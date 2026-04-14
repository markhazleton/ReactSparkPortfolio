import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  ReactNode,
} from "react";
import {
  DEFAULT_THEME_ID,
  type ThemeCatalog,
  type ThemeLoadStatus,
  type ThemeOption,
} from "../models/theme/themeCatalog";
import { SUPPORTED_THEME_CATALOG } from "../data/theme-catalog/supportedThemes";
import {
  getDefaultTheme,
  getThemeById,
  loadThemeCatalog,
  resolvePreferredTheme,
} from "../services/theme/themeCatalogService";
import { applyThemeStylesheet } from "../services/theme/themeStylesheetService";
import { readStoredThemePreference, writeStoredThemePreference } from "../utils/themePreference";

interface ThemeContextType {
  activeTheme: ThemeOption;
  catalog: ThemeCatalog;
  currentColorMode: "light" | "dark";
  theme: "light" | "dark";
  status: ThemeLoadStatus;
  errorMessage?: string;
  selectTheme: (themeId: string) => Promise<void>;
  isThemeActive: (themeId: string) => boolean;
}

const defaultTheme = getDefaultTheme(SUPPORTED_THEME_CATALOG);

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Provides the catalog-backed runtime theme state for the application.
 */
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [catalog, setCatalog] = useState<ThemeCatalog>(SUPPORTED_THEME_CATALOG);
  const [activeTheme, setActiveTheme] = useState<ThemeOption>(defaultTheme);
  const [status, setStatus] = useState<ThemeLoadStatus>("loading");
  const [errorMessage, setErrorMessage] = useState<string>();
  const catalogRef = useRef<ThemeCatalog>(SUPPORTED_THEME_CATALOG);

  useEffect(() => {
    catalogRef.current = catalog;
  }, [catalog]);

  const applyThemeById = useCallback(async (themeId: string, nextCatalog?: ThemeCatalog) => {
    const resolvedCatalog = nextCatalog ?? catalogRef.current;
    const fallbackTheme = getDefaultTheme(resolvedCatalog);
    const requestedTheme = getThemeById(resolvedCatalog, themeId) ?? fallbackTheme;

    setStatus("loading");
    const applicationResult = await applyThemeStylesheet({
      theme: requestedTheme,
      fallbackTheme,
    });

    const nextStatus: ThemeLoadStatus = applicationResult.rolledBack ? "fallback" : "ready";

    setCatalog(resolvedCatalog);
    setActiveTheme(applicationResult.activeTheme);
    setErrorMessage(applicationResult.message);
    setStatus(nextStatus);
    writeStoredThemePreference(applicationResult.activeTheme.id, resolvedCatalog.version);
  }, []);

  useEffect(() => {
    let isCancelled = false;

    const initializeTheme = async () => {
      try {
        const nextCatalog = await loadThemeCatalog();
        if (isCancelled) {
          return;
        }

        const storedPreference = readStoredThemePreference();
        const preferredTheme = resolvePreferredTheme(nextCatalog, storedPreference?.themeId);

        await applyThemeById(preferredTheme.id, nextCatalog);
      } catch (error) {
        if (isCancelled) {
          return;
        }

        setCatalog(SUPPORTED_THEME_CATALOG);
        setActiveTheme(defaultTheme);
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "BootstrapSpark could not load the selected theme."
        );
        setStatus("error");
        writeStoredThemePreference(DEFAULT_THEME_ID, SUPPORTED_THEME_CATALOG.version);
      }
    };

    void initializeTheme();

    return () => {
      isCancelled = true;
    };
  }, [applyThemeById]);

  const contextValue = useMemo<ThemeContextType>(
    () => ({
      activeTheme,
      catalog,
      currentColorMode: activeTheme.colorModeHint === "dark" ? "dark" : "light",
      theme: activeTheme.colorModeHint === "dark" ? "dark" : "light",
      status,
      errorMessage,
      selectTheme: async (themeId: string) => applyThemeById(themeId),
      isThemeActive: (themeId: string) => activeTheme.id === themeId,
    }),
    [activeTheme, applyThemeById, catalog, errorMessage, status]
  );

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
};

/**
 * Returns the active theme context for descendant components.
 */
// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
