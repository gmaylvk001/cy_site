"use client";
import { useState, useEffect, useCallback, useMemo, Fragment } from "react"; // Import 'use' from React
import CategoryComponent from "@/components/category/CategoryComponent";
import { ToastContainer, toast } from "react-toastify";
import ProductCard from "@/components/ProductCard";
import Addtocart from "@/components/AddToCart";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { GrRadialSelected } from "react-icons/gr";
import { v4 as uuidv4 } from "uuid";
import { color } from "framer-motion";

export default function customize_combo() {
  // Unwrap the params promise using React.use()
  const slug = "customize-combo";
  const [custom_combo, setCustom_combo] = useState(true);
  const [finalBycycles, setFinalBycycles] = useState([]);
  const [finalAccessories, setFinalAccessories] = useState([]);
  const [finalBags, setFinalBags] = useState([]);
  const [cycleMd5s, setCycleMd5s] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [allcycle_cat, setAllcycle_cat] = useState([]);
  const [bagProducts, setBagProducts] = useState([]);
  const [accessoriesPOP, setAccessoriesPOP] = useState(false);
  const [bagPOP, setBagPOP] = useState(false);
  const [accessoriesProducts, setAccessoriesProducts] = useState([]);
  const [cycleProducts, setCycleProducts] = useState([]);
  const [bycyclePOP, setBycyclePOP] = useState(false);
  const [all_categries, setAll_categries] = useState([]);
  const [time, setTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Cycles for Women");
  const [all_variants, setAll_variants] = useState([])
  const [openColorProductId, setOpenColorProductId] = useState(null);
  const [categoryData, setCategoryData] = useState({
    category: null,
    brands: [],
    filters: [],
    main_category: null,
  });



  const comboPrice = {
    final: 28081,
    mrp: 35679,
    off: 7598,
  };

  const totalPrice = useMemo(() => {
    const getFinalPrice = (item) => {
      if (item?.selectedVariant?.price != null) {
        return Number(item.selectedVariant.price);
      }
      return Number(item?.special_price || 0);
    };

    const cyclesTotal = (finalBycycles || []).reduce(
      (sum, item) => sum + getFinalPrice(item),
      0
    );

    const accessoriesTotal = (finalAccessories || []).reduce(
      (sum, item) => sum + getFinalPrice(item),
      0
    );

    const bagsTotal = (finalBags || []).reduce(
      (sum, item) => sum + getFinalPrice(item),
      0
    );

    return cyclesTotal + accessoriesTotal + bagsTotal;
  }, [finalBycycles, finalAccessories, finalBags]);

  const discount = useMemo(() => {
    if (totalPrice >= 10000) {
      return totalPrice * 0.1; // 10% discount
    }
    return 0; // no discount below 10000
  }, [totalPrice]);

  useEffect(() => {


    const fetchVariants = async () => {
      try {
        const res = await fetch(`/api/Variants/get_all`);
        const data = await res.json();

        setAll_variants(data.variants || []);
      } catch (err) {
        console.error("Failed to fetch variants:", err);
      }
    };
    fetchVariants();
  }, []);


  // const fetchFilteredProducts = useCallback(
  //   async (categoryData, pageNum = 1, initialLoad = false) => {
  //     try {
  //       if (!initialLoad) setLoading(true);
  //       const query = new URLSearchParams();
  //       const categoryIds =
  //         selectedFilters.categories.length > 0
  //           ? selectedFilters.categories
  //           : categoryData.allCategoryIds;

  //       query.set("sub_category_new", categoryData.main_category.md5_cat_name);

  //       //query.set('categoryIds', categoryIds.join(','));
  //       query.set("page", pageNum);
  //       query.set("limit", itemsPerPage);

  //       if (selectedFilters.brands.length > 0) {
  //         query.set("brands", selectedFilters.brands.join(","));
  //       }
  //       query.set("minPrice", selectedFilters.price.min);
  //       query.set("maxPrice", selectedFilters.price.max);

  //       if (selectedFilters.filters.length > 0) {
  //         query.set("filters", selectedFilters.filters.join(","));
  //       }

  //       const res = await fetch(`/api/product/filter/main-cat?${query}`);
  //       const { products, pagination: paginationData } = await res.json();

  //       setProducts(products);

  //       // Update pagination state
  //       setPagination({
  //         currentPage: paginationData.currentPage,
  //         totalPages: paginationData.totalPages,
  //         hasNext: paginationData.hasNext,
  //         hasPrev: paginationData.hasPrev,
  //         totalProducts: paginationData.totalProducts,
  //       });

  //       if (products.length === 0 && pageNum === 1) {
  //         setNofound(true);
  //       } else {
  //         setNofound(false);
  //       }
  //     } catch (error) {
  //       toast.error("Error fetching products" + error);
  //       // Redirect to 404 on error
  //       router.push("/noproduct");
  //     } finally {
  //       if (!initialLoad) setLoading(false);
  //     }
  //   },
  //   [selectedFilters]
  // );
  const fetchInitialData = async () => {
    // try {
    setLoading(true);

    const categoryRes = await fetch(`/api/categories/${slug}`);
    const categoryData = await categoryRes.json();
    setCategoryData({
      ...categoryData,
      categoryTree: categoryData.category,
      allCategoryIds: categoryData.allCategoryIds,
      banners: categoryData.main_category?.banners || [],
    });

    //   if (categoryData.products?.length > 0) {
    //     const prices = categoryData.products.map(
    //       (p) => p.special_price || p.price
    //     );

    //     let minPrice = Math.min(...prices);
    //     let maxPrice = Math.max(...prices);

    //     if (minPrice === maxPrice) {
    //       minPrice = Math.max(1, minPrice - 100);
    //       maxPrice = maxPrice + 100;
    //     }

    //     setPriceRange([minPrice, maxPrice]);
    //     setSelectedFilters((prev) => ({
    //       ...prev,
    //       price: { min: minPrice, max: maxPrice },
    //     }));
    //   }

    //   if (categoryData.filters?.length > 0) {
    //     const groups = {};

    //     categoryData.filters.forEach((filter) => {
    //       const groupId = filter.filter_group_id || filter.filter_group_name;

    //       if (!groups[groupId]) {
    //         groups[groupId] = {
    //           _id: groupId,
    //           name: filter.filter_group_name,
    //           filters: [],
    //         };
    //       }

    //       groups[groupId].filters.push({
    //         _id: filter._id,
    //         filter_name: filter.filter_name,
    //         count: filter.count || 0,
    //       });
    //     });

    //     setFilterGroups(groups);

    //     const expanded = {};
    //     Object.keys(groups).forEach((id) => (expanded[id] = true));
    //     setExpandedFilters(expanded);
    //   }

    //   await fetchFilteredProducts(categoryData, 1, true);
    // } catch (error) {
    //   console.error(error);
    //   toast.error("Error fetching initial data");
    //   router.push("/noproduct");
    // } finally {
    setLoading(false);
    //   setInitialLoadComplete(true);
    // }
  };
  const allcategries = async () => {
    const res = await fetch("/api/categories/get");
    const normalizeres = await res.json();
    setAll_categries(normalizeres);

    setAllcycle_cat(
      normalizeres.filter((cat) =>
        cat.category_name.toLowerCase().includes("cycle"),
      ),
    );
  };

  const allProducts = async () => {
    const raw = await fetch("/api/product/get");
    const res = await raw.json();
    const cycleMd5s = allcycle_cat.map((cat) =>
      cat.md5_cat_name.trim().toLowerCase(),
    );

    setCycleProducts(
      res.filter((product) => {
        if (!product.sub_category_new) return false;

        const productMd5s = product.sub_category_new
          .split(/##|\|\|/)
          .map((v) => v.trim().toLowerCase())
          .filter(Boolean);
        return cycleMd5s.some((md5) => productMd5s.includes(md5));
      }),
      // res
    );

    const bag = all_categries.filter((cat) =>
      cat.category_name.toLowerCase().includes("bag"),
    );

    if (bag.length > 0) {
      const bagmd5 = bag.map((bag) => bag.md5_cat_name);
      setBagProducts(
        res.filter((product) => {
          if (!product.sub_category_new) return false;
          const temp = product.sub_category_new.split(/##|\|\|/);
          return bagmd5.some((md5) => temp.includes(md5));
        }),
      );
    }

    const accessories = all_categries.filter((cat) =>
      cat.category_name.toLowerCase().includes("accessories"),
    );

    if (accessories.length > 0) {
      const accessoriesmd5 = accessories.map(
        (accessories) => accessories.md5_cat_name,
      );
      setAccessoriesProducts(
        res.filter((product) => {
          if (!product.sub_category_new) return false;
          const temp = product.sub_category_new.split(/##|\|\|/);
          return accessoriesmd5.some((md5) => temp.includes(md5));
        }),
      );
    }
  };
  const filter = (products = [], selected = null) => {
    if (!selected || !all_categries.length) {
      setFilteredProducts([]);
      return;
    }

    if (!selected.md5) {
      setFilteredProducts([]);
      return;
    }

    const selectedMd5 = selected.md5.toLowerCase();

    setFilteredProducts(
      products.filter((product) => {
        if (!product.sub_category_new) return false;

        const md5s = product.sub_category_new
          .split(/##|\|\|/)
          .map((v) => v.trim().toLowerCase())
          .filter(Boolean);

        return md5s.includes(selectedMd5);
      }),
    );
  };

  const handlecyclePOP = (open = false) => {
    open ? setBycyclePOP(true) : setBycyclePOP(false);
    if (open) {
      setFilteredProducts(cycleProducts);
      if (finalBycycles.length > 0) {
        setSelectedProducts(finalBycycles);
      }
    }
    if (!open) setSelectedProducts([]);
  };

  const handleAccessoriesPOP = (open) => {
    open ? setAccessoriesPOP(true) : setAccessoriesPOP(false);
    if (open) {
      setFilteredProducts(accessoriesProducts);
      if (finalAccessories.length > 0) {
        setSelectedProducts(finalAccessories);
      }
    }
    if (!open) setSelectedProducts([]);
  };
  const handleBagPOP = (open) => {
    open ? setBagPOP(true) : setBagPOP(false);
    if (open) {
      setFilteredProducts(bagProducts);
      if (finalBags.length > 0) {
        setSelectedProducts(finalBags);
      }
    }
    if (!open) setSelectedProducts([]);
  };

  const fetchCombo = async () => {
    try {
      const token = localStorage.getItem("token");
      const guestId = localStorage.getItem("guestCartId") || uuidv4();

      const res = await fetch(
        token
          ? "/api/custom_combo/get"
          : `/api/custom_combo/get?guestId=${guestId}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      // console.log('res', res);
      const data = await res.json();
      if (data.message == 'Invalid token') {
        localStorage.removeItem('token')
        let guestId = localStorage.getItem("guestCartId") || uuidv4();
        localStorage.setItem("guestCartId", guestId);
      }
      if (data.success && data.products) {
        // 🔹 Normalize data for frontend usage
        const normalize = (items = []) =>
          items.map((item) => ({
            ...item.productId,              // actual product
            selectedVariant: item.selectedVariant || {},
            selectedColor: item.selectedVariant?.color || null,
          }));

        const cycles = normalize(data.products.cycles);
        const accessories = normalize(data.products.accessories);
        const bags = normalize(data.products.bags);

        setFinalBycycles(cycles);
        setFinalAccessories(accessories);
        setFinalBags(bags);

        if (cycles.length || accessories.length || bags.length) {
          setCustom_combo(true);
        }
      } else {
        // No combo → reset
        setFinalBycycles([]);
        setFinalAccessories([]);
        setFinalBags([]);
        setCustom_combo(false);
      }
    } catch (err) {
      console.error("Failed to fetch combo", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCombo();
  }, []);

  useEffect(() => {
    if (allcycle_cat.length > 0 && all_categries.length > 0) {
      allProducts();
    }
  }, [allcycle_cat, all_categries]);

  useEffect(() => {
    setTime(Date.now());
    fetchInitialData();
    allcategries();
  }, []);
  const handleBuyCombo = () => {
    alert("Buying Combo!");
  };

  const handleproductSelect = (product = null, variant = null, variant_info = {}) => {
    if (!product?._id) return;
    // console.log(product, 'product', variant, 'variant', variant_info, 'variant info');
    const alreadySelected = selectedProducts.some((p) => p._id === product._id);

    // ❌ Block adding more than 3 (only when adding)
    if (!alreadySelected && selectedProducts.length >= 3 && bycyclePOP) {
      toast.error("You can select only 3 bicycles");
      return;
    }

    setSelectedProducts((prev) => {
      const exists = prev.some((p) => p._id === product._id);

      // remove
      if (exists) {
        return prev.filter((p) => p._id !== product._id);
      }
      const newProduct = {
        ...product,
        selectedColor: variant?.color || null,
        selectedVariant: variant_info || {},
      };
      // add
      return [...prev, newProduct];
    });
  };

  const finaladd = async () => {
    let token = localStorage.getItem("token");
    let guestId = null;

    if (!token) {
      guestId = localStorage.getItem("guestCartId") || uuidv4();
      localStorage.setItem("guestCartId", guestId);
    }

    if (bycyclePOP) {
      if (selectedProducts.length === 0)
        return toast.error("please select Bycycles");
      const items = selectedProducts;
      setFinalBycycles(selectedProducts);
      setSelectedProducts([]);
      setBycyclePOP(false);
      await fetch("/api/custom_combo/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          items,
          type: "bycycle",
          guestId,
        }),
      });
    }
    if (accessoriesPOP) {
      if (selectedProducts.length === 0)
        return toast.error("please select Bycycles");
      const items = selectedProducts;
      setFinalAccessories(selectedProducts);
      setSelectedProducts([]);
      setAccessoriesPOP(false);

      await fetch("/api/custom_combo/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          items,
          type: "accessories",
          guestId,
        }),
      });
    }
    if (bagPOP) {
      if (selectedProducts.length === 0)
        return toast.error("please select Bycycles");
      let items = selectedProducts;
      setFinalBags(selectedProducts);
      setSelectedProducts([]);
      setBagPOP(false);

      await fetch("/api/custom_combo/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          items,
          type: "bags",
          guestId,
        }),
      });
    }
    fetchCombo();
  };

  const handledelete = async (item, type) => {
    let token = localStorage.getItem("token");
    let guestId = null;

    if (!token) {
      guestId = localStorage.getItem("guestCartId") || uuidv4();
      localStorage.setItem("guestCartId", guestId);
    }

    try {
      const res = await fetch("/api/custom_combo/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          item,
          type,
          guestId,
        }),
      });

      const data = await res.json(); // ✅ REQUIRED

      if (data?.success === 1) {
        fetchCombo(); // ✅ sync frontend with backend
      } else {
        console.error("Delete failed", data);
      }
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  const handle_search = async (e) => {
    if (bycyclePOP) {
      const search_filter = cycleProducts.filter((product) => {
        return (
          product.name.toLowerCase().includes(e.toLowerCase()) ||
          product.search_keywords.toLowerCase().includes(e.toLowerCase()) ||
          product.item_code.toLowerCase().includes(e.toLowerCase())
        );
      });
      search_filter.length > 0
        ? setFilteredProducts(search_filter)
        : setFilteredProducts(cycleProducts);
    }
    if (accessoriesPOP) {
      const search_filter = accessoriesProducts.filter((product) => {
        return (
          product.name.toLowerCase().includes(e.toLowerCase()) ||
          product.search_keywords.toLowerCase().includes(e.toLowerCase()) ||
          product.item_code.toLowerCase().includes(e.toLowerCase())
        );
      });
      search_filter.length > 0
        ? setFilteredProducts(search_filter)
        : setFilteredProducts(accessoriesProducts);
    }
    if (bagPOP) {
      const search_filter = bagProducts.filter((product) => {
        return (
          product.name.toLowerCase().includes(e.toLowerCase()) ||
          product.search_keywords.toLowerCase().includes(e.toLowerCase()) ||
          product.item_code.toLowerCase().includes(e.toLowerCase())
        );
      });
      search_filter.length > 0
        ? setFilteredProducts(search_filter)
        : setFilteredProducts(bagProducts);
    }
  };
  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border-4 border-[#a3ca43] border-t-transparent animate-spin"></div>
          <p className="text-[#a3ca43] text-sm sm:text-base font-medium">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <section className="relative w-full h-fit overflow-hidden">
        {/* Background Image */}
        <div className="h-fit w-full">
          {categoryData.main_category?.image && (
            <Image
              src={categoryData.main_category.image}
              alt="Category background"
              fill
              priority
              quality={100}
              className="object-cover"
            />
          )}
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 z-10"></div>

        {/* Content */}
        <div className="relative z-20 container mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between h-full">
          {/* Text */}
          <div className="text-white max-w-lg mb-6 md:mb-0">
            <h1 className="text-xl font-bold mb-4">
              Top-Selling Combo at Great Prices!
            </h1>
            <p className="text-lg">
              Elevate your ride with a world-class bicycle, premium accessories,
              and a versatile backpack. Don't miss out on the best deal for the
              ultimate cycling experience!
            </p>
          </div>

          {/* Button */}
          {/* <button
            className="bg-[#a3ca43] hover:bg-lime-500 text-white font-semibold uppercase px-6 py-3 rounded shadow transition-colors"
            onClick={() => setCustom_combo((custom) => !custom)}
          >
            {!custom_combo ? "Create your own Combo" : "Close Custom Combo"}
          </button> */}
        </div>
      </section>

      {true && (
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Left Side: Steps and Items */}
              <div className="lg:col-span-3">
                <div className="bg-white shadow rounded-lg p-4">
                  {/* Step Header */}
                  {/* <ul className="grid grid-cols-3 text-center mb-6">
                    <li className="flex flex-col items-center">
                      <div className="scSprit bike mb-2 w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        🚲
                      </div>
                      Bicycle
                    </li>
                    <li className="flex flex-col items-center">
                      <div className="scSprit acc mb-2 w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        🛠️
                      </div>
                      Accessories
                    </li>
                    <li className="flex flex-col items-center">
                      <div className="scSprit bags mb-2 w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        🎒
                      </div>
                      Bags
                    </li>
                  </ul> */}

                  {/* Step Items */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Bicycle */}
                    <div className="space-y-4">
                      <div className="flex flex-col items-center mb-6 mt-3">
                        <div className="scSprit bike mb-2 w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                          🚲
                        </div>
                        Bicycle
                      </div>
                      {/* Selected Bicycles */}

                      {finalBycycles.map((cycle, ind) => {
                        // console.log(cycle, 'dycle')
                        return (
                          <div
                            key={ind}
                            className="relative bg-white rounded-lg shadow p-4 h-[384px]"
                          >
                            {/* ❌ Close Button */}
                            <button
                              onClick={() => {
                                // setFinalBycycles((prev) => {
                                //   return prev.filter(
                                //     (pre) => pre._id !== cycle._id,
                                //   );
                                // });
                                // handledelete(cycle, "bycycle");

                                handledelete(cycle, "bycycle");

                              }}
                              className="absolute top-1 right-3 text-gray-500 hover:text-black text-xl"
                            >
                              ✕
                            </button>

                            {/* Image */}
                            {(cycle.selectedVariant?.images?.[0] || cycle.images?.[0]) && (
                              <div className="relative w-full h-48 mb-4">
                                <Image
                                  src={(() => {
                                    const img =
                                      cycle.selectedVariant?.images?.[0] || cycle.images?.[0];

                                    return img.startsWith("http")
                                      ? img
                                      : `/uploads/products/${img}`;
                                  })()}
                                  alt={cycle.name}
                                  fill
                                  className="object-contain mt-3"
                                  unoptimized
                                />
                              </div>
                            )}


                            {/* Product Name */}
                            <h3
                              className="text-lg font-bold uppercase mb-3 hover:text-[#A3CA43]"
                              onClick={() =>
                                router.push(`/product/${cycle.slug}`)
                              }
                            >
                              {cycle.name}
                            </h3>

                            {/* Features */}

                            {/* Price Section */}

                            {(() => {
                              const hasVariantPrice = cycle.selectedVariant?.price != null;
                              const finalPrice = hasVariantPrice
                                ? cycle.selectedVariant.price
                                : cycle.special_price;
                              const mrp = cycle.price;

                              return mrp > finalPrice ? (
                                <div className="space-y-1">
                                  <div className="text-xl font-bold">
                                    ₹{finalPrice}
                                  </div>

                                  <div className="text-sm text-gray-500">
                                    MRP :
                                    <span className="line-through ml-1">
                                      ₹{mrp}
                                    </span>
                                    <span className="text-green-600 font-semibold ml-2">
                                      ₹{mrp - finalPrice} OFF
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                <div className="text-xl font-bold">
                                  ₹{finalPrice}
                                </div>
                              );
                            })()}

                          </div>
                        )
                      }

                      )}

                      {/* ➕ Add Bicycle (Always LAST) */}
                      <div
                        className="bg-gray-50 rounded-lg shadow p-4 flex flex-col items-center cursor-pointer hover:bg-gray-100 transition"
                        onClick={() => handlecyclePOP(true)}
                      >
                        <div className="mb-2 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl font-bold">
                          +
                        </div>
                        <div>Add Bicycle</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Accessories */}
                      <div className="flex flex-col items-center mb-6 mt-3">
                        <div className="scSprit acc mb-2 w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                          🛠️
                        </div>
                        Accessories
                      </div>
                      {finalAccessories.map((acce) => (
                        <div
                          key={acce._id}
                          className="relative bg-white rounded-lg shadow p-4 h-[384px]"
                        >
                          {/* ❌ Close Button */}
                          <button
                            onClick={() => {
                              setFinalAccessories((prev) => {
                                return prev.filter(
                                  (pre) => pre._id !== acce._id,
                                );
                              });
                              handledelete(acce, "accessories");
                            }}
                            className="absolute top-1 right-3 text-gray-500 hover:text-black text-xl"
                          >
                            ✕
                          </button>

                          {/* Image */}
                          {acce.images?.[0] && (
                            <div className="relative w-full h-48 mb-4">
                              <Image
                                src={
                                  acce.images[0].startsWith("http")
                                    ? acce.images[0]
                                    : `/uploads/products/${acce.images[0]}`
                                }
                                alt={acce.name}
                                fill
                                className="object-contain mt-3"
                                unoptimized
                              />
                            </div>
                          )}

                          {/* Product Name */}
                          <h3
                            className="text-lg font-bold uppercase mb-3 hover:text-[#A3CA43]"
                            onClick={() => router.push(`/product/${acce.slug}`)}
                          >
                            {acce.name}
                          </h3>

                          {/* Features */}

                          {/* Price Section */}
                          {acce.price > acce.special_price ? (
                            <div className="space-y-1">
                              <div className="text-xl font-bold">
                                ₹{acce.special_price}
                              </div>

                              <div className="text-sm text-gray-500">
                                MRP :
                                <span className="line-through ml-1">
                                  ₹{acce.price}
                                </span>
                                <span className="text-green-600 font-semibold ml-2">
                                  {acce.price - acce.special_price}₹ OFF
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="text-xl font-bold">
                              ₹{acce.special_price}
                            </div>
                          )}
                        </div>
                      ))}
                      <div
                        className="bg-gray-50 rounded-lg shadow p-4 flex flex-col items-center cursor-pointer hover:bg-gray-100 transition"
                        onClick={() => handleAccessoriesPOP((open = true))}
                      >
                        <div className="plusIcon circle mb-2 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl font-bold">
                          +
                        </div>
                        <div>Add Accessories</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex flex-col items-center mb-6 mt-3">
                        <div className="scSprit bags mb-2 w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                          🎒
                        </div>
                        Bags
                      </div>
                      {/* Bags */}
                      {finalBags.map((bag) => (
                        <div
                          key={bag._id}
                          className="relative bg-white rounded-lg shadow p-4 h-[384px]"
                        >
                          {/* ❌ Close Button */}
                          <button
                            onClick={() => {
                              setFinalBags((prev) => {
                                return prev.filter(
                                  (pre) => pre._id !== bag._id,
                                );
                              });
                              handledelete(bag, "bags");
                            }}
                            className="absolute top-1 right-3 text-gray-500 hover:text-black text-xl"
                          >
                            ✕
                          </button>

                          {/* Image */}
                          {bag.images?.[0] && (
                            <div className="relative w-full h-48 mb-4 ">
                              <Image
                                src={
                                  bag.images[0].startsWith("http")
                                    ? bag.images[0]
                                    : `/uploads/products/${bag.images[0]}`
                                }
                                alt={bag.name}
                                fill
                                className="object-contain mt-3"
                                unoptimized
                              />
                            </div>
                          )}

                          {/* Product Name */}
                          <h3
                            className="text-lg font-bold uppercase mb-3 cursor-pointer hover:text-[#A3CA43]"
                            onClick={() => router.push(`/product/${bag.slug}`)}
                          >
                            {bag.name}
                          </h3>

                          {/* Features */}

                          {/* Price Section */}
                          {bag.price > bag.special_price ? (
                            <div className="space-y-1">
                              <div className="text-xl font-bold">
                                ₹{bag.special_price}
                              </div>

                              <div className="text-sm text-gray-500">
                                MRP :
                                <span className="line-through ml-1">
                                  ₹{bag.price}
                                </span>
                                <span className="text-green-600 font-semibold ml-2">
                                  {bag.price - bag.special_price}₹ OFF
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="text-xl font-bold">
                              ₹{bag.special_price}
                            </div>
                          )}
                        </div>
                      ))}
                      <div
                        className="bg-gray-50 rounded-lg shadow p-4 flex flex-col items-center cursor-pointer hover:bg-gray-100 transition"
                        onClick={() => handleBagPOP((open = true))}
                      >
                        <div className="mb-2 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl font-bold">
                          +
                        </div>
                        <div>Add Bags</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white shadow rounded-lg p-4">
                  <div className="font-bold text-lg mb-4">Custom Combo</div>
                  <hr className="my-3" />

                  {finalBycycles.map((item, ind) => (
                    <div key={ind} className="flex items-start gap-3 py-2">
                      {/* Icon */}
                      <GrRadialSelected
                        className="mt-1 shrink-0"
                        color="green"
                      />

                      {/* Text */}
                      <div className="flex flex-col">
                        <h4 className="font-semibold text-sm leading-tight">
                          {item.name}
                        </h4>
                        <span className="text-green-600 font-semibold text-sm">
                          ₹{item.selectedVariant.price || item.special_price}/-
                        </span>
                      </div>
                    </div>
                  ))}

                  {finalAccessories.map((item) => (
                    <div key={item._id} className="flex items-start gap-3 py-2">
                      <GrRadialSelected
                        className="mt-1 shrink-0"
                        color="green"
                      />

                      <div className="flex flex-col">
                        <h4 className="font-semibold text-sm leading-tight">
                          {item.name}
                        </h4>
                        <span className="text-green-600 font-semibold text-sm">
                          ₹{item.selectedVariant.price || item.special_price}/-
                        </span>
                      </div>
                    </div>
                  ))}

                  {finalBags.map((item) => (
                    <div key={item._id} className="flex items-start gap-3 py-2">
                      <GrRadialSelected
                        className="mt-1 shrink-0"
                        color="green"
                      />

                      <div className="flex flex-col">
                        <h4 className="font-semibold text-sm leading-tight">
                          {item.name}
                        </h4>
                        <span className="text-green-600 font-semibold text-sm">
                          ₹{item.selectedVariant.price || item.special_price}/-
                        </span>
                      </div>
                    </div>
                  ))}
                  {totalPrice > 0 && (
                    <div>
                      <h4>Total price</h4>

                      {/* If discount exists, show original price struck through */}
                      {discount > 0 ? (
                        <div className="flex flex-col gap-1">
                          <span className="line-through text-gray-500">
                            ₹{totalPrice}/-
                          </span>
                          <span className="text-xl font-bold text-[#a3ca43]">
                            ₹{totalPrice - discount}/-
                          </span>
                        </div>
                      ) : (
                        <h3 className="text-xl font-bold text-black">
                          ₹{totalPrice}/-
                        </h3>
                      )}

                      <button
                        className="w-full h-[60px] bg-yellow-400 text-black text-center mt-2"
                        onClick={() => router.push("/custom_combo_checkout")}
                      >
                        Buy now
                      </button>
                    </div>
                  )}

                  <hr className="my-3" />

                  {/* Benefits List */}
                  <ul className="grid grid-cols-2 sm:grid-cols-1 gap-4">
                    <li className="flex flex-col items-center text-center">
                      <img
                        src="https://d60i6mpkbdpwe.cloudfront.net/assets/ninetyone/images/icon/free-shipping.svg"
                        alt="Free Shipping"
                        className="w-9 h-9 mb-1"
                      />
                      <div className="text-sm">
                        Free
                        <br />
                        Shipping
                      </div>
                    </li>

                    <li className="flex flex-col items-center text-center">
                      <img
                        src="https://d60i6mpkbdpwe.cloudfront.net/assets/ninetyone/images/icon/gst-benefit.svg"
                        alt="GST Billing"
                        className="w-10 h-7 mb-1"
                      />
                      <div className="text-sm">
                        GST
                        <br />
                        Billing
                      </div>
                    </li>

                    <li className="flex flex-col items-center text-center">
                      <img
                        src="https://d60i6mpkbdpwe.cloudfront.net/assets/ninetyone/images/icon/original_v.svg"
                        alt="100% Genuine Parts"
                        className="w-16 h-14 mb-1"
                      />
                      <div className="text-sm">
                        100% Genuine
                        <br />
                        Parts
                      </div>
                    </li>

                    <li className="flex flex-col items-center text-center">
                      <img
                        src="https://d60i6mpkbdpwe.cloudfront.net/assets/ninetyone/images/icon/flag.svg"
                        alt="Made in India"
                        className="w-6 h-5 mb-1"
                      />
                      <div className="text-sm">
                        Made
                        <br />
                        In India
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {(bycyclePOP || accessoriesPOP || bagPOP) && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center rounded-md">
          <div className="bg-white w-[95%] max-w-6xl h-[90vh] rounded-xl shadow-xl flex flex-col relative ">
            {/* ❌ Close */}
            <button
              onClick={() => {
                handlecyclePOP();
                handleAccessoriesPOP();
                handleBagPOP();
              }}
              className="absolute top-[-1.25rem] right-[1.25rem] text-xl font-bold z-50 h-[35px] w-[35px] rounded-full bg-white"
            >
              ✕
            </button>

            {/* ================= HEADER ================= */}
            <div className="sticky top-0 bg-white z-20 border-b px-6 py-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <h3 className="text-lg font-semibold">
                  {(bycyclePOP && "Select Bicycles") ||
                    (accessoriesPOP && "Select Accessories") ||
                    (bagPOP && "Select Bags")}
                </h3>

                {/* Search */}
                <div className="relative">
                  <input
                    type="search"
                    placeholder="Search bicycles..."
                    onChange={(e) => handle_search(e.target.value)}
                    className="w-full rounded-lg border px-10 py-2 text-sm focus:ring-2 focus:ring-black"
                  />
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-4.35-4.35m1.85-5.65a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"
                    />
                  </svg>
                </div>

                {/* Category */}
                {bycyclePOP && (
                  <div className="relative">
                    <select
                      value={selectedCategory?.md5 || ""}
                      onChange={(e) => {
                        const category = allcycle_cat.find(
                          (c) => c.md5_cat_name === e.target.value,
                        );

                        const selected = {
                          name: category.category_name,
                          md5: category.md5_cat_name,
                        };

                        setSelectedCategory(selected);

                        // ✅ use the fresh value
                        filter(cycleProducts, selected);
                      }}
                      className="w-full appearance-none rounded-lg border px-4 py-2 pr-10 text-sm"
                    >
                      {/* <option value="">Select category</option> */}

                      {allcycle_cat.map((c) => (
                        <option key={c._id} value={c.md5_cat_name}>
                          {c.category_name}
                        </option>
                      ))}
                    </select>

                    <svg
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* ================= PRODUCT GRID ================= */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {filteredProducts.map((product) => {
                  const isSelected = selectedProducts.some(
                    (p) => p._id === product._id,
                  );
                  let selected_pro = selectedProducts.find((p) => p?._id === product?._id)
                  // console.log(selected_pro, 'testing')
                  // console.log(all_variants, 'test all variants')
                  const filterVariant = all_variants?.find(
                    vari => vari.parent_id === product._id
                  );
                  let filterVariant_info;
                  let colors = [];
                  let sizes = [];
                  if (filterVariant) {
                    filterVariant.variants.forEach((vari) => {
                      vari.variant_arr.forEach((v) => {
                        if (v.variant_attribute_name == 'color') {
                          if (v.options == selected_pro?.selectedColor) {
                            filterVariant_info = vari
                          }
                          colors.push(v.options)
                        }
                        else if (v.variant_attribute_name == 'size') {
                          sizes.push(v.options);
                        }
                      })
                    });
                  }
                  return (
                    <div
                      key={product._id}
                      className={`relative rounded-lg overflow-hidden shadow-sm hover:shadow-md
                                  ${isSelected
                          ? "border-2 border-blue-500"
                          : "border border-gray-200"
                        }
                                `}
                    >
                      {/* Product image */}
                      <div
                        onClick={() => {
                          // console.log('testing', colors.length)
                          handleproductSelect(product)

                          // if (colors.length === 0) {
                          //   handleproductSelect(product)
                          // }
                          // else {
                          //   if(selectedProducts.find((p)=>p?._id === product?._id)?.selectedColor){
                          //      handleproductSelect(product)
                          //   }
                          //   else{
                          //     setOpenColorProductId(product._id);
                          //   }
                          // }
                        }
                        }
                      // className={`relative cursor-pointer ${
                      //   isSelected ? "blur-sm opacity-40" : ""
                      // }`}
                      >
                        <div className="relative w-full aspect-square bg-white">
                          {product.images?.[0] && (
                            <Image
                              src={
                                filterVariant_info?.images?.[0] ? `/uploads/products/${filterVariant_info.images[0]}` :
                                  product.images[0].startsWith("http") ? product.images[0] : `/uploads/products/${product.images[0]}`
                              }
                              alt={product.name}
                              fill
                              className="object-contain p-2 md:p-4"
                              sizes="(max-width: 640px) 50vw, 33vw, 25vw"
                              unoptimized
                            />
                          )}
                        </div>
                      </div>

                      {/* Color picker */}
                      {/* {openColorProductId === product._id && (colors.length > 0) && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
                          <div
                            // onChange={(e) =>
                            //   setProductColor(product._id, e.target.value)
                            // }
                            className="inline-block"
                          >

                            {colors?.map((color, index) => {
                              const [c1, c2] = color.split("/");

                              return (
                                <span
                                  key={index}
                                  className="w-6 h-6 inline-block rounded-full border border-gray-300 shadow-sm m-2 cursor-pointer mb-0"
                                  style={{
                                    background: `linear-gradient(135deg, ${c1} 50%, ${c2} 50%)`,
                                  }}
                                  onClick={() => {
                                    handleproductSelect(product, { color: color })
                                    setOpenColorProductId(null);
                                  }}
                                ></span>
                              );
                            })}

                          </div>
                        </div>
                      )} */}

                      {/* Info */}
                      <div className="p-3 border-t relative">
                        <h4 className="text-sm font-semibold line-clamp-2">
                          {product.name}
                        </h4>
                        <p className="text-sm font-bold mt-1">
                          ₹{filterVariant_info?.special_price || product.special_price.toLocaleString()}
                        </p>
                        <div className="absolute top-1/2 right-2 -translate-y-1/2 flex gap-2">

                          {colors.map((color, key) => {
                            const [c1, c2 = c1] = color.split('/');
                            let info;
                            if (filterVariant) {
                              filterVariant.variants.forEach((vari) => {
                                vari.variant_arr.forEach((v) => {
                                  if (v.variant_attribute_name == 'color') {
                                    if (v.options == color) {
                                      info = vari
                                    }
                                  }
                                })
                              });
                            }
                            const variantInfo = {
                              color: color,             // selected color
                              frame: null, // optional
                              size: null,   // optional
                              price: info.special_price || product.special_price,        // optional
                              images: info.images || [],        // optional
                            };
                            return (
                              <span
                                key={key}
                                className={`
                                    w-4 h-4 rounded-full cursor-pointer mb-1
                                    border border-gray-300
                                    ${selected_pro?.selectedColor === color
                                    ? "ring-2 ring-blue-500 ring-offset-2"
                                    : ""}
                                  `}
                                style={{
                                  background: `linear-gradient(135deg, ${c1} 50%, ${c2} 50%)`,
                                }}
                                onClick={() => {
                                  // if()
                                  // console.log(selected_pro?.selectedColor, 'tstinpadf')
                                  handleproductSelect(product, { color }, variantInfo);
                                }}
                              />

                            )
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ================= FOOTER ================= */}
            <div className="sticky bottom-0 bg-white border-t px-6 py-3 flex items-center justify-between rounded-lg">
              <span className="text-sm">
                <b>{selectedProducts.length}</b>{" "}
                {(bycyclePOP && "bicycles Selected") ||
                  (accessoriesPOP && "Accessories Selected ") ||
                  (bagPOP && "Bags Selected")}
              </span>

              <button
                // onClick={handleAddBicycles}
                className="bg-[#a3ca43] hover:bg-lime-500 text-white px-6 py-2 rounded-lg font-semibold"
                onClick={() => {
                  finaladd();
                }}
              >
                {(bycyclePOP && "Add Bycycle") ||
                  (accessoriesPOP && "Add Accessories ") ||
                  (bagPOP && "Add Bags")}
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}
