// app/api/store/[storeId]/route.js
import { NextResponse } from "next/server";
import { parseForm } from "@/lib/parseForm";
import connectDB from "@/lib/db"; // Adjust path as per your project structure
import Store from "@/models/store"; // Adjust path to your Store model
import multer from "multer"; // You might need a file upload library like multer or formidable for Node.js
import path from "path";
import fs from "fs/promises"; // For file system operations
import { FileSliders } from "lucide-react";
import mongoose from "mongoose";
import slugify from "slugify";
// Configure Multer for file uploads (assuming you're storing files locally)
// For production, consider cloud storage like AWS S3, Cloudinary, etc.
const upload = multer({
  storage: multer.diskStorage({
    destination: "./public/uploads", // Files will be saved in public/uploads
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(
        null,
        file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
      );
    },
  }),
});

// Helper to run Multer middleware
const runMiddleware = (req, res, fn) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

// Disable Next.js body parser to allow Multer to handle file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

// old get method

// GET handler to fetch a single store by ID
// export async function GET(request, context) {
//   const { storeId } = await context.params; // ✅ CORRECT
//   // const storeId = "68bac057ef9969a73caa3ac1"
//   if (!storeId) {
//     return NextResponse.json(
//       { error: "Store ID is required." },
//       { status: 400 }
//     );
//   }

//   try {
//     await connectDB();
//     const store = await Store.findById(storeId);

//     if (!store) {
//       return NextResponse.json({ error: "Store not found." }, { status: 404 });
//     }
//     // console.log(store,"store")
//     return NextResponse.json(store, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching store:", error);
//     return NextResponse.json(
//       { error: "Internal Server Error", details: error.message },
//       { status: 500 }
//     );
//   }
// }

