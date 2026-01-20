import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import custom_combo from "@/models/custom_combo";
import jwt from "jsonwebtoken";

export async function GET(req) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const guestId = searchParams.get("guestId");

  const auth = req.headers.get("authorization");
  const token = auth?.split(" ")[1];

  let query = {};

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      query.userId = decoded.userId;
    } catch (err) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }
  } else if (guestId) {
    query.guestId = guestId;
  } else {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

const combo = await custom_combo
  .findOne(query)
  .populate("cycles")
  .populate("accessories")
  .populate("bags");


  return NextResponse.json({ success: 1, products: combo });
}
