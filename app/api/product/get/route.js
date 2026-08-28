import dbConnect from "@/lib/db";
import Product from "@/models/product";
import { NextResponse } from "next/server";
import Wishlist from "@/models/ecom_wishlist_info";
import Filter from '@/models/ecom_filter_infos';
import FilterGroup from '@/models/ecom_filter_group_infos';
import ProductFilter from '@/models/ecom_productfilter_info';

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const lite = searchParams.get("lite") === "1";
    const limit = parseInt(searchParams.get("limit") || "0", 10);

    if (lite) {
      const query = Product.find({
        status: "Active",
        quantity: { $gt: 0 },
        stock_status: "In Stock",
      })
        .sort({ createdAt: -1 })
        .select(
          "name slug images price special_price offer_price quantity stock_status brand status createdAt"
        )
        .lean();

      if (limit > 0) {
        query.limit(limit);
      }

      const products = await query;
      return NextResponse.json(products, {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=120, stale-while-revalidate=300",
        },
      });
    }

    // Run all queries together (full admin payload)
    const [
      products,
      wishlistedItems,
      ProductFilteritems,
      Filteritems,
      sizeGroup
    ] = await Promise.all([
      Product.find({}).sort({ createdAt: -1 }).lean(),

      Wishlist.find({}, 'productId userId').lean(),

      ProductFilter.find({}, 'product_id filter_id').lean(),

      Filter.find({}).lean(),

      // only fetch size group
      FilterGroup.findOne({ filtergroup_name: /size/i }).lean()
    ]);

    // Create maps
    const wishlistMap = new Map(
      wishlistedItems.map(item => [item.productId.toString(), item])
    );

    const filterMap = new Map();
    ProductFilteritems.forEach(item => {
      const key = item.product_id.toString();
      if (!filterMap.has(key)) filterMap.set(key, []);
      filterMap.get(key).push(item);
    });

    const filtersMap = new Map(
      Filteritems.map(item => [item._id.toString(), item])
    );

    const productsWithWishlist = products.map(product => {
      const wishlist = wishlistMap.get(product._id.toString()) || null;
      const filtersdata = filterMap.get(product._id.toString()) || [];

      const filterDetails = filtersdata
        .map(f => filtersMap.get(f.filter_id?.toString()))
        .filter(Boolean);

      const sizeFilterDetails = filterDetails.filter(f =>
        f.filter_group?.toString() === sizeGroup?._id.toString()
      );

      return {
        ...product,
        wishlist,
        filterDetails,
        sizeFilterDetails,
      };
    });

    return NextResponse.json(productsWithWishlist, { status: 200 });

  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}