export async function GET(request, context) {
  const { storeId } = await context.params; // same param, dual purpose

  if (!storeId) {
    return NextResponse.json(
      { error: "Store ID or organisation name is required." },
      { status: 400 }
    );
  }

  try {
    await connectDB();

    let query = {};

    // If it's a valid ObjectId, search by _id — otherwise by organisation_name
    if (mongoose.Types.ObjectId.isValid(storeId)) {
      query = { _id: storeId };
    } else {
      query = { slug: storeId };
    }

    const store = await Store.findOne(query);

    if (!store) {
      return NextResponse.json(
        { error: "Store not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(store, { status: 200 });

  } catch (error) {
    console.error("Error fetching store:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}

// PUT handler to update an existing store
export async function PUT(request, context) {
  const { storeId } = await context.params;
  if (!storeId) {
    return NextResponse.json(
      { error: "Store ID is required." },
      { status: 400 }
    );
  }

  await connectDB();

  try {
    const { fields, files } = await parseForm(request);
    // console.log(fields,'fields test')
    // Build update data
    const updateData = {
      organisation_name: fields.organisation_name?.[0] || "",
      slug:'',
      category: fields.category?.[0] || "",
      description: fields.description?.[0] || "",
      location: fields.location?.[0] || "",
      zipcode: fields.zipcode?.[0] || "",
      address: fields.address?.[0] || "",
      service_area: fields.service_area?.[0] || "",
      city: fields.city?.[0] || "",
      phone: fields.phone?.[0] || "",
      phone_after_hours: fields.phone_after_hours?.[0] || "",
      website: fields.website?.[0] || "",
      email: fields.email?.[0] || "",
      twitter: fields.twitter?.[0] || "",
      facebook: fields.facebook?.[0] || "",
      meta_title: fields.meta_title?.[0] || "",
      meta_description: fields.meta_description?.[0] || "",
      verified: fields.verified?.[0] === "true" ? "Yes" : "No",
      approved: fields.approved?.[0] === "true" ? "Yes" : "No",
      // user: fields.user?.[0] || "",
      status: fields.status?.[0] || "",
      tags: fields.tags?.[0]
        ? fields.tags[0]
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
      parking: fields.parking?.[0] || "",
      mon_sat: {
        open: fields.mon_sat_open?.[0] || "",
        close: fields.mon_sat_close?.[0] || "",
      },
      sunday: {
        closed: fields.sunday_closed[0] === "true" ? true : false,
        open: fields.sunday_open?.[0] || "",
        close: fields.sunday_close?.[0] || "",
      },
      payment_method: fields.payment_method?.[0] || "",
    };
    // only set it if present
    if (fields.user?.[0]) {
      updateData.user = fields.user[0];
    }

    if (
      fields.category?.[0] &&
      fields.category[0] !== "null" &&
      fields.category[0] !== "undefined"
    ) {
      updateData.category = fields.category[0]; // <-- single value
    } else {
      delete updateData.category; // <-- don't send empty value
    }
    const slug = slugify(updateData.organisation_name, { lower: true, strict: true });
    updateData.slug = slug || '';
    // Logo upload
    if (files.logo?.[0]) {
      const filePath = path.basename(files.logo[0].filepath);
      updateData.logo = `/uploads/${filePath}`;
    } else if (fields.logo?.[0]) {
      updateData.logo = fields.logo[0];
    }

    // Store images
    const newStoreImages = [];
    for (let i = 0; i < 3; i++) {
      if (files[`store_image_${i}`]?.[0]) {
        newStoreImages[i] = `/uploads/${path.basename(
          files[`store_image_${i}`][0].filepath
        )}`;
      } else if (fields[`existing_store_image_${i}`]?.[0]) {
        newStoreImages[i] = fields[`existing_store_image_${i}`][0];
      } else {
        newStoreImages[i] = null;
      }
    }
    updateData.store_images = newStoreImages;

    // ---------------- FEATURED PRODUCTS ----------------
    const featuredProducts = [];

    for (let i = 0; ; i++) {
      const title = fields[`featured_products[${i}][title]`]?.[0];

      // stop when no more indexed items exist
      if (title === undefined) break;

      // check if new file uploaded
      const file = files[`featured_products[${i}][image]`]?.[0];

      featuredProducts.push({
        title,
        image: file
          ? `/uploads/${path.basename(file.filepath)}`
          : fields[`featured_products[${i}][existing_image]`]?.[0] || null,
      });
    }

    updateData.featured_products = featuredProducts;

    const offers = [];
    for (let i = 0; ; i++) {
      const title = fields[`offers[${i}][title]`]?.[0];
      if (title === undefined) break;
      const valid = fields[`offers[${i}][valid]`]?.[0];
      const description = fields[`offers[${i}][description]`]?.[0];
      const file = files[`offers[${i}][image]`]?.[0];
      const image = file
        ? `/uploads/${path.basename(file.filepath)}`
        : fields[`offers[${i}][existing_image]`]?.[0] || null;

      if (!title && !image && !description && !valid) continue;

      offers.push({
        title,
        valid,
        description,
        image,
      });
    }

    const highlights = [];

    for (let i = 0; ; i++) {
      const label = fields[`highlights[${i}][label]`]?.[0] || "";

      // stop when no more rows exist
      const hasAnyField =
        fields[`highlights[${i}][label]`] ||
        fields[`highlights[${i}][existing_image]`] ||
        fields[`highlights[${i}][image]`];

      if (!hasAnyField) break;

      const file = files[`highlights[${i}][image]`]?.[0];

      const image = file
        ? `/uploads/${path.basename(file.filepath || file.filePath)}`
        : fields[`highlights[${i}][existing_image]`]?.[0] || null;

      highlights.push({
        label,
        image,
      });
    }

    updateData.highlights = highlights;

    const social_timeline = [];

    for (let i = 0; ; i++) {
      const media_url = fields[`social_timeline[${i}][media_url]`]?.[0] || "";
      const post_text = fields[`social_timeline[${i}][post_text]`]?.[0] || "";
      const date = fields[`social_timeline[${i}][date]`]?.[0] || "";

      // stop when no more rows exist
      const hasAnyField =
        fields[`social_timeline[${i}][media_url]`] ||
        fields[`social_timeline[${i}][existing_image]`] ||
        fields[`social_timeline[${i}][image]`] ||
        fields[`social_timeline[${i}][post_text]`] ||
        fields[`social_timeline[${i}][date]`];

      if (!hasAnyField) break;

      const file = files[`social_timeline[${i}][image]`]?.[0];

      const image = file
        ? `/uploads/${path.basename(file.filepath || file.filePath)}`
        : fields[`social_timeline[${i}][existing_image]`]?.[0] || null;

      social_timeline.push({
        media_url,
        post_text,
        date,
        image,
      });
    }

    updateData.social_timeline = social_timeline;

    // General images
    const generalImages = [];
    if (files.images) {
      (Array.isArray(files.images) ? files.images : [files.images]).forEach(
        (file) => {
          generalImages.push(`/uploads/${path.basename(file.filepath)}`);
        }
      );
    }
    if (fields.existing_images) {
      const existing = Array.isArray(fields.existing_images)
        ? fields.existing_images
        : [fields.existing_images];
      generalImages.push(...existing);
    }
    updateData.images = generalImages;
    // console.log(updateData,'update datas')
    const updatedStore = await Store.findByIdAndUpdate(
      storeId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedStore) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Store updated successfully.", store: updatedStore },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating store:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
// PATCH handler to update store status to Inactive (from previous request)
export async function PATCH(request, context) {
  const { storeId } = context.params;

  if (!storeId) {
    return NextResponse.json(
      { error: "Store ID is required." },
      { status: 400 }
    );
  }

  try {
    await connectDB();
    const updatedStore = await Store.findByIdAndUpdate(
      storeId,
      { status: "Inactive" },
      { new: true, runValidators: true }
    );

    if (!updatedStore) {
      return NextResponse.json({ error: "Store not found." }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Store status updated to Inactive.", store: updatedStore },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error inactivating store:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE handler for permanent deletion (optional, if you want this functionality)
export async function DELETE(request, context) {
  const { storeId } = context.params;
  if (!storeId) {
    return NextResponse.json(
      { error: "Store ID is required." },
      { status: 400 }
    );
  }
  try {
    await connectDB();
    const deletedStore = await Store.findByIdAndDelete(storeId);
    if (!deletedStore) {
      return NextResponse.json({ error: "Store not found." }, { status: 404 });
    }
    return NextResponse.json(
      { message: "Store permanently deleted." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting store:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
