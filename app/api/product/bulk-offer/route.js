import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/models/product";
import Variant from "@/models/Variant";
import mongoose from "mongoose";
import { calcOfferPriceFromBase, getOfferBasePrice } from "@/lib/pricing";

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

      product.updatedAt = new Date();
      await product.save();
      updatedCount += 1;
    }

    return NextResponse.json({
      message: isRemove
        ? `Offer removed from ${updatedCount} product(s). Special price will show again.`
        : `Offer applied to ${updatedCount} product(s).`,
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
