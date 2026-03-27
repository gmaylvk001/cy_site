import dbConnect from "@/lib/db";
import Product from "@/models/product";
import ProductFilter from "@/models/ecom_productfilter_info";
import Filter from "@/models/ecom_filter_infos";
import FilterGroup from "@/models/ecom_filter_group_infos";

export async function GET(req) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    //console.log(searchParams);
    const categoryIds = searchParams.get('categoryIds')?.split(',') || [];
    const sub_category_new = searchParams.get('sub_category_new');
    const brandIds = searchParams.get('brands')?.split(',') || [];
    const minPrice = parseFloat(searchParams.get('minPrice')) || 0;
    const maxPrice = parseFloat(searchParams.get('maxPrice')) || 1000000;
    const filterIds = searchParams.get('filters')?.split(',') || [];
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 5;


    // Base query - always filter by category
    let query = { 
        status: "Active",
        quantity: { $gt: 0 } 
      };

      if (sub_category_new && typeof sub_category_new === "string") {
  query.sub_category_new = { 
    $regex: sub_category_new,
    $options: "i"
  };
}

    // Add brand filters if any
    if (brandIds.length > 0) {
      query.brand = { $in: brandIds };
    }
    
    // Price range filter (considers both price and special_price)
    query.$or = [
      { 
        $and: [
          { special_price: { $ne: null } },
          { special_price: { $gte: minPrice, $lte: maxPrice } }
        ]
      },
      { 
        $and: [
          { special_price: null },
          { special_price: { $gte: minPrice, $lte: maxPrice } }
        ]
      }
    ];
    
    const baseProductIds = await Product.find(query).distinct("_id");
    const baseProductIdStrings = baseProductIds.map((id) => id.toString());
    let matchingProductIdStrings = baseProductIdStrings;

    if (filterIds.length > 0 && baseProductIdStrings.length > 0) {
      const selectedProductFilters = await ProductFilter.find({
        product_id: { $in: baseProductIdStrings },
        filter_id: { $in: filterIds },
      }).lean();

      const filtersByProduct = selectedProductFilters.reduce((acc, pf) => {
        const productId = pf.product_id.toString();
        if (!acc[productId]) acc[productId] = new Set();
        acc[productId].add(pf.filter_id.toString());
        return acc;
      }, {});

      matchingProductIdStrings = baseProductIdStrings.filter((productId) => {
        const productFilterIds = filtersByProduct[productId] || new Set();
        return filterIds.some((fid) => productFilterIds.has(fid));
      });
    }

    const allProductFilters =
      matchingProductIdStrings.length > 0
        ? await ProductFilter.find({
            product_id: { $in: matchingProductIdStrings },
          }).lean()
        : [];

    const filterCountMap = allProductFilters.reduce((acc, pf) => {
      const filterId = pf.filter_id?.toString();
      const productId = pf.product_id?.toString();

      if (!filterId || !productId) {
        return acc;
      }

      if (!acc[filterId]) {
        acc[filterId] = new Set();
      }

      acc[filterId].add(productId);
      return acc;
    }, {});

    const availableFilterIds = Object.keys(filterCountMap);
    const availableFilters =
      availableFilterIds.length > 0
        ? await Filter.find({ _id: { $in: availableFilterIds } })
            .populate({
              path: "filter_group",
              select: "_id filtergroup_name",
              model: FilterGroup,
            })
            .lean()
        : [];

    const formattedAvailableFilters = availableFilters
      .map((filter) => ({
        ...filter,
        filter_group_id: filter.filter_group?._id?.toString() || "",
        filter_group_name: filter.filter_group?.filtergroup_name || "No Group",
        count: filterCountMap[filter._id.toString()]?.size || 0,
      }))
      .filter((filter) => filter.count > 0);

    if (matchingProductIdStrings.length > 0) {
      query._id = { $in: matchingProductIdStrings };
    } else {
      query._id = { $in: [] };
    }

    let productsQuery = Product.find(query).populate("brand", "brand_name brand_slug");


    // Apply sorting: Products with quantity > 0 first, then quantity <= 0
    productsQuery = productsQuery.sort({ 
      quantity: -1, // -1 for descending: quantity > 0 comes first, then quantity <= 0
      _id: -1 // Secondary sort by _id or any other field you prefer
    });
  
  // Apply pagination
  const skip = (page - 1) * limit;
  const products = await productsQuery
    .skip(skip)
    .limit(limit)
    .lean();
  
  // Get total count for pagination info (optional)
  const totalProducts = await Product.countDocuments(query);
  const totalPages = Math.ceil(totalProducts / limit);
  
  return Response.json({
    products,
    availableFilters: formattedAvailableFilters,
    pagination: {
      currentPage: page,
      totalPages,
      totalProducts,
      hasNext: page < totalPages,
      hasPrev: page > 1,
      hasMore: page < totalPages
    }
  });
  } catch (error) {
    console.error('Error in /api/product/filter:', error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
