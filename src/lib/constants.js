/**
 * Application-wide constants.
 *
 * STRAPI_URL is read from the environment so that local dev, staging,
 * and production can each point to a different backend without editing
 * source files.  Fall back to the Render deployment for convenience.
 *
 * NEVER put secrets (API keys, admin tokens) in VITE_* variables.
 * Anything prefixed VITE_ is inlined into the client bundle and is
 * visible to every user who opens DevTools.
 */
export const STRAPI_URL =
  import.meta.env.VITE_STRAPI_URL ||
  "https://campuskatale-fwih.onrender.com";

/**
 * Currency display helpers.
 * Prices in Strapi are stored in UGX (Ugandan Shilling).
 */
export const CURRENCY = "UGX";

/** Format a number as a UGX price string, e.g. "UGX 25,000" */
export const formatPrice = (amount) =>
  `${CURRENCY} ${Number(amount || 0).toLocaleString("en-UG")}`;

/** Compact price format for badges, e.g. "25K" */
export const formatPriceCompact = (amount) => {
  const n = Number(amount || 0);
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
};

/**
 * Generate a URL-safe slug from a title string.
 * e.g. "Engineering Maths 2024" → "engineering-maths-2024"
 */
export const generateSlug = (title = "") =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .trim()
    .replace(/\s+/g, "-");
