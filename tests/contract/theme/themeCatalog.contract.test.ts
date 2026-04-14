import { describe, expect, it } from "vitest";
import { ThemeCatalogSchema } from "@/models/theme/themeCatalog";
import {
  BOOTSWATCH_THEME_IDS,
  SUPPORTED_THEME_CATALOG,
} from "@/data/theme-catalog/supportedThemes";

describe("theme catalog contract", () => {
  it("matches the validated internal catalog shape", () => {
    expect(() => ThemeCatalogSchema.parse(SUPPORTED_THEME_CATALOG)).not.toThrow();
  });

  it("preserves a single default theme and stable ordering", () => {
    const defaultThemes = SUPPORTED_THEME_CATALOG.themes.filter((theme) => theme.isDefault);
    const orders = SUPPORTED_THEME_CATALOG.themes.map((theme) => theme.order);
    const expectedOrders = Array.from(
      { length: BOOTSWATCH_THEME_IDS.length + 1 },
      (_, index) => index
    );

    expect(defaultThemes).toHaveLength(1);
    expect(orders).toEqual(expectedOrders);
  });
});
