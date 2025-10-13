// Version management utility
declare const __BUILD_DATE__: string;

// Check if we're in development mode
const isDevelopment = import.meta.env.DEV;

export const APP_VERSION = isDevelopment
  ? `dev-${Date.now()}`
  : typeof __BUILD_DATE__ !== "undefined"
  ? __BUILD_DATE__
  : `prod-${Date.now()}`;

export class VersionManager {
  private static readonly VERSION_KEY = "app_version";
  private static readonly LAST_CHECK_KEY = "last_version_check";
  private static readonly CHECK_INTERVAL = isDevelopment
    ? 30 * 1000
    : 5 * 60 * 1000; // 30 seconds in dev, 5 minutes in prod

  static getCurrentVersion(): string {
    return APP_VERSION;
  }

  static getStoredVersion(): string | null {
    return localStorage.getItem(this.VERSION_KEY);
  }

  static setStoredVersion(version: string): void {
    localStorage.setItem(this.VERSION_KEY, version);
  }

  static shouldCheckForUpdates(): boolean {
    const lastCheck = localStorage.getItem(this.LAST_CHECK_KEY);
    if (!lastCheck) return true;

    const timeSinceLastCheck = Date.now() - parseInt(lastCheck, 10);
    return timeSinceLastCheck > this.CHECK_INTERVAL;
  }

  static markVersionChecked(): void {
    localStorage.setItem(this.LAST_CHECK_KEY, Date.now().toString());
  }

  static hasNewVersion(): boolean {
    const storedVersion = this.getStoredVersion();
    const currentVersion = this.getCurrentVersion();

    if (!storedVersion) {
      this.setStoredVersion(currentVersion);
      return false;
    }

    return storedVersion !== currentVersion;
  }

  static async checkForUpdates(): Promise<boolean> {
    if (!this.shouldCheckForUpdates()) {
      return this.hasNewVersion();
    }

    try {
      // Try to fetch a fresh version from the server
      const response = await fetch("/index.html", {
        method: "HEAD",
        cache: "no-cache",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
        },
      });

      this.markVersionChecked();

      if (response.ok) {
        // Check if we have a new version
        return this.hasNewVersion();
      }
    } catch (error) {
      console.warn("Failed to check for app updates:", error);
    }

    return false;
  }

  static promptForUpdate(): boolean {
    const message = `A new version of the application is available. Would you like to refresh to get the latest updates?`;
    return window.confirm(message);
  }

  static forceRefresh(): void {
    // Clear all caches and reload
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => registration.unregister());
      });
    }

    // Clear localStorage version info and projects cache
    localStorage.removeItem(this.VERSION_KEY);
    localStorage.removeItem(this.LAST_CHECK_KEY);

    // Clear projects cache to force fresh image loading
    localStorage.removeItem("cachedProjectsData");
    localStorage.removeItem("projectsLastUpdated");
    localStorage.removeItem("projectsCount");
    localStorage.removeItem("projectsSource");

    // Force hard reload
    window.location.reload();
  }

  static updateVersion(): void {
    this.setStoredVersion(this.getCurrentVersion());
  }
}
