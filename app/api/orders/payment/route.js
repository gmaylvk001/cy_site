import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import EcomOrderInfo from "@/models/ecom_order_info";
import Payment from "@/models/ecom_payment_info";

export async function POST(req) {
  await dbConnect();

  try {
    const {
      orderId,
      paymentRecordId,
      paymentGatewayId,
      paymentStatus,
      paymentType,
    } = await req.json();

    if (!orderId || !paymentRecordId || !paymentGatewayId || !paymentStatus) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const paymentData = await Payment.findByIdAndUpdate(
      paymentRecordId,
      {
        payment_id: paymentGatewayId,
        status: paymentStatus,
        payment_mode: paymentType || "online",
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!paymentData) {
      return NextResponse.json(
        { success: false, message: "Payment record not found" },
        { status: 404 }
      );
    }

    const order = await EcomOrderInfo.findByIdAndUpdate(
      orderId,
      {
        payment_status: paymentStatus,
        payment_type: paymentType || "online",
        payment_method: "online",
      },
      { new: true }
    );

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, order, paymentData }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
