import { screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useTheme } from "@/contexts/ThemeContext";
import { SUPPORTED_THEME_CATALOG } from "@/data/theme-catalog/supportedThemes";
import * as themeCatalogService from "@/services/theme/themeCatalogService";
import { renderWithThemeProviders } from "./renderWithThemeProviders";

const ThemeInitializationHarness: React.FC = () => {
  const { activeTheme } = useTheme();

  return <p>Active: {activeTheme.name}</p>;
};

describe("theme catalog initialization", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("attempts remote Bootswatch metadata enrichment during app initialization", async () => {
    const loadThemeCatalogSpy = vi
      .spyOn(themeCatalogService, "loadThemeCatalog")
      .mockResolvedValue(SUPPORTED_THEME_CATALOG);

    renderWithThemeProviders(<ThemeInitializationHarness />);

    await waitFor(() => expect(screen.getByText("Active: BootstrapSpark")).toBeInTheDocument());

    expect(loadThemeCatalogSpy).toHaveBeenCalledWith(
      expect.objectContaining({ attemptRemoteMetadata: true })
    );
  });
});
