import { beforeEach, describe, expect, it } from "vitest";
import {
  clearStoredThemePreference,
  readStoredThemePreference,
  writeStoredThemePreference,
} from "@/utils/themePreference";

describe("themePreference", () => {
  beforeEach(() => {
    clearStoredThemePreference();
  });

  it("writes and reads a valid stored preference", () => {
    writeStoredThemePreference("flatly", "2026-04-13");

    expect(readStoredThemePreference()).toMatchObject({
      themeId: "flatly",
      catalogVersion: "2026-04-13",
    });
  });

  it("returns undefined for invalid stored data", () => {
    window.localStorage.setItem("bootstrapspark.themePreference", "not-json");

    expect(readStoredThemePreference()).toBeUndefined();
  });
});
