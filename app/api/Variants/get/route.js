import Variant from "@/models/Variant";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const _id = searchParams.get("_id");

    if (!_id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const variant = await Variant.findOne({ parent_id: _id });

    if (!variant) {
      return NextResponse.json({ error: "Variant not found" }, { status: 404 });
    }

    return NextResponse.json(variant, { status: 200 });
  } catch (error) {
    console.error("Error fetching variants:", error);
    return NextResponse.json({ error: "Failed to fetch variants" }, { status: 500 });
  }
}
