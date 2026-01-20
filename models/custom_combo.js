import mongoose from "mongoose";

const CustomComboSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ecom_users_infos",
      required: true,
      index: true,
    },
    guestId: {
      type: String,
      default: null,
      index: true,
    },

    cycles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    accessories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    bags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// ✅ Prevent model overwrite error in Next.js
export default mongoose.models.custom_combo ||
  mongoose.model("custom_combo", CustomComboSchema);
