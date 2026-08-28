/**
 * Read guest cart id from request headers (case-insensitive).
 */
export function getGuestCartIdFromRequest(req) {
  if (!req?.headers?.get) return null;

  return (
    req.headers.get("guestcartid") ||
    req.headers.get("x-guest-cart-id") ||
    null
  );
}
