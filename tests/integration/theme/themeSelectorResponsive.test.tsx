import { screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ThemeSelectorPage from "@/components/theme/ThemeSelectorPage";
import { renderWithThemeProviders } from "./renderWithThemeProviders";

describe("theme selector responsive behavior", () => {
  it.each([375, 1280])(
    "renders usable selector controls at %ipx viewport width",
    async (viewportWidth) => {
      window.innerWidth = viewportWidth;
      window.dispatchEvent(new Event("resize"));

      renderWithThemeProviders(<ThemeSelectorPage />, "/themes");

      await waitFor(() =>
        expect(screen.getByRole("heading", { name: /Choose the site mood/i })).toBeInTheDocument()
      );
      expect(screen.getAllByRole("button", { name: /Apply theme|Active/i }).length).toBeGreaterThan(
        0
      );
    }
  );
});
