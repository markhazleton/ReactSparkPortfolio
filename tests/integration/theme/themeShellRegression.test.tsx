import { screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { writeStoredThemePreference } from "@/utils/themePreference";
import { renderWithThemeProviders } from "./renderWithThemeProviders";

describe("theme shell regression", () => {
  it("keeps the header and footer usable for a dark theme selection", async () => {
    writeStoredThemePreference("darkly", "2026-04-13");

    renderWithThemeProviders(
      <>
        <Header />
        <Footer />
      </>,
      "/themes"
    );

    await waitFor(() =>
      expect(screen.getByRole("link", { name: /Open theme selector/i })).toBeInTheDocument()
    );
    expect(screen.getByRole("link", { name: /View on GitHub/i })).toBeInTheDocument();
    expect(document.documentElement.getAttribute("data-active-theme")).toBe("darkly");
  });
});
