import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useTheme } from "@/contexts/ThemeContext";
import { SUPPORTED_THEME_CATALOG } from "@/data/theme-catalog/supportedThemes";
import * as themeStylesheetService from "@/services/theme/themeStylesheetService";
import { renderWithThemeProviders } from "./renderWithThemeProviders";

const RecoveryHarness: React.FC = () => {
  const { activeTheme, errorMessage, selectTheme, status } = useTheme();

  return (
    <div>
      <p>Active: {activeTheme.name}</p>
      <p>Status: {status}</p>
      <p>{errorMessage}</p>
      <button type="button" onClick={() => void selectTheme("darkly")}>
        Select Darkly
      </button>
    </div>
  );
};

describe("theme fallback recovery", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("rolls back to the BootstrapSpark default theme when the stylesheet application fails", async () => {
    const user = userEvent.setup();
    const defaultTheme = SUPPORTED_THEME_CATALOG.themes[0];

    vi.spyOn(themeStylesheetService, "applyThemeStylesheet")
      .mockResolvedValueOnce({
        activeTheme: defaultTheme,
        latencyMs: 5,
        rolledBack: false,
      })
      .mockResolvedValueOnce({
        activeTheme: defaultTheme,
        latencyMs: 8,
        rolledBack: true,
        message: "Darkly could not be loaded. Restored to BootstrapSpark instead.",
      });

    renderWithThemeProviders(<RecoveryHarness />);

    await waitFor(() => expect(screen.getByText("Active: BootstrapSpark")).toBeInTheDocument());

    await user.click(screen.getByRole("button", { name: "Select Darkly" }));

    await waitFor(() => expect(screen.getByText("Status: fallback")).toBeInTheDocument());
    expect(screen.getByText(/Restored to BootstrapSpark/i)).toBeInTheDocument();
    expect(
      JSON.parse(window.localStorage.getItem("bootstrapspark.themePreference") ?? "{}")
    ).toMatchObject({
      themeId: "bootstrapspark",
    });
  });
});
