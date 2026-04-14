import { describe, expect, it, vi } from "vitest";
import { BOOTSWATCH_THEME_IDS } from "@/data/theme-catalog/supportedThemes";
import { loadThemeCatalog, resolvePreferredTheme } from "@/services/theme/themeCatalogService";

describe("themeCatalogService", () => {
  it("loads the BootstrapSpark theme plus the full local Bootswatch catalog by default", async () => {
    const catalog = await loadThemeCatalog();

    expect(catalog.themes).toHaveLength(BOOTSWATCH_THEME_IDS.length + 1);
    expect(catalog.themes[0]?.id).toBe("bootstrapspark");
  });

  it("falls back to the default theme when the saved preference is invalid", async () => {
    const catalog = await loadThemeCatalog();
    const resolvedTheme = resolvePreferredTheme(catalog, "missing-theme");

    expect(resolvedTheme.id).toBe("bootstrapspark");
  });

  it("merges optional Bootswatch metadata when remote enrichment succeeds", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        themes: [
          {
            name: "Flatly",
            description: "Remote Flatly description",
            preview: "https://bootswatch.com/flatly/",
            thumbnail: "https://bootswatch.com/5/flatly/thumbnail.png",
          },
        ],
      }),
    });

    const catalog = await loadThemeCatalog({ attemptRemoteMetadata: true, fetchImpl: fetchMock });
    const flatlyTheme = catalog.themes.find((theme) => theme.id === "flatly");

    expect(flatlyTheme?.description).toBe("Remote Flatly description");
  });
});
