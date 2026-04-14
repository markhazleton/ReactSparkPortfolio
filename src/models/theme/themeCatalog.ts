import { z } from "zod";

/**
 * Theme source classification for supported themes.
 */
export const ThemeSourceSchema = z.enum(["first-party", "bootswatch"]);

/**
 * Supported theme color-mode hints used for shell rendering.
 */
export const ThemeColorModeHintSchema = z.enum(["light", "dark", "mixed"]);

/**
 * Runtime validation schema for one supported theme option.
 */
export const ThemeOptionSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  source: ThemeSourceSchema,
  isDefault: z.boolean(),
  isSupported: z.boolean(),
  stylesheetHref: z.string().min(1),
  previewUrl: z.string().url().optional(),
  thumbnailUrl: z.string().url().optional(),
  colorModeHint: ThemeColorModeHintSchema,
  order: z.number().int().nonnegative(),
});

/**
 * Runtime validation schema for the supported theme catalog.
 */
export const ThemeCatalogSchema = z
  .object({
    version: z.string().min(1),
    generatedFrom: z.string().optional(),
    themes: z.array(ThemeOptionSchema).min(1),
  })
  .superRefine((value, context) => {
    const defaultThemes = value.themes.filter((theme) => theme.isDefault);
    const themeIds = value.themes.map((theme) => theme.id);
    const uniqueThemeIds = new Set(themeIds);

    if (defaultThemes.length !== 1) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Exactly one supported theme must be marked as default.",
      });
    }

    if (uniqueThemeIds.size !== themeIds.length) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Supported theme IDs must be unique.",
      });
    }
  });

/**
 * Runtime validation schema for a stored theme preference.
 */
export const ThemePreferenceSchema = z.object({
  themeId: z.string().min(1),
  savedAt: z.string().datetime().optional(),
  catalogVersion: z.string().optional(),
});

export type ThemeOption = z.infer<typeof ThemeOptionSchema>;
export type ThemeCatalog = z.infer<typeof ThemeCatalogSchema>;
export type ThemePreference = z.infer<typeof ThemePreferenceSchema>;
export type ThemeLoadStatus = "idle" | "loading" | "ready" | "fallback" | "error";

/**
 * Runtime state returned by the theme application service.
 */
export interface ThemeApplicationResult {
  activeTheme: ThemeOption;
  latencyMs: number;
  rolledBack: boolean;
  message?: string;
}

export const DEFAULT_THEME_ID = "bootstrapspark";
export const THEME_STORAGE_KEY = "bootstrapspark.themePreference";
export const THEME_STYLESHEET_ID = "bootstrapspark-runtime-theme";
