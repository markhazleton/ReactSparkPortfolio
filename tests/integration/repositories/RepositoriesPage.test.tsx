import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Repositories from "@/components/Repositories";
import { type RepositoryFeed } from "@/models/Repository";
import repositoryFeed from "@/data/repositories.json";

const cloneRepositoryFeed = (): RepositoryFeed =>
  JSON.parse(JSON.stringify(repositoryFeed)) as RepositoryFeed;

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

  it("filters repositories by language and status", async () => {
    const user = userEvent.setup();
    const customFeed = cloneRepositoryFeed();

    customFeed.repositories = [
      {
        ...customFeed.repositories[0],
        name: "alpha-repo",
        description: "TypeScript project with tests",
        language: "TypeScript",
        has_tests: true,
      },
      {
        ...customFeed.repositories[1],
        name: "beta-repo",
        description: "Python project without tests",
        language: "Python",
        has_tests: false,
      },
    ];

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      json: async () => customFeed,
    } as Response);

    renderPage();

    await user.selectOptions(await screen.findByLabelText("Language"), "TypeScript");
    await user.selectOptions(screen.getByLabelText("Status"), "tests");

    await waitFor(() => {
      const resultsSection = screen.getByLabelText("Repository results");
      expect(within(resultsSection).getByText("alpha-repo")).toBeInTheDocument();
      expect(within(resultsSection).queryByText("beta-repo")).not.toBeInTheDocument();
      expect(screen.getByText("Showing 1-1 of 1 repositories")).toBeInTheDocument();
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
      expect(screen.getByRole("button", { name: /Refresh/i })).toBeInTheDocument();
    });
  });

  it("renders badges, featured fallback labels, and outbound repository actions", async () => {
    const customFeed = cloneRepositoryFeed();

    customFeed.repositories = customFeed.repositories.slice(0, 3).map((repo, index) => ({
      ...repo,
      name: `featured-${index + 1}`,
      curated: false,
      is_featured: false,
      has_tests: index === 0,
      has_docs: true,
      recent_commits_90d: 25 - index,
      website_url: index === 0 ? "https://example.com/live-site" : repo.website_url,
    }));

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      json: async () => customFeed,
    } as Response);

    renderPage();

    await screen.findByText("Featured Repositories");

    const repoLinks = screen.getAllByRole("link", { name: /Open .* repository on GitHub/i });
    expect(repoLinks.length).toBeGreaterThan(0);
    expect(screen.getAllByText(/automatic/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText("tests").length).toBeGreaterThan(0);
    expect(screen.getAllByText("docs").length).toBeGreaterThan(0);
    expect(
      screen.getAllByRole("link", { name: /Open featured-1 live site/i }).length
    ).toBeGreaterThan(0);
  });

  it("refetches repository data when refresh is activated", async () => {
    const user = userEvent.setup();
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      json: async () => repositoryFeed,
    } as Response);

    renderPage();

    await screen.findByText("GitHub Repository Showcase");
    await user.click(screen.getByRole("button", { name: /Refresh/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });
});
