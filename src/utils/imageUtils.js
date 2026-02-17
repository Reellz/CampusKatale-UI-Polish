// Utility function to add cache-busting parameter to image URLs
export const getImageUrl = (imageUrl) => {
  if (!imageUrl) return imageUrl;
  
  // Convert to string if it's not already
  const urlString = String(imageUrl);
  
  // If it's a local asset (starts with /, ./ or ../, or is a data URL, or contains the build path)
  // Add cache-busting to force refresh
  if (urlString.startsWith('/') || urlString.startsWith('./') || urlString.startsWith('../') || urlString.startsWith('data:') || urlString.includes('/src/') || urlString.includes('/assets/')) {
    const separator = urlString.includes('?') ? '&' : '?';
    const timestamp = Date.now();
    return `${urlString}${separator}_t=${timestamp}`;
  }
  
  // For external URLs (http/https), add cache-busting parameter
  if (urlString.startsWith('http://') || urlString.startsWith('https://')) {
    const separator = urlString.includes('?') ? '&' : '?';
    const timestamp = Date.now();
    return `${urlString}${separator}_t=${timestamp}`;
  }
  
  // For any other case, add cache-busting
  const separator = urlString.includes('?') ? '&' : '?';
  const timestamp = Date.now();
  return `${urlString}${separator}_t=${timestamp}`;
};
