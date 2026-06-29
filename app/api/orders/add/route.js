import dbConnect from "@/lib/db";
import EcomOrderInfo from "@/models/ecom_order_info";
import Product from "@/models/product";
import Variant from "@/models/Variant";
import mongoose from 'mongoose';
import Coupon from '@/models/ecom_offer_info';
import Usedcoupon from '@/models/ecom_coupon_track_info';

function findMatchingVariant(variantDoc, selectedVariant = {}) {
  if (!variantDoc?.variants?.length) return null;

  const selectedEntries = Object.entries(selectedVariant || {}).filter(
    ([, value]) => value !== "" && value !== null && value !== undefined
  );

  if (!selectedEntries.length) return null;

  return variantDoc.variants.find((variant) =>
    selectedEntries.every(([key, value]) =>
      variant.variant_arr?.some(
        (attribute) =>
          attribute.variant_attribute_name === key &&
          attribute.options === value
      )
    )
  );
}

async function getOrderItemUnitPrice(item) {
  if (!item?.productId) return Number(item?.price) || 0;

  const product = await Product.findById(item.productId).lean();
  if (!product) return Number(item?.price) || 0;

  const variantDoc = await Variant.findOne({ parent_id: item.productId }).lean();
  const matchedVariant = findMatchingVariant(variantDoc, item.variant);

  if (matchedVariant) {
    return Number(matchedVariant.special_price) > 0
      ? Number(matchedVariant.special_price)
      : Number(matchedVariant.price) || 0;
  }

  return Number(product.special_price) > 0
    ? Number(product.special_price)
    : Number(product.price) || 0;
}

async function normalizeOrderItems(orderItems = []) {
  const items = [];

  for (const item of orderItems) {
    const quantity = Number(item?.quantity) || 0;
    const unitPrice = await getOrderItemUnitPrice(item);

    items.push({
      ...item,
      price: unitPrice,
      actual_price: unitPrice,
      quantity,
      discount: 0,
      coupondetails: [],
    });
  }

  return items;
}

const calculateOrderAmount = (orderItems = []) =>
  orderItems.reduce((sum, item) => {
    const price = Number(item?.price) || 0;
    const quantity = Number(item?.quantity) || 0;
    const warranty = Number(item?.warranty) || 0;
    const extendedWarranty = Number(item?.extendedWarranty) || 0;
    return sum + (price * quantity) + warranty + extendedWarranty;
  }, 0);

export async function POST(req) {
  await dbConnect();

  try {
    const body = await req.json();

    const {
      user_id,
      order_username,
      order_phonenumber,
      order_item,
      order_amount,
      order_deliveryaddress,
      payment_method,
      payment_type,
      order_status,
      delivery_type,
      pickup_store,
      payment_id,
      order_number,
      order_details,
      payment_status,
      user_adddeliveryid,
      email_address,
    } = body;

    // Validate required fields
    if (!user_id || !email_address || !order_phonenumber || !Array.isArray(order_item) || order_item.length == 0) {
      return Response.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    const sanitizedOrderItems = await normalizeOrderItems(order_item);
    const calculatedOrderAmount = calculateOrderAmount(sanitizedOrderItems);

    if (calculatedOrderAmount <= 0) {
      return Response.json({ success: false, message: "Invalid order amount" }, { status: 400 });
    }

    const newOrder = new EcomOrderInfo({
      user_id,
      order_username,
      order_phonenumber,
      order_item: sanitizedOrderItems,
      order_amount: calculatedOrderAmount,
      order_deliveryaddress,
      payment_method,
      payment_type,
      delivery_type,
      pickup_store,
      payment_id,
      order_number,
      order_details,
      user_adddeliveryid,
      email_address,
      order_status: order_status || "pending",
      payment_status: payment_status || "unpaid"
    });

    await newOrder.save();
    if(newOrder){
        for(const item of sanitizedOrderItems){
          if(item.productId){
            const productId = item.productId;
              const product = await Product.findById(item.productId);
              const coupon  = item.discount;
              if(coupon > 0){
                const userObjectId = new mongoose.Types.ObjectId(user_id);
                const couponid = new mongoose.Types.ObjectId(item.coupondetails[0]._id);
                const coupon_track = new Usedcoupon({coupon_id:couponid,user_id:userObjectId})
                await coupon_track.save();
                if(couponid){
                  const updatecoupon = await Coupon.findOne({couponid});
                  // console.log(updatecoupon);
                  if(updatecoupon){
                    updatecoupon.used_by +=1;
                    updatecoupon.save();
                  }
                }

              }
              // console.log(product);
              if (product && product.quantity > 0) {
                product.quantity = product.quantity - item.quantity;
                await product.save();
              }
          }
        }
    }
    // Create notification after order is placed
    try {
      const Notification = require("@/models/Notification.js");
      const notification = new Notification({
        userId: user_id,
        message: `Order #${newOrder.order_number || newOrder._id} placed successfully!`,
        orderId: newOrder._id,
      });
      await notification.save();
    } catch (notifErr) {
      // Optionally log notification error, but don't block order creation
      console.error("Notification creation failed:", notifErr);
    }
    return Response.json({ success: true, message: "Order added successfully", order: newOrder }, { status: 201 });

  } catch (error) {
    return Response.json({ success: false, message: "Server error", error: error.message }, { status: 500 });
  }
}
