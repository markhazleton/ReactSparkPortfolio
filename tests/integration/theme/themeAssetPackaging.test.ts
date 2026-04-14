import { existsSync, readFileSync } from "fs";
import path from "path";
import { describe, expect, it } from "vitest";
import { BOOTSWATCH_THEME_IDS } from "@/data/theme-catalog/supportedThemes";

describe("theme asset packaging", () => {
  it("keeps source and build theme assets available for the supported catalog", () => {
    const workspaceRoot = process.cwd();
    const sourceDefaultTheme = path.join(workspaceRoot, "public", "themes", "bootstrapspark.css");
    const publicThemesPath = path.join(workspaceRoot, "public", "themes");

    expect(existsSync(sourceDefaultTheme)).toBe(true);
    for (const themeId of BOOTSWATCH_THEME_IDS) {
      const publicThemePath = path.join(publicThemesPath, themeId, "bootstrap.min.css");

      expect(existsSync(publicThemePath)).toBe(true);
      expect(readFileSync(publicThemePath, "utf8")).not.toContain("fonts.googleapis.com");
    }

    const docsThemesPath = path.join(workspaceRoot, "docs", "themes");
    if (!existsSync(docsThemesPath)) {
      return;
    }

    expect(existsSync(path.join(docsThemesPath, "bootstrapspark.css"))).toBe(true);
    for (const themeId of BOOTSWATCH_THEME_IDS) {
      expect(existsSync(path.join(docsThemesPath, themeId, "bootstrap.min.css"))).toBe(true);
    }
  });
});
