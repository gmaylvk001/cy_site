import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function VariantModal({ open, onClose, initialVariant, onSubmit }) {
    const emptyVariant = {
        variant_arr: [
            {
                variant_attribute_name: "", // default
                options: "", // user types: red/green
            }
        ],
        item_code: "",
        price: "",
        special_price: "",
        quantity: "",
        stock_status: "In Stock",
        images: [],
        files: [],
        status: "Active",
    };
    const [error, setError] = useState({});


    const [variant, setVariant] = useState(emptyVariant);

    // Load initial values when modal opens
    useEffect(() => {
        if (!open) return;

        let v = initialVariant || emptyVariant;

        // Reset files array
        v = {
            ...v,
            files: [],
            images: Array.isArray(v.images) ? v.images : [],
        };

        // ✅ Check if variant_arr contains color and no images exist
        const hasColor = v.variant_arr.some(
            (item) => item.variant_attribute_name?.trim() === "color"
        );

        if (hasColor && (!v.images || v.images.length === 0)) {
            // Add one empty image slot
            v.images = [""];
            v.files = [null];
        }

        setVariant(v);

    }, [open]); // DO NOT put initialVariant here




    const handleChange = async (field, value, ind) => {
        if (field === "variant_attribute_name") {
            const newVariantArr = [...variant.variant_arr];
            newVariantArr[ind].variant_attribute_name = value;

            const updatedVariant = { ...variant, variant_arr: newVariantArr };

            setVariant(updatedVariant);

            if (value === "color" && (!variant.images || variant.images.length === 0)) {
                addImageField();
            }

            // validate with updatedVariant (NOT old state)
            errors(`variant_attribute_name_${ind}`, updatedVariant);
            errors(`options_${ind}`, updatedVariant);

            return;
        }

        if (field === "options") {
            const newVariantArr = [...variant.variant_arr];
            newVariantArr[ind].options = value;

            const updatedVariant = { ...variant, variant_arr: newVariantArr };

            setVariant(updatedVariant);

            errors(`options_${ind}`, updatedVariant);

            return;
        }

        const updatedVariant = { ...variant, [field]: value };
        setVariant(updatedVariant);

        errors(field, updatedVariant);
    };



    const handleImageChange = (index, e) => {
        const file = e.target.files[0];
        if (!file) return;

        const newImages = [...(variant.images || [])];
        const newFiles = [...(variant.files || [])];

        newImages[index] = URL.createObjectURL(file);
        newFiles[index] = file;

        const updatedVariant = { ...variant, images: newImages, files: newFiles };

        setVariant(updatedVariant);

        // ✅ validate using updatedVariant (not old state)
        errors("images", updatedVariant);
    };


    const addImageField = () => {
        console.log("Adding image field");
        setVariant((prev) => ({
            ...prev,
            images: [...(prev.images || []), ""],
            files: [...(prev.files || []), null],
        }));
    };

    const removeImage = (index) => {
        setVariant((prev) => ({
            ...prev,
            images: (prev.images || []).filter((_, i) => i !== index),
            files: (prev.files || []).filter((_, i) => i !== index),
        }));
    };



    const validColors = [
        "aliceblue", "antiquewhite", "aqua", "aquamarine", "azure", "beige", "bisque",
        "black", "blanchedalmond", "blue", "blueviolet", "brown", "burlywood", "cadetblue",
        "chartreuse", "chocolate", "coral", "cornflowerblue", "cornsilk", "crimson", "cyan",
        "darkblue", "darkcyan", "darkgoldenrod", "darkgray", "darkgrey", "darkgreen",
        "darkkhaki", "darkmagenta", "darkolivegreen", "darkorange", "darkorchid", "darkred",
        "darksalmon", "darkseagreen", "darkslateblue", "darkslategray", "darkslategrey",
        "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgray", "dimgrey",
        "dodgerblue", "firebrick", "floralwhite", "forestgreen", "fuchsia", "gainsboro",
        "ghostwhite", "gold", "goldenrod", "gray", "grey", "green", "greenyellow", "honeydew",
        "hotpink", "indianred", "indigo", "ivory", "khaki", "lavender", "lavenderblush",
        "lawngreen", "lemonchiffon", "lightblue", "lightcoral", "lightcyan", "lightgoldenrodyellow",
        "lightgray", "lightgrey", "lightgreen", "lightpink", "lightsalmon", "lightseagreen",
        "lightskyblue", "lightslategray", "lightslategrey", "lightsteelblue", "lightyellow",
        "lime", "limegreen", "linen", "magenta", "maroon", "mediumaquamarine", "mediumblue",
        "mediumorchid", "mediumpurple", "mediumseagreen", "mediumslateblue", "mediumspringgreen",
        "mediumturquoise", "mediumvioletred", "midnightblue", "mintcream", "mistyrose", "moccasin",
        "navajowhite", "navy", "oldlace", "olive", "olivedrab", "orange", "orangered", "orchid",
        "palegoldenrod", "palegreen", "paleturquoise", "palevioletred", "papayawhip", "peachpuff",
        "peru", "pink", "plum", "powderblue", "purple", "rebeccapurple", "red", "rosybrown",
        "royalblue", "saddlebrown", "salmon", "sandybrown", "seagreen", "seashell", "sienna",
        "silver", "skyblue", "slateblue", "slategray", "slategrey", "snow", "springgreen", "steelblue",
        "tan", "teal", "thistle", "tomato", "turquoise", "violet", "wheat", "white", "whitesmoke",
        "yellow", "yellowgreen"
    ];


    const errors = (fieldKey = null, data = variant) => {
        console.log("Validating :", data, " FieldKey: ", fieldKey);

        let newError = {};

        data.variant_arr.forEach((v, index) => {
            const attrKey = `variant_attribute_name_${index}`;
            const optKey = `options_${index}`;

            if (!fieldKey || fieldKey === attrKey) {
                if (!v.variant_attribute_name?.trim()) {
                    newError[attrKey] = "Variant name is required";
                }
            }

            if (!fieldKey || fieldKey === optKey) {
                const opt = v.options?.trim() || "";

                if (!opt) {
                    newError[optKey] = "Options are required";
                } else if (v.variant_attribute_name?.trim() === "color") {
                    const colors = opt
                        .split("/")
                        .map((x) => x.trim().toLowerCase())
                        .filter(Boolean);

                    if (colors.length < 2) {
                        newError[optKey] =
                            "Color variant must have at least two color names separated by / (example: red/green). If single color, give twice like red/red";
                    } else {
                        const invalids = colors.filter((c) => !validColors.includes(c));
                        if (invalids.length > 0) {
                            newError[optKey] = `Invalid color(s): ${invalids.join(", ")}`;
                        }
                    }
                }
            }
        });

        // price
        if (!fieldKey || fieldKey === "price") {
            const price = Number(data.price);
            if (data.price === "" || data.price === null || isNaN(price)) {
                newError["price"] = "Price is required";
            } else if (price <= 0) {
                newError["price"] = "Price must be greater than 0";
            }
        }

        // special price
        if (!fieldKey || fieldKey === "special_price") {
            const price = Number(data.price);
            const sp = Number(data.special_price);

            if (data.special_price === "" || data.special_price === null || isNaN(sp)) {
                newError["special_price"] = "Special price is required";
            } else if (sp < 0) {
                newError["special_price"] = "Special price cannot be negative";
            } else if (!isNaN(price) && price > 0 && sp > price) {
                newError["special_price"] = "Special price must be less than or equal to Price";
            }
        }

        // quantity
        if (!fieldKey || fieldKey === "quantity") {
            const qty = Number(data.quantity);
            if (data.quantity === "" || data.quantity === null || isNaN(qty)) {
                newError["quantity"] = "Quantity is required";
            } else if (qty < 0) {
                newError["quantity"] = "Quantity cannot be negative";
            }
        }

        // images check
        if (!fieldKey || fieldKey === "images") {
            const hasColor = data.variant_arr.some(
                (v) => v.variant_attribute_name?.trim() === "color"
            );

            if (hasColor) {
                const hasOneImage =
                    Array.isArray(data.images) &&
                    data.images.some((img) => img && img !== "");

                if (!hasOneImage) {
                    newError["images"] = "At least one image is required for Color variant";
                }
            }
        }

        setError((prev) => {
            if (fieldKey) {
                const updated = { ...prev };
                delete updated[fieldKey];
                return { ...updated, ...newError };
            }
            return newError;
        });

        return Object.keys(newError).length > 0;
    };






    const buildFinalVariant = () => ({
        variant_arr: variant.variant_arr.map(v => ({
            variant_attribute_name: v.variant_attribute_name?.trim() || "",
            options: typeof v.options === "string" ? v.options : "",
        })),

        // variant_attribute_name: variant.variant_attribute_name?.trim() || "",
        // options: typeof variant.options === "string" ? variant.options : "",
        item_code: variant.item_code?.trim() || "",
        price: Number(variant.price || 0),
        special_price: Number(variant.special_price || 0),
        quantity: Number(variant.quantity || 0),
        stock_status: variant.stock_status || "In Stock",
        images: Array.isArray(variant.images) ? variant.images : [],
        files: Array.isArray(variant.files) ? variant.files : [],
        status: variant.status || "Active",
    });

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative z-50 w-[95%] max-w-3xl bg-white rounded-2xl shadow-xl p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Variant</h2>

                    <button
                        type="button"
                        onClick={onClose}
                        className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                    {/* Attribute + Options */}
                    <div className="border p-4 rounded-xl bg-white shadow-sm">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-800">Variant Section</h2>

                            <button
                                type="button"
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                                onClick={() => {
                                    const newVariantArr = [...(variant.variant_arr || [])];
                                    newVariantArr.push({ variant_attribute_name: "", options: "" });
                                    setVariant((prev) => ({ ...prev, variant_arr: newVariantArr }));
                                }}
                            >
                                + Add
                            </button>
                        </div>

                        {/* Variant List */}
                        <div className="space-y-4">
                            {variant?.variant_arr?.map((variant_item, idx) => (
                                <div key={idx} className="border rounded-xl p-4 bg-gray-50">
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                                        {/* Attribute */}
                                        <div className="md:col-span-5">
                                            <label className="text-sm font-medium text-gray-700">
                                                Variant Attribute Name
                                            </label>
                                            <select
                                                value={variant_item.variant_attribute_name ?? ""}
                                                onChange={(e) => {
                                                    handleChange("variant_attribute_name", e.target.value, idx)
                                                    errors(`variant_attribute_name_${idx}`);
                                                }
                                                }
                                                className="w-full border p-2 rounded-lg bg-white"
                                            >
                                                <option value="" disabled>
                                                    select variant
                                                </option>
                                                <option value="color">Color</option>
                                                <option value="size">Size</option>
                                                <option value="frame">Frame</option>
                                                <option value="model">Model</option>
                                            </select>
                                            {error[`variant_attribute_name_${idx}`] && (
                                                <p className="text-red-500 text-xs mt-1">
                                                    {error[`variant_attribute_name_${idx}`]}
                                                </p>
                                            )}
                                        </div>

                                        {/* Options */}
                                        <div className="md:col-span-6">
                                            <label className="text-sm font-medium text-gray-700">
                                                Options (use /)
                                            </label>
                                            <input
                                                type="text"
                                                value={variant_item.options ?? ""}
                                                onChange={(e) => {
                                                    handleChange("options", e.target.value, idx)
                                                    errors(`options_${idx}`);
                                                }}
                                                className="w-full border p-2 rounded-lg bg-white"
                                                placeholder="ex: red/green or 27.5/29"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                Example: <b>red/green</b> or <b>red-black/green-black</b>
                                            </p>
                                            {error[`options_${idx}`] && (
                                                <p className="text-red-500 text-xs mt-1">
                                                    {error[`options_${idx}`]}
                                                </p>
                                            )}
                                        </div>

                                        {/* Delete */}
                                        <div className="md:col-span-1 flex md:justify-end">
                                            <button
                                                type="button"
                                                className="mt-8 text-red-500 hover:text-red-700 text-sm font-medium"
                                                onClick={() => {
                                                    if (variant.variant_arr.length === 1) {
                                                        toast.error("At least one variant attribute is required");
                                                        return;
                                                    }
                                                    const newVariantArr = variant.variant_arr.filter((_, i) => i !== idx);
                                                    setVariant((prev) => ({ ...prev, variant_arr: newVariantArr }));
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                        </div>
                    </div>


                    {/* Images */}
                    <div className="border p-3 rounded-lg bg-white">
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium">Images</label>
                            <button
                                type="button"
                                onClick={addImageField}
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                            >
                                + Add
                            </button>
                        </div>
                        <div className="divide-y divide-gray-200">
                            {(variant.images || []).map((img, imgIndex) => (
                                <div key={imgIndex} className="grid grid-cols-12 gap-4 items-center py-4 px-4">
                                    <div className="col-span-5">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="block w-full text-sm text-gray-500
                                                file:mr-4 file:py-2 file:px-4
                                                file:rounded-full file:border-0
                                                file:text-sm file:font-semibold
                                                file:bg-blue-50 file:text-blue-700
                                                hover:file:bg-blue-100"
                                            onChange={(e) => handleImageChange(imgIndex, e)}
                                            required={imgIndex === 0}
                                        />
                                        {error["images"] && imgIndex === 0 && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {error["images"]}
                                            </p>
                                        )}
                                    </div>
                                    <div className="col-span-5">
                                        <img
                                            className="w-20 h-20 object-cover rounded border border-gray-200"
                                            alt={`Preview ${imgIndex + 1}`}
                                            src={
                                                variant.images?.[imgIndex]?.startsWith("http") ||
                                                    variant.images?.[imgIndex]?.startsWith("blob:") ||
                                                    variant.images?.[imgIndex]?.startsWith("data:")
                                                    ? variant.images?.[imgIndex]
                                                    : `/uploads/products/${variant.images?.[imgIndex] || "no-image.jpg"}`
                                            }
                                        />
                                    </div>
                                    <div className="col-span-2 flex justify-end">
                                        <button
                                            type="button"
                                            onClick={() => removeImage(imgIndex)}
                                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}

                        </div>
                    </div>

                    {/* Item Code */}
                    <div>
                        <label className="text-sm font-medium">Item Code {'(optional)'}</label>
                        <input
                            type="text"
                            value={variant.item_code ?? ""}
                            onChange={(e) => handleChange("item_code", e.target.value)}
                            className="w-full border p-2 rounded-lg"
                            placeholder="ex: HERO-RED-BLK-275"
                        />
                    </div>

                    {/* Price + Quantity */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                            <label className="text-sm font-medium">Price</label>
                            <input
                                type="number"
                                value={variant.price ?? ''}
                                onChange={(e) => {
                                    handleChange("price", e.target.value)
                                    // errors("price");
                                }}
                                className="w-full border p-2 rounded-lg"
                            />
                            {error["price"] && (
                                <p className="text-red-500 text-xs mt-1">
                                    {error["price"]}
                                </p>
                            )
                            }
                        </div>
                        <div>
                            <label className="text-sm font-medium">Special Price</label>
                            <input
                                type="number"
                                value={variant.special_price ?? ''}
                                onChange={(e) => {
                                    handleChange("special_price", e.target.value)
                                    // errors("special_price");
                                }}
                                className="w-full border p-2 rounded-lg"
                            />
                            {error["special_price"] && (
                                <p className="text-red-500 text-xs mt-1">
                                    {error["special_price"]}
                                </p>
                            )
                            }
                        </div>
                        <div>
                            <label className="text-sm font-medium">Quantity</label>
                            <input
                                type="number"
                                value={variant.quantity ?? ''}
                                onChange={(e) => {
                                    handleChange("quantity", e.target.value)
                                    // errors("quantity");
                                }}
                                className="w-full border p-2 rounded-lg"
                            />
                            {error["quantity"] && (
                                <p className="text-red-500 text-xs mt-1">
                                    {error["quantity"]}
                                </p>
                            )
                            }
                        </div>
                    </div>

                    {/* Stock + Status */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <label className="text-sm font-medium">Stock Status</label>
                            <select
                                value={variant.stock_status ?? 'In Stock'}
                                onChange={(e) => handleChange("stock_status", e.target.value)}
                                className="w-full border p-2 rounded-lg"
                            >
                                <option value="In Stock">In Stock</option>
                                <option value="Out of Stock">Out of Stock</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium">Status</label>
                            <select
                                value={variant.status ?? 'Active'}
                                onChange={(e) => handleChange("status", e.target.value)}
                                className="w-full border p-2 rounded-lg"
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300"
                    >
                        Close
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            errors() && toast.error(`Please fill important fields before submitting`);
                            if (errors()) return;

                            const finalVariant = buildFinalVariant();
                            onSubmit(finalVariant);
                            onClose();
                        }}
                        className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
}
