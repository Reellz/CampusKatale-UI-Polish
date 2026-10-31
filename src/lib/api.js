/**
 * Thin Strapi REST API client.
 *
 * Centralises:
 *   - Base URL (reads VITE_STRAPI_URL env var, falls back to Render deployment)
 *   - Common headers
 *   - HTTP error handling
 *   - (Future) Clerk JWT injection for authenticated requests
 *
 * Usage:
 *   import { strapiGet, strapiPost, strapiPut, strapiDelete } from '@/lib/api';
 *   const data = await strapiGet('/products?populate=*');
 */

import { STRAPI_URL } from "./constants";

/** Build full Strapi API URL from a path starting with /api/... */
const url = (path) => `${STRAPI_URL}${path}`;

/**
 * Shared fetch wrapper.
 * @param {string} path - API path, e.g. "/api/products?populate=*"
 * @param {RequestInit} options - fetch options
 * @returns {Promise<any>} Parsed JSON response
 * @throws {Error} With a message from the API or a generic description
 */
async function strapiRequest(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Remove Content-Type for FormData requests (multipart/form-data needs boundary)
  if (options.body instanceof FormData) {
    delete headers["Content-Type"];
  }

  const response = await fetch(url(path), { ...options, headers });

  if (!response.ok) {
    let message = `Strapi ${options.method || "GET"} ${path} failed: ${response.status} ${response.statusText}`;
    try {
      const errorBody = await response.json();
      if (errorBody?.error?.message) message = errorBody.error.message;
    } catch {
      // ignore parse error — use status text
    }
    throw new Error(message);
  }

  // 204 No Content (e.g. DELETE success)
  if (response.status === 204) return null;

  return response.json();
}

/** GET request */
export const strapiGet = (path) => strapiRequest(path);

/** POST request with JSON body */
export const strapiPost = (path, data) =>
  strapiRequest(path, { method: "POST", body: JSON.stringify(data) });

/** POST request with FormData (file uploads) */
export const strapiUpload = (path, formData) =>
  strapiRequest(path, { method: "POST", body: formData });

/** PUT request with JSON body */
export const strapiPut = (path, data) =>
  strapiRequest(path, { method: "PUT", body: JSON.stringify(data) });

/** DELETE request */
export const strapiDelete = (path) =>
  strapiRequest(path, { method: "DELETE" });
