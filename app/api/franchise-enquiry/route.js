import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import FranchiseEnquiry from "@/models/franchise_enquiry";

export async function GET() {
  try {
    await dbConnect();

    const enquiries = await FranchiseEnquiry.find({}).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: enquiries }, { status: 200 });
  } catch (error) {
    console.error("Error fetching franchise enquiries:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const {
      name,
      phone,
      email,
      city,
      company = "",
      investment_range = "",
      start_time = "",
      occupation_type = "",
      utm_source = "",
      utm_medium = "",
      utm_campaign = "",
      source = "franchise_form",
      status = "new",
    } = body;

    if (!name || !phone || !email || !city) {
      return NextResponse.json(
        { success: false, message: "Name, phone, email and city are required" },
        { status: 400 }
      );
    }

    const enquiry = await FranchiseEnquiry.create({
      name,
      phone,
      email,
      city,
      company,
      investment_range,
      start_time,
      occupation_type,
      utm_source,
      utm_medium,
      utm_campaign,
      source,
      status,
    });

    return NextResponse.json(
      { success: true, message: "Franchise enquiry saved successfully", data: enquiry },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving franchise enquiry:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
