// utils/getUrlParams.js

export function getUrlParams() {
  // Check if running on server (Next.js SSR)
  if (typeof window === "undefined") return {};

  const params = new URLSearchParams(window.location.search);

  return {
    utm_source: params.get("utm_source") || "franchise-opportunities",
    utm_medium: params.get("utm_medium") || "franchise-opportunities",
    utm_campaign: params.get("utm_campaign") || "franchise-opportunities",
  };
}
