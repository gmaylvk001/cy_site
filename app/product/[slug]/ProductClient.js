'use client';


import ProductDetailsSection from "@/components/ProductDetailsSection";
// import RelatedProducts from "@/components/RelatedProducts";
import { useEffect, useState, useRef, useCallback } from "react";
import { ShieldHalf } from 'lucide-react';
import { Icon } from '@iconify/react';
import { useParams, usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { FaStore } from "react-icons/fa";
import { FaShield } from "react-icons/fa6";
import { FaShoppingCart, FaHeart, FaShareAlt, FaRupeeSign, FaCartPlus, FaBell } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { TbTruckDelivery } from "react-icons/tb";
import { IoFastFoodOutline, IoReload, IoCardOutline, IoShieldCheckmark, IoStorefront } from "react-icons/io5";
import Link from "next/link";
import { useCart } from '@/context/CartContext';
import { useModal } from '@/context/ModalContext';
import ProductCard from "@/components/ProductCard";
import ProductAddtoCart from "@/components/ProductAddtoCart"
import Addtocart from "@/components/AddToCart";
import ProductBreadcrumb from "@/components/ProductBreadcrumb";
import RecentlyViewedProducts from '@/components/RecentlyViewedProducts';
import RelatedProducts from "@/components/RelatedProducts";
import RazorpayOffers from "@/components/RazorpayOffers";
import { v4 as uuidv4 } from "uuid";
import { useSearchParams } from "next/navigation";
// import Variant from "@/models/Variant";
// import { size } from "pdfkit/js/page";
export default function ProductClient() {

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const color = searchParams.get("color");
  let colorParam = null;
  const router = useRouter();
  const { slug } = useParams();
  const [relatedProductsLoading, setRelatedProductsLoading] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [brand, setBrand] = useState([]);
  const [selectedRelatedProducts, setSelectedRelatedProducts] = useState([]);
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);
  const [showHighlights, setShowHighlights] = useState(false);
  const [product, setProduct] = useState(null);
  const [copyproduct, setCopyproduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showEMIModal, setShowEMIModal] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [selectedWarrantyAmount, setSelectedWarrantyAmount] = useState(0);
  const [showNoWarrantyModal, setShowNoWarrantyModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [variantData, setVariantData] = useState(null);
  const [colorOptions, setColorOptions] = useState([]);
  const [sizeOptions, setSizeOptions] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const handleDecrease = () => {
    setQuantity(Math.max(1, quantity - 1));
    setQuantityWarning(false); // clear warning when decreasing
  };
  const handleIncrease = () => {
    if (quantity < product.quantity) {
      setQuantity(quantity + 1);
      setQuantityWarning(false); // clear warning if under limit
    } else {
      setQuantityWarning(true); // show warning if exceeding
    }
  };




  // // Function to fetch category products
  //   useEffect(() => {
  //     const fetchCategoryProducts = async () => {
  //       try {
  //         const res = await fetch(`/api/product/category/${categoryId}?limit=5`);
  //         const data = await res.json();
  //         if (data.success) {
  //           setCategoryProducts(data.products);
  //         }
  //       } catch (error) {
  //         console.error("Error fetching category products:", error);
  //       }
  //     };

  //     if (categoryId) fetchCategoryProducts();
  //   }, [categoryId]);



  const { updateCartCount } = useCart();
  const { openAuthModal } = useModal();
  const handleBuyNow = async () => {
    console.log("Buying now with warranty:", selectedWarranty, selectedExtendedWarranty);
    try {
      const token = localStorage.getItem("token");

      let isLoggedIn = false;
      let userData = null;

      /*
  
      // ✅ Check authentication
      const response = await fetch("/api/auth/check", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
  
      const data = await response.json();
      if (!data.loggedIn) {
        openAuthModal({
          error: "Please log in to continue.",
          onSuccess: () => handleBuyNow(), // retry on success
        });
        return;
      }
        */

      if (token) {
        const response = await fetch("/api/auth/check", {
          method: "GET",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        isLoggedIn = data.loggedIn;
        userData = data.user;

        //updateHeaderdetails({ user: data.user });
        //setIsLoggedIn(true);
        //const role = data.role;
        //if(role == 'admin'){
        //setIsAdmin(true);
        //}
      }

      // ✅ If not logged in → use guestCartId
      let guestCartId = null;
      if (!isLoggedIn) {
        guestCartId = localStorage.getItem("guestCartId") || uuidv4();
        localStorage.setItem("guestCartId", guestCartId);
      }

      // ✅ Add main product

      /*
      const cartResponse = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: product._id,
          quantity,
          selectedWarranty: selectedWarranty,
          selectedExtendedWarranty: selectedExtendedWarranty,
        }),
      });
  
      */

      // ✅ Add main product to cart
      const cartResponse = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(isLoggedIn && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          productId: product._id,
          quantity,
          selectedWarranty: selectedWarranty,
          selectedExtendedWarranty: selectedExtendedWarranty,
          variant: {
            color: selectedColor || "",
            size: selectedSize || '',
          },
          ...(guestCartId && { guestCartId }), // ✅ include only if guest
        }),
      });

      if (!cartResponse.ok) {
        throw new Error("Failed to add main product to cart");
      }

      // ✅ Add frequent & related products
      const additionalProducts = [
        ...selectedFrequentProducts.map((p) => p._id),
        ...selectedRelatedProducts.map((p) => p._id),
      ];

      /*
      if (additionalProducts.length > 0) {
        await Promise.all(
          additionalProducts.map(async (id) => {
            const res = await fetch("/api/cart", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ productId: id, quantity: 1 }),
            });
            if (!res.ok) throw new Error("Failed to add extra product");
          })
        );
      } */


      // ✅ Add additional products (if any)
      if (additionalProducts.length > 0) {
        await Promise.all(
          additionalProducts.map(async (id) => {
            const res = await fetch("/api/cart", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                ...(isLoggedIn && { Authorization: `Bearer ${token}` }),
              },
              body: JSON.stringify({
                productId: id,
                quantity: 1,
                ...(guestCartId && { guestCartId }),
              }),
            });
            if (!res.ok) throw new Error("Failed to add additional product");
          })
        );
      }

      const cartData = await cartResponse.json();
      updateCartCount(cartData.cart.totalItems + additionalProducts.length);

      // ✅ Build Buy Now items
      const items = [
        {
          ...product,
          quantity,
          variant: {
            color: selectedColor,
            size: selectedSize
          },
          warranty: selectedWarranty || 0,             // ✅ add warranty
          extendedWarranty: selectedExtendedWarranty || 0, // ✅ add extended warranty
        },
        ...selectedFrequentProducts.map((p) => ({ ...p, quantity: 1 })),
        ...selectedRelatedProducts.map((p) => ({ ...p, quantity: 1 })),
      ];


      const total = items.reduce((sum, item) => {
        const basePrice =
          (item.special_price && item.special_price > 0
            ? item.special_price
            : item.price) * item.quantity;

        const warrantyCost = (item.warranty || 0) * item.quantity;
        const extendedCost = (item.extendedWarranty || 0) * item.quantity;

        return sum + basePrice + warrantyCost + extendedCost;
      }, 0);


      // ✅ Save Buy Now state in localStorage
      /*
      localStorage.setItem(
        "buyNowData",
        JSON.stringify({
          cart: { items },
          total,
        })
      );
      */

      // ✅ Redirect
      window.location.href = "/checkout";
    } catch (err) {
      console.error("Buy Now error:", err);
    }
  };




  const warranties = product?.extend_warranty || [];



  // In your ProductPage component, add these state variables near the top:
  const [selectedFrequentProducts, setSelectedFrequentProducts] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [selectedWarranty, setSelectedWarranty] = useState(null);
  const [selectedExtendedWarranty, setSelectedExtendedWarranty] = useState(null);
  const [mainImage, SetMainImage] = useState(null)
  const [quantityWarning, setQuantityWarning] = useState(false);

  // Add this function to handle frequent product selection
  const toggleFrequentProduct = (product) => {
    setSelectedFrequentProducts(prev => {
      const existingIndex = prev.findIndex(p => p._id === product._id);
      if (existingIndex >= 0) {
        return prev.filter(p => p._id !== product._id);
      } else {
        return [...prev, product];
      }
    });
  };

  // Fetch related products
  // // Fetch related products
  // const fetchRelatedProducts = async () => {
  //   try {
  //     setLoading(true);
  //     const res = await fetch(`/api/product/related?productId=${product._id}`);
  //     const data = await res.json();

  //     if (!res.ok) {
  //       throw new Error(`API error: ${res.status} ${res.statusText}`);
  //     }

  //     if (res.ok && data.success) {
  //       setRelatedProducts(data.products || []);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching related products:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   if (product?._id) {
  //     fetchRelatedProducts(product._id);
  //   }
  // }, [product]);




  const categoryId = product?.category;
  const currentProductId = product?._id;
  const brandId = product?.brand;
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const res = await fetch(
          `/api/product/relatedpro?category=${categoryId}&brand=${brandId}&exclude=${currentProductId}&limit=5`
        );
        const data = await res.json();
        console.log("current related products is:", data);

        if (res.ok) {
          if (data.success && data.products) {
            setRelatedProducts(data.products);
          } else if (data.relatedProducts) {
            setRelatedProducts(data.relatedProducts);
          } else {
            setRelatedProducts([]);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    if (categoryId && brandId) fetchRelatedProducts();
  }, [categoryId, brandId, currentProductId]);


  const toggleRelatedProduct = (product) => {
    setSelectedRelatedProducts(prev => {
      const existingIndex = prev.findIndex(p => p._id === product._id);
      if (existingIndex >= 0) {
        return prev.filter(p => p._id !== product._id);
      } else {
        return [...prev, product];
      }
    });
  };

  //  Add this useEffect to calculate the cart total whenever selected products change
  // Calculate cart total
  useEffect(() => {
    let total = product ? (product.special_price || product.price) * quantity : 0;

    selectedFrequentProducts.forEach(item => {
      total += (item.special_price || item.price);
    });

    // NEW: Add selected related products to total
    selectedRelatedProducts.forEach(item => {
      total += (item.special_price || item.price);
    });

    if (selectedWarranty) total += selectedWarranty;
    if (selectedExtendedWarranty) total += selectedExtendedWarranty;

    setCartTotal(total);
  }, [selectedFrequentProducts, selectedRelatedProducts, product, quantity, selectedWarranty, selectedExtendedWarranty]);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      if (!product?.featured_products?.length) return;

      const res = await fetch('/api/product/featured', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: product.featured_products }),
      });

      const data = await res.json();
      setFeaturedProducts(data);
    };


    fetchFeaturedProducts();
  }, [product]);

  useEffect(() => {
    const savedIds = JSON.parse(localStorage.getItem("selectedFrequentProductIds") || "[]");
    if (savedIds.length && featuredProducts.length > 0) {
      const matchedProducts = featuredProducts.filter(p => savedIds.includes(p._id));
      setSelectedFrequentProducts(matchedProducts);
    }
  }, [featuredProducts]);
  // derived main image
  // const mainImage = product?.images?.[selectedImageIndex] || "/no-image.jpg";

  // helper to resolve full path
  const resolveImagePath = (image) => {
    if (!image) return "/no-image.jpg";
    if (
      image.startsWith("http") ||
      image.startsWith("blob:") ||
      image.startsWith("data:") ||
      image.startsWith("/")
    ) return image;
    return `/uploads/products/${image}`;
  };


  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (product?.images?.[0]) {
      // setSelectedImage(`/uploads/products/${product.images[0]}`);
      setSelectedImage(product.images[0]);
      SetMainImage(product?.images?.[selectedImageIndex] || "/no-image.jpg")
    }
  }, [product]);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0, visible: false });
  const imgRef = useRef(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const zoomContainerRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState("");     // <-- declare this
  const [showGoHome, setShowGoHome] = useState(false);
  const [showZoomLens, setShowZoomLens] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const zoomLensRef = useRef(null);
  const zoomResultRef = useRef(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [showReplacementModal, setShowReplacementModal] = useState(false);
  const [showWarrantyModal, setshowWarrantyModal] = useState(false);
  const [showGstInvoiceModal, setshowGstInvoiceModal] = useState(false);

  // ###### Show Customer Reviews ###### //
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/product/${slug}`);


        // if (!response.ok) {
        //   throw new Error(`HTTP error! status: ${response.status}`);
        // }

        if (!response.ok) {
          // Instead of throwing an error, handle it gracefully
          setErrorMessage("Content not loading. Please try again later.");
          setShowGoHome(true);
          return;
        }

        const data = await response.json();
        // ✅ Final client-side check
        if (data.status !== "Active") {
          router.push("/404");
          return;
        }
        // console.log(data);

        // If API returns an array, find the product with matching slug
        if (Array.isArray(data)) {
          const foundProduct = data.find(p => p.slug === slug);
          if (!foundProduct) {
            throw new Error("Product not found");
          }

          setProduct(foundProduct);
          setCopyproduct(foundProduct);
        }
        // If API returns a single product object
        else if (data && data.slug) {
          setProduct(data);
          setCopyproduct(data);
          // ###### Fetch Customer Reviews ###### //
          try {
            // fetch reviews
            const reviewsRes = await fetch(`/api/reviews/${data._id}`);
            const reviewsData = await reviewsRes.json();


            if (reviewsData.success) {
              setReviews(reviewsData.reviews);
              setAvgRating(reviewsData.avgRating);
              setReviewCount(reviewsData.count);
            }
          } catch (error) {
            console.error("Error fetching product or reviews:", error);
          }

        }
        else {
          throw new Error("Invalid product data");
        }


        if (product?.images?.length > 0) {
          setSelectedImage(`/uploads/products/${product.images[0]}`);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message || "Something went wrong");
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
      colorParam = color ? color.replaceAll("-", "/") : null;
      setSelectedColor(colorParam);
    }
  }, [slug]);

  const selected_i = (variants, color = null) => {
    return variants?.find((variant) => {
      if (variant.status !== "Active") return false;

      return variant.variant_arr?.some((attr) => {
        return (
          attr.variant_attribute_name?.toLowerCase() === "color" &&
          attr.options?.toLowerCase() === color?.toLowerCase()
        );
      });
    });
  };
  const set_options = (variants, option = "") => {
    const colors = new Set();
    const sizes = new Set();

    variants.forEach((variant) => {
      if (variant.status !== "Active") return;

      variant.variant_arr.forEach((attr) => {
        const name = attr.variant_attribute_name.toLowerCase();
        if (name === "color") colors.add(attr.options);
        if (name === "size") sizes.add(attr.options);
      });
    });
    if (option === 'color') {
      setColorOptions([...colors]);
    }
    else if (option === ' size') {
      setSizeOptions([...sizes]);
    }
    else {
      setColorOptions([...colors]);
      setSizeOptions([...sizes]);
    }
  }


  const getVariantOption = (variant, name) => {
    const attr = variant.variant_arr?.find(
      (a) => a.variant_attribute_name?.toLowerCase() === name.toLowerCase()
    );
    return attr?.options || null;
  };


  const updateDependentOptions = (variants, type, value) => {
    const colors = new Set();
    const sizes = new Set();

    variants.forEach((variant) => {
      if (variant.status !== "Active") return;

      const color = getVariantOption(variant, "color"); // no split
      const size = getVariantOption(variant, "size");   // no split

      // If user selected a color -> show sizes of matching variants
      if (type === "color") {
        if (color === value && size) sizes.add(size);
      }

      // If user selected a size -> show colors of matching variants
      if (type === "size") {
        if (size === value && color) colors.add(color);
      }
    });

    if (type === "color") setSizeOptions([...sizes]);
    if (type === "size") setColorOptions([...colors]);
  };


  // 1) Fetch variants only when productId changes
  useEffect(() => {
    if (!product?._id) return;

    const fetchVariants = async () => {
      try {
        const res = await fetch(`/api/Variants/get/?_id=${product._id}`);
        const data = await res.json();

        const variants = data?.variants || [];
        setVariantData(variants);

        // set options
        set_options(variants)

        // select default variant based on param
        const matched = selected_i(variants, colorParam);
        setSelectedVariant(matched || null);
      } catch (err) {
        console.error("Failed to fetch variants:", err);
      }
    };

    fetchVariants();
  }, [product?._id]);  // ✅ important


  useEffect(() => {
    if (!selectedColor || !variantData?.length) {
      setSelectedVariant(null)
      return;
    }
    // router.push(`${process.env.NEXT_PUBLIC_API_URL}?${params.toString()}`, { scroll: false });
    const matched = selected_i(variantData, selectedColor);
    setSelectedVariant(matched || null);
  }, [selectedColor, variantData]);



  useEffect(() => {
    if (!selectedVariant) {
      setProduct(copyproduct)
      return;
    };
    setProduct((prev) => ({
      ...prev,
      images: selectedVariant.images || prev.image,
      price: selectedVariant.price || prev.price,
      special_price: selectedVariant.special_price || prev.special_price,
      quantity: selectedVariant.quantity >= 0 ? selectedVariant.quantity : prev.quantity,
      stock_status: selectedVariant.stock_status || prev.stock_status
    })

    )
  }, [selectedVariant])


  useEffect(() => {
    if (selectedFrequentProducts.length > 0) {
      localStorage.setItem("selectedFrequentProducts", JSON.stringify(selectedFrequentProducts));
    } else {
      localStorage.removeItem("selectedFrequentProducts");
    }
  }, [selectedFrequentProducts]);



  useEffect(() => {
    if (featuredProducts?.length > 0) {
      const stored = localStorage.getItem("selectedFrequentProducts");
      if (stored) {
        const storedProducts = JSON.parse(stored);
        // Match only products still in the featured list
        const validSelected = featuredProducts.filter(fp =>
          storedProducts.some(sp => sp._id === fp._id)
        );
        setSelectedFrequentProducts(validSelected);
      }
    }
  }, [featuredProducts]);


  const fetchBrand = async () => {
    try {
      const response = await fetch("/api/brand");
      const result = await response.json();
      if (result.error) {
        console.error(result.error);
      } else {
        const data = result.data;

        // Format for react-select
        const brandOptions = data.map((b) => ({
          value: b._id,
          label: b.brand_name,
        }));

        setBrand(brandOptions);
        // 👉 If you already have the ID and want to get the label (e.g., when editing)
        if (product?.brand) {
          const matched = brandOptions.find((b) => b.value === product.brand);
          // if (matched) console.log("Selected Brand Name:", matched.label);
        }

      }
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchBrand();
  }, []);



  const handleThumbnailClick = (index) => {
    const imagePath = product.images?.[index];

    if (imagePath) {
      // Use same logic as main image src
      const finalSrc =
        imagePath.startsWith("http") ||
          imagePath.startsWith("blob:") ||
          imagePath.startsWith("data:")
          ? imagePath
          : `/uploads/products/${imagePath}`;

      setSelectedImage(finalSrc);
    }
  };

  // Handle mouse movement for zoom lens
  const handleMouseMove = (e) => {
    if (!imgRef.current || !zoomLensRef.current || !zoomResultRef.current) return;

    const { left, top, width, height } = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    // Keep position within bounds
    const boundedX = Math.max(0, Math.min(100, x));
    const boundedY = Math.max(0, Math.min(100, y));

    setZoomPosition({ x: boundedX, y: boundedY });

    // Position the lens
    zoomLensRef.current.style.left = `calc(${boundedX}% - 75px)`;
    zoomLensRef.current.style.top = `calc(${boundedY}% - 75px)`;

    // Update the zoom result
    zoomResultRef.current.style.backgroundPosition = `${boundedX}% ${boundedY}%`;
  };

  const handleMouseEnter = () => {
    setShowZoomLens(true);
  };

  const handleMouseLeave = () => {
    setShowZoomLens(false);
  };

  const openLightbox = (index = 0) => {
    if (product?.images && product.images.length > 0) {
      setLightboxIndex(index);
      setLightboxOpen(true);
      setSelectedImage(product.images[index]);
    }
  };


  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const navigateLightbox = (direction) => {
    if (!product?.images || product.images.length === 0) return;

    let newIndex;
    if (direction === "prev") {
      newIndex =
        (selectedImageIndex - 1 + product.images.length) % product.images.length;
    } else {
      newIndex = (selectedImageIndex + 1) % product.images.length;
    }

    setSelectedImageIndex(newIndex);
    SetMainImage(product?.images?.[newIndex] || "/no-image.jpg")
  };

  // Handle keyboard events for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxOpen) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateLightbox('prev');
        if (e.key === 'ArrowRight') navigateLightbox('next');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, lightboxIndex]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }



  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-blue-500">{error}</h2>
          <Link href="/" className="mt-4 inline-flex items-center text-blue-600">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!product || !product.name) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Product not found</h2>
          <Link href="/" className="mt-4 inline-flex items-center text-blue-600">
            ← Back to Homee
          </Link>
        </div>
      </div>
    );
  }

  if (!product || !product.images) {
    return null; // or return a skeleton/loading spinner
  }


  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* 🟠 Wishlist Header Bar */}
      {/* <div className="bg-blue-50 py-6 px-8 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Shop Details</h2>
        <div className="flex items-center space-x-2">
          <Link href="/" className="text-gray-600 hover:text-blue-600">🏠 Home</Link>
          <span className="text-gray-500">›</span>
          <span className="text-blue-600 font-semibold">Shop Details</span>
        </div>
      </div> */}

      {errorMessage && (
        <div className="text-center mt-10">
          <p className="text-red-600 text-lg mb-3">{errorMessage}</p>
          {showGoHome && (
            <a
              href="/"
              className="inline-block px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
            >
              Go to Home Page
            </a>
          )}
        </div>
      )}


      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb - moved outside the grid but inside container */}
        <ProductBreadcrumb product={product} />
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Section - Product Image with Zoom */}
          <div className="md:col-span-4 relative sticky top-20 z-30">
            <div className="relative border border-gray-400 rounded-lg z-0">
              {/* Main Image with fixed aspect ratio */}
              <div
                className="relative aspect-square w-full px-7 overflow-hidden z-0"
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={() => openLightbox(0)}
                ref={zoomContainerRef}
              >
                <img
                  src={resolveImagePath(mainImage) || "/no-image.jpg"}
                  alt={product?.name || "Product"}
                  className="w-full h-full object-contain rounded-xl"
                  ref={imgRef}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/no-image.jpg";
                  }}
                />

                {/* 🔹 Zoom Lens Overlay */}
                {showZoomLens && (
                  <div
                    className="absolute border-2 border-white bg-white bg-opacity-30 pointer-events-none"
                    style={{
                      width: "150px",
                      height: "150px",
                      left: 0,
                      top: 0,
                      borderRadius: "50%",
                      transform: "translateZ(0)",
                      zIndex: 2, // ✅ low
                      display: "block",
                    }}
                    ref={zoomLensRef}
                  />
                )}
              </div>

              {/* 🔹 Zoom Result (shown on hover) */}
              {showZoomLens && (
                <div
                  className="absolute hidden md:block left-full ml-4 top-0 bg-no-repeat bg-white border rounded-lg overflow-hidden"
                  style={{
                    backgroundImage: `url(${resolveImagePath(
                      mainImage
                    )})`,
                    backgroundSize: "200%",
                    backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                    zIndex: 5, // ✅ above lens but not above whole UI
                    height: "400px",
                    width: "525px",
                  }}
                  ref={zoomResultRef}
                />
              )}
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 mt-3 overflow-x-auto pb-2 -mt-1">
              {product.images &&
                product.images.filter((img) => img && img.trim() !== "").length > 0 && (
                  <div className="flex gap-2 mt-3 overflow-x-auto pb-2 -mt-1">
                    {product.images
                      .filter((img) => img && img.trim() !== "")
                      .map((image, index) => (
                        <div key={index} className="flex-shrink-0">
                          <img
                            src={resolveImagePath(image)}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-20 h-20 border border-gray-400 rounded-lg cursor-pointer hover:scale-110 transition-transform duration-300 object-cover"
                            onClick={() => {
                              setSelectedImageIndex(index)
                              SetMainImage(product?.images?.[index] || "/no-image.jpg")
                            }}
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        </div>
                      ))}
                  </div>
                )}
            </div>

            {/* Lightbox Modal */}
            {lightboxOpen && (
              <div
                className="fixed inset-0 z-[9999] flex items-start justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-6 overflow-y-auto"
                onClick={closeLightbox}
              >
                <div
                  className="relative bg-white rounded-lg shadow-2xl w-full max-w-md sm:max-w-2xl mx-auto flex flex-col items-center max-h-[80vh] sm:max-h-[70vh] p-3 sm:p-6 mt-[10rem] sm:mt-32"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Close button */}
                  <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 transition-colors duration-200 z-50"
                    onClick={closeLightbox}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 sm:w-6 sm:h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>

                  {/* Main Image */}
                  <div className="relative w-full flex items-center justify-center">
                    <img
                      src={resolveImagePath(mainImage)}
                      alt={product?.name || "Product"}
                      className="object-contain max-h-[60vh] sm:max-h-[50vh] w-full rounded-md"
                    />
                  </div>

                  {/* Divider line */}
                  <div className="w-full border-t border-gray-300 my-3"></div>

                  {/* Thumbnails */}
                  {product.images &&
                    product.images.filter(
                      (img) =>
                        img &&
                        img.trim() !== "" &&
                        img.trim().toLowerCase() !== "null"
                    ).length > 0 && (
                      <div className="flex justify-center flex-wrap gap-2 sm:gap-3">
                        {product.images
                          .filter(
                            (img) =>
                              img &&
                              img.trim() !== "" &&
                              img.trim().toLowerCase() !== "null"
                          )
                          .map((image, index) => {
                            const imgPath =
                              image.startsWith("http") ||
                                image.startsWith("blob:") ||
                                image.startsWith("data:")
                                ? image
                                : `/uploads/products/${image}`;

                            return (
                              <img
                                key={index}
                                src={imgPath}
                                alt={`Thumbnail ${index + 1}`}
                                className={`object-cover w-14 h-14 sm:w-16 sm:h-16 rounded-sm cursor-pointer transition-transform duration-300 hover:scale-105 ${selectedImageIndex === index ? "ring-2 ring-blue-400" : ""
                                  }`}
                                onClick={() => {
                                  setSelectedImageIndex(index)
                                  SetMainImage(product?.images?.[index] || "/no-image.jpg")
                                }}
                                onError={(e) => e.currentTarget.remove()}
                              />
                            );
                          })}
                      </div>
                    )}
                </div>
              </div>
            )}
          </div>



          {/* Middle Section */}
          <div className="md:col-span-5">
            <h1 className="text-1xl font-semibold">{product.name}</h1>
            <div className="mt-2 pb-3 border-b border-gray-400">
              {/* Top Row - Item Code and Quantity Label */}
              <div className="flex items-center space-x-2 text-sm mb-1">
                <span className="text-gray-500 text-xs">{product.item_code}</span>
              </div>

              {/* Bottom Row - All elements in one line */}
              <div className="flex items-center gap-2">
                {/* Price Section */}
                <div className="flex items-baseline gap-2">
                  {(Number(product.special_price) > 0 || Number(product.price) > 0) && (
                    <>
                      <span className="text-2xl font-bold text-blue-800">
                        Rs.{Math.round(Number(product.special_price) || Number(product.price))}
                      </span>

                      {Number(product.special_price) > 0 && Number(product.price) > 0 && (
                        <span className="text-gray-800 line-through text-sm">
                          Rs.{Math.round(Number(product.price))}
                        </span>
                      )}
                    </>
                  )}
                </div>


                {/* Quantity Selector */}
                <div className="flex items-center border border-gray-300 rounded-full h-8 w-max">
                  <button
                    onClick={handleDecrease}
                    className="px-2 py-1 border-r text-xs"
                  >
                    -
                  </button>
                  <span className="px-2 py-1 text-xs w-6 text-center">{quantity}</span>
                  <button
                    onClick={handleIncrease}
                    className="px-2 py-1 border-l text-xs"
                  >
                    +
                  </button>
                </div>


                {/* Add to Cart Button */}
                <div className="flex gap-4 flex-wrap items-start">
                  {/* <div className="flex-shrink-0">
                      <Addtocart
                        productId={product._id}
                        stockQuantity={product.quantity}
                        quantity={quantity}
                        additionalProducts={selectedFrequentProducts.map(p => p._id)}
                        warranty={selectedWarranty}
                        extendedWarranty={selectedExtendedWarranty}
                        selectedFrequentProducts={selectedFrequentProducts}
                      />
                    </div> */}

                  {product.quantity > 0 && (
                    <div className="flex-grow mt-2">
                      <ProductCard productId={product._id} />
                    </div>
                  )}

                </div>


              </div>
              {quantityWarning && (
                <p className="text-red-600 text-xs font-medium">
                  ⚠ You can't order more than {product.quantity} item{product.quantity > 1 ? "s" : ""}.(Stock only {product.quantity} items)
                </p>
              )}
            </div>
            {/* <p className="text-gray-700 text-sm mt-3 font-medium">
              {product.sku || "N/A"}
            </p> */}

            {/* Color Variant Section */}
            {/* <div className="p-3">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Colour Variant:</h3>
              <div className="flex gap-[10px] mt-1">
              {product.variants && product.variants.length > 0 ? (
                  product.variants.slice(0, 3).map((variant, index) => (
                    <div key={index} className="w-[80px] h-[80px] flex items-center justify-center">
                      <img 
                        src={variant.image} 
                        alt={`Variant ${index + 1}`} 
                        className="w-full h-full object-cover border border-gray-300 rounded-md"
                        
                      />
                    </div>
                  ))
                ) : (
                  [...Array(3)].map((_, i) => (
                    <div key={i} className="w-[80px] h-[80px] bg-gray-200 rounded-md" />
                  ))
                )}
              </div>
            </div> */}

            {/* {colorOptions && colorOptions.length > 0 && (
              <div className="p-3">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Colour Variant:</h3>
                <div className="flex gap-[10px] mt-1">
                  {product.variants.slice(0, 3).map((variant, index) => (
                    <div key={index} className="w-[80px] h-[80px] flex items-center justify-center">
                      <img
                        src={variant.image}
                        alt={`Variant ${index + 1}`}
                        className="w-full h-full object-cover border border-gray-300 rounded-md"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )} */}
            <div className="relative z-0 w-full rounded-xl border border-gray-200 bg-white px-6 py-4">
              <div className="flex items-center gap-6">
                <h4 className="text-lg font-semibold text-black">Colour :</h4>

                <div className="flex items-center gap-4">
                  {colorOptions.length > 0 &&
                    colorOptions.map((c, ind) => {
                      const [c1, c2] = c.split("/");
                      const isSelected =
                        selectedColor?.toLowerCase() === c?.toLowerCase();

                      return (
                        <button
                          key={ind}
                          onClick={() => {
                            if (selectedColor === c) {
                              console.log(selectedColor, c, 'testing')
                              setSelectedColor(null);
                              set_options(variantData)
                            }
                            else {
                              setSelectedColor(c);


                              const urlColor = c.replaceAll("/", "-");
                              const params = new URLSearchParams(searchParams.toString());
                              params.set("color", urlColor);

                              const newUrl = `${pathname}?${params.toString()}`;

                              window.history.replaceState(null, "", newUrl); // ✅ updates URL always
                              updateDependentOptions(variantData, "color", c);

                            }
                            // setSelectedVariant(selected_i(variantData, c));
                          }}
                          className="relative"   // ✅ no z-index here
                        >
                          {/* circle */}
                          <span
                            className={`block h-7 w-7 rounded-full border-2 shadow-sm transition ${isSelected ? "border-green-500" : "border-gray-300"
                              }`}
                            style={{
                              background: `linear-gradient(135deg, ${c1} 50%, ${c2} 50%)`,
                            }}
                          />

                          {/* small green pointer under selected */}
                          {isSelected && (
                            <span
                              className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0
                  border-l-[6px] border-l-transparent
                  border-r-[6px] border-r-transparent
                  border-t-[9px] border-t-green-500"
                              style={{ zIndex: 0 }}  // ✅ keep it lowest
                            />
                          )}
                        </button>
                      );
                    })}
                </div>
              </div>
            </div>
            {/* Size section */}
            <div className="relative z-0 w-full rounded-xl border border-gray-200 bg-white px-6 py-4 mt-3">
              <div className="flex items-center gap-6">
                <h4 className="text-lg font-semibold text-black">Sizes : </h4>
                {sizeOptions.map((size, ind) => (
                  <div className={`flex border-2 p-2 rounded-md ${selectedSize == size && 'bg-gray-400'}`}
                    key={ind}
                    onClick={() => {
                      if (selectedSize === size) {
                        setSelectedSize(null)
                        set_options(variantData)
                        return;
                      }
                      else {
                        updateDependentOptions(variantData, "size", size);
                        setSelectedSize(size)
                      }
                    }}
                  >
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 512 512"
                      fill="currentColor"
                      className="text-black"
                      size={size}
                    >
                      <path className="st0" d="M336.896,269.874c-18.795,0-36.449,7.308-49.698,20.575c-13.276,13.267-20.593,30.912-20.593,49.698 c0,18.768,7.307,36.422,20.593,49.707c13.276,13.267,30.921,20.574,49.698,20.574c18.769,0,36.422-7.307,49.698-20.574 c13.276-13.286,20.584-30.939,20.584-49.707c0-18.778-7.307-36.43-20.574-49.689C373.336,277.182,355.682,269.874,336.896,269.874z M378.1,381.35c-11.011,11.003-25.636,17.061-41.204,17.061c-15.559,0-30.202-6.058-41.204-17.061 c-11.011-11.002-17.07-25.635-17.07-41.203c0-15.568,6.058-30.202,17.07-41.195c11.002-11.011,25.645-17.069,41.204-17.069 c15.568,0,30.193,6.058,41.204,17.069c11.002,10.993,17.06,25.627,17.06,41.195C395.161,355.715,389.102,370.348,378.1,381.35z"></path> <path className="st0" d="M499.041,317.118l-37.455-5.428c-2.346-0.18-4.368-1.654-5.277-3.838l-12.134-29.294 c-0.908-2.175-0.531-4.656,1.006-6.436l22.4-30.103c3.569-4.18,3.335-10.392-0.556-14.274l-17.726-17.726 c-2.04-2.05-4.736-3.083-7.433-3.083c-2.427,0-4.863,0.836-6.832,2.526l-30.112,22.409c-1.141,0.98-2.588,1.492-4.044,1.492 c-0.809,0-1.618-0.162-2.382-0.476l-29.312-12.153c-2.166-0.89-3.65-2.94-3.838-5.268l-5.438-37.455 c-0.422-5.484-4.989-9.708-10.472-9.708h-25.078c-5.492,0-10.059,4.224-10.481,9.708l-5.447,37.455 c-0.179,2.328-1.654,4.378-3.829,5.276l-29.312,12.144c-0.773,0.314-1.582,0.476-2.39,0.476c-1.456,0-2.895-0.512-4.045-1.492 l-30.094-22.4c-1.969-1.69-4.404-2.535-6.822-2.535c-2.706,0-5.402,1.043-7.452,3.092l-17.726,17.717 c-3.883,3.892-4.116,10.094-0.557,14.274l22.4,30.103c1.519,1.779,1.914,4.26,1.016,6.436l-12.144,29.303 c-0.881,2.175-2.931,3.65-5.258,3.829l-37.474,5.438c-5.464,0.432-9.689,4.998-9.689,10.49v25.06 c0,5.502,4.225,10.068,9.689,10.498l37.474,5.43c2.328,0.189,4.378,1.672,5.258,3.838l12.144,29.311 c0.907,2.158,0.503,4.656-1.016,6.436l-22.4,30.103c-3.559,4.161-3.326,10.382,0.557,14.265l17.726,17.726 c2.05,2.049,4.746,3.082,7.443,3.082c2.427,0,4.863-0.836,6.832-2.526l30.094-22.409c1.15-0.98,2.589-1.483,4.045-1.483 c0.809,0,1.617,0.152,2.39,0.476L304.6,459.57c2.175,0.899,3.659,2.93,3.838,5.276l5.438,37.456 c0.422,5.464,4.989,9.698,10.481,9.698h25.078c5.492,0,10.049-4.234,10.481-9.698l5.429-37.456 c0.189-2.345,1.672-4.376,3.838-5.276l29.312-12.144c0.773-0.324,1.581-0.476,2.39-0.476c1.456,0,2.904,0.503,4.045,1.483 l30.103,22.409c1.969,1.69,4.404,2.526,6.832,2.526c2.697,0,5.393-1.034,7.433-3.082l17.726-17.726 c3.9-3.883,4.125-10.104,0.556-14.265l-22.4-30.103c-1.509-1.78-1.914-4.279-1.006-6.436l12.134-29.311 c0.909-2.167,2.931-3.65,5.277-3.838l37.455-5.43c5.474-0.431,9.699-4.997,9.699-10.48v-25.078 C508.74,322.125,504.515,317.559,499.041,317.118z M496.722,351.364l-36.574,5.304c-6.643,0.71-12.324,4.944-14.939,11.182 l-12.126,29.266c-2.598,6.22-1.582,13.25,2.633,18.481l21.879,29.402l-15.856,15.855l-29.392-21.878 c-3.236-2.616-7.29-4.054-11.461-4.054c-2.436,0-4.808,0.485-6.984,1.402l-29.339,12.152c-6.211,2.589-10.444,8.278-11.155,14.93 l-5.302,36.574h-22.418l-5.312-36.565c-0.701-6.652-4.926-12.35-11.173-14.957l-29.276-12.117c-2.238-0.944-4.602-1.42-7.028-1.42 c-4.153,0-8.198,1.438-11.443,4.044l-29.411,21.887l-15.847-15.855l21.87-29.402c4.224-5.232,5.24-12.27,2.652-18.446 l-12.117-29.248c-2.553-6.256-8.252-10.517-14.94-11.236l-36.592-5.304v-22.436l36.575-5.303 c6.714-0.701,12.422-4.98,14.929-11.164l12.126-29.267c2.606-6.22,1.591-13.258-2.633-18.48l-21.879-29.411l15.865-15.856 l29.383,21.878c3.245,2.624,7.29,4.054,11.461,4.054c2.409,0,4.763-0.468,6.992-1.393l29.303-12.144 c6.23-2.571,10.481-8.278,11.173-14.948l5.321-36.566h22.418l5.302,36.584c0.72,6.669,4.972,12.369,11.173,14.921l29.312,12.153 c2.22,0.916,4.575,1.393,6.984,1.393c4.18,0,8.234-1.438,11.47-4.054l29.392-21.878l15.856,15.856l-21.86,29.375 c-4.243,5.214-5.268,12.26-2.661,18.471l12.135,29.312c2.588,6.22,8.288,10.462,14.948,11.164l36.565,5.303V351.364z"></path> <path className="st0" d="M170.661,260.418l18.463-6.742c4.054-1.474,6.274-5.816,5.123-9.96l-6.066-29.05 c-0.486-1.798,0.062-3.686,1.411-4.926l18.328-16.826c0.907-0.836,2.094-1.276,3.29-1.276c0.584,0,1.169,0.099,1.716,0.296 l28.198,8.423c0.962,0.359,1.95,0.53,2.921,0.521c3.11-0.009,6.068-1.798,7.452-4.764l8.278-17.824 c1.843-3.91,0.332-8.557-3.416-10.67l-24.584-16.144c-1.6-0.907-2.562-2.624-2.472-4.476l1.061-24.853 c0.081-1.843,1.187-3.461,2.841-4.233l26.138-14.076c3.928-1.78,5.807-6.292,4.332-10.328l-6.732-18.471 c-1.214-3.336-4.378-5.43-7.776-5.42c-0.728,0.009-1.465,0.098-2.193,0.306l-29.052,6.049c-0.432,0.126-0.872,0.189-1.303,0.189 c-1.348,0.009-2.661-0.566-3.614-1.59l-16.808-18.32c-1.259-1.356-1.646-3.29-0.99-5.006l8.414-28.207 c1.501-4.035-0.332-8.53-4.252-10.355l-17.824-8.296c-1.133-0.522-2.329-0.773-3.506-0.773c-2.885,0.017-5.654,1.546-7.154,4.206 l-16.153,24.593c-0.872,1.528-2.49,2.471-4.243,2.48h-0.215l-24.863-1.078c-1.834-0.09-3.488-1.195-4.242-2.858L107.103,4.836 c-1.375-3.038-4.387-4.853-7.542-4.836c-0.926,0-1.869,0.162-2.786,0.494l-18.463,6.75c-4.054,1.475-6.283,5.807-5.114,9.951 l6.058,29.06c0.494,1.771-0.054,3.667-1.411,4.908L59.517,67.99c-0.925,0.845-2.094,1.286-3.299,1.295 c-0.575,0-1.159-0.108-1.726-0.324l-28.188-8.395c-0.961-0.369-1.95-0.539-2.921-0.539c-3.101,0.017-6.05,1.798-7.442,4.764 L7.662,82.624c-1.834,3.901-0.333,8.539,3.416,10.669l24.584,16.153c1.609,0.899,2.562,2.616,2.471,4.441l-1.06,24.871 c-0.072,1.834-1.196,3.461-2.85,4.234L8.085,157.068c-3.919,1.779-5.798,6.283-4.324,10.319l6.733,18.471 c1.222,3.335,4.386,5.447,7.784,5.438c0.719-0.009,1.447-0.117,2.175-0.323l29.069-6.058c0.423-0.117,0.854-0.18,1.277-0.18 c1.357,0,2.678,0.558,3.622,1.582l16.818,18.337c1.258,1.348,1.626,3.29,0.989,5.016l-8.414,28.188 c-1.5,4.036,0.342,8.539,4.252,10.374l17.815,8.286c1.141,0.522,2.337,0.773,3.514,0.773c2.886-0.018,5.654-1.537,7.146-4.197 l16.153-24.584c0.862-1.528,2.463-2.482,4.197-2.482h0.27l24.854,1.07c1.842,0.072,3.487,1.177,4.252,2.849l14.067,26.139 c1.384,3.02,4.386,4.836,7.55,4.827C168.801,260.903,169.744,260.75,170.661,260.418z M156.98,224.491 c-2.741-5.564-8.242-9.151-14.454-9.394l-24.763-1.06c-0.306-0.018-0.611-0.036-0.917-0.036 c-5.834,0.036-11.299,3.128-14.338,8.108L87.984,244.23l-11.883-5.528l7.569-25.321c1.986-5.887,0.628-12.314-3.569-16.845 l-16.79-18.309c-3.21-3.524-7.784-5.528-12.558-5.502c-1.33,0-2.661,0.162-3.946,0.486l-26.148,5.447l-4.477-12.297l23.514-12.656 c5.564-2.777,9.151-8.288,9.376-14.444l1.07-24.799c0.296-6.22-2.805-12.009-8.117-15.227L19.931,84.727l5.519-11.883l25.357,7.568 c1.762,0.594,3.595,0.881,5.465,0.881c4.206-0.018,8.225-1.581,11.371-4.458l18.274-16.773c4.629-4.206,6.535-10.498,5.034-16.539 l-5.438-26.121l12.296-4.494l12.646,23.513c2.751,5.547,8.234,9.133,14.446,9.393l24.889,1.079l0.746,0.018 c5.879-0.027,11.353-3.137,14.391-8.126l14.526-22.121l11.883,5.527l-7.56,25.304c-2.013,5.896-0.664,12.314,3.56,16.862 l16.817,18.328c3.208,3.514,7.775,5.51,12.512,5.483c1.349-0.009,2.679-0.17,3.991-0.476l26.121-5.456l4.476,12.305l-23.524,12.674 c-5.491,2.733-9.069,8.18-9.375,14.418l-1.07,24.781c-0.297,6.23,2.805,12.018,8.126,15.254l22.085,14.516l-5.519,11.892 l-25.348-7.577c-1.762-0.594-3.595-0.89-5.474-0.881c-4.234,0.008-8.279,1.609-11.362,4.44l-18.346,16.836 c-4.557,4.206-6.436,10.481-4.97,16.485l5.456,26.138l-12.306,4.477L156.98,224.491z"></path> <path className="st0" d="M186.04,154.802c6.499-13.987,7.173-29.663,1.888-44.135c-5.294-14.48-15.891-26.04-29.842-32.521 c-7.792-3.64-16.062-5.465-24.575-5.429c-6.651,0.027-13.231,1.213-19.559,3.524c-14.498,5.285-26.057,15.883-32.556,29.86 c-6.499,13.96-7.173,29.626-1.897,44.134c5.304,14.49,15.911,26.049,29.861,32.53c7.784,3.622,16.053,5.455,24.565,5.42 c6.661-0.036,13.241-1.222,19.578-3.524C167.965,179.377,179.515,168.77,186.04,154.802z M149.376,173.372 c-5.042,1.843-10.282,2.769-15.505,2.787c-6.634,0.036-13.25-1.403-19.442-4.288c-11.065-5.151-19.442-14.302-23.64-25.762 c-4.17-11.478-3.65-23.882,1.501-34.939c5.151-11.074,14.31-19.469,25.77-23.639c5.051-1.852,10.292-2.778,15.506-2.796 c6.634-0.028,13.24,1.411,19.433,4.297c11.056,5.15,19.451,14.301,23.64,25.761c4.18,11.47,3.648,23.865-1.493,34.939 C169.978,160.797,160.837,169.184,149.376,173.372z"></path>
                    </svg>
                    <button className="pl-1">
                      {size}
                    </button>
                  </div>
                )
                )}
              </div>
            </div>


            {/* Stock Alert */}
            <div className="mt-4">
              {/* <p className="font-semibold">⚠ Products are almost sold out</p> */}

              {product.quantity < 5 ? (
                <p className="font-semibold text-red-600">⚠ Products are almost sold out</p>
              ) : (
                <p className="font-semibold text-green-600">✅ In stock. Order anytime.</p>
              )}
              <p className="text-gray-600 text-sm mt-1">
                {product.quantity && product.quantity > 0 ? (
                  <>Available only: <span className="font-bold">{product.quantity}</span></>
                ) : (
                  <span className="text-red-600 font-bold">No stock</span>
                )}
              </p>

            </div>

            {/* Add this code right after the Stock Alert section */}
            {/* <div className="border-2 border-customBlue rounded-lg overflow-hidden bg-blue-50 shadow-md mt-4">
              
                <div className="bg-customBlue px-4 py-3 rounded-t-lg">
                  <h3 className="text-base font-semibold text-white">
                    EMI OPTIONS AVAILABLE
                  </h3>
                </div>

               
                <div className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <img 
                        src="/emi-bank-logos.png" 
                        alt="Bank Logos" 
                        className="h-6 w-auto"
                      />
                      <span className="text-sm text-blue-700">
                        From <span className="font-bold">₹{Math.floor((product.special_price || product.price) / 6)}</span>/month
                      </span>
                    </div>
                    <button className="text-sm font-semibold text-blue-700 hover:underline">
                      View Plans
                    </button>
                  </div>
                  <p className="text-xs text-blue-600">
                    Credit Card EMI available on orders above ₹5,000
                  </p>
                </div>
              </div> */}

            {/* <h4><b>Available offers</b></h4> */}


            {/* <RazorpayOffers amount={product.special_price} /> */}




            {/* EMI Modal */}
            {/* {showEMIModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white rounded-lg w-full max-w-md mx-4">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="font-semibold">EMI Options</h3>
        <button 
          onClick={() => setShowEMIModal(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
      </div>
      
      <div className="p-4 max-h-[60vh] overflow-y-auto">
        <div className="mb-4">
          <h4 className="font-medium text-sm mb-2">Credit Card EMI</h4>
          <div className="space-y-3">
            {[
              { bank: 'HDFC Bank', tenure: '3 Months', emi: Math.floor((product.special_price || product.price) / 3) },
              { bank: 'ICICI Bank', tenure: '6 Months', emi: Math.floor((product.special_price || product.price) / 6) },
              { bank: 'SBI Card', tenure: '9 Months', emi: Math.floor((product.special_price || product.price) / 9) },
              { bank: 'Axis Bank', tenure: '12 Months', emi: Math.floor((product.special_price || product.price) / 12) },
            ].map((option, index) => (
              <div key={index} className="flex justify-between items-center p-2 border rounded">
                <div>
                  <div className="font-medium text-sm">{option.bank}</div>
                  <div className="text-xs text-gray-500">{option.tenure}</div>
                </div>
                <div className="font-semibold">₹{option.emi}/month</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-4">
          <h4 className="font-medium text-sm mb-2">Debit Card EMI</h4>
          <div className="space-y-3">
            {[
              { bank: 'Kotak Bank', tenure: '6 Months', emi: Math.floor((product.special_price || product.price) / 6) },
              { bank: 'IndusInd Bank', tenure: '9 Months', emi: Math.floor((product.special_price || product.price) / 9) },
            ].map((option, index) => (
              <div key={index} className="flex justify-between items-center p-2 border rounded">
                <div>
                  <div className="font-medium text-sm">{option.bank}</div>
                  <div className="text-xs text-gray-500">{option.tenure}</div>
                </div>
                <div className="font-semibold">₹{option.emi}/month</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="p-4 border-t text-sm">
        <p className="text-gray-600 mb-2">* Interest rates may vary based on your bank's policies</p>
        <button 
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium"
          onClick={() => setShowEMIModal(false)}
        >
          Close
        </button>
      </div>
    </div>
  </div>
)} */}

            {/* Extended Warranty Section */}

            {/* Extended Warranty Section */}
            {/* {Array.isArray(product.extend_warranty) &&
              product.extend_warranty.some(w => w.year > 0 || w.amount > 0) && (
                <div className="mt-4 bg-white p-4 border border-gray-300 rounded-md shadow-sm">
                  <div className="flex items-center text-lg text-blue-800 font-bold mb-4 gap-2">
                    <FaShield className="w-6 h-6 text-blue-800" />
                    <span className="font-bold">BEA Care</span>
                    <span className="text-gray-700 font-normal text-sm">Add extra protection to your products</span>
                  </div>

                  <div className="border-t border-gray-300 mb-4"></div>

                  <div className="flex flex-col md:flex-row items-start gap-6">
                    <div className="flex-shrink-0 mx-auto md:mx-0">
                      <img
                        src="/images/beashield.png"
                        alt="Sathya Shield"
                        className="w-36 h-36 object-contain"
                      />
                    </div>

                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 mb-3 text-md">
                        Brand Authorised Repair/Replacement Guarantee As Per Manufacturer.
                      </p>

                      <p className="text-gray-700 text-sm mb-4">
                        If you would like to cover your product under extended warranty for additional years. You may choose the plans as given below.
                      </p>

                      <div className="space-y-3 mb-6">
                        {product.extend_warranty.map((warranty, index) => (
                          <label
                            key={warranty._id || index}
                            className="flex items-center gap-3 p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
                          >
                            <input
                              type="radio"
                              name="extendedWarranty"
                              value={warranty.amount}
                              checked={selectedWarrantyAmount === warranty.amount}
                              onChange={() => setSelectedWarrantyAmount(warranty.amount)}
                              className="w-4 h-4 accent-blue-800"
                            />
                            <span className="text-gray-700 text-sm">
                              Include {warranty.year} Year{warranty.year > 1 ? "s" : ""} for
                              <span className="font-semibold"> ₹{warranty.amount.toLocaleString()}</span>
                            </span>
                          </label>
                        ))}

                        <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
                          <input
                            type="radio"
                            name="extendedWarranty"
                            value={0}
                            checked={selectedWarrantyAmount === 0}
                            onChange={() => setSelectedWarrantyAmount(0)}
                            className="w-4 h-4 accent-blue-800"
                          />
                          <span className="text-gray-700 text-sm">No Extended Warranty</span>
                        </label>
                      </div>

                      {selectedWarrantyAmount > 0 && (
                        <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-gray-300">
                                <th className="text-left pb-2 font-semibold text-gray-700">Product</th>
                                <th className="text-left pb-2 font-semibold text-gray-700">Warranty</th>
                                <th className="text-right pb-2 font-semibold text-gray-700">Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="py-2 font-semibold text-gray-900">
                                  ₹{(product.special_price || product.price).toLocaleString()}
                                </td>
                                <td className="py-2 font-semibold text-gray-900">
                                  ₹{selectedWarrantyAmount.toLocaleString()}
                                </td>
                                <td className="py-2 text-right font-bold text-blue-800 text-lg">
                                  ₹{((product.special_price || product.price) + selectedWarrantyAmount).toLocaleString()}
                                </td>
                              </tr>
                            </tbody>
                          </table>

                          <div className="md:hidden mt-3 space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-700">Product:</span>
                              <span className="font-semibold">₹{(product.special_price || product.price).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-700">Warranty:</span>
                              <span className="font-semibold">₹{selectedWarrantyAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between border-t border-gray-300 pt-2">
                              <span className="font-semibold text-gray-900">Total:</span>
                              <span className="font-bold text-blue-800 text-lg">
                                ₹{((product.special_price || product.price) + selectedWarrantyAmount).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )} */}



            {/* Product More Info */}

            <div className="mt-4 bg-gray-50 p-4 rounded-md">
              {/* Static Title */}
              <h3 className="text-sm font-semibold text-gray-900 mb-3">MORE INFO</h3>

              <div className="flex flex-row gap-4">
                {/* Image Section (Left) */}
                <div className="w-[30%] flex-shrink-0">
                  <img
                    src={resolveImagePath(mainImage) || "/no-image.jpg"}
                    alt={product?.name || "Product"}
                    className="w-full h-auto max-w-[150px] max-h-[150px] object-contain rounded-md border border-gray-200 mx-auto"
                  />
                </div>

                {/* Content Section (Right) */}
                <div className="w-[70%] flex flex-col">
                  {/* Brand Information */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">Brand</h4>
                    <p className="text-gray-700 text-sm">
                      {brand.find((b) => b.value === product.brand)?.label || "No Brand Info Available"}
                    </p>
                  </div>

                  {/* Quantity Information */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">Available Quantity</h4>
                    <p className="text-gray-700 text-sm">
                      {product.quantity ? `${product.quantity} units available` : "Out of stock"}
                    </p>
                    {product.quantity && (
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                        <div
                          className="bg-green-600 h-1.5 rounded-full"
                          style={{ width: `${Math.min(100, product.quantity)}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>


            <div className="border-b border-gray-400 mt-2"></div>

            {/* Product feature section */}

            <div className="mt-4 bg-gray-50 p-4 rounded-md">
              {/* Static Title */}
              <h3 className="text-sm font-semibold text-gray-900 mb-3">PRODUCT FEATURES</h3>

              <div className="mt-3">
                {(() => {
                  let features = [];

                  if (product?.key_specifications) {
                    if (Array.isArray(product.key_specifications)) {
                      features = product.key_specifications.flatMap(item =>
                        // 🔥 Smart split: split by comma NOT inside parentheses
                        item.split(/,(?![^(]*\))/)
                      );
                    } else if (typeof product.key_specifications === "string") {
                      features = product.key_specifications.split(/,(?![^(]*\))/);
                    }
                  }

                  // 🔥 Clean & filter
                  const cleanedFeatures = features
                    .map(f => String(f).replace(/[{}\[\]"]/g, "").trim())
                    .filter(f => f.length > 0);

                  return cleanedFeatures.length > 0 ? (
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                      {cleanedFeatures.map((feature, index) => (
                        <li key={index}>
                          {feature.charAt(0).toUpperCase() + feature.slice(1)}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-xs text-gray-500">No features available.</span>
                  );
                })()}
              </div>
            </div>

            <div className="border-b border-gray-400 mt-2"></div>

            {/* Product highlight section */}
            {/* <div className="mt-4 bg-gray-50 p-4 rounded-md">
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setShowHighlights(!showHighlights)}
                >
                  <h3 className="text-sm font-semibold text-gray-900">PRODUCT HIGHLIGHTS</h3>
                  <svg 
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${showHighlights ? 'transform rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                  {showHighlights && (
                    <div className="mt-3">
                      {product.highlights && product.highlights.trim() !== '' ? (
                        <ol className="list-decimal pl-5 space-y-1 text-xs text-gray-600">
                          {product.highlights
                            .split('\n')
                            .filter(item => item.trim() !== '')
                            .map((item, index) => (
                              <li key={index}>{item.trim()}</li>
                            ))}
                        </ol>
                      ) : (
                        <p className="text-xs text-gray-500">No highlights available.</p>
                      )}
                    </div>
                  )}
            </div> */}
            <div className="mt-4 bg-gray-50 p-4 rounded-md">
              {/* Static Title */}
              <h3 className="text-sm font-semibold text-gray-900 mb-3">PRODUCT HIGHLIGHTS</h3>

              <div className="mt-3 overflow-auto">
                {Array.isArray(product.product_highlights) &&
                  product.product_highlights
                    .flatMap(item => item.split(/[\n,]+/).map(i => i.trim()))
                    .filter(item => item.length > 0).length > 0 ? (
                  <table className="w-full text-xs text-left text-gray-700 border border-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border px-3 py-2">Key</th>
                        <th className="border px-3 py-2">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.product_highlights
                        .flatMap(item => item.split(/[\n,]+/).map(i => i.trim()))
                        .filter(item => item.length > 0)
                        .map((item, index) => {
                          const cleanedItem = item
                            .replace(/[\[\]{}"]/g, '') // remove braces, brackets, quotes
                            .replace(/\s+/g, ' ')
                            .trim();
                          const [key, ...rest] = cleanedItem.split(':');
                          const value = rest.join(':').trim();
                          return (
                            <tr key={index} className="bg-white even:bg-gray-50">
                              <td className="border px-3 py-2 font-medium">{key?.trim()}</td>
                              <td className="border px-3 py-2">{value || '-'}</td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-gray-500 text-xs">No highlights available.</p>
                )}
              </div>
            </div>


            <div className="border-b border-gray-400 mt-2"></div>

            {/* Coupons */}
            {/* <div className="mt-4">
              <div className="flex items-center justify-between border border-blue-400 rounded-md p-2 mb-3">
                <div className="flex items-center gap-1">
                  //  <span className="text-gray-600 text-sm">➕</span> 
                  <span className="inline-flex items-center justify-center w-4 h-4 text-white bg-gray-600 rounded-full text-lg">+</span>

                  <span className="text-gray-700 text-xs">Mfr. coupon. $3.00 off 5</span>
                </div>
                <button className="text-blue-500 text-xs font-semibold hover:underline">
                  View Details
                </button>
              </div>
              <div className="mt-1 text-gray-900 text-xs font-medium">
                <p>Buy 1, Get 1 FREE</p>
                <p>Buy 1, Get 1 FREE</p>
              </div>
            </div> */}

            <div className="mt-4">


              {/* Responsive 3 Boxes Section */}
              <div className="mt-3 flex flex-col md:flex-row md:justify-between gap-2 space-y-2 md:space-y-0">
                {/* Replacement Box 
    <div
      className="flex items-start bg-blue-50 border border-blue-200 rounded-md p-4 w-full md:w-1/3 shadow-sm cursor-pointer"
      onClick={() => setShowReplacementModal(true)}
    >
     <span className="text-3xl mr-3 mt-1">
  <Icon icon="mdi:refresh" className="text-blue-600" />
</span>
      <div>
        <div className="text-sm font-semibold text-blue-800">Replacement</div>
        <div className="text-xs text-blue-600">in 7 days</div>
      </div>
    </div>
	
	*/}

                {/* Warranty Box 
    <div
      className="flex items-start bg-blue-50 border border-blue-200 rounded-md p-4 w-full md:w-1/3 shadow-sm cursor-pointer"
      onClick={() => setshowWarrantyModal(true)}
    >
      <span className="text-3xl mr-3 mt-1">
  <Icon icon="mdi:shield" className="text-blue-500" />
</span>
      <div>
        <div className="text-sm font-semibold text-blue-800">Warranty</div>
        <div className="text-xs text-blue-600">in 1 Year</div>
      </div>
    </div>
	
	*/}

                {/* GST Invoice Box 
    <div
      className="flex items-start bg-blue-50 border border-blue-200 rounded-md p-4 w-full md:w-1/3 shadow-sm cursor-pointer"
      onClick={() => setshowGstInvoiceModal(true)}
    >
      <span className="text-yellow-500 text-xl mr-3 mt-1">📄</span>
      <div>
        <div className="text-sm font-semibold text-blue-800">GST Invoice</div>
        <div className="text-xs text-blue-600">Available</div>
      </div>
	  
	  
    </div>
	*/}

              </div>

              {/* Modal */}
              {showReplacementModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl relative p-6">
                    {/* Modal Header */}
                    <div className="flex justify-between items-center border-b pb-2">
                      <h2 className="text-lg font-semibold text-blue-800">Replacement</h2>
                      <button
                        className="text-gray-500 hover:text-gray-700 text-xl"
                        onClick={() => setShowReplacementModal(false)}
                      >
                        &times;
                      </button>
                    </div>

                    {/* Modal Content */}
                    <div className="mt-4 text-sm text-gray-700 space-y-2 max-h-[60vh] scrollbar-hide overflow-y-auto">
                      <p>Please go through the mentioned Replacement policy before placing an order.</p>
                      <p>
                        Should you receive an item with physical damages, please note that you should
                        contact us within 48 hours, (In the case of Brands like Apple, 24 hours), without
                        using the product and without breaching Poorvika's Online Replacement Policy. If
                        you fail to follow these, the replacement claim will become void.
                      </p>
                      <p>
                        Products you purchased from Poorvika Online are only eligible for Replacement, under
                        the following conditions during delivery:
                      </p>
                      <ul className="list-disc pl-6">
                        <li>Physical Damage to the Product</li>
                        <li>Defective Product</li>
                        <li>Wrong product received</li>
                        <li>Broken Seal</li>
                      </ul>
                      <p className="font-semibold">Replacement of Mobile Phone:</p>
                      <p>
                        In case you receive an item that is not in perfect condition, please contact us
                        immediately. Important - DO NOT INSERT THE SIM and DO NOT CONNECT TO WIFI (Adhering
                        to Poorvika's Online Replacement Policy).
                      </p>
                      <p className="font-semibold">Void Claim:</p>
                      <p>
                        Please note that if you do not abide by Poorvika Online's Replacement Policy and/or
                        on ignoring your duties as stated above, you agree that your claim for replacement
                        will become a VOID CLAIM.
                      </p>
                    </div>

                    {/* Modal Footer */}
                    <div className="mt-6 flex justify-end border-t pt-3">
                      <a
                        href="/cancellation-refund-policy"
                        className="text-sm text-blue-600 font-medium hover:underline"
                      >
                        Know More
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Modal */}
              {showWarrantyModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl relative p-6">
                    {/* Modal Header */}
                    <div className="flex justify-between items-center border-b pb-2">
                      <h2 className="text-lg font-semibold text-blue-800">Warranty</h2>
                      <button
                        className="text-gray-500 hover:text-gray-700 text-xl"
                        onClick={() => setshowWarrantyModal(false)}
                      >
                        &times;
                      </button>
                    </div>

                    {/* Modal Content */}
                    <div className="mt-4 text-sm text-gray-700 space-y-2 max-h-[60vh] scrollbar-hide overflow-y-auto">
                      <p>1 Year manufacturer warranty for device and 6 months manufacturer warranty for in-box accessories.</p>
                    </div>

                    {/* Modal Footer */}
                    <div className="mt-6 flex justify-end border-t pt-3">
                      <a
                        href="/privacypolicy"
                        className="text-sm text-blue-600 font-medium hover:underline"
                      >
                        Know More
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Modal */}
              {showGstInvoiceModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl relative p-6">
                    {/* Modal Header */}
                    <div className="flex justify-between items-center border-b pb-2">
                      <h2 className="text-lg font-semibold text-blue-800">GST Invoice</h2>
                      <button
                        className="text-gray-500 hover:text-gray-700 text-xl"
                        onClick={() => setshowGstInvoiceModal(false)}
                      >
                        &times;
                      </button>
                    </div>

                    {/* Modal Content */}
                    <div className="mt-4 text-sm text-gray-700 space-y-2 max-h-[60vh] scrollbar-hide overflow-y-auto">
                      <p>Click here to know more about our T & C</p>
                    </div>

                    {/* Modal Footer */}
                    <div className="mt-6 flex justify-end border-t pt-3">
                      <a
                        href="/shipping"
                        className="text-sm text-blue-600 font-medium hover:underline"
                      >
                        Know More
                      </a>
                    </div>
                  </div>
                </div>
              )}
              {/* Modals - Keep your existing code for modals */}
            </div>








          </div>

          {/* Right Section - Seller Info */}
          <div className="md:col-span-3 w-full max-w-sm flex flex-col space-y-4">

            {/* ================= Box: Featured + Warranty + Related ================= */}
            {featuredProducts?.filter(item => item.stock_status === "In Stock").length > 0 && (
              <div className="border border-gray-300 rounded-lg shadow-md bg-white max-h-[500px] overflow-y-scroll scrollbar-hide">
                <div className="px-4 py-4 border-b border-gray-300">
                  <h3 className="font-semibold text-sm text-gray-800 underline mb-4">
                    Frequently Bought Together:
                  </h3>

                  {featuredProducts.map((item) => (
                    <div key={item._id} className="flex items-start mb-4">
                      <input
                        type="checkbox"
                        className="mt-2 mr-3"
                        checked={selectedFrequentProducts.some(p => p._id === item._id)}
                        onChange={() => toggleFrequentProduct(item)}
                      />
                      <div className="flex items-start gap-3">
                        {item.images?.[0] && (
                          <img
                            src={'/uploads/products/' + item.images[0]}
                            alt={item.name}
                            className="w-16 h-16 object-contain"
                          />
                        )}
                        <div className="text-sm">
                          <Link
                            href={`/product/${item.slug}`}
                            className="block mb-1"
                            onClick={() => handleProductClick(item)}
                          >
                            <h3 className="text-xs sm:text-sm font-medium text-[#0069c6] hover:text-[#00badb] line-clamp-2 min-h-[40px]">
                              {item.name}
                            </h3>
                          </Link>

                          <div className="flex items-center gap-2">
                            <span className="text-base font-semibold text-red-600">
                              ₹ {(
                                item.special_price &&
                                  item.special_price > 0 &&
                                  item.special_price !== "0" &&
                                  item.special_price < item.price
                                  ? item.special_price
                                  : item.price
                              ).toLocaleString()}
                            </span>

                            {item.special_price &&
                              item.special_price > 0 &&
                              item.special_price !== "0" &&
                              item.special_price < item.price && (
                                <span className="text-xs text-gray-500 line-through">
                                  ₹ {item.price.toLocaleString()}
                                </span>
                              )}
                          </div>

                          <h4
                            className={`text-xs ${item.stock_status === "In Stock"
                              ? "text-green-600"
                              : "text-red-600"
                              }`}
                          >
                            {item.stock_status}
                            {item.stock_status === "In Stock" && item.quantity
                              ? `, ${item.quantity} units`
                              : ""}
                          </h4>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}


            {/* Warranty Section
  {(product?.warranty || product?.extended_warranty) && (
    <div className="px-4 py-4 border-b border-gray-300">
      <h4 className="text-sm font-semibold text-blue-600 mb-2">
        Want to protect your product?
      </h4>

      {product?.warranty && (
        <>
          <p className="text-sm font-bold text-gray-800 underline mb-2">
            Accidental and Liquid Damage Protection Plan
          </p>
          <div className="text-sm text-gray-800 space-y-2 mb-4">
            <div className="flex items-center">
              <input
                type="radio"
                name="protection"
                className="mr-2"
                checked={selectedWarranty === product.warranty}
                onClick={() =>
                  setSelectedWarranty(prev =>
                    prev === product.warranty ? null : product.warranty
                  )
                }
                readOnly
              />
              <label>
                1 Year Accidental And Liquid Damage
                <span className="text-green-600 font-bold ml-2">
                  ₹ {product.warranty}
                </span>
              </label>
            </div>
          </div>
        </>
      )}

      {product?.extended_warranty && (
        <>
          <p className="text-sm font-bold text-gray-800 underline mb-2">
            Extended Warranty
          </p>
          <div className="text-sm text-gray-800">
            <div className="flex items-center">
              <input
                type="radio"
                name="extended"
                className="mr-2"
                checked={selectedExtendedWarranty === product.extended_warranty}
                onClick={() =>
                  setSelectedExtendedWarranty(prev =>
                    prev === product.extended_warranty ? null : product.extended_warranty
                  )
                }
                readOnly
              />
              <label>
                1 Year Extended Warranty Protection
                <span className="text-green-600 font-bold ml-2">
                  ₹ {product.extended_warranty}
                </span>
              </label>
            </div>
          </div>
        </>
      )}
    </div>
  )} */}
            {relatedProducts.filter((item) => item.quantity > 0 && item.status === "Active").length > 0 && (
              <div className="border border-gray-300 rounded-lg shadow-md bg-white max-h-[500px] overflow-y-scroll scrollbar-hide">
                <div className="px-4 py-4">
                  <h2 className="text-sm font-bold text-green-500 underline mb-2">
                    Similar Products
                  </h2>

                  {relatedProducts
                    .filter((item) => item.quantity > 0 && item.status === "Active")
                    .slice(0, 3)
                    .map((item) => (
                      <div key={item._id} className="flex items-start mb-4">
                        {item.quantity > 0 && (
                          <input
                            type="checkbox"
                            className="mt-2 mr-3"
                            checked={selectedRelatedProducts.some(p => p._id === item._id)}
                            onChange={() => toggleRelatedProduct(item)}
                          />
                        )}
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <Link
                            href={`/product/${item.slug}`}
                            className="block mb-1"
                            onClick={() => handleProductClick(item)}
                          >
                            {item.images?.[0] && (
                              <img
                                src={'/uploads/products/' + item.images[0]}
                                alt={item.name}
                                className="w-16 h-16 object-contain flex-shrink-0"
                              />
                            )}
                          </Link>
                          <div className="text-sm flex-1 min-w-0">
                            <Link
                              href={`/product/${item.slug}`}
                              className="block mb-1"
                              onClick={() => handleProductClick(item)}
                            >
                              <h3 className="text-xs sm:text-sm font-medium text-green-800 hover:text-[#a3ca43] line-clamp-2 min-h-[40px]">
                                {item.name}
                              </h3>
                            </Link>

                            <div className="flex items-center gap-2">
                              <span className="text-base font-semibold">
                                ₹ {(
                                  item.special_price &&
                                    item.special_price > 0 &&
                                    item.special_price !== "0" &&
                                    item.special_price < item.price
                                    ? item.special_price
                                    : item.price
                                ).toLocaleString()}
                              </span>

                              {item.special_price &&
                                item.special_price > 0 &&
                                item.special_price !== "0" &&
                                item.special_price < item.price && (
                                  <span className="text-xs text-gray-500 line-through">
                                    ₹ {item.price.toLocaleString()}
                                  </span>
                                )}
                            </div>

                            <h4
                              className={`text-xs ${item.stock_status === "In Stock"
                                ? "text-green-600"
                                : "text-red-600"
                                }`}
                            >
                              {item.stock_status}
                              {item.stock_status === "In Stock" && item.quantity
                                ? `, ${item.quantity} units`
                                : ""}
                            </h4>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}



            {/* <div className="px-4 py-4">
        <h2 className="text-sm font-bold text-customBlue underline mb-2">
          Similar Products
        </h2>
        {relatedProducts
          .filter(item => item.stock_status === "In Stock")
          .slice(0, 3)
          .map((item) => (
            <div key={item._id} className="flex items-start mb-4">
              {product?.quantity > 0 && (
              <input
                type="checkbox"
                className="mt-2 mr-3"
                checked={selectedRelatedProducts.some(p => p._id === item._id)}
                onChange={() => toggleRelatedProduct(item)}
              />
            )}
              <div className="flex items-start gap-3">
                {item.images?.[0] && (
                  <img
                    src={'/uploads/products/' + item.images[0]}
                    alt={item.name}
                    className="w-16 h-16 object-contain"
                  />
                )}
                <div className="text-sm">
                  <Link
                    href={`/product/${item.slug}`}
                    className="block mb-1"
                    onClick={() => handleProductClick(item)}
                  >
                    <h3 className="text-xs sm:text-sm font-medium text-[#0069c6] hover:text-[#00badb] line-clamp-2 min-h-[40px]">
                      {item.name}
                    </h3>
                  </Link>
  
                  <div className="flex items-center gap-2">
                    <span className="text-base font-semibold text-red-600">
                      ₹ {(
                        item.special_price &&
                        item.special_price > 0 &&
                        item.special_price !== "0" &&
                        item.special_price < item.price
                          ? item.special_price
                          : item.price
                      ).toLocaleString()}
                    </span>
  
                    {item.special_price &&
                      item.special_price > 0 &&
                      item.special_price !== "0" &&
                      item.special_price < item.price && (
                        <span className="text-xs text-gray-500 line-through">
                          ₹ {item.price.toLocaleString()}
                        </span>
                      )}
                  </div>
  
                  <h4
                    className={`text-xs ${
                      item.stock_status === "In Stock"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {item.stock_status}
                    {item.stock_status === "In Stock" && item.quantity
                      ? `, ${item.quantity} units`
                      : ""}
                  </h4>
                </div>
              </div>
            </div>
          ))}
      </div> */}

            {/* </div> */}


            {/* ================= Buttons Block (Below Box) ================= */}
            <div className="w-full space-y-3">
              {/* Cart total */}

              {(selectedRelatedProducts.length > 0 ||
                selectedFrequentProducts.length > 0 ||
                selectedWarranty ||
                selectedExtendedWarranty) && (
                  <div className="w-full bg-customBlue text-white border border-gray-400 font-semibold py-2 rounded-md shadow-md flex items-center justify-between px-4">
                    {/* Left - Icon + Label */}
                    <div className="flex items-center gap-2">
                      <FaCartPlus className="text-white w-5 h-5" />
                      <span className="text-md font-semibold">Cart Total</span>
                    </div>

                    {/* Right - Price + View Cart */}
                    <div className="flex flex-col items-end leading-tight">
                      <span className="text-md font-semibold">₹{cartTotal.toLocaleString()}</span>
                      <Link
                        href="/cart"
                        className="text-[12px] text-white hover:underline mt-0.5"
                      >
                        View Cart
                      </Link>
                    </div>
                  </div>
                )}
              {/* Buy Now */}
              {product.stock_status === "In Stock" && product.quantity > 0 && (
                <button
                  onClick={handleBuyNow}
                  className="w-full w-1/2 bg-[#a3ca43] py-3 border border-blue-200 font-semibold py-3 rounded-md shadow-md flex items-center justify-center gap-3"
                >
                  <FaStore className="h-5 w-5" />
                  <span>Buy Now</span>
                </button>
              )}


              {/* Add to Cart */}
              <ProductAddtoCart
                productId={product._id}
                stockQuantity={product.quantity}
                quantity={quantity}
                additionalProducts={[
                  ...selectedFrequentProducts.map((p) => p._id),
                  ...selectedRelatedProducts.map((p) => p._id),
                ]}
                // warranty={selectedWarranty}
                selectedRelatedProducts={selectedRelatedProducts}
                // extendedWarranty={selectedExtendedWarranty}
                extendedWarranty={selectedWarrantyAmount}
                selectedFrequentProducts={selectedFrequentProducts}
                variant={{
                  color: selectedColor || "",
                  size: selectedSize || ""
                }}
                selectedVariant={selectedVariant}
                className="w-full bg-customBlue hover:bg-blue-700 text-white font-semibold py-3 rounded-md shadow-md text-center"
              />
            </div>

          </div>
        </div>


      </div>


      <div className="space-y-8">
        <ProductDetailsSection
          product={product}
          reviews={reviews}
          avgRating={avgRating}
          reviewCount={reviewCount}
        />
        {/* <RecentlyViewedProducts className="w-full" /> */}


        {/* <RelatedProducts
             className="w-full"
             categoryId={product.category}
             currentProductId={product._id}
           /> */}





      </div>

    </div>


  );
}


