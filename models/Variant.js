import mongoose from "mongoose";

const VariantAttributeSchema = new mongoose.Schema(
  {
    variant_attribute_name: { type: String, required: true, trim: true },
    options: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const SingleVariantSchema = new mongoose.Schema(
  {
    variant_arr: {
      type: [VariantAttributeSchema],
      default: [],
    },

    item_code: { type: String, default: "", trim: true },
    price: { type: Number, default: 0 },
    special_price: { type: Number, default: 0 },
    quantity: { type: Number, default: 0 },

    stock_status: {
      type: String,
      enum: ["In Stock", "Out of Stock"],
      default: "In Stock",
    },

    images: { type: [String], default: [] },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  { _id: false }
);

const VariantSchema = new mongoose.Schema(
  {
    parent_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    parent_model: {
      type: String,
      enum: ["Product", "Product_all"],
      required: true,
    },

    // product item_code
    item_code: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    product_name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    // ✅ THIS is your main variants array
    variants: {
      type: [SingleVariantSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.models.Variant ||
  mongoose.model("Variant", VariantSchema);
