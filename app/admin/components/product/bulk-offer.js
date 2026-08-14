"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { ToastContainer, toast } from "react-toastify";
import ReactPaginate from "react-paginate";
import {
  calcOfferPriceFromBase,
  getOfferBasePrice,
  hasOfferPrice,
} from "@/lib/pricing";

export default function BulkOfferComponent() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [brandFilter, setBrandFilter] = useState("");

  const [selectedIds, setSelectedIds] = useState(new Set());
  const [percentage, setPercentage] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 25;

  useEffect(() => {
    import("react-toastify/dist/ReactToastify.css");
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/product/get");
      const data = await response.json();
      setProducts(Array.isArray(data) ? data.filter((p) => p.item_code !== "none") : []);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await fetch("/api/brand/get");
      const data = await response.json();
      if (data.success) setBrands(data.brands || []);
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchBrands();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        product.name?.toLowerCase().includes(q) ||
        product.item_code?.toLowerCase().includes(q) ||
        product.slug?.toLowerCase().includes(q);

      const matchesStatus =
        !statusFilter ||
        product.status?.toLowerCase() === statusFilter.toLowerCase();

      let matchesCategory = true;
      if (categoryFilter) {
        const selectedCategory = categories.find(
          (cat) => cat._id?.toString() === categoryFilter
        );
        const productCategoryIds = Array.isArray(product.category)
          ? product.category.map((c) =>
              typeof c === "object" ? c?._id?.toString() : c?.toString()
            )
          : product.category
            ? [
                typeof product.category === "object"
                  ? product.category._id?.toString()
                  : product.category.toString(),
              ]
            : [];

        if (selectedCategory?.parentid === "none") {
          const subCategoryIds = categories
            .filter((cat) => cat.parentid === categoryFilter)
            .map((cat) => cat._id.toString());
          matchesCategory = productCategoryIds.some(
            (id) => id === categoryFilter || subCategoryIds.includes(id)
          );
        } else {
          matchesCategory = productCategoryIds.includes(categoryFilter);
        }
      }

      let matchesBrand = true;
      if (brandFilter) {
        const brandId =
          typeof product.brand === "object"
            ? product.brand?._id?.toString()
            : product.brand?.toString();
        matchesBrand = brandId === brandFilter;
      }

      return matchesSearch && matchesStatus && matchesCategory && matchesBrand;
    });
  }, [products, searchQuery, statusFilter, categoryFilter, brandFilter, categories]);

  useEffect(() => {
    setCurrentPage(0);
  }, [searchQuery, statusFilter, categoryFilter, brandFilter]);

  const pageCount = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = filteredProducts.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const filteredIds = useMemo(
    () => filteredProducts.map((p) => p._id.toString()),
    [filteredProducts]
  );

  const allFilteredSelected =
    filteredIds.length > 0 && filteredIds.every((id) => selectedIds.has(id));

  const someFilteredSelected =
    filteredIds.some((id) => selectedIds.has(id)) && !allFilteredSelected;

  const toggleSelectAllFiltered = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allFilteredSelected) {
        filteredIds.forEach((id) => next.delete(id));
      } else {
        filteredIds.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  const toggleProduct = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const clearSelection = () => setSelectedIds(new Set());

  const runBulkOffer = async (action) => {
    if (selectedIds.size === 0) {
      toast.error("Select at least one product.");
      return;
    }

    let pct = null;
    if (action === "apply") {
      pct = Number(percentage);
      if (Number.isNaN(pct) || pct < 0 || pct > 100) {
        toast.error("Enter a valid percentage between 0 and 100.");
        return;
      }
    }

    const confirmed = window.confirm(
      action === "remove"
        ? `Remove offer_price from ${selectedIds.size} selected product(s)?\nSpecial price will show again on storefront/cart/checkout.`
        : `Apply ${pct}% offer into offer_price for ${selectedIds.size} selected product(s)?\n\noffer_price = special_price − ${pct}% (special_price stays unchanged)`
    );
    if (!confirmed) return;

    setIsApplying(true);
    try {
      const response = await fetch("/api/product/bulk-offer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productIds: Array.from(selectedIds),
          percentage: pct,
          action,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to update offer.");
        return;
      }

      toast.success(data.message);
      if (data.skippedCount > 0) {
        toast.warn(`${data.skippedCount} product(s) skipped (invalid price).`);
      }
      clearSelection();
      if (action === "apply") setPercentage("");
      await fetchProducts();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while updating offer.");
    } finally {
      setIsApplying(false);
    }
  };

  const mainCategories = categories
    .filter((cat) => cat.parentid === "none")
    .slice()
    .sort((a, b) => a.category_name.localeCompare(b.category_name));

  return (
    <div className="container mx-auto p-4">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex flex-wrap justify-between items-center gap-3 mb-5">
        <div>
          <h2 className="text-2xl font-bold">Bulk Percentage Offer</h2>
          <p className="text-sm text-gray-600 mt-1">
            Sets <strong>offer_price</strong> only. Special price is never changed. Remove offer to fall back to special price.
          </p>
        </div>
        <Link
          href="/admin/product"
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <Icon icon="mdi:arrow-left" className="text-lg" />
          Back to Product List
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg p-5 mb-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Offer Percentage (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.01"
              placeholder="e.g. 10"
              value={percentage}
              onChange={(e) => setPercentage(e.target.value)}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>

          <div className="md:col-span-3 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={toggleSelectAllFiltered}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              {allFilteredSelected ? "Deselect All Filtered" : "Select All Filtered"}
            </button>
            <button
              type="button"
              onClick={clearSelection}
              disabled={selectedIds.size === 0}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md disabled:opacity-50"
            >
              Clear Selection
            </button>
            <button
              type="button"
              onClick={() => runBulkOffer("apply")}
              disabled={isApplying || selectedIds.size === 0 || percentage === ""}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md disabled:bg-gray-400 flex items-center gap-2"
            >
              <Icon icon="mdi:tag-percent" className="text-lg" />
              {isApplying ? "Saving..." : `Apply Offer (${selectedIds.size})`}
            </button>
            <button
              type="button"
              onClick={() => runBulkOffer("remove")}
              disabled={isApplying || selectedIds.size === 0}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md disabled:bg-gray-400 flex items-center gap-2"
            >
              <Icon icon="mdi:tag-off" className="text-lg" />
              Remove Offer
            </button>
            <span className="text-sm text-gray-600">
              Showing {filteredProducts.length} product(s) · {selectedIds.size} selected
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-5 overflow-x-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              placeholder="Name / Item code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="">All Categories</option>
              {mainCategories.map((cat) => (
                <option key={cat._id} value={cat._id.toString()}>
                  {cat.category_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
            <select
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="">All Brands</option>
              {brands
                .slice()
                .sort((a, b) => a.brand_name.localeCompare(b.brand_name))
                .map((brand) => (
                  <option key={brand.id || brand._id} value={(brand.id || brand._id)?.toString()}>
                    {brand.brand_name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {isLoading ? (
          <p>Loading products...</p>
        ) : (
          <>
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left text-sm">
                  <th className="p-3 border">
                    <input
                      type="checkbox"
                      checked={allFilteredSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = someFilteredSelected;
                      }}
                      onChange={toggleSelectAllFiltered}
                      title="Select / deselect all filtered products"
                    />
                  </th>
                  <th className="p-3 border">Product</th>
                  <th className="p-3 border">Item Code</th>
                  <th className="p-3 border">Price</th>
                  <th className="p-3 border">Special Price</th>
                  <th className="p-3 border">Offer Price</th>
                  <th className="p-3 border">Preview Offer</th>
                  <th className="p-3 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-4 text-center text-gray-500 border">
                      No products found.
                    </td>
                  </tr>
                ) : (
                  paginatedProducts.map((product) => {
                    const id = product._id.toString();
                    const checked = selectedIds.has(id);
                    const preview =
                      percentage === ""
                        ? "—"
                        : `₹ ${calcOfferPriceFromBase(
                            getOfferBasePrice(product),
                            percentage
                          ).toLocaleString("en-IN")}`;

                    return (
                      <tr
                        key={id}
                        className={`text-sm hover:bg-gray-50 ${checked ? "bg-green-50" : ""}`}
                      >
                        <td className="p-3 border">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleProduct(id)}
                          />
                        </td>
                        <td className="p-3 border max-w-xs truncate" title={product.name}>
                          {product.name}
                          {hasOfferPrice(product) && (
                            <span className="ml-2 text-xs text-purple-700 font-semibold">
                              OFFER
                            </span>
                          )}
                        </td>
                        <td className="p-3 border">{product.item_code || "—"}</td>
                        <td className="p-3 border">
                          ₹ {Number(product.price || 0).toLocaleString("en-IN")}
                        </td>
                        <td className="p-3 border">
                          ₹ {Number(product.special_price || 0).toLocaleString("en-IN")}
                        </td>
                        <td className="p-3 border font-medium text-purple-700">
                          {hasOfferPrice(product)
                            ? `₹ ${Number(product.offer_price).toLocaleString("en-IN")}`
                            : "—"}
                        </td>
                        <td className="p-3 border font-medium text-green-700">{preview}</td>
                        <td className="p-3 border">{product.status || "—"}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>

            {pageCount > 1 && (
              <div className="mt-4 flex justify-center">
                <ReactPaginate
                  previousLabel="← Prev"
                  nextLabel="Next →"
                  breakLabel="..."
                  pageCount={pageCount}
                  marginPagesDisplayed={1}
                  pageRangeDisplayed={3}
                  onPageChange={({ selected }) => setCurrentPage(selected)}
                  forcePage={currentPage}
                  containerClassName="flex gap-2 items-center"
                  pageClassName="px-3 py-1 border rounded"
                  activeClassName="bg-blue-600 text-white"
                  previousClassName="px-3 py-1 border rounded"
                  nextClassName="px-3 py-1 border rounded"
                  disabledClassName="opacity-40"
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
