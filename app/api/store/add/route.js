import store from "@/models/store";
import connectDB from "@/lib/db";
import path from "path";
import fs from "fs/promises";
import slugify from "slugify";

export async function POST(req) {
  await connectDB();

  try {
    const formData = await req.formData();

    const newStoreData = {};
    const storeImagesFiles = [];
    const generalImagesFiles = [];

    const featuredTemp = {};
    const offersTemp = {};
    const highlightsTemp = {};
    const socialTimelineTemp = {};
    function toBool(v) {
      if (v === true || v === false) return v;
      if (v === "true" || v === "1" || v === "yes") return true;
      if (v === "false" || v === "0" || v === "no") return false;
      return false;
    }

    for (const [key, value] of formData.entries()) {
      // --------------- FILES FIRST (IMPORTANT) -----------------
      if (value instanceof File) {
        // LOGO
        if (key === "logo") newStoreData.logoFile = value;
        // STORE IMAGES
        else if (key.startsWith("store_image_")) storeImagesFiles.push(value);
        // GENERAL IMAGES
        else if (key === "images") generalImagesFiles.push(value);
        // FEATURED PRODUCTS IMAGE
        else if (
          key.startsWith("featured_products[") &&
          key.includes("][image]")
        ) {
          const index = key.match(/featured_products\[(\d+)\]/)[1];
          featuredTemp[index] ??= {};
          featuredTemp[index].imageFile = value;
        }

        // OFFERS IMAGE
        else if (key.startsWith("offers[") && key.includes("][image]")) {
          const index = key.match(/offers\[(\d+)\]/)[1];
          offersTemp[index] ??= {};
          offersTemp[index].imageFile = value;
        }

        // HIGHLIGHTS IMAGE
        else if (key.startsWith("highlights[") && key.includes("][image]")) {
          const index = key.match(/highlights\[(\d+)\]/)[1];
          highlightsTemp[index] ??= {};
          highlightsTemp[index].imageFile = value;
        }

        // SOCIAL TIMELINE IMAGE
        else if (
          key.startsWith("social_timeline[") &&
          key.includes("][image]")
        ) {
          const index = key.match(/social_timeline\[(\d+)\]/)[1];
          socialTimelineTemp[index] ??= {};
          socialTimelineTemp[index].imageFile = value;
        }

        continue; // <-- skip to next entry, do not treat this as text
      }

      // ---------------- TEXT FIELDS BELOW ---------------------

      // FEATURED PRODUCT TITLE
      if (key.startsWith("featured_products[") && key.includes("][title]")) {
        const index = key.match(/featured_products\[(\d+)\]/)[1];
        featuredTemp[index] ??= {};
        featuredTemp[index].title = value;
      }

      // OFFERS TEXT
      else if (key.startsWith("offers[") && key.includes("][title]")) {
        const index = key.match(/offers\[(\d+)\]/)[1];
        offersTemp[index] ??= {};
        offersTemp[index].title = value;
      } else if (key.startsWith("offers[") && key.includes("][valid]")) {
        const index = key.match(/offers\[(\d+)\]/)[1];
        offersTemp[index] ??= {};
        offersTemp[index].valid = value;
      } else if (key.startsWith("offers[") && key.includes("][description]")) {
        const index = key.match(/offers\[(\d+)\]/)[1];
        offersTemp[index] ??= {};
        offersTemp[index].description = value;
      }

      // HIGHLIGHTS LABEL
      else if (key.startsWith("highlights[") && key.includes("][label]")) {
        const index = key.match(/highlights\[(\d+)\]/)[1];
        highlightsTemp[index] ??= {};
        highlightsTemp[index].label = value;
      }

      // SOCIAL TIMELINE TEXT
      else if (
        key.startsWith("social_timeline[") &&
        key.includes("][media_url]")
      ) {
        const index = key.match(/social_timeline\[(\d+)\]/)[1];
        socialTimelineTemp[index] ??= {};
        socialTimelineTemp[index].media_url = value;
      } else if (key.includes("][post_text]")) {
        const index = key.match(/social_timeline\[(\d+)\]/)[1];
        socialTimelineTemp[index] ??= {};
        socialTimelineTemp[index].post_text = value;
      } else if (key.includes("][date]")) {
        const index = key.match(/social_timeline\[(\d+)\]/)[1];
        socialTimelineTemp[index] ??= {};
        socialTimelineTemp[index].date = value;
      }

      // NORMAL FIELDS
      else {
        if (key === "tags") {
          newStoreData[key] = (value || "")
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean); // remove empty values
        } else {
          newStoreData[key] = value;
        }
      }
    }

    // ---------------- FILE SAVE HELPERS ---------------------

    async function saveFile(file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = `${Date.now()}-${file.name}`;
      await fs.writeFile(
        path.join(process.cwd(), "public", "uploads", filename),
        buffer
      );
      return `/uploads/${filename}`;
    }

    // LOGO
    newStoreData.logo = newStoreData.logoFile
      ? await saveFile(newStoreData.logoFile)
      : null;
    delete newStoreData.logoFile;

    // STORE IMAGES
    newStoreData.store_images = [];
    for (const f of storeImagesFiles)
      newStoreData.store_images.push(await saveFile(f));

    // GENERAL IMAGES
    newStoreData.images = [];
    for (const f of generalImagesFiles)
      newStoreData.images.push(await saveFile(f));

    // FEATURED PRODUCTS
    newStoreData.featured_products = [];
    for (const i of Object.keys(featuredTemp)) {
      const fp = featuredTemp[i];
      newStoreData.featured_products.push({
        title: fp.title || "",
        image: fp.imageFile ? await saveFile(fp.imageFile) : null,
      });
    }

    // OFFERS
    newStoreData.offers = [];
    for (const i of Object.keys(offersTemp)) {
      const o = offersTemp[i];
      newStoreData.offers.push({
        title: o.title || "",
        valid: o.valid || null,
        description: o.description || "",
        image: o.imageFile ? await saveFile(o.imageFile) : null,
      });
    }

    // HIGHLIGHTS
    newStoreData.highlights = [];
    for (const i of Object.keys(highlightsTemp)) {
      const hl = highlightsTemp[i];
      newStoreData.highlights.push({
        label: hl.label || "",
        image: hl.imageFile ? await saveFile(hl.imageFile) : null,
      });
    }

    // SOCIAL TIMELINE
    newStoreData.social_timeline = [];
    for (const i of Object.keys(socialTimelineTemp)) {
      const st = socialTimelineTemp[i];
      newStoreData.social_timeline.push({
        media_url: st.media_url || "",
        post_text: st.post_text || "",
        date: st.date || "",
        image: st.imageFile ? await saveFile(st.imageFile) : null,
      });
    }

    if (!newStoreData.category || newStoreData.category === "") {
      newStoreData.category = null;
    }

    // ---- BOOLEAN NORMALIZATION ----
    newStoreData.sunday = {
      closed: toBool(newStoreData.sunday_closed),
      open: newStoreData.sunday_open || "",
      close: newStoreData.sunday_close || "",
    };

    delete newStoreData.sunday_closed;
    delete newStoreData.sunday_open;
    delete newStoreData.sunday_close;

    // mon-sat mapping
    newStoreData.mon_sat = {
      open: newStoreData.mon_sat_open || "",
      close: newStoreData.mon_sat_close || "",
    };

    delete newStoreData.mon_sat_open;
    delete newStoreData.mon_sat_close;
    const slug = slugify(newStoreData.organisation_name, {
      lower: true,
      strict: true,
    });
    newStoreData.slug = slug || "";
    const storeRecord = await store.create(newStoreData);

    return new Response(JSON.stringify({ success: true, data: storeRecord }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
