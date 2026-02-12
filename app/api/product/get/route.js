import dbConnect from "@/lib/db";
import Product from "@/models/product";
import { NextResponse } from "next/server";
import Wishlist from "@/models/ecom_wishlist_info";
import Filter from '@/models/ecom_filter_infos';
import FilterGroup from '@/models/ecom_filter_group_infos';
import ProductFilter from '@/models/ecom_productfilter_info';

export async function GET() {
  try {
    await dbConnect();

    // 🔥 Run all queries together (faster)
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
