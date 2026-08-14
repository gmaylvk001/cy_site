import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/models/product";
import Variant from "@/models/Variant";
import Category from "@/models/ecom_category_info";
import mongoose from "mongoose";
import { calcOfferPriceFromBase, getOfferBasePrice } from "@/lib/pricing";

function toIdStrings(value) {
  if (!value) return [];
  const arr = Array.isArray(value) ? value : [value];
  return arr
    .map((item) => {
      if (!item) return "";
      if (typeof item === "object") return item._id?.toString() || "";
      return String(item);
    })
    .filter(Boolean);
}

function splitChains(value) {
  if (!value) return [];
  return String(value)
    .split("||")
    .map((part) => part.trim())
    .filter(Boolean);
}

async function findOffersCategory() {
  return (
    (await Category.findOne({ category_slug: "offers" })) ||
    (await Category.findOne({ category_slug: { $regex: /^offers$/i } })) ||
    (await Category.findOne({ category_name: { $regex: /^offers$/i } }))
  );
}

async function buildOffersChain(offersCategory) {
  const md5Chain = [];
  const nameChain = [];
  const idChain = [];
  let current = offersCategory;

  while (current) {
    md5Chain.push(current.md5_cat_name);
    nameChain.push(current.category_name);
    idChain.push(current._id.toString());
    if (!current.parentid || current.parentid === "none") break;
    current = await Category.findById(current.parentid);
  }

  const rootId = idChain[idChain.length - 1] || "";
  const rootMd5 = md5Chain[md5Chain.length - 1] || "";
  md5Chain.reverse();
  nameChain.reverse();

  return {
    offerId: offersCategory._id.toString(),
    offerMd5: offersCategory.md5_cat_name,
    offerName: offersCategory.category_name,
    isRoot: !offersCategory.parentid || offersCategory.parentid === "none",
    md5Chain: md5Chain.join("##"),
    nameChain: nameChain.join("##"),
    rootId,
    rootMd5,
  };
}

function addToOffersCategory(product, chain) {
  const categoryIds = toIdStrings(product.category);
  if (chain.rootId && !categoryIds.includes(chain.rootId)) {
    categoryIds.push(chain.rootId);
    product.category = categoryIds;
    product.markModified("category");
  }

  const subIds = toIdStrings(product.sub_category);
  if (!subIds.includes(chain.offerId)) {
    subIds.push(chain.offerId);
    product.sub_category = subIds;
    product.markModified("sub_category");
  }

  const categoryNew = toIdStrings(product.category_new);
  if (chain.rootMd5 && !categoryNew.includes(chain.rootMd5)) {
    categoryNew.push(chain.rootMd5);
    product.category_new = categoryNew;
    product.markModified("category_new");
  }

  const md5Chains = splitChains(product.sub_category_new);
  const alreadyHasOffer = md5Chains.some((c) =>
    c.split("##").includes(chain.offerMd5)
  );
  if (chain.md5Chain && !alreadyHasOffer) {
    md5Chains.push(chain.md5Chain);
    product.sub_category_new = md5Chains.join("||");
  }

  const nameChains = splitChains(product.sub_category_new_name);
  const alreadyHasName = nameChains.some((c) =>
    c
      .split("##")
      .some((name) => name.toLowerCase() === chain.offerName.toLowerCase())
  );
  if (chain.nameChain && !alreadyHasName) {
    nameChains.push(chain.nameChain);
    product.sub_category_new_name = nameChains.join("||");
  }
}

function removeFromOffersCategory(product, chain) {
  product.sub_category = toIdStrings(product.sub_category).filter(
    (id) => id !== chain.offerId
  );
  product.markModified("sub_category");

  const remainingMd5Chains = splitChains(product.sub_category_new).filter(
    (c) => !c.split("##").includes(chain.offerMd5)
  );
  product.sub_category_new = remainingMd5Chains.join("||");

  const remainingNameChains = splitChains(product.sub_category_new_name).filter(
    (c) =>
      !c
        .split("##")
        .some((name) => name.toLowerCase() === chain.offerName.toLowerCase())
  );
  product.sub_category_new_name = remainingNameChains.join("||");

  if (chain.isRoot) {
    product.category = toIdStrings(product.category).filter(
      (id) => id !== chain.offerId
    );
    product.category_new = toIdStrings(product.category_new).filter(
      (md5) => md5 !== chain.offerMd5
    );
    product.markModified("category");
    product.markModified("category_new");
  }
}

