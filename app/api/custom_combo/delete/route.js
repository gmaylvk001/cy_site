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

  if (!item?._id) {
    return NextResponse.json(
      { message: "item._id is required" },
      { status: 400 }
    );
  }

  let query = {};
  let update = {};

  // 🔐 Logged-in user
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      query.userId = decoded.userId;
    } catch (err) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }
  }
  // 👤 Guest user
  else if (guestId) {
    query.guestId = guestId;
  } else {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const productId = new mongoose.Types.ObjectId(item._id);

  // 🎯 Remove from specific array
  if (type) {
    if (type === "bycycle") {
      update.$pull = { cycles: { productId } };
    } else if (type === "accessories") {
      update.$pull = { accessories: { productId } };
    } else if (type === "bags") {
      update.$pull = { bags: { productId } };
    } else {
      return NextResponse.json({ message: "Invalid type" }, { status: 400 });
    }
  }
  // 🎯 Remove from ALL arrays
  else {
    update.$pull = {
      cycles: { productId },
      accessories: { productId },
      bags: { productId },
    };
  }

  const combo = await custom_combo.findOneAndUpdate(query, update, {
    new: true,
  });

  return NextResponse.json({ success: 1, combo });
}
