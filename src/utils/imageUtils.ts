/**
 * Image utility functions for cache busting and optimization
 */

// Check if we're in development mode
const isDevelopment = import.meta.env.DEV;

/**
 * Adds cache busting parameters to image URLs in development mode
 * @param imageUrl The original image URL
 * @returns Image URL with cache busting parameter if in development
 */
export const addCacheBuster = (imageUrl: string): string => {
  if (!isDevelopment || !imageUrl) {
    return imageUrl;
  }

  // Don't add cache buster to data URLs or already parameterized URLs
  if (imageUrl.startsWith("data:") || imageUrl.includes("?v=")) {
    return imageUrl;
  }

  // Add timestamp as cache buster for development
  const separator = imageUrl.includes("?") ? "&" : "?";
  return `${imageUrl}${separator}v=${Date.now()}`;
};

/**
 * Preloads an image to warm the cache
 * @param imageUrl The image URL to preload
 */
export const preloadImage = (imageUrl: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to load image: ${imageUrl}`));
    img.src = imageUrl;
  });
};

/**
 * Forces image refresh by appending a new cache buster
 * @param imageUrl The original image URL
 * @returns Image URL with fresh cache buster
 */
export const forceImageRefresh = (imageUrl: string): string => {
  if (!imageUrl) return imageUrl;

  // Remove existing cache buster if present
  const cleanUrl = imageUrl.split("?")[0];

  // Add fresh cache buster
  return `${cleanUrl}?v=${Date.now()}`;
};

/**
 * Development helper: Clear all localStorage caches and force page reload
 * This function is available globally in development mode
 */
export const clearAllCaches = (): void => {
  if (!isDevelopment) {
    console.warn("Cache clearing is only available in development mode");
    return;
  }

  // Clear all relevant caches
  localStorage.clear();

  // Clear service worker caches if available
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => registration.unregister());
    });
  }

  // Clear browser cache programmatically if possible
  if ("caches" in window) {
    caches.keys().then((names) => {
      names.forEach((name) => {
        caches.delete(name);
      });
    });
  }

  console.log("All caches cleared. Page will reload...");
  window.location.reload();
};

// Make cache clearing available globally in development
if (isDevelopment) {
  (
    globalThis as typeof globalThis & { clearAllCaches: () => void }
  ).clearAllCaches = clearAllCaches;
  console.log(
    "Development mode: Use clearAllCaches() in console to clear all caches"
  );
}
