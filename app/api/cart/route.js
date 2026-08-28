import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Cart from "@/models/ecom_cart_info";
import Product from "@/models/product";
import jwt from "jsonwebtoken";
import Variant from "@/models/Variant";
import { getSellingPrice } from "@/lib/pricing";
import { getGuestCartIdFromRequest } from "@/lib/cartGuest";
/** Utils **/
const extractToken = (req) => {
  const authHeader = req.headers.get("authorization");
  return authHeader?.split(" ")[1];
};

const verifyToken = (token) => {
  if (!token) throw new Error("Authorization token required");
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw new Error("Token has expired");
    } else {
      throw new Error("Invalid token");
    }
  }
};

const calculateCartTotals = (items) => {
  let totalItems = 0;
  let totalPrice = 0;

  for (const item of items) {
    const base = item.price * item.quantity;
    const warranty = item.warranty || 0;
    const extended = item.extendedWarranty || 0;
    const upsells = item.upsells?.reduce((uSum, u) => uSum + (u.price || 0), 0) || 0;

    totalItems += item.quantity;
    totalPrice += base + warranty + extended + upsells;
  }

  return { totalItems, totalPrice };
};

function normalize(str) {
  return String(str || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "")        // remove spaces
    .replace(/[-_]/g, "/");     // treat - or _ as /
}

function findMatchingVariant(variantDoc, selectedVariant = {}) {
  if (!variantDoc?.variants?.length) return null;

  return variantDoc.variants.find((v) => {
    if (!v.variant_arr?.length) return false;

    // If user selected color, check if any variant_arr has that color
    if (selectedVariant.color) {
      const colorMatch = v.variant_arr.some(
        (attr) =>
          attr.variant_attribute_name === "color" &&
          attr.options === selectedVariant.color
      );

      if (!colorMatch) return false;
    }

    // If user selected size, check size also (if exists in DB)
    if (selectedVariant.size) {
      const sizeMatch = v.variant_arr.some(
        (attr) =>
          attr.variant_attribute_name === "size" &&
          attr.options === selectedVariant.size
      );

      if (!sizeMatch) return false;
    }

    return true;
  });
}





