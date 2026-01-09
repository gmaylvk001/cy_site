import connectDB from "@/lib/db";
import Filter from "@/models/ecom_filter_infos";
import FilterGroup from "@/models/ecom_filter_group_infos";

export async function GET(req) {
  try {
    await connectDB();

    // Step 1: Get all active filter groups
    const groups = await FilterGroup.find({ status: "Active" }).lean();

    // Step 2: Initialize an object to hold grouped filters
    const groupedFilters = {};

    // Step 3: For each group, get its filters
    for (const group of groups) {
      const filters = await Filter.find({
        filter_group: group._id,
        status: "Active",
      }).lean();

      // Map each filter to { name, id } and assign to slug key
      groupedFilters[group.filtergroup_slug] = filters.map(f => ({
        name: f.filter_name,
        id: f._id.toString(), // make sure ID is string
      }));
    }

    // Step 4: Return grouped filters as JSON
    return new Response(JSON.stringify(groupedFilters), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error fetching filters:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
