import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Contact from "../../../src/components/Contact";

describe("Contact page", () => {
  it("renders community heading and key sections", () => {
    render(<Contact />);

    expect(screen.getByRole("heading", { name: "Community & Contributing" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Contributing Guide" })).toBeInTheDocument();
    expect(
      screen.getByText(/A collaborative ecosystem for modern web development/i)
    ).toBeInTheDocument();
  });

  it("shows primary contribution links", () => {
    render(<Contact />);

    expect(screen.getByRole("link", { name: "Visit Repository" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Report Bug" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Suggest Feature" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Join Discussions" })).toBeInTheDocument();
  });
});