/** POST - Add to Cart **/
export async function POST(req) {
  try {
    await connectDB();

    let userId = null;
    let guestId = null;

    const authHeader = req.headers.get("authorization");
    if (authHeader) {
      try {
        const decoded = jwt.verify(authHeader.split(" ")[1], process.env.JWT_SECRET);
        userId = decoded.userId;
      } catch {
        // ignore if invalid/expired, fallback to guest
      }
    }

    const {
      productId,
      original_prod_quantity,
      quantity = 1,
      selectedWarranty = 0,
      selectedExtendedWarranty = 0,
      upsellProducts = [],
      variant = {},
      guestCartId: guestCartIdBody,
    } = await req.json();

    const guestCartId = guestCartIdBody || getGuestCartIdFromRequest(req);

    const selectedColor = variant?.color || "";
    const selectedSize = variant?.size || "";

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    const variantDoc = await Variant.findOne({ parent_id: productId }).lean()

    // remove empty variant values like { size:"", color:"" }
    const selectedVariantValues = Object.fromEntries(
      Object.entries(variant || {}).filter(([k, v]) => v !== "" && v !== null && v !== undefined)
    );

    const matchedVariant =
      Object.keys(selectedVariantValues).length > 0
        ? findMatchingVariant(variantDoc, selectedVariantValues)
        : null;

    let finalPrice = getSellingPrice(product);
    let finalImage = product.images?.[0] || "";
    let finalItemCode = product.item_code;
    let finalStockQty = product.quantity;

    // If variant selected and matched
    if (Object.keys(selectedVariantValues).length > 0) {
      if (!matchedVariant) {
        return NextResponse.json(
          { error: "Selected variant not found" },
          { status: 404 }
        );
      }

      finalPrice = getSellingPrice(matchedVariant);

      finalImage = matchedVariant.images?.[0] || finalImage;
      finalItemCode = matchedVariant.item_code || finalItemCode;
      finalStockQty = matchedVariant.quantity ?? finalStockQty;
      // stock check
      if (finalStockQty < quantity) {
        return NextResponse.json(
          { error: "Requested quantity exceeds available stock for this variant." },
          { status: 409 }
        );
      }
    }



    // choose key
    if (!userId && !guestCartId) {
      return NextResponse.json(
        { error: "Guest cart id is required for guest checkout" },
        { status: 400 }
      );
    }

    const query = userId ? { userId } : { guestId: guestCartId };
    let cart = await Cart.findOne(query);

    if (!cart) {
      cart = new Cart({ ...(userId ? { userId } : { guestId: guestCartId }), items: [] });
    }

    // add/update item
    const existingItemIndex = cart.items.findIndex(
      (item) =>
        item.productId.toString() === productId &&
        JSON.stringify(item.variant || {}) === JSON.stringify(selectedVariantValues || {})
    );

    // const original_prod_quantity = product.data.quantity;

    if (existingItemIndex >= 0) {
      cart.items[existingItemIndex].quantity += quantity;
      // console.log('exits', cart.items[existingItemIndex].quantity)

      const item = cart.items[existingItemIndex];
      const orderQty = quantity; // ordering quantity

      const hasVariant =
        item.variant &&
        (item.variant.color || item.variant.size);

      const availableStock = hasVariant
        ? finalStockQty
        : original_prod_quantity;

      if (typeof availableStock !== "number" || availableStock < orderQty) {
        return NextResponse.json(
          { error: "Requested quantity exceeds available stock." },
          { status: 409 }
        );
      }

      cart.items[existingItemIndex].warranty = selectedWarranty;
      cart.items[existingItemIndex].extendedWarranty = selectedExtendedWarranty;
    } else {
      cart.items.push({
        item_code: product.item_code,
        productId,
        quantity,
        price: finalPrice,
        name: product.name,
        image: finalImage,
        warranty: selectedWarranty,
        variant: selectedVariantValues,
        extendedWarranty: selectedExtendedWarranty,
        actual_price: finalPrice,
      });
    }

    // totals
    const totals = calculateCartTotals(cart.items);
    cart.totalItems = totals.totalItems;
    cart.totalPrice = totals.totalPrice;

    await cart.save();

    return NextResponse.json(
      { message: "Product added", cart: { id: cart._id, ...totals, items: cart.items } },
      { status: 200 }
    );
  } catch (error) {
    console.error("POST cart error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


/** GET - Fetch Cart **/
export async function GET(req) {
  try {
    await connectDB();

    const token = extractToken(req);
    const guestCartId = getGuestCartIdFromRequest(req);
    let cart = null;

    if (token) {
      try {
        const decoded = verifyToken(token);
        cart = await Cart.findOne({ userId: decoded.userId }).populate(
          "items.productId",
          "name price special_price offer_price images item_code quantity"
        );
      } catch {
        if (guestCartId) {
          cart = await Cart.findOne({ guestId: guestCartId }).populate(
            "items.productId",
            "name price special_price offer_price images item_code quantity"
          );
        }
      }
    } else if (guestCartId) {
      cart = await Cart.findOne({ guestId: guestCartId }).populate(
        "items.productId",
        "name price special_price offer_price images item_code quantity"
      );
    }

    if (!cart) {
      return NextResponse.json(
        { message: "Cart is empty", cart: { items: [], totalItems: 0, totalPrice: 0 } },
        { status: 200 }
      );
    }

    let pricesChanged = false;

    const items = (
      await Promise.all(
        cart.items.map(async (item) => {
          const productDoc = item.productId;
          if (!productDoc) return null;

          let livePrice = getSellingPrice(productDoc);

        // Re-resolve variant offer/special if cart line has a variant
        if (item.variant && (item.variant.color || item.variant.size)) {
          const variantDoc = await Variant.findOne({ parent_id: productDoc._id }).lean();
          const matched = findMatchingVariant(variantDoc, item.variant || {});
          if (matched) {
            livePrice = getSellingPrice(matched);
          }
        }

        if (Number(item.price) !== Number(livePrice)) {
          item.price = livePrice;
          pricesChanged = true;
        }

        const original_quantity = await getQuantity(productDoc.item_code);
        return {
          original_quantity,
          item_code: productDoc.item_code,
          productId: productDoc._id,
          name: productDoc.name,
          price: livePrice,
          image: productDoc.images?.[0],
          quantity: item.quantity,
          warranty: item.warranty || 0,
          variant: item.variant || { color: "", size: "" },
          extendedWarranty: item.extendedWarranty || 0,
          actual_price: productDoc.price,
          offer_price: productDoc.offer_price ?? null,
          special_price: productDoc.special_price ?? null,
        };
      })
      )
    ).filter(Boolean);

    if (pricesChanged) {
      const totals = calculateCartTotals(cart.items);
      cart.totalItems = totals.totalItems;
      cart.totalPrice = totals.totalPrice;
      await cart.save();
    }

    const responseTotals = calculateCartTotals(cart.items);

    return NextResponse.json(
      {
        cart: {
          id: cart._id,
          totalItems: responseTotals.totalItems,
          totalPrice: responseTotals.totalPrice,
          items,
        },
        products: { productdata: [] },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET cart error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}



async function getQuantity(item_code) {
  const product = await Product.findOne({ item_code }).lean();
  return product?.quantity ?? null;
}




/** PUT - Update Quantity **/
export async function PUT(req) {
  try {

    let guestId = null;
    let cart = null;

    await connectDB();

    const { productId, quantity } = await req.json();
    if (!productId || quantity < 1) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const token = extractToken(req);
    const guestCartId = getGuestCartIdFromRequest(req);

    if (token) {
      try {
        const decoded = verifyToken(token);
        cart = await Cart.findOne({ userId: decoded.userId });
      } catch {
        if (guestCartId) {
          cart = await Cart.findOne({ guestId: guestCartId });
        }
      }
    } else if (guestCartId) {
      cart = await Cart.findOne({ guestId: guestCartId });
    }



    //const cart = await Cart.findOne({ userId });
    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    // console.log(cart.items);

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    // console.log(itemIndex);
    if (itemIndex === -1) {
      return NextResponse.json({ error: "Product not in cart" }, { status: 404 });
    }

    cart.items[itemIndex].quantity = quantity;
    const item_code = cart.items[itemIndex].item_code;
    // console.log(item_code);
    const original_quantity = await getQuantity(item_code);
    const totals = calculateCartTotals(cart.items);
    cart.totalItems = totals.totalItems;
    cart.totalPrice = totals.totalPrice;
    cart.items[itemIndex].original_quantity = original_quantity;
    // console.log(cart.items);


    await cart.save();

    // cart.items.forEach((item) => {
    //   // console.log(item);
    // });
    const items = cart.items.map((item) => ({
      productId: item.productId._id,
      name: item.name,
      price: item.price,
      image: item.productId.images,
      quantity: item.quantity,
      item_code: item.productId.item_code,
      original_quantity: item.original_quantity ?? null, // dynamically attach
    }));


    return NextResponse.json(
      {
        message: "Cart updated",
        cart: {
          id: cart._id,
          ...totals,
          items: items,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT cart error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}




export async function DELETE(req) {
  try {
    await connectDB();
    let guestId = null;
    let cart = null;

    /*
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return NextResponse.json(
        { error: "Authorization token required" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId; */

    const { productId, clearAll } = await req.json();

    const token = extractToken(req);
    const guestCartId = getGuestCartIdFromRequest(req);

    if (token) {
      try {
        const decoded = verifyToken(token);
        cart = await Cart.findOne({ userId: decoded.userId });
      } catch {
        if (guestCartId) {
          cart = await Cart.findOne({ guestId: guestCartId });
        }
      }
    } else if (guestCartId) {
      cart = await Cart.findOne({ guestId: guestCartId });
    }

    //const cart = await Cart.findOne({ userId });
    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    if (clearAll) {
      // Clear the entire cart
      cart.items = [];
      cart.totalItems = 0;
      cart.totalPrice = 0;
    } else {
      // Remove a specific item
      const existingItemIndex = cart.items.findIndex(
        item => item.productId.toString() === productId
      );

      if (existingItemIndex === -1) {
        return NextResponse.json({ error: "Item not found in cart" }, { status: 404 });
      }

      cart.items.splice(existingItemIndex, 1);

      // Recalculate totals
      cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
      cart.totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }

    await cart.save();

    return NextResponse.json(
      {
        message: clearAll ? "Cart cleared" : "Item removed from cart",
        cart: {
          id: cart._id,
          totalItems: cart.totalItems,
          totalPrice: cart.totalPrice,
          items: cart.items
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Remove from cart error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update cart" },
      { status: 500 }
    );
  }
}



function getCartOwner(req) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.split(" ")[1];

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return { userId: decoded.userId, guestCartId: null };
    } catch {
      return { userId: null, guestCartId: null }; // invalid token
    }
  }

  // Guest cart fallback
  return { userId: null, guestCartId: req.headers.get("x-guest-cart-id") };
}