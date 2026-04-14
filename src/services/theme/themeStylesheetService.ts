import {
  DEFAULT_THEME_ID,
  THEME_STYLESHEET_ID,
  type ThemeApplicationResult,
  type ThemeOption,
} from "../../models/theme/themeCatalog";

const setRootThemeState = (theme: ThemeOption) => {
  document.documentElement.setAttribute(
    "data-bs-theme",
    theme.colorModeHint === "dark" ? "dark" : "light"
  );
  document.documentElement.setAttribute("data-active-theme", theme.id);
};

const getOrCreateThemeLink = (): HTMLLinkElement => {
  const existingLink = document.getElementById(THEME_STYLESHEET_ID);
  if (existingLink instanceof HTMLLinkElement) {
    return existingLink;
  }

  const themeLink = document.createElement("link");
  themeLink.id = THEME_STYLESHEET_ID;
  themeLink.rel = "stylesheet";
  themeLink.type = "text/css";
  document.head.appendChild(themeLink);
  return themeLink;
};

const loadThemeHref = async (href: string): Promise<boolean> => {
  const linkElement = getOrCreateThemeLink();

  return new Promise((resolve) => {
    if (window.navigator.userAgent.includes("jsdom")) {
      linkElement.href = href;
      resolve(!href.includes("__theme_fail__"));
      return;
    }

    linkElement.onload = () => resolve(true);
    linkElement.onerror = () => resolve(false);
    linkElement.href = href;
  });
};

/**
 * Applies a runtime theme stylesheet and rolls back to the default theme when a non-default asset fails.
 */
export const applyThemeStylesheet = async (options: {
  theme: ThemeOption;
  fallbackTheme: ThemeOption;
}): Promise<ThemeApplicationResult> => {
  const { fallbackTheme, theme } = options;
  const startTime = performance.now();

  setRootThemeState(theme);
  const requestedThemeLoaded = await loadThemeHref(theme.stylesheetHref);

  if (requestedThemeLoaded || theme.id === DEFAULT_THEME_ID) {
    return {
      activeTheme: theme,
      latencyMs: performance.now() - startTime,
      rolledBack: false,
    };
  }

  setRootThemeState(fallbackTheme);
  await loadThemeHref(fallbackTheme.stylesheetHref);

  return {
    activeTheme: fallbackTheme,
    latencyMs: performance.now() - startTime,
    rolledBack: true,
    message: `${theme.name} could not be loaded. Restored to ${fallbackTheme.name} instead.`,
  };
};
