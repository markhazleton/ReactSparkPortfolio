import { describe, expect, it } from "vitest";
import { SUPPORTED_THEME_CATALOG } from "@/data/theme-catalog/supportedThemes";
import { applyThemeStylesheet } from "@/services/theme/themeStylesheetService";

describe("theme performance validation", () => {
  it("reports theme-switch latency inside the one-second target for normal local execution", async () => {
    const defaultTheme = SUPPORTED_THEME_CATALOG.themes[0];
    const flatlyTheme = SUPPORTED_THEME_CATALOG.themes[1] ?? defaultTheme;

    const result = await applyThemeStylesheet({ theme: flatlyTheme, fallbackTheme: defaultTheme });

    expect(result.activeTheme.id).toBe(flatlyTheme.id);
    expect(result.latencyMs).toBeLessThan(1000);
  });
});
