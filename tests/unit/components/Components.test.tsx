import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Components from "../../../src/components/Components";

describe("Components page", () => {
  it("renders section navigation and key content", () => {
    render(<Components />);

    expect(screen.getByRole("heading", { name: "Bootstrap Components" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Buttons" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Primary" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Tables" })).toBeInTheDocument();
  });
});
