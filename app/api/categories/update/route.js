import dbConnect from "@/lib/db";
import Category from "@/models/ecom_category_info";
import CategoryFilter from "@/models/ecom_categoryfilters_infos"; // Import the new model
import { NextResponse } from "next/server";
import md5 from "md5";
import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";
import mongoose from "mongoose";
import { toPublicImageSrc } from "@/lib/imageSrc";

function isUploadedFile(file) {
  return Boolean(
    file &&
      typeof file !== "string" &&
      typeof file.arrayBuffer === "function" &&
      file.size > 0 &&
      file.name
  );
}

function toRelativeUploadPath(imageUrl) {
  return toPublicImageSrc(imageUrl, "");
}

function publicFilePath(imageUrl) {
  const relative = toRelativeUploadPath(imageUrl);
  if (!relative) return null;
  return path.join(process.cwd(), "public", relative.replace(/^[/\\]+/, ""));
}

async function deletePublicFile(imageUrl) {
  const filePath = publicFilePath(imageUrl);
  if (!filePath) return;
  try {
    await unlink(filePath);
  } catch (err) {
    console.error("Error deleting old image:", err);
  }
}

async function saveCategoryUpload(file, prefix) {
  const uploadDir = path.join(process.cwd(), "public", "uploads", "categories");
  await mkdir(uploadDir, { recursive: true });
  const fileName = `${prefix}_${Date.now()}${path.extname(file.name)}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadDir, fileName), buffer);
  return `/uploads/categories/${fileName}`;
}

function convertSlug(slug) {
  let result = slug.replace(/ /g, "-"); // replace spaces with hyphens
  result = result.replace(/[^A-Za-z0-9\-]/g, ""); // remove special chars
  result = result.replace(/-+/g, "-"); // collapse multiple hyphens
  result = result.toLowerCase();
  return result;
}

export async function PUT(req) {
  try {
    await dbConnect();

    // Parse formData
    const formData = await req.formData();
    const _id = formData.get("_id");
    const category_name = formData.get("category_name");
    let parentid = formData.get("parentid") || "none";
    let parentid_new = "none";
    const status = formData.get("status") || "Active";
    const content = formData.get("content") || ""; // ✅ Add content field
    const file = formData.get("image");
    const existingImage = formData.get("existingImage");
    const selectedFilters = formData.get("selectedFilters"); // Get selected filters

    if (!_id || !category_name) {
      return NextResponse.json({ error: "Category ID and name are required" }, { status: 400 });
    }

    // Find the existing category
    const existingCategory = await Category.findById(_id);
    if (!existingCategory) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    // Check if new category name already exists (excluding current category)
    let category_slug = convertSlug(category_name);
    const md5_cat_name = md5(category_slug);
    
    if (parentid === "none") {
        parentid_new = "none";
    }
    else
    {
        const objectId = new mongoose.Types.ObjectId(parentid);
        const getParentCategory = await Category.findOne({ _id: objectId });
        parentid_new = getParentCategory.md5_cat_name;
    }

    const duplicateCategory = await Category.findOne({
      category_slug,
      _id: { $ne: _id } // Exclude current category from check
    });

    if (duplicateCategory) {
      return NextResponse.json({ error: "Category name already exists" }, { status: 400 });
    }

    // Handle image upload/update — always store a relative public path
    let image_url =
      toRelativeUploadPath(existingImage) ||
      toRelativeUploadPath(existingCategory.image) ||
      "";

    if (isUploadedFile(file)) {
      await deletePublicFile(image_url || existingImage);
      image_url = await saveCategoryUpload(file, "category");
    }

    // Handle navImage upload/update BEFORE updating category
    const existingNavImage = formData.get("existingNavImage");
    let nav_image_url =
      toRelativeUploadPath(existingNavImage) ||
      toRelativeUploadPath(existingCategory.navImage) ||
      "";
    const navFile = formData.get("navImage");
    if (isUploadedFile(navFile)) {
      await deletePublicFile(nav_image_url || existingNavImage);
      nav_image_url = await saveCategoryUpload(navFile, "category_nav");
    }

    // UPDATE FILTERS LOGIC - Same as product filters
    let filterIds = [];
    if (selectedFilters) {
      try {
        filterIds = JSON.parse(selectedFilters);
        
        // Remove existing filters for this category
        await CategoryFilter.deleteMany({ category_id: _id });
        
        // Add new filters if any are selected
        if (filterIds.length > 0) {
          const filterPromises = filterIds.map(filterId => 
            CategoryFilter.create({
              filter_id: filterId,
              category_id: _id
            })
          );
          await Promise.all(filterPromises);
          // console.log(`Updated ${filterIds.length} filters for category ${_id}`);
        }
      } catch (error) {
        console.error("Error updating filters:", error);
        // Don't fail the entire update if filters fail, just log it
      }
    } else {
      // If no filters are provided, remove all existing filters
      await CategoryFilter.deleteMany({ category_id: _id });
      // console.log(`Removed all filters for category ${_id}`);
    }

    // ✅ Update category with content and other fields
    const updatedCategory = await Category.findByIdAndUpdate(
      _id,
      {
        category_name,
        category_slug,
        md5_cat_name,
        parentid,
        parentid_new,
        status,
        content, // ✅ Add content field here
        image: image_url,
        navImage: nav_image_url,
        updatedAt: new Date(),
      },
      { new: true }
    ); 

    if (!updatedCategory) {
      return NextResponse.json({ error: "Failed to update category" }, { status: 400 });
    }

    return NextResponse.json(
      {
        message: "Category updated successfully",
        category: updatedCategory
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Failed to update category", details: error.message },
      { status: 500 }
    );
  }
}