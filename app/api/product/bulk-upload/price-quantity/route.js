import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/models/product";

const parseExcelOrCsv = async (excelFile) => {
  const XLSX = await import("xlsx");
  const name = excelFile.name ? excelFile.name.toLowerCase() : "";
  const arrayBuffer = await excelFile.arrayBuffer();

  if (name.endsWith(".csv")) {
    const csvText = new TextDecoder("utf-8").decode(arrayBuffer);
    const workbook = XLSX.read(csvText, { type: "string" });
    return XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
  }

  const data = new Uint8Array(arrayBuffer);
  const workbook = XLSX.read(data, { type: "array" });
  return XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
};

const pickRowValue = (row, keys) => {
  for (const key of keys) {
    if (typeof row[key] !== "undefined" && row[key] !== null && row[key] !== "") {
      return row[key];
    }
  }
  return "";
};

const parseNumberField = (value, fieldName) => {
  const normalized = String(value ?? "").trim();
  if (!normalized.length) {
    return { error: `${fieldName} is required.` };
  }

  const parsed = Number(normalized);
  if (Number.isNaN(parsed)) {
    return { error: `${fieldName} must be a valid number.` };
  }

  return { value: parsed };
};

const normalizeStatus = (value) => {
  const normalized = String(value ?? "").trim().toLowerCase();

  if (!normalized.length) {
    return { error: "status is required." };
  }

  if (["1", "active"].includes(normalized)) {
    return { value: "Active" };
  }

  if (["0", "inactive"].includes(normalized)) {
    return { value: "Inactive" };
  }

  return { error: "status must be Active, Inactive, 1, or 0." };
};

export async function POST(req) {
  try {
    await dbConnect();

    const formData = await req.formData();
    const excelFile = formData.get("excel");

    if (!excelFile) {
      return NextResponse.json(
        { error: "Missing required file: Excel or CSV file is mandatory." },
        { status: 400 }
      );
    }

    const fileName = excelFile.name?.toLowerCase() || "";
    if (!fileName.endsWith(".xlsx") && !fileName.endsWith(".csv")) {
      return NextResponse.json(
        { error: "Invalid file type. Only .xlsx and .csv files are allowed." },
        { status: 400 }
      );
    }

    const rows = await parseExcelOrCsv(excelFile);
    if (!rows.length) {
      return NextResponse.json(
        { error: "No rows found in the uploaded file." },
        { status: 400 }
      );
    }

    const results = {
      updatedCount: 0,
      skipped: 0,
      errors: [],
    };

    const bulkOps = [];

    for (const [idx, row] of rows.entries()) {
      const item_code = String(
        pickRowValue(row, ["item_code", "ItemCode", "itemcode", "item_no", "Item No."])
      ).trim();

      if (!item_code) {
        results.errors.push({ row: idx + 2, error: "item_code is required." });
        continue;
      }

      const priceResult = parseNumberField(
        pickRowValue(row, ["price", "Price"]),
        "price"
      );
      if (priceResult.error) {
        results.errors.push({ row: idx + 2, item_code, error: priceResult.error });
        continue;
      }

      const specialPriceResult = parseNumberField(
        pickRowValue(row, ["special_price", "SpecialPrice", "specialprice"]),
        "special_price"
      );
      if (specialPriceResult.error) {
        results.errors.push({ row: idx + 2, item_code, error: specialPriceResult.error });
        continue;
      }

      const quantityResult = parseNumberField(
        pickRowValue(row, ["quantity", "Quantity"]),
        "quantity"
      );
      if (quantityResult.error) {
        results.errors.push({ row: idx + 2, item_code, error: quantityResult.error });
        continue;
      }

      const statusResult = normalizeStatus(
        pickRowValue(row, ["status", "Status"])
      );
      if (statusResult.error) {
        results.errors.push({ row: idx + 2, item_code, error: statusResult.error });
        continue;
      }

      bulkOps.push({
        rowNumber: idx + 2,
        updateOne: {
          filter: { item_code },
          update: {
            $set: {
              price: priceResult.value,
              special_price: specialPriceResult.value,
              quantity: quantityResult.value,
              status: statusResult.value,
              stock_status: quantityResult.value > 0 ? "In Stock" : "Out of Stock",
              updatedAt: new Date(),
            },
          },
        },
      });
    }

    if (!bulkOps.length) {
      return NextResponse.json(
        {
          message: "No valid rows were found to update.",
          ...results,
        },
        { status: 400 }
      );
    }

    const itemCodes = bulkOps.map((op) => op.updateOne.filter.item_code);
    const existingProducts = await Product.find(
      { item_code: { $in: itemCodes } },
      { item_code: 1 }
    ).lean();
    const existingItemCodes = new Set(existingProducts.map((product) => product.item_code));

    const filteredOps = [];
    for (const op of bulkOps) {
      const itemCode = op.updateOne.filter.item_code;
      if (!existingItemCodes.has(itemCode)) {
        results.errors.push({
          row: op.rowNumber,
          item_code: itemCode,
          error: "Product not found with the given item_code.",
        });
        results.skipped++;
        continue;
      }
      filteredOps.push(op);
    }

    if (!filteredOps.length) {
      return NextResponse.json(
        {
          message: "No matching products were found for update.",
          ...results,
        },
        { status: 400 }
      );
    }

    const response = await Product.bulkWrite(
      filteredOps.map(({ updateOne }) => ({ updateOne })),
      { ordered: false }
    );
    results.updatedCount =
      response.modifiedCount || response.nModified || response.result?.nModified || 0;

    const hasErrors = results.errors.length > 0;
    return NextResponse.json(
      {
        message: hasErrors
          ? `${results.updatedCount} products updated. ${results.errors.length} rows had issues.`
          : `${results.updatedCount} products updated successfully.`,
        ...results,
      },
      { status: hasErrors && results.updatedCount === 0 ? 400 : 200 }
    );
  } catch (error) {
    console.error("Price and quantity bulk upload error:", error);
    return NextResponse.json(
      { error: "Failed to process price and quantity upload.", details: error.message },
      { status: 500 }
    );
  }
}
