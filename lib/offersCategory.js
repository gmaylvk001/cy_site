export function isOffersCategory(categoryOrSlug) {
  if (!categoryOrSlug) return false;

  if (typeof categoryOrSlug === "string") {
    return /^offers$/i.test(categoryOrSlug.trim());
  }

  const slug = String(categoryOrSlug.category_slug || "").trim();
  const name = String(categoryOrSlug.category_name || "").trim();
  return /^offers$/i.test(slug) || /^offers$/i.test(name);
}
