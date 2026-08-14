"use client";

import {
  getDiscountPercent,
  getSellingPrice,
  shouldShowStrikeThrough,
} from "@/lib/pricing";

/**
 * Shared storefront price display: offer_price → special_price → price
 */
export default function ProductPrice({
  product,
  className = "",
  priceClassName = "text-lg font-bold",
  mrpClassName = "text-sm text-gray-400 line-through",
  offerClassName = "text-sm text-[#a3ca43] font-semibold",
  showPercent = true,
  prefix = "₹ ",
}) {
  if (!product) return null;

  const selling = getSellingPrice(product);
  const mrp = Number(product.price) || 0;
  const showStrike = shouldShowStrikeThrough(product);
  const percent = getDiscountPercent(product);

  return (
    <div className={`flex gap-2 items-center flex-wrap ${className}`}>
      <span className={priceClassName}>
        {prefix}
        {Number(selling).toLocaleString("en-IN")}
      </span>
      {showStrike && (
        <>
          <span className={mrpClassName}>
            {prefix}
            {mrp.toLocaleString("en-IN")}
          </span>
          {showPercent && percent > 0 && (
            <span className={offerClassName}>{percent}% OFF</span>
          )}
        </>
      )}
    </div>
  );
}
