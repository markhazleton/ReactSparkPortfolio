/**
 * Utility to clear all service workers
 * Run this once to remove any cached service workers causing CSP issues
 */

export const clearAllServiceWorkers = async (): Promise<void> => {
  if ("serviceWorker" in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      console.log(`Found ${registrations.length} service worker(s) to unregister`);

      for (const registration of registrations) {
        const result = await registration.unregister();
        console.log("Service worker unregistered:", result);
      }

      console.log("All service workers cleared successfully");
    } catch (error) {
      console.error("Error clearing service workers:", error);
    }
  } else {
    console.log("Service workers not supported in this browser");
  }
};

// Auto-run in development to prevent CSP issues
if (import.meta.env.DEV) {
  clearAllServiceWorkers().then(() => {
    console.log("Development mode: Service workers cleared");
  });
}
