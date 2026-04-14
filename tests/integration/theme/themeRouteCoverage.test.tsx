import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AdvancedComponents from "@/components/AdvancedComponents";
import Components from "@/components/Components";
import Contact from "@/components/Contact";
import Hero from "@/components/Hero";
import SiteDemoProductCatalog from "@/components/SiteDemoProductCatalog";
import { renderWithThemeProviders } from "./renderWithThemeProviders";

describe("theme route coverage", () => {
  it("renders representative primary, showcase, and demo surfaces without crashing", () => {
    renderWithThemeProviders(
      <>
        <Hero />
        <Components />
        <AdvancedComponents />
        <Contact />
        <SiteDemoProductCatalog />
      </>
    );

    expect(
      screen.getAllByRole("heading", { name: /Bootstrap Components/i }).length
    ).toBeGreaterThan(0);
    expect(screen.getAllByRole("heading", { name: /Advanced Components/i }).length).toBeGreaterThan(
      0
    );
    expect(
      screen.getAllByRole("heading", { name: /Community & Contributing/i }).length
    ).toBeGreaterThan(0);
    expect(screen.getAllByRole("heading", { name: /Product Catalog/i }).length).toBeGreaterThan(0);
  });
});
