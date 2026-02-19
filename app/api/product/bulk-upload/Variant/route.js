import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import mongoose from "mongoose";
import { join } from "path";
import AdmZip from "adm-zip";
import fs from "fs/promises";
import { format } from "date-fns";
import { writeFile } from "fs/promises";
import Product from "@/models/product";
import Product_all from "@/models/Product_all";
import Category from "@/models/ecom_category_info";
import Brand from "@/models/ecom_brand_info";
import formidable from "formidable";
import md5 from "md5";
import Filter from "@/models/ecom_filter_infos";
import ProductFilter from "@/models/ecom_productfilter_info";
import Variant from "@/models/Variant";

export const config = {
  api: { bodyParser: false },
};

export async function POST(req) {
  try {
    const formData = await req.formData();
    const VariantexcelFile = formData.get("variantExcel");

    if (!VariantexcelFile) {
      return NextResponse.json(
        { error: "Variant Excel file is mandatory." },
        { status: 400 }
      );
    }

    const allowedExtension = [".xlsx", ".csv"];
    const fileNam = VariantexcelFile.name.toLowerCase();

    if (!allowedExtension.some((ext) => fileNam.endsWith(ext))) {
      return NextResponse.json(
        { error: "Invalid file type. Only .xlsx and .csv files are allowed." },
        { status: 400 }
      );
    }

    const VariantexcelBuffer = Buffer.from(await VariantexcelFile.arrayBuffer());
    const variantWorkbook = XLSX.read(VariantexcelBuffer);

    const variants = XLSX.utils.sheet_to_json(
      variantWorkbook.Sheets[variantWorkbook.SheetNames[0]],
      { header: 1 }
    );

    const valid_variant = variants
      .slice(0)
      .filter((row) => row && row.length > 0 && row[0]);

    if (!valid_variant || valid_variant.length === 0) {
      return NextResponse.json(
        { error: "No products found in the uploaded Variant Excel file." },
        { status: 400 }
      );
    }

    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGODB_URI);
    }

    /* ---------- YOUR COMPLETE VARIANT LOOP (UNCHANGED) ---------- */

    // ✅ PASTE your full variant loop here exactly as in original code
    // (From: for (let i = 1; i < valid_variant.length; i++) { ... })
    // UNTIL: await variantDoc.save();
        for (let i = 1; i < valid_variant.length; i++) {
          const row = valid_variant[i];
    
          const item_code = (row[0] || "").toString().trim();
          const product_name = (row[1] || "").toString().trim();
    
          if (!item_code || !product_name) continue;
    
          // parse variant_arr
          let variant_arr = [];
          if (row[2] && row[2].toString().trim() !== "") {
            try {
              variant_arr = JSON.parse(row[2].toString().trim());
              if (!Array.isArray(variant_arr)) variant_arr = [];
            } catch (err) {
              // console.log(`Variant JSON error at row ${i + 1}:`, err.message);
              continue;
            }
          }
    
          const price = Number(row[3] || 0);
          const special_price = Number(row[4] || 0);
          const quantity = Number(row[5] || 0);
    
          const stock_status =
            (row[6] || "").toString().trim() ||
            (quantity > 0 ? "In Stock" : "Out of Stock");
    
          const images = row[7]
            ? row[7]
              .toString()
              .split(",")
              .map((x) => x.trim())
              .filter(Boolean)
            : [];
    
          const status = (row[8] || "Inactive").toString().trim();
    
          // ---------------------------------------------------
          // ✅ STEP 1: Find parent in Product or Product_all
          // ---------------------------------------------------
          let parent = await Product.findOne({ item_code }).select("_id name");
          let parent_model = "Product";
    
          if (!parent) {
            parent = await Product_all.findOne({ item_code }).select("_id name");
            parent_model = "Product_all";
          }
    
          if (!parent) {
            console.log(`❌ Parent product not found for item_code: ${item_code}`);
            continue;
          }
    
          const parent_id = parent._id;
    
          // ---------------------------------------------------
          // ✅ STEP 2: Build variant object from excel row
          // ---------------------------------------------------
          const newVariantObj = {
            variant_arr,
            item_code: "", // optional: if you have variant item code column put it here
            price,
            special_price,
            quantity,
            stock_status,
            images,
            status,
          };
    
          // ---------------------------------------------------
          // ✅ STEP 3: Upsert Variant parent document
          // ---------------------------------------------------
          let variantDoc = await Variant.findOne({
            parent_id,
            parent_model,
            item_code,
          });
    
          if (!variantDoc) {
            // Create new doc with first variant
            await Variant.create({
              parent_id,
              parent_model,
              item_code,
              product_name,
              variants: [newVariantObj],
            }); 
    
            // console.log(`✅ Created Variant doc for ${item_code}`);
            continue;
          }
    
          // ---------------------------------------------------
          // ✅ STEP 4: Check if same variant_arr already exists
          // ---------------------------------------------------
          const isSameVariantArr = (a = [], b = []) => {
            if (a.length !== b.length) return false;
    
            // normalize to compare
            const normalize = (arr) =>
              arr
                .map((x) => ({
                  variant_attribute_name: (x.variant_attribute_name || "")
                    .toString()
                    .trim()
                    .toLowerCase(),
                  options: (x.options || "").toString().trim().toLowerCase(),
                }))
                .sort((x, y) =>
                  (x.variant_attribute_name + x.options).localeCompare(
                    y.variant_attribute_name + y.options
                  )
                );
    
            const A = normalize(a);
            const B = normalize(b);
    
            return JSON.stringify(A) === JSON.stringify(B);
          };
    
          const existingIndex = variantDoc.variants.findIndex((v) =>
            isSameVariantArr(v.variant_arr, variant_arr)
          );
    
          if (existingIndex !== -1) {
            // ✅ update existing variant
            variantDoc.variants[existingIndex] = {
              ...variantDoc.variants[existingIndex]._doc,
              ...newVariantObj,
            };
    
            // console.log(
            //   `🔁 Updated existing variant for ${item_code} at index ${existingIndex}`
            // );
          } else {
            // ✅ push new variant
            variantDoc.variants.push(newVariantObj);
    
            // console.log(`➕ Added new variant for ${item_code}`);
          }
    
          // update name also
          variantDoc.product_name = product_name;
    
          await variantDoc.save();
        }

    return NextResponse.json({
      message: `Successfully processed ${valid_variant.length - 1} variants.`,
    });

  } catch (error) {
    console.error("Variant bulk upload error:", error);
    return NextResponse.json(
      {
        error:
          "Failed to process variant upload: " + error.message,
      },
      { status: 500 }
    );
  }
}
