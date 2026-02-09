import jwt from "jsonwebtoken";
import custom_combo from "@/models/custom_combo";
import dbConnect from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  await dbConnect();

  const { items, type, guestId } = await req.json();
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.split(" ")[1];

  if (!Array.isArray(items)) {
    return NextResponse.json(
      { message: "items must be an array" },
      { status: 400 }
    );
  }

  let query = {};

  // 🔐 Logged-in user
  if (token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    query.userId = decoded.userId;
  }
  // 👤 Guest user
  else if (guestId) {
    query.guestId = guestId;
  } else {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  // Build array with product + selectedVariant
  const productsWithVariant = items.map((i) => ({
    productId: i._id,
    selectedVariant: i.selectedVariant || {}, // use frontend variant object
  }));

  let update = {};

  if (type === "bycycle") update.cycles = productsWithVariant;
  if (type === "accessories") update.accessories = productsWithVariant;
  if (type === "bags") update.bags = productsWithVariant;

  const combo = await custom_combo.findOneAndUpdate(
    query,
    { $set: update },
    { new: true, upsert: true }
  );

  return NextResponse.json({ success: true, combo });
}
