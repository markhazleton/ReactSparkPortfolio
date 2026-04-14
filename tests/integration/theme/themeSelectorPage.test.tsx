import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import ThemeSelectorPage from "@/components/theme/ThemeSelectorPage";
import { renderWithThemeProviders } from "./renderWithThemeProviders";

describe("theme selector page", () => {
  it("renders the curated theme cards and supports keyboard selection", async () => {
    const user = userEvent.setup();
    renderWithThemeProviders(<ThemeSelectorPage />, "/themes");

    await waitFor(() =>
      expect(screen.getByRole("heading", { name: /Supported themes/i })).toBeInTheDocument()
    );
    expect(screen.getAllByRole("heading", { name: "Flatly" }).length).toBeGreaterThan(0);

    const flatlyButton = screen
      .getAllByRole("button", { name: /Apply theme|Active/i })
      .find((button) => button.closest(".theme-selector-card")?.textContent?.includes("Flatly"));
    expect(flatlyButton).toBeDefined();

    if (!flatlyButton) {
      throw new Error("Flatly button was not found.");
    }

    flatlyButton.focus();
    await user.keyboard("{Enter}");

    await waitFor(() => expect(screen.getAllByText("Active").length).toBeGreaterThan(0));
  });
});
