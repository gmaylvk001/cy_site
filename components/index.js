"use client";
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ToastContainer, toast } from "react-toastify";
import "../styles/slick-custom.css";
import { motion, useAnimation, useInView } from "framer-motion";
//import { ShoppingCartSimple, CaretDown } from "@phosphor-icons/react";
import { X } from "lucide-react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HiArrowRight } from "react-icons/hi";
import { FiChevronLeft, FiChevronRight, FiShoppingCart } from "react-icons/fi";
import {FaBicycle,FaPhoneAlt,FaShieldAlt,FaHeadset,FaCreditCard,FaUserTie,FaScrewdriver,FaStore,FaLayerGroup,FaWrench,FaTags,FaEnvelope,FaPhone,FaUsers,FaGlobe,FaIndustry,FaAward,} from "react-icons/fa";
import { Heart, ShoppingCart } from "lucide-react";
import Addtocart from "@/components/AddToCart";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import RecentlyViewedProducts from "@/components/RecentlyViewedProducts";
import CategoryProducts from "@/components/CategoryProducts";
import { ChevronRight } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { v4 as uuidv4 } from "uuid";
import ProductCard from "@/components/ProductCard";
/* ------------------- UTIL: click outside ------------------- */
function useOutside(ref, cb) {
  useEffect(() => {
    const handler = (e) =>
      ref.current && !ref.current.contains(e.target) && cb();
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [ref, cb]);
}

/* ------------------- Gender Select ------------------- */
function GenderSelect({ value, setValue }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useOutside(ref, () => setOpen(false));

  return (
    <div className="relative w-full" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`w-full px-3 py-5 rounded-md shadow-sm
            flex justify-between items-center text-md font-semibold border
            ${open ? "bg-[#f5f5f5]" : "bg-white"}`}
      >
        {value}
        <span className={`transition ${open ? "rotate-180" : ""}`}>▾</span>
      </button>

      {open && (
        <div
          className="absolute top-[115%] left-0 w-[480px] max-w-[90vw]
            bg-[#f5f5f5] rounded-xl shadow-xl z-50 px-6 py-6"
        >
          <div className="absolute -top-2 left-10 w-4 h-4 bg-[#f5f5f5] rotate-45"></div>

          <div className="flex flex-col sm:flex-row gap-4">
            {[
              { label: "MALE", icon: <i className="fa-solid fa-mars"></i> },
              { label: "FEMALE", icon: <i className="fa-solid fa-venus"></i> },
              {
                label: "UNISEX",
                icon: <i className="fa-solid fa-venus-mars"></i>,
              },
            ].map((g) => (
              <button
                key={g.label}
                onClick={() => {
                  setValue(g.label);
                  setOpen(false);
                }}
                className={`flex-1 py-3 rounded-full font-bold text-sm
                    flex justify-center items-center gap-2
                    ${
                      value === g.label
                        ? "bg-[#a3ca43] text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
              >
                {g.icon} {g.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------- Height Select (FT + CM) ------------------- */
function HeightSelect({ value, setValue }) {
  const [open, setOpen] = useState(false);
  const [unit, setUnit] = useState("FT");
  const ref = useRef(null);
  useOutside(ref, () => setOpen(false));

  const ftToCm = (ft) => Math.round(ft * 30.48);
  const cmToFt = (cm) => +(cm / 30.48).toFixed(1);

  const display =
    typeof value === "number"
      ? unit === "FT"
        ? `${value.toFixed(1)} FT`
        : `${ftToCm(value)} CM`
      : value; // show placeholder string like "Height"

  return (
    <div className="relative w-full" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`w-full px-2 py-5 rounded-md shadow-sm
            flex justify-between items-center text-md font-semibold border
            ${open ? "bg-[#f5f5f5]" : "bg-white"}`}
      >
        {display}
        <span className={`transition ${open ? "rotate-180" : ""}`}>▾</span>
      </button>

      {open && (
        <div
          className="absolute top-[115%] left-[-25] w-[560px] max-w-[95vw]
            bg-[#f5f5f5] rounded-xl shadow-xl z-50 px-6 py-6"
        >
          <div className="absolute -top-2 left-12 w-4 h-4 bg-[#f5f5f5] rotate-45"></div>

          {/* Unit Toggle */}
          <div className="flex mb-6">
            {["FT", "CM"].map((u) => (
              <button
                key={u}
                onClick={() => setUnit(u)}
                className={`px-4 py-2 text-sm font-bold border
                    ${u === "FT" ? "rounded-l-md" : "rounded-r-md"}
                    ${
                      unit === u
                        ? "bg-[#a3ca43] text-white border-[#a3ca43]"
                        : "bg-white text-gray-700"
                    }`}
              >
                {u === "FT" ? "FT/INCH" : "CM"}
              </button>
            ))}
          </div>

          {/* Slider */}
          <div className="relative px-2">
            <input
              type="range"
              min={unit === "FT" ? 2 : 90}
              max={unit === "FT" ? 7 : 210}
              step={unit === "FT" ? 0.1 : 1}
              value={unit === "FT" ? value : ftToCm(value)}
              onChange={(e) =>
                unit === "FT"
                  ? setValue(+e.target.value)
                  : setValue(cmToFt(+e.target.value))
              }
              className="w-full accent-[#a3ca43]"
            />

            {/* Bubble */}
            <div
              className="absolute -top-10 bg-[#a3ca43] text-white
                  text-sm font-bold px-3 py-1 rounded-md"
              style={{
                left:
                  unit === "FT"
                    ? `${((value - 2) / 5) * 100}%`
                    : `${((ftToCm(value) - 90) / 120) * 100}%`,
                transform: "translateX(-50%)",
              }}
            >
              {display}
            </div>

            {/* Scale */}
            <div className="flex justify-between text-xs text-gray-500 mt-2 px-1">
              {unit === "FT"
                ? [2, 3, 4, 5, 6, 7].map((n) => <span key={n}>{n}</span>)
                : [90, 120, 150, 180, 210].map((n) => <span key={n}>{n}</span>)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------- Purpose Select ------------------- */
function PurposeSelect({ value, setValue }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useOutside(ref, () => setOpen(false));

  return (
    <div className="relative w-full" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`w-full px-3 py-5 rounded-md shadow-sm
            flex justify-between items-center text-md font-semibold border
            ${open ? "bg-[#f5f5f5]" : "bg-white"}`}
      >
        {value}
        <span className={`transition ${open ? "rotate-180" : ""}`}>▾</span>
      </button>

      {open && (
        <div
          className="absolute top-[115%] right-0 w-[480px] max-w-[90vw]
            bg-[#f5f5f5] rounded-xl shadow-xl z-50 px-6 py-6"
        >
          <div className="absolute -top-2 right-12 w-4 h-4 bg-[#f5f5f5] rotate-45"></div>

          <div className="flex flex-col sm:flex-row gap-4">
            {["DAILY-COMMUTE", "FITNESS", "SPORT"].map((p) => (
              <button
                key={p}
                onClick={() => {
                  setValue(p);
                  setOpen(false);
                }}
                className={`flex-1 py-3 rounded-full font-bold text-sm
                    ${
                      value === p
                        ? "bg-[#a3ca43] text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
export default function HomeComponent() {
  function slugify(text) {
    return text
      ?.toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-") 
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-");
  }
  const features = [
    {
      icon: <FaBicycle className="w-9 h-9 text-[#a3ca43]" />,
      title: "Bicycle Insurance",
      subtitle: "Toffee Insurance",
    },
    {
      icon: <FaPhoneAlt className="w-7 h-7 text-[#a3ca43]" />,
      title: "11/7 Support",
      subtitle: "Dedicated Support",
    },
    {
      icon: <FaShieldAlt className="w-7 h-7 text-[#a3ca43]" />,
      title: "100% Safety",
      subtitle: "Only secure payments",
    },
    {
      icon: <FaCreditCard className="w-7 h-7 text-[#a3ca43]" />,
      title: "Bajaj Finserv",
      subtitle: "0% EMI",
    },
  ];
  const reels = [
    "https://www.instagram.com/reel/DSHpp73DWm5/",
    "https://www.instagram.com/p/DSJt6wICEaw/?hl=en",
    "https://www.instagram.com/p/DRWJpAfk1wx/?hl=en",
    "https://www.instagram.com/reel/DSHpp73DWm5/",
    "https://www.instagram.com/p/DSJt6wICEaw/?hl=en",
    "https://www.instagram.com/p/DRWJpAfk1wx/?hl=en",
  ];
  const scrollContainerRef = useRef(null);
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);
  const [isBannerLoading, setIsBannerLoading] = useState(true);
  const [navigating, setNavigating] = useState(false);
  const [bannerData, setBannerData] = useState({
    banner: {
      items: [],
    },
  });

  const [gender, setGender] = useState("Gender");
  const [height, setHeight] = useState("Height");
  const [purpose, setPurpose] = useState("Purpose");
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState([]);
  const [isBrandsLoading, setIsBrandsLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [scrollDirection, setScrollDirection] = useState("down");
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [isSectionLoading, setIsSectionLoading] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 350;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };
  useEffect(() => {
   const fetchBannerData = async () => {
      setIsBannerLoading(true);
      try {
        const response = await fetch("/api/topbanner");
        const data = await response.json();
        // console.log("Banner data:", data);
        if (data.success && data.banners?.length > 0) {
          const bannerItems = data.banners
            .filter((banner) => banner.status === "Active") // ✅ only Active
            .map((banner) => ({
              id: banner._id,
              buttonLink: banner.redirect_url || "/shop",
              bgImageUrl: banner.banner_image,
              bannerImageUrl: banner.banner_image,
              redirectUrl: banner.redirect_url,
            }));

          setBannerData({
            banner: { items: bannerItems },
          });
        }
      } catch (error) {
        console.error("Error fetching banner data:", error);
        setBannerData({
          banner: {
            items: [
              {
                id: 1,
                buttonLink: "/shop",
                bgImageUrl: "/images/banner-img1.png",
                bannerImageUrl: "/images/banner-product.png",
              },
            ],
          },
        });
      } finally {
        setIsBannerLoading(false);
      }
    };
    const fetchBrands = async () => {
          setIsBrandsLoading(true);
          try {
              const response = await fetch('/api/brand/get');
              if (!response.ok) {
                  throw new Error('Network response was not ok');
              }
              const data = await response.json();
              console.log(data);
              if (data.success) {
                  setBrands(data.brands || []);
              }
          } catch (error) {
              console.error("Error fetching brands:", error);
              setBrands([]);
          } finally {
              setIsBrandsLoading(false);
          }
    };
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories/get");
        if (!res.ok) throw new Error("Network response not ok");

        const data = await res.json();

        // Ensure it's an array
        const categoriesArray = Array.isArray(data) ? data : [];

        // Filter active categories with images
        const activeCategories = categoriesArray.filter((cat) => {
          const isActive = cat.status === "Active";
          const hasImage = 
            cat.navImage || 
            cat.image || 
            cat.banner || 
            cat.thumbnail || 
            cat.category_image ||
            cat.imageUrl;
          return isActive && hasImage;
        });

        setCategories(activeCategories);
      } catch (error) {
        console.error("Failed to load categories", error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/product/get");
        const data = await res.json();
        setProducts(data.slice(0, 20)); // top 20 new arrivals
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBannerData();
    fetchBrands();
    fetchCategories();
    fetchProducts();
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    setHasMounted(true);
  }, []);
  useEffect(() => {
    if (!hasMounted) return;
    checkAuthStatus();
  }, [hasMounted]);
  const controls = useAnimation();
  const refs = {
    banner: useRef(null),
  };
  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch("/api/auth/check", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setIsLoggedIn(true);
        setUserData(data.user);
      } else {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
    }
  };
  const isInView = {
    banner: useInView(refs.banner, { once: true, amount: 0.1 }),
  };
  useEffect(() => {
    if (isInView.banner) {
      controls.start("visible");
    }
  }, [isInView.banner, controls]);
  const CustomPrevArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className="
         group
         absolute left-0 top-1/2 transform -translate-y-1/2 bg-[#ffffff70] text-white py-1 md:pl-[0.25rem] md:pr-[0.50rem] md:py-2 lg:pl-1 lg:pr-2 lg:py-2 rounded-r-lg shadow-md z-10 hover:bg-[#000000] flex items-center justify-center
       "
    >
      <FiChevronLeft size={20} md={22} className="text-[#000000] group-hover:text-white
        transition-colors" />
    </button>
  );
  const CustomNextArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className="
         group
         absolute right-0 top-1/2 transform -translate-y-1/2 bg-[#ffffff70] py-1 text-white  md:pl-[0.50rem] md:pr-[0.25rem] md:py-2 lg:pl-2 lg:pr-1 lg:py-2 rounded-l-lg shadow-md z-10 hover:bg-[#000000] flex items-center justify-center
       "
    >
      <FiChevronRight size={20} md={22} className="text-[#000000] group-hover:text-white
        transition-colors" />
    </button>
  );
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    responsive: [
      {
        breakpoint: 768, 
        settings: {
          dots: false,
        },
      },
    ],
  };
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };
  const handleProductClick = (product) => {
    if (navigating) return;
    setNavigating(true);
    const stored = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
    const alreadyViewed = stored.find((p) => p._id === product._id);
    const updated = alreadyViewed
      ? stored.filter((p) => p._id !== product._id)
      : stored;
    updated.unshift(product);
    const limited = updated.slice(0, 10);
    localStorage.setItem("recentlyViewed", JSON.stringify(limited));
  };

  const handleCategoryClick = useCallback(
    (category) => (e) => {
      if (navigating) {
        e.preventDefault();
        return;
      }
      setNavigating(true);
      router.push(`/category/${category.category_slug}`);
    },
    [navigating, router],
  );

  useEffect(() => {
    const handleRouteChange = () => setNavigating(false);

    if (!router?.events?.on) return;

    router.events.on("routeChangeComplete", handleRouteChange);
    router.events.on("routeChangeError", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
      router.events.off("routeChangeError", handleRouteChange);
    };
  }, [router]);

  // Get image from possible fields
  const getCategoryImage = (category) => {
    return (
      category.navImage ||
      category.image ||
      "/images/placeholder-category-image.jpg"
    );
  };
  // Get URL for category
  const getCategoryUrl = (category) => {
    return category.category_slug ? `/category/${category.category_slug}`: "#";
  };

   // Map product types to colors if your API doesn't provide typeColor
  const typeColors = {
    MTB: "bg-red-500",
    Road: "bg-indigo-700",
    Hybrid: "bg-green-500",
  };

  // Map brand IDs to names
  const brandMap = useMemo(() => {
    const map = {};
    brands.forEach((b) => {
      map[b.id] = b.brand_name; // use id, not _id
    });
    return map;
  }, [brands]);

  // buynow button
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

      // Add main product to cart
      await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(isLoggedIn && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          productId: product._id,
          quantity: 1, // Home page default quantity
          ...(guestCartId && { guestCartId }),
        }),
      });

      // Redirect to checkout
      window.location.href = "/checkout";
    } catch (err) {
      console.error("Buy Now error", err);
    }
  };

  return (
    <>
      {navigating && (
        <div className="fixed inset-0 z-[9999] flex justify-center items-center bg-black bg-opacity-30">
          <div className="p-4  shadow-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        </div>
      )}
      {isLoading && (
        <div className="preloader fixed inset-0 z-[9999] flex justify-center items-center bg-white">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      )}
      {/* main div start */}
      <div
        className={`relative transition-opacity duration-300 bg-gradient-to-r from-[#2a7b9b] via-[#57c785] to-[#eddd53] ${isLoading ? "opacity-0 h-0 overflow-hidden" : "opacity-100"}`}
        ref={containerRef}
      >
        {/* Banner Section start */}
        <motion.section 
                id="topbanner"
                ref={refs.banner}
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="overflow-hidden pt-0 m-0"
              >
          <div className="relative">
            {isBannerLoading ? (
              <div className="p-6 flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
              </div>
            ) : bannerData.banner.items.length > 0 ? (
              bannerData.banner.items.length > 1 ? (
                <Slider {...settings} className="relative">
                  {bannerData.banner.items.map((banner) => (
                    <motion.div
                      key={banner.id}
                      className="relative w-full aspect-[2000/667] max-h-auto"
                      variants={itemVariants}
                    >
                      <div className="absolute inset-0 overflow-hidden">
                        <Image
                          src={banner.bgImageUrl}
                          alt="Banner"
                          fill
                          quality={100}
                          className="object-fill w-full h-full"
                          style={{ objectPosition: "center 30%" }}
                          priority
                        />
                      </div>
                      {/* Clickable accessible banner - REMOVED HOVER EFFECT */}
                      <div
                        className="absolute inset-0 overflow-hidden cursor-pointer"
                        role="link"
                        tabIndex={0}
                        aria-label={banner?.alt || banner?.redirectUrl || "Banner"}
                        onClick={() => {
                          const href = banner?.redirectUrl;
                          if (!href) return;
                          if (href.startsWith("/")) {
                            router.push(href);
                          } else {
                            window.location.href = href;
                          }
                        }}
                        onKeyDown={(e) => {
                          const href = banner?.redirectUrl;
                          if (!href) return;
                          if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
                            e.preventDefault();
                            if (href.startsWith("/")) {
                              router.push(href);
                            } else {
                              window.location.href = href;
                            }
                          }
                        }}
                      >
                        <Image
                          src={banner.bgImageUrl}
                          alt={banner?.alt || "Banner"}
                          fill
                          quality={100}
                          className="object-fill w-full h-full"
                          style={{ objectPosition: "center 30%" }}
                          priority
                        />
                      </div>
                    </motion.div>
                  ))}
                </Slider>
              ) : (
                <motion.div
                  className="p-4 md:p-6 relative aspect-[2000/667] max-h-auto"
                  variants={itemVariants}
                >
                  <div className="absolute inset-0 flex justify-center items-center bg-white">
                    <Image
                      src={bannerData.banner.items[0].bgImageUrl}
                      alt="Banner"
                      fill
                      className="object-fill w-full h-full"
                      priority
                    />
                  </div>
                </motion.div>
              )
            ) : (
              <div></div>
            )}
          </div>
        </motion.section>
        {/* find perfect bicycle */}
        <section className="py-10">
          <div className=" px-5 max-w-7xl mx-auto space-x-6">
            <div className="grid grid-cols-1  gap-4 items-center">
              <div className="sectitle">
                <h1 className="text-3xl text-center">
                  Find Your Perfect Bicycle
                </h1>
              </div>
              <div className="col-span-2 seccontent">
                <div className="max-w-7xl mx-auto px-4 py-5">
                  {/* Controls */}
                  <div className="flex flex-col sm:flex-row gap-4 items-start justify-end">
                    <GenderSelect value={gender} setValue={setGender} />
                    <HeightSelect value={height} setValue={setHeight} />
                    <PurposeSelect value={purpose} setValue={setPurpose} />
                    <button className="w-auto w-12 bg-[#a3ca43] hover:bg-[#33333] text-white font-bold px-5 py-5 rounded-md shadow-md flex justify-center items-center">
                      GO
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* product card */}
        {!loading && products.length > 0 &&(
          <section className="max-w-7xl mx-auto px-4 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl font-bold">New Arrivals</h2>

            <div className="flex gap-3 top-selling-swiper">
              <button className="swiper-prev w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-[#a3ca43] hover:text-white transition">
                ‹
              </button>
              <button className="swiper-next w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-[#a3ca43] hover:text-white transition">
                ›
              </button>
            </div>
          </div>

          <div className="top-selling-swiper pb-10">
            <div className="swiper-pagination mt-4 text-center" />

            <Swiper
              modules={[Navigation, Autoplay, Pagination]}
              navigation={{
                prevEl: ".top-selling-swiper .swiper-prev",
                nextEl: ".top-selling-swiper .swiper-next",
              }}
              pagination={{
                el: ".top-selling-swiper .swiper-pagination",
                clickable: true,
              }}
              spaceBetween={20}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
                1280: { slidesPerView: 4 },
              }}
              className="customSwiper-product"
            >
              {products.map((product) => (

                <SwiperSlide key={product._id} className="min-h-[450px] flex">
                  <div className="bg-white rounded-xl border shadow-md overflow-hidden flex flex-col h-full w-full relative">

                     {/* Wishlist absolute */}
                    <div className="absolute top-3 left-3 z-20">
                      <ProductCard 
                        productId={product._id} 
                        isOutOfStock={product.quantity === 0} 
                      />
                    </div>

                    {/* Category Badge */}
                   <div className="absolute top-3 right-3 z-30 bg-blue-600 text-white text-xs px-3 py-1 rounded-md">
                      {product.category?.name || "New"}
                    </div>

  
                    {/* Image */}
                    <div className="relative h-56">
                      {product.images?.[0] && (
                        <Link href={`/product/${product.slug}`} passHref>
                          <Image
                            src={
                              product.images[0].startsWith("http")
                                ? product.images[0]
                                : `/uploads/products/${product.images[0]}`
                            }
                            alt={product.name}
                            fill
                            className="object-contain p-4"
                          />
                        </Link>
                      )}
                    </div>

                    {/* Info */}
                    <div className="px-4 py-2 border-t flex-grow">
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

                      <Link href={`/product/${product.slug}`} passHref>
                        <h3 className="text-sm font-medium text-[#333] hover:text-[#a3ca43] line-clamp-2 cursor-pointer">
                          {product.name}{" "}
                          {product.model_number ? `(${product.model_number})` : ""}
                        </h3>
                      </Link>

                      <div className="flex justify-between items-center mt-2 gap-2 flex-wrap">
                        <div className="flex gap-2 items-center">
                          {/* Selling Price / Special Price */}
                          <span className="text-lg font-bold">
                            ₹{" "}
                            {Number(product.special_price) > 0 &&
                            Number(product.special_price) < Number(product.price)
                              ? Number(product.special_price).toLocaleString()
                              : Number(product.price).toLocaleString()}
                          </span>

                          {/* Original Price / MRP */}
                          {Number(product.special_price) > 0 &&
                            Number(product.special_price) < Number(product.price) && (
                              <>
                                <span className="text-sm text-gray-400 line-through">
                                  ₹ {Number(product.price).toLocaleString()}
                                </span>

                                {/* Discount Percentage */}
                                <span className="text-sm text-[#a3ca43] font-semibold">
                                  {Math.round(100 - (Number(product.special_price) / Number(product.price)) * 100)}% OFF
                                </span>
                              </>
                            )}
                        </div>
                      </div>

                    <div className="my-1">
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          product.quantity > 0 && product.stock_status === "In Stock"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {product.quantity > 0 && product.stock_status === "In Stock"
                          ? `In Stock, ${product.quantity} units`
                          : "Out Of Stock"}
                      </span>
                    </div>

                    </div>

                    {/* Actions */}
                    <div className="mt-auto flex text-sm font-semibold border-t">
                      <Link
                        href={`https://wa.me/919865555000?text=${encodeURIComponent(
                          `Check Out This Product: ${
                            typeof window !== "undefined"
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
                        special_price={product.special_price}
                        className="flex-1 whitespace-nowrap text-xs sm:text-sm py-1.5 my-2"
                      />
                    <button
                      onClick={() => handleBuyNow(product)}
                      className={`w-1/2 py-3  font-semibold text-white transition-colors duration-300 ${
                        product.quantity > 0 && product.stock_status === "In Stock"
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
        </section>
        )}
        {/* category section*/}
         {!loading && categories.length > 0 && (
          <section className="bg-[#F5F5F5]">
            <div className="max-w-7xl mx-auto px-4 py-10 text-center">

              {/* Heading */}
              <div className="mb-6">
                <h2 className="text-2xl md:text-3xl font-bold">Shop By Categories</h2>
                <p className="text-gray-600 mt-1">
                  Discover tailored selections for every interest
                </p>
              </div>

              <div className="top-selling-swiper-1 mx-2">
                <Swiper
                  modules={[Navigation, Autoplay, Pagination]}
                   navigation={{
                    prevEl: ".top-selling-swiper-1 .swiper-prev-1",
                    nextEl: ".top-selling-swiper-1 .swiper-next-1",
                  }}
                  pagination={{
                    el: ".top-selling-swiper-1 .swiper-pagination-1",
                    clickable: true,
                  }}
                  spaceBetween={20}
                  slidesPerView={1}
                  breakpoints={{
                    640: { slidesPerView: 2 },
                    768: { slidesPerView: 2 },
                    1024: { slidesPerView: 4 },
                  }}
                >
                  {categories.map((category) => (
                    <SwiperSlide key={category._id}>
                      <Link
                        href={getCategoryUrl(category)}
                        className="block relative h-80 rounded-xl overflow-hidden group cursor-pointer
                                  border-4 border-transparent hover:border-lime-400 transition-colors duration-300"
                      >
                        <Image
                          src={getCategoryImage(category)}
                          alt={category.category_name}
                          fill
                          className="object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black via-black/70 to-transparent" />
                        <div className="absolute bottom-0 left-4 right-4 text-center">
                          <h3 className="text-white text-lg font-semibold mb-2">
                            {category.category_name}
                          </h3>
                          <button className="inline-flex items-center gap-2 bg-lime-400 text-black font-semibold px-2 py-1 rounded-t-md
                                            opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                            Shop Now
                          </button>
                        </div>
                      </Link>
                    </SwiperSlide>
                  ))}
                </Swiper>
                {/* Navigation & Pagination wrapper above slides */}
              <div className="flex justify-between items-center mt-4">
                <div className="swiper-pagination-1" />
              </div>
              </div>
            </div>
          </section>
        )}
        {/* Growth Story */}
        <section className="py-10">
          <div className="max-w-7xl mx-auto px-4 text-center">
            {/* Heading */}
            <h2 className="text-3xl font-bold text-gray-900">
              The Cycle World Growth Story
            </h2>
            <p className="text-gray-600 mt-2">
              From a single store in 2011 to India’s largest multibrand bicycle
              chain
            </p>

            {/* IMAGE + FLOATING STATS */}
            <div className="relative mt-5">
              {/* Banner Image */}
              <img
                src="/images/Franchise.jpg"
                alt="Cycle World Growth"
                className="w-full h-[320px] sm:h-[380px] lg:h-[420px] object-cover rounded-xl"
              />

              {/* Floating Stats Bar */}
              <div
                className="relative mt-6 lg:absolute lg:left-1/2 lg:-bottom-16 lg:-translate-x-1/2 w-full lg:w-[95%] 
                   bg-white rounded-2xl shadow-xl px-6 py-6"
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
                  {/* Item 1 */}
                  <div className="flex flex-col items-center gap-2">
                    <FaStore className="text-[#a3ca43] text-2xl" />
                    <p className="font-semibold text-md">
                      90+ Stores Nationwide
                    </p>
                    <span className="text-xs text-gray-500">
                      India’s largest multibrand bicycle retail franchise
                    </span>
                  </div>

                  {/* Item 2 */}
                  <div className="flex flex-col items-center gap-2">
                    <FaUsers className="text-[#a3ca43] text-2xl" />
                    <p className="font-semibold text-md">
                      1 Lakh+ Customers Served
                    </p>
                    <span className="text-xs text-gray-500">
                      Trusted by cyclists across India since 2011
                    </span>
                  </div>

                  {/* Item 3 */}
                  <div className="flex flex-col items-center gap-2">
                    <FaGlobe className="text-[#a3ca43] text-2xl" />
                    <p className="font-semibold text-md">
                      25+ Global <br /> Brands
                    </p>
                    <span className="text-xs text-gray-500">
                      National distributor for leading international bicycle
                      brands
                    </span>
                  </div>

                  {/* Item 4 */}
                  <div className="flex flex-col items-center gap-2">
                    <FaIndustry className="text-[#a3ca43] text-2xl" />
                    <p className="font-semibold text-md">
                      In-house Manufacturing
                    </p>
                    <span className="text-xs text-gray-500">
                      6,000 bicycles per month manufacturing capacity
                    </span>
                  </div>

                  {/* Item 5 */}
                  <div className="flex flex-col items-center gap-2">
                    <FaBicycle className="text-[#a3ca43] text-2xl" />
                    <p className="font-semibold text-md">
                      GSports & EV Innovation
                    </p>
                    <span className="text-xs text-gray-500">
                      Mid-premium bicycles & electric mobility solutions
                    </span>
                  </div>

                  {/* Item 6 */}
                  <div className="flex flex-col items-center gap-2">
                    <FaAward className="text-[#a3ca43] text-2xl" />
                    <p className="font-semibold text-md">
                      ₹50 Cr <br /> Turnover
                    </p>
                    <span className="text-xs text-gray-500">
                      Awarded “Most Trusted & Fastest Growing Brand”
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Spacer for overlap */}
            <div className="hidden lg:block h-24"></div>
          </div>
        </section>
        {/*insta video section */}
        <section className=" bg-[#f5f5f5]">
          <div className="max-w-7xl mx-auto px-4 py-6 text-center">
            {/* Heading */}
            <h2 className="text-3xl font-bold mb-6">Instagram Stories</h2>
            <p className="text-gray-600 my-5">
              Watch our latest bicycle highlights straight from Instagram.
            </p>
           <div className="insta-swiper pb-[40px] mx-2 relative">
              {/* Navigation & Pagination wrapper above slides */}
              <div className="flex justify-between items-center mb-4">
                <div className="swiper-pagination" />
              </div>

              <Swiper
                modules={[Navigation, Autoplay, Pagination]}
                navigation={{
                  prevEl: ".insta-swiper .swiper-prev",
                  nextEl: ".insta-swiper .swiper-next",
                }}
                pagination={{
                  el: ".insta-swiper .swiper-pagination",
                  clickable: true,
                }}
                spaceBetween={20}
                slidesPerView={1}
                breakpoints={{
                  640: { slidesPerView: 2, spaceBetween: 20 },
                  768: { slidesPerView: 2, spaceBetween: 20 },
                  1024: { slidesPerView: 3, spaceBetween: 20 },
                }}
                preventClicks={false} // allows clicks inside slide
                preventClicksPropagation={false}
                onSwiper={() => window.instgrm?.Embeds.process()} // ensures Instagram renders
              >
                {reels.map((url, i) => (
                  <SwiperSlide key={i}>
                    <div className="px-2">
                      <blockquote
                      className="instagram-media"
                      data-instgrm-permalink={url}
                      data-instgrm-version="14"
                      style={{ maxWidth: 420, margin: "0 auto" }}
                    />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

          </div>
        </section>
        {/* Why Choose Cycle World */}
        <section className="py-10">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900">
              Why Choose Cycle World
            </h2>
            <p className="text-gray-800 mt-2">
              Choose Cycle World for its trusted nationwide presence, quality
              bicycles and e-mobility products, expert service support, and
              excellent value for money.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
              <div className="bg-white rounded-xl shadow-md p-6 flex gap-4">
                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gray-100">
                  <FaStore className="text-[#a3ca43] text-2xl" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">90+ Stores Across India</h3>
                  <p className="text-gray-500 text-sm">
                    Trusted nationwide presence
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 flex gap-4">
                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gray-100">
                  <FaBicycle className="text-[#a3ca43] text-2xl" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">
                    4,000+ Bikes Sold Monthly
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Proven customer confidence
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 flex gap-4">
                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gray-100">
                  <FaLayerGroup className="text-[#a3ca43] text-2xl" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Wide Product Range</h3>
                  <p className="text-gray-500 text-sm">
                    Cycles, e-bikes & electric mopeds
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 flex gap-4">
                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gray-100">
                  <FaShieldAlt className="text-[#a3ca43] text-2xl" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Quality Brands</h3>
                  <p className="text-gray-500 text-sm">
                    Reliable Indian & global partners
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 flex gap-4">
                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gray-100">
                  <FaWrench className="text-[#a3ca43] text-2xl" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Expert Service</h3>
                  <p className="text-gray-500 text-sm">
                    Professional support & genuine parts
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 flex gap-4">
                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gray-100">
                  <FaTags className="text-[#a3ca43] text-2xl" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Best Value</h3>
                  <p className="text-gray-500 text-sm">
                    Competitive pricing & transparent warranty
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Why Shop + Features */}
        <section className="bg-[#f5f5f5] py-10">
          <div className="max-w-7xl mx-auto px-4 text-center">
            {/* Heading */}
            <h2 className="text-3xl font-bold text-gray-900">
              Why Shop CycleWorld
            </h2>
            <p className="text-gray-500 mt-2">
              Your trusted partner in quality and convenience
            </p>

            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-8 mt-12">
              <div className="bg-white rounded-xl shadow-md p-6 text-center">
                <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-gray-100 mb-4">
                  <FaBicycle className="text-[#a3ca43] text-2xl" />
                </div>
                <h3 className="text-lg font-bold">Bicycle Insurance</h3>
                <p className="text-gray-500 text-sm mt-2">
                  Get reliable bicycle insurance with Toffee Insurance.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 text-center">
                <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-gray-100 mb-4">
                  <FaHeadset className="text-[#a3ca43] text-2xl" />
                </div>
                <h3 className="text-lg font-bold">24/7 Dedicated Support</h3>
                <p className="text-gray-500 text-sm mt-2">
                  Dedicated support available anytime you need help.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 text-center">
                <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-gray-100 mb-4">
                  <FaShieldAlt className="text-[#a3ca43] text-2xl" />
                </div>
                <h3 className="text-lg font-bold">Safety & Secure Payments</h3>
                <p className="text-gray-500 text-sm mt-2">
                  Safe, secure, and trusted payment experience.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 text-center">
                <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-gray-100 mb-4">
                  <FaCreditCard className="text-[#a3ca43] text-2xl" />
                </div>
                <h3 className="text-lg font-bold">EMI with Bajaj Finserv</h3>
                <p className="text-gray-500 text-sm mt-2">
                  Easy payments with Bajaj Finserv 0% EMI.
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* shop by brands */}
        {!isBrandsLoading && brands.length > 0 && (
          <section id="brands" className="rounded-xl py-6">
            <div className="max-w-7xl mx-auto px-4">

              {/* Header */}
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold md:text-2xl">
                  Shop by Brands
                </h2>

                {/* Navigation Buttons */}
                <div className="flex gap-2">
                  <button
                    className="brand-prev flex h-9 w-9 items-center justify-center rounded-full border transition hover:bg-gray-100"
                    aria-label="Previous"
                  >
                    <FiChevronLeft size={20} />
                  </button>

                  <button
                    className="brand-next flex h-9 w-9 items-center justify-center rounded-full border transition hover:bg-gray-100"
                    aria-label="Next"
                  >
                    <FiChevronRight size={20} />
                  </button>
                </div>
              </div>

              {/* Swiper */}
              <Swiper
                modules={[Navigation, Autoplay]}
                navigation={{
                  prevEl: ".brand-prev",
                  nextEl: ".brand-next",
                }}
                autoplay={{
                  delay: 2000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                loop
                spaceBetween={24}
                breakpoints={{
                  0: { slidesPerView: 2 },
                  640: { slidesPerView: 3 },
                  1024: { slidesPerView: 5 },
                }}
                className=" !py-5 rounded-xl"
              >
                {brands.map((brand) => (
                  <SwiperSlide key={brand.id}>
                    <Link href={`/brand/${slugify(brand.brand_name)}`}>
                      <div
                        className="group flex cursor-pointer flex-col items-center rounded-lg p-4
                                  my-4 mx-4 border border-gray-300 shadow-md
                                  hover:bg-gray hover:shadow-md hover:border-lime-400
                                  transition-all duration-300"
                      >
                        <div className="w-24 h-14 flex items-center justify-center">
                          <Image
                            src={
                              brand.image
                                ? `/uploads/Brands/${brand.image}`
                                : "/images/no-logo-brand-img.png"
                            }
                            alt={brand.brand_name}
                            width={90}
                            height={90}
                            className="object-contain grayscale transition-transform duration-300
                                      group-hover:grayscale-0 group-hover:scale-110"
                            unoptimized
                          />
                        </div>

                        <p className="mt-2 text-sm font-medium text-gray-700 group-hover:text-black">
                          {brand.brand_name}
                        </p>
                      </div>
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>

            </div>
          </section>
        )}
        {/* Contact Us */}
        <section className="bg-[#f5f5f5] py-10">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900">Contact Us</h2>
            <p className="text-gray-500 mt-2">10am – 7pm weekdays</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
              {/* Sales Enquiry */}
              <div className="relative bg-white rounded-xl shadow-md p-6 flex flex-col justify-between border">
                <div>
                  <h3 className="text-xl font-semibold mb-1">Sales Enquiry</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    (Dial tollfree number then Press 1)
                  </p>

                  <a
                    href="tel:+918152908888"
                    className="flex items-center gap-3 text-black mb-2"
                  >
                    <FaPhone className="text-[#a3ca43]" />
                    <span className="font-medium">+91 81529 08888</span>
                  </a>

                  <a
                    href="mailto:info@cycleworld.in"
                    className="flex items-center gap-3 text-black"
                  >
                    <FaEnvelope className="text-[#a3ca43]" />
                    <span className="font-medium">info@cycleworld.in</span>
                  </a>
                </div>
                <div className="absolute bottom-4 right-4 text-black text-5xl opacity-20">
                  <FaUserTie />
                </div>
              </div>

              {/* Assembly & Service */}
              <div className="relative bg-white rounded-xl shadow-md p-6 flex flex-col justify-between border">
                <div>
                  <h3 className="text-xl font-semibold mb-1">
                    Assembly & Service
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    (Dial tollfree number then Press 2)
                  </p>

                  <a
                    href="tel:+918152908888"
                    className="flex items-center gap-3 text-black mb-2"
                  >
                    <FaPhone className="text-[#a3ca43]" />
                    <span className="font-medium">+91 81529 08888</span>
                  </a>

                  <a
                    href="mailto:info@cycleworld.in"
                    className="flex items-center gap-3 text-black"
                  >
                    <FaEnvelope className="text-[#a3ca43]" />
                    <span className="font-medium">info@cycleworld.in</span>
                  </a>
                </div>
                <div className="absolute bottom-4 right-4 text-black text-5xl opacity-20">
                  <FaScrewdriver />
                </div>
              </div>

              {/* Call Me Now */}
              <div className="relative bg-white rounded-xl shadow-md p-6 flex flex-col justify-between border">
                <div>
                  <h3 className="text-xl font-semibold mb-1">
                    Looking To Buy A Bicycle?
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Our experts will assist you!
                  </p>

                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-2 border rounded-md px-3 py-2 w-full">
                      <FaPhone className="text-[#a3ca43]" />
                      <input
                        type="text"
                        placeholder="Add Your Number"
                        className="w-full outline-none text-sm"
                      />
                    </div>
                  </div>

                  <button className="bg-[#a3ca43] hover:bg-[#a3ca43] transition text-white font-semibold px-6 py-2 rounded-md">
                    CALL ME NOW
                  </button>
                </div>
                <div className="absolute bottom-4 right-4 text-black text-5xl opacity-20">
                  <FaHeadset />
                </div>
              </div>
            </div>

            <p className="text-center text-sm text-gray-500 mt-10">
              For Franchise inquiries, fill details @{" "}
              <span className="text-[#a3ca43] font-medium cursor-pointer">
                franchise@cycleworld.in
              </span>
            </p>
          </div>
        </section>
        <ToastContainer />
        <RecentlyViewedProducts />
      </div>
    </>
  );
}
