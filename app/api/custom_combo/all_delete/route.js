import jwt from "jsonwebtoken";
import custom_combo from "@/models/custom_combo";
import dbConnect from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(req) {
  await dbConnect();

  const { guestId } = await req.json();
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.split(" ")[1];

  let query = {};

  try {
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

    const combo = await custom_combo.findOneAndDelete(query);

    if (!combo) {
      return NextResponse.json(
        { message: "No combo found to delete" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: 1,
      combo,
      msg: "Combo products deleted successfully",
    },{status: 200});

  } catch (error) {
    return NextResponse.json(
      { message: "Invalid or expired token" },
      { status: 401 }
    );
  }
}
