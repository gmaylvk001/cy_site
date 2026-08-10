import connectDB from "@/lib/db";
import Otp from "@/models/Otp";
import { NextResponse } from "next/server";

function emailRegexExact(email) {
  return new RegExp(`^${email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i");
}

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const email = (body.email || "").trim();
    const otp = (body.otp || "").trim();

    if (!email || !otp) {
      return NextResponse.json(
        { message: "Email and OTP are required.", error: "Email and OTP are required." },
        { status: 400 }
      );
    }

    // Find the OTP record (case-insensitive email)
    const otpRecord = await Otp.findOne({
      email: { $regex: emailRegexExact(email) },
      otp,
    });

    if (!otpRecord) {
      return NextResponse.json(
        { message: "Invalid OTP.", error: "Invalid OTP." },
        { status: 400 }
      );
    }

    // Check if expired
    if (otpRecord.expiresAt < new Date()) {
      return NextResponse.json(
        { message: "OTP expired.", error: "OTP expired." },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: "OTP verified successfully." });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json(
      { message: "Server error.", error: "Server error." },
      { status: 500 }
    );
  }
}
