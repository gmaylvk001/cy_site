"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Addtocart from "@/components/AddToCart";
import ProductCard from "@/components/ProductCard";
import { FiChevronLeft, FiChevronRight, FiRefreshCw } from "react-icons/fi";
import { v4 as uuidv4 } from "uuid";

import { getSellingPrice, getDiscountPercent, shouldShowStrikeThrough } from "@/lib/pricing";
/* ------------------- useOutside Hook ------------------- */
function useOutside(ref, cb) {
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) cb();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [ref, cb]);
}

/* ------------------- Dropdown Components ------------------- */
function GenderSelect({ value, setValue, options }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  useOutside(dropdownRef, () => setOpen(false));

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-3 py-3 rounded-md shadow-sm flex justify-between items-center text-md font-semibold border border-gray-300 bg-white"
      >
        {value ? options.find((o) => o.id === value)?.name : "All Genders"} <span className={`transition ${open ? "rotate-180" : ""}`}>▾</span>
      </button>
      {open && (
        <div className="absolute top-[115%] left-0 w-[200px]
        lg:w-[250px] md:w-[210px] max-w-[90vw] bg-white rounded-xl shadow-xl z-10 px-4 py-2 flex flex-col items-center">
          <div className="absolute -top-2 left-10 w-4 h-4 bg-white rotate-45"></div>
          {/* Up arrow */}
          <button
            onClick={() => {
              const scrollDiv = document.getElementById("dropdown-scroll");
              scrollDiv.scrollBy({ top: -40, behavior: "smooth" });
            }}
            className="text-lime-500 mb-1"
          >
          </button>

          {/* Scrollable options with hidden scrollbar */}
          <div
            id="dropdown-scroll"
            className="flex flex-col gap-2 w-full max-h-60 overflow-y-auto scrollbar-none"
            style={{
              scrollbarWidth: 'none', // Firefox
            }}
          >
            {options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => {
                  setValue(opt.id);
                  setOpen(false);
                }}
                className={`flex-1 py-2 rounded-full font-bold text-sm ${value === opt.id ? "bg-[#a3ca43] text-white" : "bg-gray-200 text-gray-700"}`}
              >
                {opt.name}
              </button>
            ))}
            <button
              onClick={() => {
                setValue(null);
                setOpen(false);
              }}
              className="flex-1 py-2 rounded-full font-bold text-sm bg-gray-300 text-gray-700 mt-2"
            >
              All Gender
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function PriceSelect({ value, setValue, min = 0, max = 50000 }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useOutside(ref, () => setOpen(false));

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full px-3 py-3 border rounded-md shadow-sm flex justify-between items-center font-semibold border-gray-300 bg-white"
      >
        {value ? `₹${value.toLocaleString()}` : `Budget`} <span className={`transition-transform ${open ? "rotate-180" : ""}`}>▾</span>
      </button>
      {open && (
        <div className="absolute z-40 top-full left-0 w-[360px] bg-white rounded-lg shadow-lg mt-2 p-5">
          <div className="absolute -top-2 left-10 w-4 h-4 bg-white rotate-45"></div>
          <input
            type="range"
            min={min}
            max={max}
            step={1000}
            value={value || max}
            onChange={(e) => setValue(Number(e.target.value))}
            className="w-full accent-[#a3ca43]"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1 px-1 select-none">
            {[0, 10000, 20000, 30000, 40000, 50000].map((n) => (
              <span key={n}>₹{n / 1000}k</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function BrandSelect({ value, setValue, options }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  useOutside(dropdownRef, () => setOpen(false));

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-3 py-3 rounded-md shadow-sm flex justify-between items-center text-md font-semibold border border-gray-300 bg-white"
      >
        {value ? options.find((o) => o.id === value)?.brand_name : "All Brands"} <span className={`transition ${open ? "rotate-180" : ""}`}>▾</span>
      </button>
      {open && (
        <div className="absolute top-[115%] left-0 w-[200px]
        lg:w-[250px] md:w-[210px] max-w-[90vw] bg-white rounded-xl shadow-xl z-10 px-4 py-2 flex flex-col items-center">
          <div className="absolute -top-2 left-10 w-4 h-4 bg-white rotate-45"></div>
          {/* Up arrow */}
          <button
            onClick={() => {
              const scrollDiv = document.getElementById("dropdown-scroll");
              scrollDiv.scrollBy({ top: -40, behavior: "smooth" });
            }}
            className="text-lime-500 mb-1"
          >
          </button>

          {/* Scrollable options with hidden scrollbar */}
          <div
            id="dropdown-scroll"
            className="flex flex-col gap-2 w-full max-h-60 overflow-y-auto scrollbar-none"
            style={{
              scrollbarWidth: 'none', // Firefox
            }}
          >
            {options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => {
                  setValue(opt.id);
                  setOpen(false);
                }}
                className={`flex-1 py-2 rounded-full font-bold text-sm ${value === opt.id ? "bg-[#a3ca43] text-white" : "bg-gray-200 text-gray-700"
                  }`}
              >
                {opt.brand_name}
              </button>
            ))}
            <button
              onClick={() => {
                setValue(null);
                setOpen(false);
              }}
              className="flex-1 py-2 rounded-full font-bold text-sm bg-gray-300 text-gray-700 mt-2"
            >
              All Brands
            </button>
          </div>

          {/* Down arrow */}
          <button
            onClick={() => {
              const scrollDiv = document.getElementById("dropdown-scroll");
              scrollDiv.scrollBy({ top: 40, behavior: "smooth" });
            }}
            className="text-lime-500 mt-1"
          >
          </button>
        </div>
      )}
    </div>
  );
}

/* ------------------- Main Component ------------------- */
export default function BicycleFilterSection() {
  const [filters, setFilters] = useState({ gender: [] });
  const [selectedFilters, setSelectedFilters] = useState({
    gender: null,
    price: null,
    brand: null,
  });
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Loading states
  const [isFiltersLoading, setIsFiltersLoading] = useState(true);
  const [isProductsLoading, setIsProductsLoading] = useState(true);

  const brandMap = useMemo(() => {
    const map = {};
    brands.forEach((b) => {
      map[b.id] = b.brand_name;
    });
    return map;
  }, [brands]);

  /* ------------------- Fetch Filters, Brands, and Products ------------------- */
  const [variants, setVariants] = useState([]);

  useEffect(() => {
    const loadVariants = async () => {
      try {
        const res = await fetch("/api/Variants/get_all");
        const data = await res.json();
        // console.log("Variants Data:", data);
        setVariants(data.variants || []);
      } catch (err) {
        console.log("Fetch error:", err);
      }
    };

    loadVariants();
  }, []);
  const getColorPairs = (temp) => {
    const pairSet = new Set();

    temp?.variants?.forEach((variant) => {
      const colorObj = variant?.variant_arr?.find(
        (v) => v.variant_attribute_name === "color"
      );

      if (!colorObj?.options) return;

      const colors = colorObj.options
        .split("/")
        .map((c) => c.trim().toLowerCase())
        .filter(Boolean);

      // must have at least 2 colors
      if (colors.length >= 2) {
        pairSet.add(`${colors[0]}/${colors[1]}`);
      }
    });

    return [...pairSet];
  };

  useEffect(() => {
    async function fetchFiltersAndBrands() {
      setIsFiltersLoading(true);
      try {
        const [filterRes, brandRes] = await Promise.all([
          fetch("/api/filter_dynamic"),
          fetch("/api/brand/get")
        ]);
        const filterData = await filterRes.json();
        const brandData = await brandRes.json();

        const cleanGenders = (filterData.gender || []).filter(g => g.name?.trim() !== "");
        setFilters({ ...filterData, gender: cleanGenders });

        if (brandData.success) {
          const cleanBrands = (brandData.brands || []).filter(b => b.brand_name?.trim() !== "");
          setBrands(cleanBrands);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsFiltersLoading(false);
      }
    }

    async function fetchInitialProducts() {
      setIsProductsLoading(true);
      try {
        const res = await fetch(`/api/productfind?minPrice=0&maxPrice=50000&limit=25`);
        if (!res.ok) throw new Error("Failed to fetch products");
        let data = await res.json();
        data = shuffleArray(data);

        setProducts(data.slice(0, 20));
      } catch (err) {
        console.error(err);
        setProducts([]);
      } finally {
        setIsProductsLoading(false);
      }
    }

    fetchFiltersAndBrands();
    fetchInitialProducts();
  }, []);
  function shuffleArray(arr) {
    const shuffled = [...arr]; // ✅ keep original array safe (pure)
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /* ------------------- Filtered Products ------------------- */
  const handleGo = async () => {
    setHasSearched(true);
    setIsProductsLoading(true);

    const query = new URLSearchParams();
    if (selectedFilters.gender) query.append("gender", selectedFilters.gender);
    if (selectedFilters.type) query.append("type", selectedFilters.type);
    if (selectedFilters.price) query.append("maxPrice", selectedFilters.price);
    if (selectedFilters.brand) query.append("brand", selectedFilters.brand);

    try {
      const res = await fetch(`/api/productfind?${query}`);
      if (!res.ok) {
        setProducts([]);
        alert("No products found for selected filters");
        return;
      }
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
      setProducts([]);
      alert("Failed to fetch products");
    } finally {
      setIsProductsLoading(false);
    }
  };

  const handleRefreshFilters = () => {
    setSelectedFilters({ gender: null, type: null, price: null, brand: null });
    setHasSearched(false);
    setIsProductsLoading(true);
    fetch("/api/productfind")
      .then((res) => res.json())
      .then(async (data) => {
        let res = shuffleArray(data);
        setProducts(res)
      })
      .catch((err) => console.error(err))
      .finally(() => setIsProductsLoading(false));
  };

  const handleBuyNow = async (product) => {
    try {
      const token = localStorage.getItem("token");
      let isLoggedIn = false;
      let guestCartId = null;

      if (token) {
        const res = await fetch("/api/auth/check", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        isLoggedIn = data.loggedIn;
      }

      if (!isLoggedIn) {
        guestCartId = localStorage.getItem("guestCartId") || uuidv4();
        localStorage.setItem("guestCartId", guestCartId);
      }

      await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(isLoggedIn && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          productId: product._id,
          quantity: 1,
          ...(guestCartId && { guestCartId }),
        }),
      });

      window.location.href = "/cart";
    } catch (err) {
      console.error("Buy Now error", err);
    }
  };

  /* ------------------- Loader Component ------------------- */
  const Loader = () => (
    <div className="preloader flex justify-center items-center h-[300px]">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
    </div>

  );

  /* ------------------- Render ------------------- */
  return (
    <section className="px-5 max-w-7xl mx-auto py-10">
      <h1 className="text-3xl text-center mb-2">Find Your Perfect Bicycle</h1>


      <div className="flex flex-col sm:flex-row gap-4 items-start justify-center mb-4">
        <GenderSelect value={selectedFilters.gender} setValue={(v) => setSelectedFilters((p) => ({ ...p, gender: v }))} options={filters.gender} />
        <BrandSelect value={selectedFilters.brand} setValue={(v) => setSelectedFilters((p) => ({ ...p, brand: v }))} options={brands} />
        <PriceSelect className="min-w-[120px]" value={selectedFilters.price} setValue={(v) => setSelectedFilters((p) => ({ ...p, price: v }))} />
        <div className="relative w-full flex items-center md:justify-start justify-center">
          <button onClick={handleGo} className="flex items-center justify-center bg-[#a3ca43] hover:bg-green-700 text-white font-bold px-6 py-3 rounded-md shadow-md mr-3">
            Find
          </button>
          <button onClick={handleRefreshFilters} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold px-6 py-3 rounded-md shadow-md">
            <FiRefreshCw size={20} />
          </button>
        </div>
      </div>


      {isProductsLoading ? <Loader /> : products.length > 0 ? (
        <div className="relative top-selling-swipers">
          <div className="top-selling-swipers">
            <button className="swiper-prev absolute top-1/2 -translate-y-1/2 left-0 z-20 p-2 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-[#a3ca43] hover:text-white transition border-2 border-lime-500">
              <FiChevronLeft size={20} md={22} />
            </button>
            <button className="swiper-next absolute top-1/2 -translate-y-1/2 right-0 z-20 p-2 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-[#a3ca43] hover:text-white transition border-2 border-lime-500">
              <FiChevronRight size={20} md={22} />
            </button>
          </div>
          <Swiper
            modules={[Navigation, Autoplay]}
            navigation={{
              prevEl: ".top-selling-swipers .swiper-prev",
              nextEl: ".top-selling-swipers .swiper-next",
            }}
            spaceBetween={20}
            slidesPerView={1}
            slidesPerGroup={1}
            breakpoints={{
              640: {
                slidesPerView: 1,
                slidesPerGroup: 1,
              },
              768: {
                slidesPerView: 3,
                slidesPerGroup: 3,
              },
              1024: {
                slidesPerView: 3,
                slidesPerGroup: 3,
              },
              1280:
              {
                slidesPerView: 4,
                slidesPerGroup: 4,
              }
            }}
          >
            {products.map((product) => (

              <SwiperSlide key={product._id} className="min-h-[420px] flex">
                <div className="bg-white rounded-xl border shadow-md overflow-hidden flex flex-col h-full w-full relative">
                  <div className="absolute top-3 left-3 z-20">
                    <ProductCard productId={product._id} isOutOfStock={product.quantity === 0} />
                  </div>
                  {/* <div className="absolute top-3 right-3 z-30 bg-blue-600 text-white text-xs px-3 py-1 rounded-md">{product.category?.name || "New"}</div> */}

                  <div className="relative h-56">
                    {product.images?.[0] && (
                      <Link href={`/product/${product.slug}`}>
                        
                        <img
                           src={product.images[0].startsWith("http") ? product.images[0] : `/uploads/products/${product.images[0]}`}
                          alt={product.name}
                          fill
                          className="object-contain p-4"
                          loading="lazy"
                          fetchPriority="auto"
                        />
                        
                      </Link>
                    )}
                  </div>

                  <div className="px-4 py-2 border-t flex-grow relative">
                    {/* Right side color circles */}
                    <div className="absolute top-[28px] right-0 flex flex-col  bg-slate-200  rounded-tl-xl rounded-bl-xl h-fit">
                      {variants
                        .find((vari) => vari.parent_id === product._id) &&
                        getColorPairs(
                          variants.find((vari) => vari.parent_id === product._id)
                        ).map((pair, i) => {
                          const [c1, c2] = pair.split("/");

                          return (

                            <Link
                              key={i}
                              href={{
                                pathname: `/product/${product.slug}`,
                                query: { color: `${c1}-${c2}` },
                              }}
                              className="inline-block"
                            >
                              <span
                                className="w-4 h-4 inline-block rounded-full border border-gray-300 shadow-sm m-2 cursor-pointer mb-0"
                                style={{
                                  background: `linear-gradient(135deg, ${c1} 50%, ${c2} 50%)`,
                                }}
                              ></span>
                            </Link>



                          );
                        })}
                    </div>



                    <div>
                      <h4 className="text-xs text-gray-500 mb-2 uppercase">
                        {brandMap[product.brand] ? (
                          <Link
                            href={`/brand/${brandMap[product.brand]
                              .toLowerCase()
                              .replace(/\s+/g, "-")}`}
                            className="hover:text-blue-600 cursor-pointer"
                          >
                            {brandMap[product.brand]}
                          </Link>
                        ) : (
                          "Unknown Brand"
                        )}
                      </h4>

                      <Link href={`/product/${product.slug}`}>
                        <h3 className="text-sm font-medium text-[#333] hover:text-[#a3ca43] line-clamp-2 cursor-pointer">
                          {product.name}
                        </h3>
                      </Link>

                      <div className="flex justify-between items-center mt-2 gap-2 flex-wrap">
                        <div className="flex gap-2 items-center">
                          <span className="text-lg font-bold">
                            ₹{" "}
                            {getSellingPrice(product).toLocaleString()}
                          </span>

                          {shouldShowStrikeThrough(product) && (
                              <>
                                <span className="text-sm text-gray-400 line-through">
                                  ₹ {Number(product.price).toLocaleString()}
                                </span>

                                <span className="text-sm text-[#a3ca43] font-semibold">
                                  {Math.round(
                                    getDiscountPercent(product)
                                  )}
                                  % OFF
                                </span>
                              </>
                            )}
                        </div>
                      </div>

                      <div className="my-1">
                        <span
                          className={`text-xs font-semibold px-3 py-1 rounded-full ${product.quantity > 0
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                            }`}
                        >
                          {product.quantity > 0
                            ? `In Stock, ${product.quantity} units`
                            : "Out Of Stock"}
                        </span>
                      </div>
                    </div>
                  </div>


                  <div className="mt-auto flex text-sm font-semibold border-t">
                    <Link
                      href={`https://wa.me/9191919191?text=${encodeURIComponent(
                        `Check Out This Product: ${typeof window !== "undefined"
                          ? window.location.origin
                          : ""
                        }/product/${product.slug}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white  text-[#a3ca43] p-1 transition-colors duration-300 flex items-center justify-center px-2 border-r"
                    >
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 32 32"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M16.003 2.667C8.64 2.667 2.667 8.64 2.667 16c0 2.773.736 5.368 2.009 7.629L2 30l6.565-2.643A13.254 13.254 0 0016.003 29.333C23.36 29.333 29.333 23.36 29.333 16c0-7.36-5.973-13.333-13.33-13.333zm7.608 18.565c-.32.894-1.87 1.749-2.574 1.865-.657.104-1.479.148-2.385-.148-.55-.175-1.256-.412-2.162-.812-3.8-1.648-6.294-5.77-6.49-6.04-.192-.269-1.55-2.066-1.55-3.943 0-1.878.982-2.801 1.33-3.168.346-.364.75-.456 1.001-.456.25 0 .5.002.719.013.231.01.539-.088.845.643.32.768 1.085 2.669 1.18 2.863.096.192.16.423.03.683-.134.26-.2.423-.39.65-.192.231-.413.512-.589.689-.192.192-.391.401-.173.788.222.392.986 1.625 2.116 2.636 1.454 1.298 2.682 1.7 3.075 1.894.393.192.618.173.845-.096.23-.27.975-1.136 1.237-1.527.262-.392.524-.32.894-.192.375.13 2.35 1.107 2.75 1.308.393.205.656.308.75.48.096.173.096 1.003-.224 1.897z" />
                      </svg>
                    </Link>
                    <Addtocart
                      productId={product._id}
                      stockQuantity={product.quantity}
                      special_price={getSellingPrice(product)} offer_price={product.offer_price} price={product.price}
                      className="flex-1 whitespace-nowrap text-xs sm:text-sm py-1.5 my-2"
                    />
                    <button
                      onClick={() => handleBuyNow(product)}
                      className={`w-1/2 py-3  font-semibold text-white transition-colors duration-300 ${product.quantity > 0 && product.stock_status === "In Stock"
                        ? "bg-[#a3ca43] hover:bg-lime-500 cursor-pointer"
                        : "bg-gray-300 hover:bg-gray-300 cursor-not-allowed"
                        }`}
                      disabled={!(product.quantity > 0 && product.stock_status === "In Stock")}
                    >
                      BUY NOW
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ) : hasSearched ? (
        <div className="flex flex-col items-center justify-center text-center mt-10 p-6 bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">No Matching Products Found</h2>
          <p className="text-gray-500 mb-4">We couldn’t find any bicycles matching your selected filters. Try adjusting your criteria.</p>
          <button onClick={handleRefreshFilters} className="flex items-center gap-2 bg-[#a3ca43] hover:bg-lime-600 text-white font-semibold px-5 py-2 rounded-md transition">
            <FiRefreshCw /> Refresh Filters
          </button>
        </div>
      ) : null}
    </section>
  );
}
