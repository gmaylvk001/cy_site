import connectToDatabase from "@/lib/db";
import Product from "@/models/product";
import ProductFilter from "@/models/ecom_productfilter_info";

export async function GET(req) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);

    const gender = searchParams.get("gender"); // optional
    const type = searchParams.get("type");     // optional
    const minPrice = Number(searchParams.get("minPrice")) || 0;
    const maxPrice = Number(searchParams.get("maxPrice")) || 100000;
    const limit = Number(searchParams.get("limit")) || 25;
    const brand = searchParams.get("brand");

    // Base product query
    const query = {
      status: "Active",
      special_price: { $gte: minPrice, $lte: maxPrice },
      quantity: { $gt: 0 },
      stock_status: "In Stock",
    };

    // Build filter list dynamically
    const filterIds = [];
    if (gender) filterIds.push(gender);
    if (type) filterIds.push(type);

    // If filters exist → apply ProductFilter aggregation
    if (filterIds.length > 0) {
      const matchedProducts = await ProductFilter.aggregate([
        { $match: { filter_id: { $in: filterIds } } },
        {
          $group: {
            _id: "$product_id",
            matchedFilters: { $addToSet: "$filter_id" },
          },
        },
        {
          $match: { matchedFilters: { $all: filterIds } },
        },
      ]);

      const productIds = matchedProducts.map(p => p._id);

      if (productIds.length === 0) {
        return new Response(JSON.stringify([]), { status: 200 });
      }

      query._id = { $in: productIds };
    }

    if (brand) {
      query.brand = brand; 
    }

    // Fetch products
   const products = await Product.find(query)
      .sort({ createdAt: -1 })   // Newest first
      .limit(limit)                 // Only 25 products
      .populate("category", "category_name")
      .populate("brand", "brand_name")
      .lean();

    return new Response(JSON.stringify(products), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error fetching products:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
