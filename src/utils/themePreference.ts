import { THEME_STORAGE_KEY, type ThemePreference } from "../models/theme/themeCatalog";
import {
  parseStoredPreference,
  ThemePreferenceSchema,
} from "../services/theme/themeCatalogService";

/**
 * Returns the stored theme preference when a valid value is present in localStorage.
 */
export const readStoredThemePreference = (): ThemePreference | undefined => {
  const storedValue = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (!storedValue) {
    return undefined;
  }

  try {
    const parsedJson = JSON.parse(storedValue) as unknown;
    const themeId = parseStoredPreference(parsedJson);
    if (!themeId) {
      return undefined;
    }

    return ThemePreferenceSchema.parse(parsedJson);
  } catch {
    return undefined;
  }
};

/**
 * Persists the active theme preference for future visits.
 */
export const writeStoredThemePreference = (themeId: string, catalogVersion: string): void => {
  const nextPreference: ThemePreference = {
    themeId,
    catalogVersion,
    savedAt: new Date().toISOString(),
  };

  window.localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(nextPreference));
};

/**
 * Removes the stored theme preference from localStorage.
 */
export const clearStoredThemePreference = (): void => {
  window.localStorage.removeItem(THEME_STORAGE_KEY);
};
