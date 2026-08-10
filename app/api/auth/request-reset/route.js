import connectDB from "@/lib/db";
import User from "@/models/User";
import Otp from "@/models/Otp";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email } = await req.json();
    const normalizedEmail = (email || "").trim().toLowerCase();

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!normalizedEmail || !emailRegex.test(normalizedEmail)) {
      return NextResponse.json(
        { message: "Please enter a valid email.", error: "Please enter a valid email." },
        { status: 400 }
      );
    }

    await connectDB();

    // Case-insensitive lookup so stored casing doesn't block resets
    const user = await User.findOne({
      email: { $regex: new RegExp(`^${normalizedEmail.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") },
    });
    if (!user) {
      return NextResponse.json(
        { message: "Email is not registered.", error: "Email is not registered." },
        { status: 404 }
      );
    }

    const userEmail = user.email;

    // Generate OTP
    const otpValue = Math.floor(100000 + Math.random() * 900000).toString();

    // Remove any previous OTP for this email (any casing)
    await Otp.deleteMany({
      email: { $regex: new RegExp(`^${normalizedEmail.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") },
    });

    // Save OTP against the email stored on the user record
    await Otp.create({
      email: userEmail,
      otp: otpValue,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 min expiry
    });

    // Use the same SMTP config as other working mail routes
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "Cycleworld.in - Your Password Reset OTP",
      text: `Your OTP is ${otpValue}. It expires in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Password Reset OTP</h2>
          <p>Your OTP is <strong style="font-size: 20px; letter-spacing: 2px;">${otpValue}</strong>.</p>
          <p>It expires in 10 minutes.</p>
          <p>If you did not request this, you can ignore this email.</p>
        </div>
      `,
    });

    return NextResponse.json(
      { message: "OTP sent to your email." },
      { status: 200 }
    );
  } catch (error) {
    console.error("request-reset Error:", error);
    const isMailError =
      error?.code === "EAUTH" ||
      error?.responseCode === 535 ||
      /invalid login|authentication|credentials/i.test(error?.message || "");

    return NextResponse.json(
      {
        message: isMailError
          ? "Unable to send OTP email. Please try again later."
          : "Internal server error",
        error: isMailError
          ? "Unable to send OTP email. Please try again later."
          : "Internal server error",
      },
      { status: 500 }
    );
  }
}
