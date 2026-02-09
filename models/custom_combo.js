import mongoose from "mongoose";

const VariantSchema = new mongoose.Schema(
  {
    color: { type: String, default: null },
    size: { type: String, default: null },
    frame: { type: String, default: null },
    price :{ type : String , default : null},
    images :{type: [String], default : []}
    // Add any other variant attributes you need
  },
  { _id: false } // no separate _id for variant subdocument
);

const ProductWithVariantSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    selectedVariant: {
      type: VariantSchema,
      default: {},
    },
  },
  { _id: false } // no separate _id for this subdocument
);

const CustomComboSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ecom_users_infos",
      index: true,
      default: null,
    },
    guestId: {
      type: String,
      index: true,
      default: null,
    },

    cycles: [ProductWithVariantSchema],
    accessories: [ProductWithVariantSchema],
    bags: [ProductWithVariantSchema],
  },
  {
    timestamps: true,
  }
);

// ✅ Prevent model overwrite error in Next.js
export default mongoose.models.custom_combo ||
  mongoose.model("custom_combo", CustomComboSchema);
