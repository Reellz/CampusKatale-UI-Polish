/**
 * Image URL helpers.
 *
 * The previous implementation appended `?_t=Date.now()` to every image URL
 * on every render.  This defeated the browser cache entirely — every image
 * re-fetched on every re-render.  Static assets built by Vite already have
 * content-hashed filenames and do not need cache-busting.  External URLs
 * (Strapi, Unsplash) should be cached by the browser normally.
 *
 * This module now provides a safe pass-through that normalises null/undefined
 * to a placeholder and prepends the Strapi base URL to relative Strapi paths.
 */

import { STRAPI_URL } from "../lib/constants";

/**
 * Resolve an image URL safely.
 *
 * - Returns a placeholder if the URL is empty/null.
 * - Prepends STRAPI_URL to relative paths (Strapi v4 returns relative paths
 *   like /uploads/image.jpg for locally stored files).
 * - Returns external URLs (http/https) unchanged.
 * - Returns Vite asset imports (already resolved to absolute paths) unchanged.
 *
 * @param {string|null|undefined} imageUrl
 * @returns {string}
 */
export const getImageUrl = (imageUrl) => {
  if (!imageUrl) return "/placeholder-product.png";

  const str = String(imageUrl);

  // Strapi relative upload paths — prepend base URL
  if (str.startsWith("/uploads/")) {
    return `${STRAPI_URL}${str}`;
  }

  // Already an absolute URL or a Vite-resolved local asset path
  return str;
};