export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();
    const { productIds, percentage, action = "apply" } = body;

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json(
        { error: "Please select at least one product." },
        { status: 400 }
      );
    }

    const validIds = productIds.filter((id) =>
      mongoose.Types.ObjectId.isValid(id)
    );

    if (!validIds.length) {
      return NextResponse.json(
        { error: "No valid product IDs provided." },
        { status: 400 }
      );
    }

    const products = await Product.find({ _id: { $in: validIds } });

    if (!products.length) {
      return NextResponse.json(
        { error: "No matching products found." },
        { status: 404 }
      );
    }

    const offersCategory = await findOffersCategory();
    if (!offersCategory) {
      return NextResponse.json(
        {
          error:
            "Offers category not found. Create a category with slug or name 'offers' first.",
        },
        { status: 400 }
      );
    }
    const offersChain = await buildOffersChain(offersCategory);

    const isRemove = action === "remove";
    let pct = null;

    if (!isRemove) {
      pct = Number(percentage);
      if (Number.isNaN(pct) || pct < 0 || pct > 100) {
        return NextResponse.json(
          { error: "Percentage must be a number between 0 and 100." },
          { status: 400 }
        );
      }
    }

    let updatedCount = 0;
    const skipped = [];

    for (const product of products) {
      if (isRemove) {
        product.offer_price = null;

        if (Array.isArray(product.variants) && product.variants.length > 0) {
          product.variants = product.variants.map((variant) => {
            const plain =
              typeof variant.toObject === "function" ? variant.toObject() : variant;
            return { ...plain, offer_price: null };
          });
          product.markModified("variants");
        }

        const variantDoc = await Variant.findOne({ parent_id: product._id });
        if (variantDoc?.variants?.length) {
          variantDoc.variants = variantDoc.variants.map((variant) => {
            const plain =
              typeof variant.toObject === "function" ? variant.toObject() : variant;
            return { ...plain, offer_price: null };
          });
          variantDoc.markModified("variants");
          await variantDoc.save();
        }

        removeFromOffersCategory(product, offersChain);
        product.updatedAt = new Date();
        await product.save();
        updatedCount += 1;
        continue;
      }

      const basePrice = getOfferBasePrice(product);
      if (!basePrice || basePrice <= 0) {
        skipped.push({
          id: product._id.toString(),
          name: product.name,
          reason: "Invalid or missing price / special_price",
        });
        continue;
      }

      // Keep special_price untouched; store discount in offer_price
      product.offer_price = calcOfferPriceFromBase(basePrice, pct);

      if (Array.isArray(product.variants) && product.variants.length > 0) {
        product.variants = product.variants.map((variant) => {
          const plain =
            typeof variant.toObject === "function" ? variant.toObject() : variant;
          const variantBase = getOfferBasePrice(plain);
          if (!variantBase || variantBase <= 0) return plain;
          return {
            ...plain,
            offer_price: calcOfferPriceFromBase(variantBase, pct),
          };
        });
        product.markModified("variants");
      }

      const variantDoc = await Variant.findOne({ parent_id: product._id });
      if (variantDoc?.variants?.length) {
        variantDoc.variants = variantDoc.variants.map((variant) => {
          const plain =
            typeof variant.toObject === "function" ? variant.toObject() : variant;
          const variantBase = getOfferBasePrice(plain);
          if (!variantBase || variantBase <= 0) {
            return { ...plain, offer_price: null };
          }
          return {
            ...plain,
            offer_price: calcOfferPriceFromBase(variantBase, pct),
          };
        });
        variantDoc.markModified("variants");
        await variantDoc.save();
      }

      addToOffersCategory(product, offersChain);
      product.updatedAt = new Date();
      await product.save();
      updatedCount += 1;
    }

    return NextResponse.json({
      message: isRemove
        ? `Offer removed from ${updatedCount} product(s). They were also removed from the Offers category.`
        : `Offer applied to ${updatedCount} product(s). They were also added to the Offers category.`,
      updatedCount,
      skippedCount: skipped.length,
      skipped,
      percentage: pct,
      action: isRemove ? "remove" : "apply",
    });
  } catch (error) {
    console.error("bulk-offer Error:", error);
    return NextResponse.json(
      { error: "Failed to update bulk offer." },
      { status: 500 }
    );
  }
}
