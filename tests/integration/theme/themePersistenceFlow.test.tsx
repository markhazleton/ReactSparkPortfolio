import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { useTheme } from "@/contexts/ThemeContext";
import { renderWithThemeProviders } from "./renderWithThemeProviders";

const ThemeHarness: React.FC = () => {
  const { activeTheme, selectTheme } = useTheme();

  return (
    <div>
      <p>Active: {activeTheme.name}</p>
      <button type="button" onClick={() => void selectTheme("flatly")}>
        Select Flatly
      </button>
    </div>
  );
};

describe("theme persistence flow", () => {
  it("applies and persists the selected theme across reload-like rerenders", async () => {
    const user = userEvent.setup();
    const firstRender = renderWithThemeProviders(<ThemeHarness />);

    await waitFor(() => expect(screen.getByText("Active: BootstrapSpark")).toBeInTheDocument());

    await user.click(screen.getByRole("button", { name: "Select Flatly" }));

    await waitFor(() => expect(screen.getByText("Active: Flatly")).toBeInTheDocument());
    expect(document.documentElement.getAttribute("data-active-theme")).toBe("flatly");

    firstRender.unmount();
    renderWithThemeProviders(<ThemeHarness />);

    await waitFor(() => expect(screen.getByText("Active: Flatly")).toBeInTheDocument());
  });
});
