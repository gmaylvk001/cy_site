import Variant from "@/models/Variant";
import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export async function POST(request) {
  try {
    const formData = await request.formData();

    const parent_id = formData.get("parent_id");
    const item_code = formData.get("item_code");
    const product_name = formData.get("product_name");

    const variantsRaw = formData.get("variants");
    const variants = variantsRaw ? JSON.parse(variantsRaw) : [];

    // ✅ Validation
    if (!parent_id || !item_code || !product_name) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }
    if (variants.length === 0) {
      const variantDoc = await Variant.findOneAndUpdate(
        { parent_id },
        {
          parent_id,
          parent_model: "Product",
          item_code,
          product_name,
          variants: [], // ✅ empty in DB
        },
        { new: true, upsert: true }
      );

      return NextResponse.json(
        { message: "Variants cleared successfully", variant: variantDoc },
        { status: 200 }
      );
    }


    const uploadDir = path.join(process.cwd(), "public/uploads/products");
    await fs.mkdir(uploadDir, { recursive: true });

    // ✅ Get existing variants from DB (IMPORTANT)
    const existingDoc = await Variant.findOne({ parent_id });
    const existingVariants = existingDoc?.variants || [];

    // ✅ Loop each variant and update images


    for (let i = 0; i < variants.length; i++) {
      const variant = variants[i];

      delete variant.files;

      // ✅ keep images array with SAME indexes
      variant.images = Array.isArray(variant.images) ? variant.images : [];

      // ✅ IMPORTANT: don't remove blob, replace it with empty string to keep index
      variant.images = variant.images.map((img) =>
        typeof img === "string" && img.startsWith("blob:") ? "" : img
      );

      // apply uploaded files by index
      for (const [key, value] of formData.entries()) {
        const match = key.match(/^variant_files_(\d+)_(\d+)$/);
        if (!match) continue;

        const vIndex = Number(match[1]);
        const imgIndex = Number(match[2]);
        if (vIndex !== i) continue;

        const file = value;

        if (file instanceof File && file.size > 0) {
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);

          const filename = `${item_code}_${i + 1}_${imgIndex + 1}-${Date.now()}-${file.name.replace(
            /\s+/g,
            "-"
          )}`;

          await fs.writeFile(path.join(uploadDir, filename), buffer);

          // ensure array length
          while (variant.images.length <= imgIndex) {
            variant.images.push("");
          }

          // ✅ replace correct index
          variant.images[imgIndex] = filename;
        }
      }

      // ✅ remove empty slots only at end
      variant.images = variant.images.filter((img) => img && img !== "");
    }



    // ✅ Save / Update in DB
    const variantDoc = await Variant.findOneAndUpdate(
      { parent_id },
      {
        parent_id,
        parent_model: "Product",
        item_code,
        product_name,
        variants,
      },
      { new: true, upsert: true }
    );

    return NextResponse.json(
      { message: "Variant saved successfully", variant: variantDoc },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in Add/Update Variant:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
