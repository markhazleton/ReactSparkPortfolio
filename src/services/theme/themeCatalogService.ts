import { z } from "zod";
import {
  ThemeCatalogSchema,
  ThemePreferenceSchema,
  type ThemeCatalog,
  type ThemeOption,
} from "../../models/theme/themeCatalog";
import { SUPPORTED_THEME_CATALOG } from "../../data/theme-catalog/supportedThemes";

const BootswatchThemeMetadataSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1).optional(),
  preview: z.string().url().optional(),
  thumbnail: z.string().url().optional(),
});

const BootswatchCatalogResponseSchema = z.object({
  themes: z.array(BootswatchThemeMetadataSchema),
});

/**
 * Returns the default supported theme from a validated catalog.
 */
export const getDefaultTheme = (catalog: ThemeCatalog): ThemeOption => {
  return catalog.themes.find((theme) => theme.isDefault) ?? catalog.themes[0];
};

/**
 * Returns a theme by identifier when it is part of the supported catalog.
 */
export const getThemeById = (catalog: ThemeCatalog, themeId: string): ThemeOption | undefined => {
  return catalog.themes.find((theme) => theme.id === themeId && theme.isSupported);
};

/**
 * Resolves the active theme preference against the validated supported catalog.
 */
export const resolvePreferredTheme = (
  catalog: ThemeCatalog,
  preferredThemeId?: string
): ThemeOption => {
  if (!preferredThemeId) {
    return getDefaultTheme(catalog);
  }

  return getThemeById(catalog, preferredThemeId) ?? getDefaultTheme(catalog);
};

const mergeBootswatchMetadata = (
  catalog: ThemeCatalog,
  remoteThemes: z.infer<typeof BootswatchThemeMetadataSchema>[]
): ThemeCatalog => {
  const remoteThemeMap = new Map(
    remoteThemes.map((theme) => [theme.name.trim().toLowerCase(), theme])
  );

  return {
    ...catalog,
    generatedFrom: "local curated catalog + optional Bootswatch metadata",
    themes: catalog.themes.map((theme) => {
      if (theme.source !== "bootswatch") {
        return theme;
      }

      const remoteTheme = remoteThemeMap.get(theme.name.trim().toLowerCase());
      if (!remoteTheme) {
        return theme;
      }

      return {
        ...theme,
        description: remoteTheme.description ?? theme.description,
        previewUrl: remoteTheme.preview ?? theme.previewUrl,
        thumbnailUrl: remoteTheme.thumbnail ?? theme.thumbnailUrl,
      };
    }),
  };
};

const fetchRemoteBootswatchMetadata = async (
  fetchImpl: typeof fetch
): Promise<z.infer<typeof BootswatchThemeMetadataSchema>[]> => {
  const abortController = new AbortController();
  const timeoutId = window.setTimeout(() => abortController.abort(), 1500);

  try {
    const response = await fetchImpl("https://bootswatch.com/api/5.json", {
      signal: abortController.signal,
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Theme metadata request failed with status ${response.status}.`);
    }

    const jsonResponse = await response.json();
    return BootswatchCatalogResponseSchema.parse(jsonResponse).themes;
  } finally {
    window.clearTimeout(timeoutId);
  }
};

/**
 * Loads the supported theme catalog and optionally enriches it with Bootswatch metadata.
 */
export const loadThemeCatalog = async (options?: {
  attemptRemoteMetadata?: boolean;
  fetchImpl?: typeof fetch;
}): Promise<ThemeCatalog> => {
  const validatedLocalCatalog = ThemeCatalogSchema.parse(SUPPORTED_THEME_CATALOG);

  if (!options?.attemptRemoteMetadata) {
    return validatedLocalCatalog;
  }

  try {
    const remoteThemes = await fetchRemoteBootswatchMetadata(options.fetchImpl ?? fetch);
    return ThemeCatalogSchema.parse(mergeBootswatchMetadata(validatedLocalCatalog, remoteThemes));
  } catch {
    return validatedLocalCatalog;
  }
};

/**
 * Validates an unknown stored preference payload and returns a safe theme identifier when possible.
 */
export const parseStoredPreference = (value: unknown): string | undefined => {
  const parsedPreference = ThemePreferenceSchema.safeParse(value);
  return parsedPreference.success ? parsedPreference.data.themeId : undefined;
};

export { ThemePreferenceSchema };
