/**
 * Selling price priority: offer_price → special_price → price
 * When admin removes the offer (offer_price cleared), special_price is used again.
 */

export function getSellingPrice(item = {}) {
  const offer = Number(item?.offer_price);
  if (Number.isFinite(offer) && offer > 0) return offer;

  const special = Number(item?.special_price);
  if (Number.isFinite(special) && special > 0) return special;

  return Number(item?.price) || 0;
}

export function hasOfferPrice(item = {}) {
  const offer = Number(item?.offer_price);
  return Number.isFinite(offer) && offer > 0;
}

export function getCompareAtPrice(item = {}) {
  return Number(item?.price) || 0;
}

export function shouldShowStrikeThrough(item = {}) {
  const selling = getSellingPrice(item);
  const mrp = getCompareAtPrice(item);
  return mrp > 0 && selling > 0 && selling < mrp;
}

export function getDiscountPercent(item = {}) {
  const selling = getSellingPrice(item);
  const mrp = getCompareAtPrice(item);
  if (!mrp || !selling || selling >= mrp) return 0;
  return Math.round(100 - (selling / mrp) * 100);
}

export function calcOfferPriceFromBase(basePrice, percentage) {
  const base = Number(basePrice) || 0;
  const pct = Number(percentage);
  if (!base || Number.isNaN(pct)) return 0;
  return Math.max(0, Math.round(base - (base * pct) / 100));
}

/** Base used to compute admin % offer: special_price if set, else MRP */
export function getOfferBasePrice(item = {}) {
  const special = Number(item?.special_price);
  if (Number.isFinite(special) && special > 0) return special;
  return Number(item?.price) || 0;
}
