import jwt from "jsonwebtoken";
import custom_combo from "@/models/custom_combo";
import dbConnect from "@/lib/db";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(req) {
  await dbConnect();

  const { item, type, guestId } = await req.json();
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.split(" ")[1];

  if (!item || !type) {
    return NextResponse.json(
      { message: "item and type are required" },
      { status: 400 }
    );
  }

  let query = {};
  let update = {};

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

  const productId = new mongoose.Types.ObjectId(item._id);

  // 🎯 Decide which array to pull from
  if (type === "bycycle") update.$pull = { cycles: productId };
  if (type === "accessories") update.$pull = { accessories: productId };
  if (type === "bags") update.$pull = { bags: productId };

  if (!update.$pull) {
    return NextResponse.json(
      { message: "Invalid type" },
      { status: 400 }
    );
  }

  const combo = await custom_combo.findOneAndUpdate(
    query,
    update,
    { new: true }
  );

  return NextResponse.json({ success: 1, combo });
}
