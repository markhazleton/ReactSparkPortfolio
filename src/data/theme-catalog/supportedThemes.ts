import type { ThemeCatalog, ThemeOption } from "../../models/theme/themeCatalog";

const BOOTSWATCH_DARK_THEMES = new Set([
  "cyborg",
  "darkly",
  "slate",
  "solar",
  "superhero",
  "vapor",
]);

export const BOOTSWATCH_THEME_IDS = [
  "brite",
  "cerulean",
  "cosmo",
  "cyborg",
  "darkly",
  "flatly",
  "journal",
  "litera",
  "lumen",
  "lux",
  "materia",
  "minty",
  "morph",
  "pulse",
  "quartz",
  "sandstone",
  "simplex",
  "sketchy",
  "slate",
  "solar",
  "spacelab",
  "superhero",
  "united",
  "vapor",
  "yeti",
  "zephyr",
] as const;

const toDisplayName = (themeId: string) => `${themeId.charAt(0).toUpperCase()}${themeId.slice(1)}`;

const createBootswatchTheme = (
  themeId: (typeof BOOTSWATCH_THEME_IDS)[number],
  order: number
): ThemeOption => ({
  id: themeId,
  name: toDisplayName(themeId),
  description: `${toDisplayName(themeId)} is available as a full Bootswatch theme option for BootstrapSpark.`,
  source: "bootswatch",
  isDefault: false,
  isSupported: true,
  stylesheetHref: `/themes/${themeId}/bootstrap.min.css`,
  previewUrl: `https://bootswatch.com/${themeId}/`,
  thumbnailUrl: `https://bootswatch.com/5/${themeId}/thumbnail.png`,
  colorModeHint: BOOTSWATCH_DARK_THEMES.has(themeId) ? "dark" : "light",
  order,
});

/**
 * Product-owned source-of-truth catalog for supported runtime themes.
 */
export const SUPPORTED_THEME_CATALOG: ThemeCatalog = {
  version: "2026-04-13",
  generatedFrom: "local BootstrapSpark + full Bootswatch catalog",
  themes: [
    {
      id: "bootstrapspark",
      name: "BootstrapSpark",
      description:
        "The maintained first-party theme with warm accent colors and the portfolio's default visual identity.",
      source: "first-party",
      isDefault: true,
      isSupported: true,
      stylesheetHref: "/themes/bootstrapspark.css",
      colorModeHint: "light",
      order: 0,
    },
    ...BOOTSWATCH_THEME_IDS.map((themeId, index) => createBootswatchTheme(themeId, index + 1)),
  ],
};
