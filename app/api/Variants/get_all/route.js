import Variant from "@/models/Variant";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";

export async function GET(request) {
  try {
    await dbConnect();
    const variants = await Variant.find({}).lean();
    return NextResponse.json({ variants }, { status: 200 });
  } catch (error) {
    console.error("Error fetching variants:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
