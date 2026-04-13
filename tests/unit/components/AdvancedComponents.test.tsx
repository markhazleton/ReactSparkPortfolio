import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AdvancedComponents from "../../../src/components/AdvancedComponents";

describe("AdvancedComponents page", () => {
  it("renders navigation and advanced sections", () => {
    render(<AdvancedComponents />);

    expect(screen.getByRole("heading", { name: "Advanced Components" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Accordion" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Open Panel" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Breadcrumbs" })).toBeInTheDocument();
  });
});
