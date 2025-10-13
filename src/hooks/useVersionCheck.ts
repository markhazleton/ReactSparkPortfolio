import { useEffect, useState } from "react";
import { VersionManager } from "../utils/version";

export const useVersionCheck = (enabled: boolean = true) => {
  const [hasUpdate, setHasUpdate] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  // In development mode, disable version checking by default
  const isDevelopment = import.meta.env.DEV;
  const shouldEnable = enabled && !isDevelopment;

  useEffect(() => {
    if (!shouldEnable) return;

    const checkVersion = async () => {
      setIsChecking(true);
      try {
        const updateAvailable = await VersionManager.checkForUpdates();
        setHasUpdate(updateAvailable);
      } catch (error) {
        console.warn("Version check failed:", error);
      } finally {
        setIsChecking(false);
      }
    };

    // Check immediately
    checkVersion();

    // Set up periodic checking (more frequent in dev if enabled)
    const interval = setInterval(
      checkVersion,
      isDevelopment ? 30 * 1000 : 5 * 60 * 1000
    );

    return () => clearInterval(interval);
  }, [shouldEnable, isDevelopment]);

  const handleUpdate = () => {
    if (VersionManager.promptForUpdate()) {
      VersionManager.forceRefresh();
    }
  };

  const dismissUpdate = () => {
    VersionManager.updateVersion();
    setHasUpdate(false);
  };

  return {
    hasUpdate,
    isChecking,
    handleUpdate,
    dismissUpdate,
  };
};
