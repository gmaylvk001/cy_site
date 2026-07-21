import mongoose from "mongoose";

const FranchiseEnquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    city: { type: String, required: true, trim: true },
    company: { type: String, trim: true, default: "" },
    investment_range: { type: String, trim: true, default: "" },
    start_time: { type: String, trim: true, default: "" },
    occupation_type: { type: String, trim: true, default: "" },
    utm_source: { type: String, trim: true, default: "" },
    utm_medium: { type: String, trim: true, default: "" },
    utm_campaign: { type: String, trim: true, default: "" },
    source: { type: String, trim: true, default: "franchise_form" },
    status: { type: String, trim: true, default: "new" },
  },
  { timestamps: true }
);

export default mongoose.models.FranchiseEnquiry ||
  mongoose.model("FranchiseEnquiry", FranchiseEnquirySchema, "franchise_enquiry");
