"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { FaPlus, FaMinus, FaTimes } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Dynamically import react-select to avoid SSR issues
const Select = dynamic(() => import("react-select"), { ssr: false });

// This component now accepts an optional 'storeId' prop
export default function CreateStoreForm({ storeId = null }) {
  const router = useRouter();
  const [tags, setTags] = useState("");
  const [store, setStore] = useState([]);
  const [newStore, setNewStore] = useState({
    organisation_name: "",
    category: "",
    description: "",
    logo: null,
    store_images: [null, null, null], // Up to 3 store images
    location: "",
    zipcode: "",
    address: "",
    service_area: "",
    city: "",
    images: [], // General images
    tags: [],
    phone: "",
    phone_after_hours: "",
    website: "",
    email: "",
    twitter: "",
    facebook: "",
    meta_title: "",
    meta_description: "",
    verified: "No",
    approved: "No",
    user: "",
    status: "Active",
    parking: "",
    mon_sat: { open: "", close: "" },
    sunday: { closed: true, open: "", close: "" },
    featured_products: [],
    offers: [],
    highlights: [],
    social_timeline: [],
    payment_method: "",
  });

  const [openingHours, setOpeningHours] = useState({
    mon_sat: { open: "", close: "" },
    sunday: { closed: true, open: "", close: "" },
  });
  function updateOpeningHours(section, field, value) {
    setOpeningHours((prev) => {
      const updated = {
        ...prev,
        [section]: { ...prev[section], [field]: value },
      };

      // keep newStore synced
      setNewStore((store) => ({
        ...store,
        [section]: { ...prev[section], [field]: value },
      }));

      return updated;
    });
  }

  const [errors, setErrors] = useState({});
  const [logoPreview, setLogoPreview] = useState(null);
  const [storeImagePreviews, setStoreImagePreviews] = useState([
    null,
    null,
    null,
  ]);
  const [generalImagePreviews, setGeneralImagePreviews] = useState([]);

  // State for category tree
  const [categories, setCategories] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("");

  // Multi-form section
  const [currentStep, setCurrentStep] = useState(1);

  // State for users dropdown
  const [users, setUsers] = useState([]);

  // --- Fetch Data for Edit Mode ---
  useEffect(() => {
    fetchCategories();
    fetchUsers();

    if (storeId) {
      // If storeId is provided, fetch existing store data
      fetchStoreData(storeId);
    }
    fetchStores();
  }, [storeId]); // Dependency array includes storeId to re-run when it changes

  useEffect(() => {
    setNewStore((prev) => ({
      ...prev,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    }));
  }, [tags]);
  const fetchStores = async () => {
    try {
      const res = await fetch("/api/store/get");

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const result = await res.json();

      if (result.success) {
        let data = result.data;

        // 👉 if storeId exists, remove that store
        if (storeId) {
          data = data.filter((store) => store._id !== storeId);
        }

        setStore(data);
      } else {
        toast.error(result.error || "Error fetching stores.");
      }
    } catch (error) {
      console.log("error", error);
      toast.error(error.message || "Something went wrong");
    }
  };

  const fetchStoreData = async (id) => {
    try {
      const response = await fetch(`/api/store/${id}`); // Use the GET method on your dynamic API route
      const result = await response.json();

      if (response.ok) {
        // Populate the form fields with fetched data
        setNewStore({
          organisation_name: result.organisation_name || "",
          category: result.category || "",
          description: result.description || "",
          // For files (logo, images), you might need to handle URLs vs. File objects
          // For existing images, you'd load their URLs into previews
          logo: result.logo || null, // This will likely be a URL, not a File object
          store_images: result.store_images || [null, null, null], // Array of URLs
          location: result.location || "",
          zipcode: result.zipcode || "",
          address: result.address || "",
          service_area: result.service_area || "",
          city: result.city || "",
          images: result.images || [], // Array of URLs
          tags: result.tags || [],
          phone: result.phone || "",
          phone_after_hours: result.phone_after_hours || "",
          website: result.website || "",
          email: result.email || "",
          twitter: result.twitter || "",
          facebook: result.facebook || "",
          meta_title: result.meta_title || "",
          meta_description: result.meta_description || "",
          verified: result.verified || "No",
          approved: result.approved || "No",
          user: result.user || "",
          status: result.status || "Active",
          parking: result.parking || "",
          mon_sat: {
            open: result?.mon_sat?.open || "",
            close: result?.mon_sat?.close || "",
          },

          sunday: {
            closed: result?.sunday?.closed ?? true,
            open: result?.sunday?.open || "",
            close: result?.sunday?.close || "",
          },
          featured_products: result.featured_products || [],
          offers: result.offers || [],
          highlights: result.highlights || [],
          social_timeline: result.social_timeline || [],
          payment_method: result.payment_method || "",
        });

        // Set previews for existing images (assuming they are URLs)
        setLogoPreview(result.logo || null);
        setStoreImagePreviews(result.store_images || [null, null, null]);
        setGeneralImagePreviews(result.images || []);

        // Set selected category for dropdown
        setSelectedCategory(result.category || "");
      } else {
        toast.error(result.error || "Failed to fetch store data for editing.");
        router.push("/admin/store"); // Redirect if store not found or error
      }
    } catch (error) {
      console.error("Error fetching store data:", error);
      toast.error("Failed to fetch store data: " + error.message);
      router.push("/admin/store");
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories/get");
      const result = await response.json();
      if (result.error) {
        toast.error(result.error);
      } else {
        setCategories(buildCategoryTree(result));
      }
    } catch (error) {
      toast.error("Failed to fetch categories: " + error.message);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users/get"); // Assuming this API exists
      const result = await response.json();
      if (result.error) {
        toast.error(result.error);
      } else {
        const userOptions = result.map((user) => ({
          value: user._id,
          label: user.name, // Assuming user object has a 'name' field
        }));
        setUsers(userOptions);
      }
    } catch (error) {
      toast.error("Failed to fetch users: " + error.message);
    }
  };

  const buildCategoryTree = (categories, parentId = "none") => {
    return categories
      .filter((category) => category.parentid === parentId)
      .map((category) => ({
        ...category,
        children: buildCategoryTree(categories, category._id),
      }));
  };

  const toggleCategory = (id) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category._id);
    setNewStore((prev) => ({
      ...prev,
      category: category._id,
    }));
  };

  const renderCategoryTree = (categories, level = 0) => {
    return categories.map((category) => (
      <div key={category._id} style={{ paddingLeft: `${level * 20}px` }}>
        <div className="flex items-center cursor-pointer p-2 text-sm font-medium text-gray-700">
          {category.children.length > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleCategory(category._id);
              }}
              className="mr-2 text-red-500"
            >
              {expandedCategories[category._id] ? <FaMinus /> : <FaPlus />}
            </button>
          )}
          {category.children.length === 0 && (
            <input
              type="checkbox"
              name="category"
              value={category._id}
              checked={selectedCategory === category._id}
              onChange={() => handleCategoryChange(category)}
              className="mr-2"
            />
          )}
          <span
            className={`font-medium ${
              selectedCategory === category._id
                ? "text-red-500"
                : "text-gray-700"
            }`}
          >
            {category.category_name}
          </span>
        </div>
        {expandedCategories[category._id] &&
          renderCategoryTree(category.children, level + 1)}
      </div>
    ));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name == "tags") {
      setTags(value);
      return;
    }
    setNewStore((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e, fieldName, index = null) => {
    const file = e.target.files[0];
    if (!file) return;

    if (fieldName === "logo") {
      setNewStore((prev) => ({ ...prev, logo: file })); // Store the File object
      setLogoPreview(URL.createObjectURL(file)); // For immediate preview
    } else if (fieldName === "store_images") {
      const newStoreImages = [...newStore.store_images];
      const newStoreImagePreviews = [...storeImagePreviews];
      newStoreImages[index] = file; // Store the File object
      newStoreImagePreviews[index] = URL.createObjectURL(file);
      setNewStore((prev) => ({ ...prev, store_images: newStoreImages }));
      setStoreImagePreviews(newStoreImagePreviews);
    } else if (fieldName === "images") {
      setNewStore((prev) => ({
        ...prev,
        images: [...prev.images, file], // Store the File object
      }));
      setGeneralImagePreviews((prev) => [...prev, URL.createObjectURL(file)]);
    } else if (fieldName === "Featured Products") {
      setNewStore((prev) => {
        const updated = [...prev.featured_products];
        updated[index] = {
          ...updated[index],
          image: e.target.files[0],
        };

        return {
          ...prev,
          featured_products: updated,
        };
      });
    } else if (fieldName === "offers") {
      setNewStore((prev) => {
        const updated = [...prev.offers];
        updated[index] = {
          ...updated[index],
          image: e.target.files[0],
        };
        return {
          ...prev,
          offers: updated,
        };
      });
    } else if (fieldName == "highlights") {
      setNewStore((prev) => {
        const updated = [...prev.highlights];
        updated[index] = {
          ...updated[index],
          image: e.target.files[0],
        };
        return {
          ...prev,
          highlights: updated,
        };
      });
    } else if (fieldName == "social_timeline") {
      setNewStore((prev) => {
        const updated = [...prev.social_timeline];
        updated[index] = {
          ...updated[index],
          image: e.target.files[0],
        };
        return {
          ...prev,
          social_timeline: updated,
        };
      });
    }
  };

  const handleRemoveImage = (fieldName, index) => {
    if (fieldName === "store_images") {
      const newStoreImages = [...newStore.store_images];
      const newStoreImagePreviews = [...storeImagePreviews];
      newStoreImages[index] = null; // Set to null or remove based on your backend's expectation
      newStoreImagePreviews[index] = null;
      setNewStore((prev) => ({ ...prev, store_images: newStoreImages }));
      setStoreImagePreviews(newStoreImagePreviews);
    } else if (fieldName === "images") {
      const newGeneralImages = newStore.images.filter((_, i) => i !== index);
      const newGeneralImagePreviews = generalImagePreviews.filter(
        (_, i) => i !== index
      );
      setNewStore((prev) => ({ ...prev, images: newGeneralImages }));
      setGeneralImagePreviews(newGeneralImagePreviews);
    }
  };

  const handleUserChange = (selectedOption) => {
    setNewStore((prev) => ({
      ...prev,
      user: selectedOption ? selectedOption.value : "",
    }));
  };

  const handleNext = () => {
    // Basic validation for the current step before moving next
    const currentStepErrors = {};
    if (currentStep === 1) {
      if (!newStore.organisation_name.trim()) {
        currentStepErrors.organisation_name = "Organisation Name is required";
      } else if (
        store.some(
          (s) =>
            s.organisation_name.trim().toLowerCase() ===
            newStore.organisation_name.trim().toLowerCase()
        )
      ) {
        currentStepErrors.organisation_name =
          "Organisation name already exists";
      }

      // if (!newStore.category) currentStepErrors.category = "Category is required";
      // if (!newStore.description.trim()) currentStepErrors.description = "Description is required";
      // if (!newStore.logo && !storeId) currentStepErrors.logo = "Logo is required"; // Logo required only on create
    } else if (currentStep === 2) {
      if (!newStore.address.trim())
        currentStepErrors.address = "Address is required";
      if (!newStore.city.trim()) currentStepErrors.city = "City is required";
      // if (!newStore.phone.trim()) currentStepErrors.phone = "Phone is required";
    } else if (currentStep === 3) {
      if (!newStore.email.trim()) currentStepErrors.email = "Email is required";
      // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      // if (newStore.email && !emailRegex.test(newStore.email)) {
      //   currentStepErrors.email = "Invalid email format";
      // }
      if (!newStore.user) currentStepErrors.user = "Assigned User is required";
    } else if (currentStep === 4) {
      // Example validation for additional notes (optional, change as needed)
      if (newStore.additional_notes && newStore.additional_notes.length > 500)
        currentStepErrors.additional_notes =
          "Notes must be 500 characters or less";
    }

    setErrors(currentStepErrors);
    if (Object.keys(currentStepErrors).length > 0) {
      toast.error("Please fill in all required fields for the current step.");
      return; // Prevent moving to next step if there are errors
    }
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setCurrentStep((prevStep) => prevStep - 1);
    setErrors({}); // Clear errors when going back
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Final validation for the last step before submission
    const finalErrors = {};
    if (!newStore.email.trim()) finalErrors.email = "Email is required";
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // if (newStore.email && !emailRegex.test(newStore.email)) {
    //   finalErrors.email = "Invalid email format";
    // }
    const phoneRegex = /^[0-9\-\+\s()]+$/;
    if (newStore.phone && !phoneRegex.test(newStore.phone)) {
      finalErrors.phone = "Phone format is invalid";
    }
    if (!newStore.user) finalErrors.user = "Assigned User is required";

    // Additional notes validation (optional)
    if (newStore.additional_notes && newStore.additional_notes.length > 500)
      finalErrors.additional_notes = "Notes must be 500 characters or less";

    setErrors(finalErrors);
    if (Object.keys(finalErrors).length > 0) {
      toast.error("Please correct the errors before submitting.");
      return;
    }

    const formData = new FormData();
    Object.entries(newStore).forEach(([key, value]) => {
      // Only append if it's not a file or tags array
      if (key === "mon_sat") {
        formData.append("mon_sat_open", value.open || "");
        formData.append("mon_sat_close", value.close || "");
      } else if (key === "sunday") {
        formData.append("sunday_closed", value.closed);
        formData.append("sunday_open", value.open || "");
        formData.append("sunday_close", value.close || "");
      } else if (key == "featured_products") {
        newStore.featured_products.forEach((item, index) => {
          // title (always send)
          formData.append(
            `featured_products[${index}][title]`,
            item.title || ""
          );

          // image (handle new File vs existing URL)
          if (item.image instanceof File) {
            formData.append(`featured_products[${index}][image]`, item.image);
          } else if (typeof item.image === "string" && item.image) {
            formData.append(
              `featured_products[${index}][existing_image]`,
              item.image
            );
          }
        });
      } else if (key === "offers") {
        newStore.offers.forEach((item, index) => {
          formData.append(`offers[${index}][title]`, item.title || "");
          formData.append(`offers[${index}][valid]`, item.valid || "");
          formData.append(
            `offers[${index}][description]`,
            item.description || ""
          );

          if (item.image instanceof File) {
            formData.append(`offers[${index}][image]`, item.image);
          } else if (typeof item.image === "string" && item.image) {
            formData.append(`offers[${index}][existing_image]`, item.image);
          }
        });
      } else if (key == "highlights") {
        newStore.highlights.forEach((item, index) => {
          // title (always send)
          formData.append(`highlights[${index}][label]`, item.label || "");

          // image (handle new File vs existing URL)
          if (item.image instanceof File) {
            formData.append(`highlights[${index}][image]`, item.image);
          } else if (typeof item.image === "string" && item.image) {
            formData.append(`highlights[${index}][existing_image]`, item.image);
          }
        });
      } else if (key == "social_timeline") {
        newStore.social_timeline.forEach((item, index) => {
          // title (always send)
          formData.append(
            `social_timeline[${index}][media_url]`,
            item.media_url || ""
          );
          formData.append(
            `social_timeline[${index}][post_text]`,
            item.post_text || ""
          );
          formData.append(`social_timeline[${index}][date]`, item.date || "");

          // image (handle new File vs existing URL)
          if (item.image instanceof File) {
            formData.append(`social_timeline[${index}][image]`, item.image);
          } else if (typeof item.image === "string" && item.image) {
            formData.append(
              `social_timeline[${index}][existing_image]`,
              item.image
            );
          }
        });
      } else if (key === "tags") {
        formData.append(key, [value]);
        // remove empty values
      } else if (
        key !== "logo" &&
        key !== "store_images" &&
        key !== "images" &&
        key !== "tags"
      ) {
        formData.append(key, value);
      }
    });

    // Append File objects only if they are actual File objects (newly selected)
    if (newStore.logo instanceof File) {
      formData.append("logo", newStore.logo);
    }
    newStore.store_images.forEach((image, index) => {
      if (image instanceof File) {
        formData.append(`store_image_${index}`, image);
      } else if (typeof image === "string" && image) {
        // If it's a string, it's an existing URL, send it as a string
        formData.append(`existing_store_image_${index}`, image);
      }
    });
    newStore.images.forEach((image, index) => {
      if (image instanceof File) {
        formData.append(`images`, image);
      } else if (typeof image === "string" && image) {
        // If it's a string, it's an existing URL, send it as a string
        formData.append(`existing_image_${index}`, image);
      }
    });

    // formData.append("tags", JSON.stringify(newStore.tags));

    let res;
    let url;
    let method;

    if (storeId) {
      // Edit mode
      url = `/api/store/${storeId}`; // Target the dynamic route for update
      method = "PUT"; // Or PATCH, depending on your API design for updates
      // For PUT, you might send the whole object. For PATCH, only changed fields.
      // Given FormData, PUT is often easier as it sends everything.
    } else {
      // Create mode
      url = "/api/store/add";
      method = "POST";
    }

    try {
      res = await fetch(url, {
        method: method,
        body: formData,
        // No Content-Type header needed for FormData; browser sets it automatically
      });

      const result = await res.json();
      if (res.ok) {
        toast.success(
          storeId
            ? "Store updated successfully!"
            : "Store created successfully!"
        );
        router.push("/admin/store"); // Redirect to store listing
      } else {
        toast.error(
          result.error ||
            (storeId ? "Failed to update store" : "Failed to create store")
        );
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("An unexpected error occurred: " + error.message);
    }
  };

  const formTitle = storeId ? "Edit Store" : "Create New Store";
  const submitButtonText = storeId ? "Update Store" : "Create Store";

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded-lg mt-4">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-6 ">{formTitle}</h2>
      <form onSubmit={handleSubmit}>
        {currentStep === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Organisation Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Organisation Name
              </label>
              <input
                type="text"
                name="organisation_name"
                className="p-2 border rounded w-full"
                onChange={handleInputChange}
                value={newStore.organisation_name}
              />
              {errors.organisation_name && (
                <span className="text-red-500 text-sm">
                  {errors.organisation_name}
                </span>
              )}
            </div>

            {/* Category */}
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <div className="border rounded p-2 max-h-48 overflow-y-auto">
                {renderCategoryTree(categories)}
              </div>
              {errors.category && (
                <span className="text-red-500 text-sm">{errors.category}</span>
              )}
            </div> */}

            {/* Description (full width) */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                className="p-2 border rounded w-full"
                onChange={handleInputChange}
                value={newStore.description}
              ></textarea>
              {errors.description && (
                <span className="text-red-500 text-sm">
                  {errors.description}
                </span>
              )}
            </div>

            {/* Upload Logo */}
            <div>
              <label className="block mb-1 text-sm font-semibold text-gray-700">
                Upload Logo
              </label>
              <input
                type="file"
                onChange={(e) => handleFileChange(e, "logo")}
                className="block w-full text-sm text-gray-600
                  file:mr-3 file:py-1 file:px-3
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-red-50 file:text-red-700
                  hover:file:bg-red-100"
                accept="image/*"
              />
              {logoPreview && (
                <img
                  src={logoPreview}
                  className="h-20 mt-2 rounded-md object-contain"
                  alt="Logo Preview"
                />
              )}
              {errors.logo && (
                <span className="text-red-500 text-sm">{errors.logo}</span>
              )}
            </div>

            {/* Store Images (600x450, Max 3) */}
            {/* <div>
              <label className="block mb-1 text-sm font-semibold text-gray-700">Store Images (600x450, Max 3)</label>
              {[0, 1, 2].map((index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e, "store_images", index)}
                    className="block w-full text-sm text-gray-600
                      file:mr-3 file:py-1 file:px-3
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-red-50 file:text-red-700
                      hover:file:bg-red-100"
                    accept="image/*"
                  />
                  {storeImagePreviews[index] && (
                    <div className="relative">
                      <img
                        src={storeImagePreviews[index]}
                        className="h-20 w-20 object-cover rounded-md"
                        alt={`Store Image ${index + 1} Preview`}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage("store_images", index)}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div> */}

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                className="p-2 border rounded w-full"
                onChange={handleInputChange}
                value={newStore.location}
              />
              {errors.location && (
                <span className="text-red-500 text-sm">{errors.location}</span>
              )}
            </div>

            {/* Zipcode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Zipcode
              </label>
              <input
                type="text"
                name="zipcode"
                className="p-2 border rounded w-full"
                onChange={handleInputChange}
                value={newStore.zipcode}
              />
              {errors.zipcode && (
                <span className="text-red-500 text-sm">{errors.zipcode}</span>
              )}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Row 1: Address + Service Area */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                name="address"
                className="p-2 border rounded w-full"
                onChange={handleInputChange}
                value={newStore.address}
              />
              {errors.address && (
                <span className="text-red-500 text-sm">{errors.address}</span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Service Area
              </label>
              <input
                type="text"
                name="service_area"
                className="p-2 border rounded w-full"
                onChange={handleInputChange}
                value={newStore.service_area}
              />
              {errors.service_area && (
                <span className="text-red-500 text-sm">
                  {errors.service_area}
                </span>
              )}
            </div>

            {/* Row 2: City + Additional Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                name="city"
                className="p-2 border rounded w-full"
                onChange={handleInputChange}
                value={newStore.city}
              />
              {errors.city && (
                <span className="text-red-500 text-sm">{errors.city}</span>
              )}
            </div>

            <div>
              <label className="block mb-1 text-sm font-semibold text-gray-700">
                Additional Images
              </label>
              <input
                type="file"
                onChange={(e) => handleFileChange(e, "images")}
                className="block w-full text-sm text-gray-600
                  file:mr-3 file:py-1 file:px-3
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-red-50 file:text-red-700
                  hover:file:bg-red-100"
                accept="image/*"
                multiple
              />
              {/* Previews */}
              <div className="flex flex-wrap gap-2 mt-3">
                {generalImagePreviews.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview}
                      className="h-20 w-20 object-cover rounded-md"
                      alt={`Image ${index + 1} Preview`}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage("images", index)}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Row 3: Tags + Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <input
                name="tags"
                className="p-2 border rounded w-full"
                onChange={handleInputChange}
                value={tags}
              />
              {errors.tags && (
                <span className="text-red-500 text-sm">{errors.tags}</span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Working Hours Monday – Saturday
              </label>

              <div className="flex gap-3 mt-2">
                <input
                  type="time"
                  className="p-2 border rounded w-full"
                  value={newStore.mon_sat.open}
                  onChange={(e) =>
                    updateOpeningHours("mon_sat", "open", e.target.value)
                  }
                />

                <span>to</span>

                <input
                  type="time"
                  className="p-2 border rounded w-full"
                  value={newStore.mon_sat.close}
                  onChange={(e) =>
                    updateOpeningHours("mon_sat", "close", e.target.value)
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sunday
              </label>

              <div className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  checked={newStore.sunday.closed}
                  onChange={(e) =>
                    updateOpeningHours("sunday", "closed", e.target.checked)
                  }
                />
                <span>Closed</span>
              </div>

              {!newStore.sunday.closed && (
                <div className="flex gap-3 mt-2">
                  <input
                    type="time"
                    className="border p-2 rounded"
                    value={newStore.sunday.open}
                    onChange={(e) =>
                      updateOpeningHours("sunday", "open", e.target.value)
                    }
                  />

                  <span>to</span>

                  <input
                    type="time"
                    className="border p-2 rounded"
                    value={newStore.sunday.close}
                    onChange={(e) =>
                      updateOpeningHours("sunday", "close", e.target.value)
                    }
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Parking Options
              </label>
              <input
                type="text"
                name="parking"
                className="p-2 border rounded w-full"
                onChange={handleInputChange}
                value={newStore.parking}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                className="p-2 border rounded w-full"
                onChange={handleInputChange}
                value={newStore.phone}
              />
              {errors.phone && (
                <span className="text-red-500 text-sm">{errors.phone}</span>
              )}
            </div>

            {/* Row 4: Phone After Hours + Website */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone After Hours
              </label>
              <input
                type="text"
                name="phone_after_hours"
                className="p-2 border rounded w-full"
                onChange={handleInputChange}
                value={newStore.phone_after_hours}
              />
              {errors.phone_after_hours && (
                <span className="text-red-500 text-sm">
                  {errors.phone_after_hours}
                </span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Website
              </label>
              <input
                type="text"
                name="website"
                className="p-2 border rounded w-full"
                onChange={handleInputChange}
                value={newStore.website}
              />
              {errors.website && (
                <span className="text-red-500 text-sm">{errors.website}</span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment method
              </label>
              <input
                type="text"
                name="payment_method"
                className="p-2 border rounded w-full"
                onChange={handleInputChange}
                value={newStore.payment_method}
              />
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Row 1: Email + Twitter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="text"
                name="email"
                className="p-2 border rounded w-full"
                onChange={handleInputChange}
                value={newStore.email}
              />
              {errors.email && (
                <span className="text-red-500 text-sm">{errors.email}</span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Twitter
              </label>
              <input
                type="text"
                name="twitter"
                placeholder="Twitter"
                className="p-2 border rounded w-full"
                onChange={handleInputChange}
                value={newStore.twitter}
              />
            </div>

            {/* Row 2: Facebook + Meta Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Facebook
              </label>
              <input
                type="text"
                name="facebook"
                placeholder="Facebook"
                className="p-2 border rounded w-full"
                onChange={handleInputChange}
                value={newStore.facebook}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meta Title
              </label>
              <input
                type="text"
                name="meta_title"
                placeholder="Meta Title"
                className="p-2 border rounded w-full"
                onChange={handleInputChange}
                value={newStore.meta_title}
              />
            </div>

            {/* Row 3: Meta Description (Full Width) */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meta Description
              </label>
              <textarea
                name="meta_description"
                placeholder="Meta Description"
                className="p-2 border rounded w-full h-24"
                onChange={handleInputChange}
                value={newStore.meta_description}
              />
            </div>

            {/* Row 4: Verified + Approved */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Verified
              </label>
              <select
                name="verified"
                className="p-2 border rounded w-full"
                onChange={handleInputChange}
                value={newStore.verified}
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Approved
              </label>
              <select
                name="approved"
                className="p-2 border rounded w-full"
                onChange={handleInputChange}
                value={newStore.approved}
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>

            {/* Row 5: Assigned User + Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assigned User
              </label>
              <Select
                name="user"
                options={users}
                className="basic-single"
                classNamePrefix="select"
                onChange={handleUserChange}
                value={users.find((user) => user.value === newStore.user)}
                placeholder="Select user..."
              />
              {errors.user && (
                <span className="text-red-500 text-sm">{errors.user}</span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                className="p-2 border rounded w-full"
                onChange={handleInputChange}
                value={newStore.status}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          // <div className="mb-4">
          //   <label className="block text-sm font-medium text-gray-700 mb-1">
          //     Additional Notes
          //   </label>
          //   <textarea
          //     name="additional_notes"
          //     className="p-2 border rounded w-full h-32"
          //     onChange={handleInputChange}
          //     value={newStore.additional_notes}
          //   />
          //   {errors.additional_notes && (
          //     <span className="text-red-500 text-sm">{errors.additional_notes}</span>
          //   )}
          // </div>
          <div className="w-full">
            <div className="text-center font-bold text-2xl text-blue-500">
              Additional Information
            </div>
            <div className=" grid grid-flow-row gap-2 w-full">
              <div className="w-full max-h-fit min-h-4 border rounded-lg ">
                <div className="flex justify-between mx-3 my-3">
                  <h2 className="m-3 font-bold text-xl">Featured Products</h2>
                  <button
                    className="h-[30px] w-10 bg-blue-500 rounded-md text-white"
                    type="button"
                    onClick={() =>
                      // setFeatured_Products((prev) => [
                      //   ...prev,
                      //   { image: null, title: "" },
                      // ])
                      setNewStore((prev) => ({
                        ...prev,
                        featured_products: [
                          ...prev.featured_products,
                          { image: null, title: "" },
                        ],
                      }))
                    }
                  >
                    {" "}
                    + Add
                  </button>
                </div>
                {newStore.featured_products.map((item, ind) => (
                  <div key={ind} className="flex justify-evenly m-4">
                    <input
                      type="file"
                      onChange={(e) => {
                        handleFileChange(e, "Featured Products", ind);
                      }}
                    />
                    <input
                      type="text "
                      placeholder="Product title"
                      value={item.title}
                      className="border"
                      onChange={(e) =>
                        // setFeatured_Products((prev) => {
                        //   const copy = [...prev];
                        //   copy[ind].title = e.target.value;
                        //   return copy;
                        // })

                        setNewStore((prev) => {
                          const updated = [...prev.featured_products];
                          updated[ind] = {
                            ...updated[ind],
                            title: e.target.value,
                          };

                          return {
                            ...prev,
                            featured_products: updated,
                          };
                        })
                      }
                    />
                    <img
                      src={
                        newStore.featured_products[ind].image instanceof File
                          ? URL.createObjectURL(
                              newStore.featured_products[ind].image
                            )
                          : newStore.featured_products[ind].image
                      }
                      className="max-h-[50px] max-w-[50px] rounded-md border"
                    />

                    <button
                      type="button"
                      className="h-fit w-[40px] bg-red-500 rounded-lg text-white text-xl font-bold"
                      onClick={() => {
                        setNewStore((prev) => {
                          return {
                            ...prev,
                            featured_products: prev.featured_products.filter(
                              (_, index) => index !== ind
                            ),
                          };
                        });
                      }}
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
              <div className="w-full max-h-fit min-h-4 border rounded-lg">
                <div className="flex justify-between mx-3 my-3">
                  <h3 className="m-3 font-bold text-xl">Offers</h3>
                  <button
                    className="h-[30px] w-10 bg-blue-500 rounded-md text-white"
                    type="button"
                    onClick={() =>
                      setNewStore((prev) => ({
                        ...prev,
                        offers: [
                          ...prev.offers,
                          {
                            title: "",
                            valid: "",
                            description: "",
                            image: "",
                          },
                        ],
                      }))
                    }
                  >
                    +Add
                  </button>
                </div>
                {newStore.offers.map((item, ind) => (
                  <div key={ind} className="flex justify-evenly m-4">
                    <input
                      type="file"
                      onChange={(e) => {
                        handleFileChange(e, "offers", ind);
                      }}
                    />
                    <div className="grid grid-flow-row gap-3">
                      <input
                        type="text "
                        placeholder="Offer title"
                        value={item.title}
                        className="border"
                        onChange={(e) =>
                          // setFeatured_Products((prev) => {
                          //   const copy = [...prev];
                          //   copy[ind].title = e.target.value;
                          //   return copy;
                          // })

                          setNewStore((prev) => {
                            const updated = [...prev.offers];
                            updated[ind] = {
                              ...updated[ind],
                              title: e.target.value,
                            };

                            return {
                              ...prev,
                              offers: updated,
                            };
                          })
                        }
                      />
                      <input
                        type="date"
                        placeholder="valid date"
                        value={item.valid ? item.valid.slice(0, 10) : ""}
                        className="border"
                        onChange={(e) =>
                          // setFeatured_Products((prev) => {
                          //   const copy = [...prev];
                          //   copy[ind].title = e.target.value;
                          //   return copy;
                          // })

                          setNewStore((prev) => {
                            const updated = [...prev.offers];
                            updated[ind] = {
                              ...updated[ind],
                              valid: e.target.value,
                            };

                            return {
                              ...prev,
                              offers: updated,
                            };
                          })
                        }
                      />
                      <input
                        type="text "
                        placeholder="Offer description"
                        value={item.description}
                        className="border"
                        onChange={(e) =>
                          // setFeatured_Products((prev) => {
                          //   const copy = [...prev];
                          //   copy[ind].title = e.target.value;
                          //   return copy;
                          // })

                          setNewStore((prev) => {
                            const updated = [...prev.offers];
                            updated[ind] = {
                              ...updated[ind],
                              description: e.target.value,
                            };

                            return {
                              ...prev,
                              offers: updated,
                            };
                          })
                        }
                      />
                    </div>
                    {newStore.offers[ind].image && (
                      <img
                        src={
                          newStore.offers[ind].image instanceof File
                            ? URL.createObjectURL(newStore.offers[ind].image)
                            : newStore.offers[ind].image
                        }
                        className="max-h-[50px] max-w-[50px] rounded-md border"
                      />
                    )}

                    <button
                      type="button"
                      className="h-fit w-[40px] bg-red-500 rounded-lg text-white text-xl font-bold"
                      onClick={() => {
                        setNewStore((prev) => {
                          return {
                            ...prev,
                            offers: prev.offers.filter(
                              (_, index) => index !== ind
                            ),
                          };
                        });
                      }}
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
              <div className="w-full max-h-fit min-h-4 border rounded-lg ">
                <div className="flex justify-between mx-3 my-3">
                  <h3 className="m-3 font-bold text-xl">Highlights</h3>
                  <button
                    className="h-[30px] w-10 bg-blue-500 rounded-md text-white"
                    type="button"
                    onClick={() =>
                      setNewStore((prev) => ({
                        ...prev,
                        highlights: [
                          ...prev.highlights,
                          {
                            image: null,
                            label: "",
                          },
                        ],
                      }))
                    }
                  >
                    +Add
                  </button>
                </div>
                {newStore.highlights.map((item, ind) => (
                  <div key={ind} className="flex justify-evenly m-4">
                    <input
                      type="file"
                      onChange={(e) => {
                        handleFileChange(e, "highlights", ind);
                      }}
                    />
                    <input
                      type="text "
                      placeholder="label"
                      value={item.label}
                      className="border"
                      onChange={(e) =>
                        // setFeatured_Products((prev) => {
                        //   const copy = [...prev];
                        //   copy[ind].title = e.target.value;
                        //   return copy;
                        // })

                        setNewStore((prev) => {
                          const updated = [...prev.highlights];
                          updated[ind] = {
                            ...updated[ind],
                            label: e.target.value,
                          };

                          return {
                            ...prev,
                            highlights: updated,
                          };
                        })
                      }
                    />
                    <img
                      src={
                        newStore.highlights[ind].image instanceof File
                          ? URL.createObjectURL(newStore.highlights[ind].image)
                          : newStore.highlights[ind].image
                      }
                      className="max-h-[50px] max-w-[50px] rounded-md border"
                    />

                    <button
                      type="button"
                      className="h-fit w-[40px] bg-red-500 rounded-lg text-white text-xl font-bold"
                      onClick={() => {
                        setNewStore((prev) => {
                          return {
                            ...prev,
                            highlights: prev.highlights.filter(
                              (_, index) => index !== ind
                            ),
                          };
                        });
                      }}
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>

              <div className="w-full max-h-fit min-h-4 border rounded-lg ">
                <div className="flex justify-between mx-3 my-3">
                  <h3 className="m-3 font-bold text-xl">Social Timeline</h3>
                  <button
                    className="h-[30px] w-10 bg-blue-500 rounded-md text-white"
                    type="button"
                    onClick={() =>
                      setNewStore((prev) => ({
                        ...prev,
                        social_timeline: [
                          ...prev.social_timeline,
                          {
                            media_url: "",
                            post_text: "",
                            date: "",
                            image: "",
                          },
                        ],
                      }))
                    }
                  >
                    +Add
                  </button>
                </div>
                {newStore.social_timeline.map((item, ind) => (
                  <div key={ind} className="flex justify-evenly m-4 gap-2">
                    <input
                      type="text "
                      placeholder="Media Url"
                      value={item.media_url}
                      className="border"
                      onChange={(e) =>
                        setNewStore((prev) => {
                          const updated = [...prev.social_timeline];
                          updated[ind] = {
                            ...updated[ind],
                            media_url: e.target.value,
                          };

                          return {
                            ...prev,
                            social_timeline: updated,
                          };
                        })
                      }
                    />
                    <input
                      type="text "
                      placeholder="Post text"
                      value={item.post_text}
                      className="border"
                      onChange={(e) =>
                        setNewStore((prev) => {
                          const updated = [...prev.social_timeline];
                          updated[ind] = {
                            ...updated[ind],
                            post_text: e.target.value,
                          };

                          return {
                            ...prev,
                            social_timeline: updated,
                          };
                        })
                      }
                    />
                    <input
                      type="date"
                      placeholder=""
                      value={item.date ? item.date.slice(0, 10) : ""}
                      className="border"
                      onChange={(e) =>
                        setNewStore((prev) => {
                          const updated = [...prev.social_timeline];
                          updated[ind] = {
                            ...updated[ind],
                            date: e.target.value,
                          };

                          return {
                            ...prev,
                            social_timeline: updated,
                          };
                        })
                      }
                    />
                    <div>
                      <label>
                        Thumbnail image
                        <input
                          type="file"
                          placeholder="thumbnail image"
                          onChange={(e) => {
                            handleFileChange(e, "social_timeline", ind);
                          }}
                        />
                      </label>
                      <div className="ml-5 mt-5">
                        <img
                          src={
                            newStore.social_timeline[ind].image instanceof File
                              ? URL.createObjectURL(
                                  newStore.social_timeline[ind].image
                                )
                              : newStore.social_timeline[ind].image || null
                          }
                          className="max-h-[100px] max-w-[100px] rounded-md border"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      className="h-fit w-[40px] bg-red-500 rounded-lg text-white text-xl font-bold"
                      onClick={() => {
                        setNewStore((prev) => {
                          return {
                            ...prev,
                            social_timeline: prev.social_timeline.filter(
                              (_, index) => index !== ind
                            ),
                          };
                        });
                      }}
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-6">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
            >
              Previous
            </button>
          )}

          {currentStep < 4 && ( // Assuming 4 steps, adjust as needed
            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Next
            </button>
          )}

          {currentStep === 4 && ( // Only show "Create" or "Update" on the last step
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              {submitButtonText}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
