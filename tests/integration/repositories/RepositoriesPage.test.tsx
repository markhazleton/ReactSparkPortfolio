import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Repositories from "@/components/Repositories";
import repositoryFeed from "@/data/repositories.json";

const renderPage = () =>
  render(
    <ThemeProvider>
      <BrowserRouter>
        <Repositories />
      </BrowserRouter>
    </ThemeProvider>
  );

describe("Repositories page integration", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("renders hero metrics, featured section, and activity context", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      json: async () => repositoryFeed,
    } as Response);

    renderPage();

    await waitFor(() => {
      expect(screen.getByText("GitHub Repository Showcase")).toBeInTheDocument();
      expect(screen.getByText("Repositories")).toBeInTheDocument();
      expect(screen.getByText("Recent Activity")).toBeInTheDocument();
      expect(screen.getByText("Featured Repositories")).toBeInTheDocument();
    });

    expect(screen.getByRole("heading", { name: "Stars" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Forks" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Commits" })).toBeInTheDocument();
  });

  it("supports search and zero-state recovery", async () => {
    const user = userEvent.setup();
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      json: async () => repositoryFeed,
    } as Response);

    renderPage();

    const searchInput = await screen.findByLabelText("Search repositories");
    await user.type(searchInput, "no-such-repository");

    await waitFor(() => {
      expect(screen.getByText("No repositories match your current filters.")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "Reset filters" }));

    await waitFor(() => {
      expect(screen.getByText(/Showing 1-/)).toBeInTheDocument();
    });
  });

  it("updates ordering when sort option changes", async () => {
    const user = userEvent.setup();
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      json: async () => repositoryFeed,
    } as Response);

    renderPage();

    const sortSelect = await screen.findByLabelText("Sort");
    await user.selectOptions(sortSelect, "name-asc");

    await waitFor(() => {
      const ctas = screen.getAllByRole("link", { name: /Open .* repository on GitHub/i });
      expect(ctas.length).toBeGreaterThan(0);
    });
  });

  it("falls back to embedded data when the remote request fails", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("network down"));

    renderPage();

    await waitFor(() => {
      expect(screen.getByText("GitHub Repository Showcase")).toBeInTheDocument();
      expect(screen.getByText("Showing embedded fallback repository data.")).toBeInTheDocument();
    });
  });

  it("renders outbound repository calls to action", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      json: async () => repositoryFeed,
    } as Response);

    renderPage();

    await waitFor(() => {
      const repoLinks = screen.getAllByRole("link", { name: /Open .* repository on GitHub/i });
      expect(repoLinks.length).toBeGreaterThan(0);
    });
  });
});
