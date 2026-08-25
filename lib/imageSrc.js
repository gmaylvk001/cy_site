/**
 * Convert a stored category/product image value into a same-origin public path.
 * Handles relative paths and absolute URLs like http://localhost:3000/uploads/...
 */
export function toPublicImageSrc(src, fallback = "") {
  if (!src || typeof src !== "string") return fallback;

  const trimmed = src.trim();
  if (!trimmed || trimmed === "null" || trimmed === "undefined") {
    return fallback;
  }

  if (trimmed.startsWith("blob:") || trimmed.startsWith("data:")) {
    return trimmed;
  }

  try {
    if (/^https?:\/\//i.test(trimmed)) {
      const { pathname, search } = new URL(trimmed);
      return `${pathname}${search}` || fallback;
    }
  } catch {
    // Invalid URL — fall through and treat as a path
  }

  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}
