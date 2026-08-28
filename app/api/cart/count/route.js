import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Cart from "@/models/ecom_cart_info";
import jwt from "jsonwebtoken";
import { getGuestCartIdFromRequest } from "@/lib/cartGuest";

export async function GET(req) {
  try {
    await connectDB();

    let userId = null;
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.userId;
      } catch {
        // fallback to guest cart id
      }
    }

    let cart = null;

    if (userId) {
      cart = await Cart.findOne({ userId });
    } else {
      const guestId = getGuestCartIdFromRequest(req);
      if (guestId) {
        cart = await Cart.findOne({ guestId });
      }
    }

    return NextResponse.json({
      count: cart?.totalItems || 0,
    });
  } catch (error) {
    console.error("Cart count error:", error);
    return NextResponse.json({ count: 0 });
  }
}
