import Variant from "@/models/Variant";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const variants = await Variant.find({});
    return NextResponse.json({ variants }, { status: 200 });
  } catch (error) {
    console.error("Error fetching variants:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
