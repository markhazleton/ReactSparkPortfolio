import { act, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useTheme } from "@/contexts/ThemeContext";
import { SUPPORTED_THEME_CATALOG } from "@/data/theme-catalog/supportedThemes";
import type { ThemeApplicationResult } from "@/models/theme/themeCatalog";
import * as themeStylesheetService from "@/services/theme/themeStylesheetService";
import { renderWithThemeProviders } from "./renderWithThemeProviders";

const createDeferred = <T,>() => {
  let resolve!: (value: T) => void;

  const promise = new Promise<T>((nextResolve) => {
    resolve = nextResolve;
  });

  return { promise, resolve };
};

const ThemeOrderingHarness: React.FC = () => {
  const { activeTheme, selectTheme } = useTheme();

  return (
    <div>
      <p>Active: {activeTheme.name}</p>
      <button type="button" onClick={() => void selectTheme("flatly")}>
        Select Flatly
      </button>
      <button type="button" onClick={() => void selectTheme("darkly")}>
        Select Darkly
      </button>
    </div>
  );
};

describe("theme selection ordering", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("keeps the latest theme selection when earlier requests resolve later", async () => {
    const user = userEvent.setup();
    const defaultTheme = SUPPORTED_THEME_CATALOG.themes[0]!;
    const flatlyTheme = SUPPORTED_THEME_CATALOG.themes.find((theme) => theme.id === "flatly")!;
    const darklyTheme = SUPPORTED_THEME_CATALOG.themes.find((theme) => theme.id === "darkly")!;
    const firstSelection = createDeferred<ThemeApplicationResult>();
    const secondSelection = createDeferred<ThemeApplicationResult>();

    vi.spyOn(themeStylesheetService, "applyThemeStylesheet")
      .mockResolvedValueOnce({
        activeTheme: defaultTheme,
        latencyMs: 1,
        rolledBack: false,
      })
      .mockImplementationOnce(() => firstSelection.promise)
      .mockImplementationOnce(() => secondSelection.promise);

    renderWithThemeProviders(<ThemeOrderingHarness />);

    await waitFor(() => expect(screen.getByText("Active: BootstrapSpark")).toBeInTheDocument());

    await user.click(screen.getByRole("button", { name: "Select Flatly" }));
    await user.click(screen.getByRole("button", { name: "Select Darkly" }));

    await act(async () => {
      secondSelection.resolve({
        activeTheme: darklyTheme,
        latencyMs: 3,
        rolledBack: false,
      });
      await secondSelection.promise;
    });

    await waitFor(() => expect(screen.getByText("Active: Darkly")).toBeInTheDocument());
    expect(
      JSON.parse(window.localStorage.getItem("bootstrapspark.themePreference") ?? "{}")
    ).toMatchObject({
      themeId: "darkly",
    });

    await act(async () => {
      firstSelection.resolve({
        activeTheme: flatlyTheme,
        latencyMs: 6,
        rolledBack: false,
      });
      await firstSelection.promise;
    });

    expect(screen.getByText("Active: Darkly")).toBeInTheDocument();
    expect(
      JSON.parse(window.localStorage.getItem("bootstrapspark.themePreference") ?? "{}")
    ).toMatchObject({
      themeId: "darkly",
    });
  });
});
