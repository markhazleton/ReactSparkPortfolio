import type { ReactElement } from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { SEOProvider } from "@/contexts/SEOContext";

/**
 * Renders UI with the routing, SEO, and theme providers required by theme-aware components.
 */
export const renderWithThemeProviders = (ui: ReactElement, route = "/") => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <ThemeProvider>
        <SEOProvider>{ui}</SEOProvider>
      </ThemeProvider>
    </MemoryRouter>
  );
};
