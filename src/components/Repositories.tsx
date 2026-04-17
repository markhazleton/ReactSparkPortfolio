import { useEffect, useMemo, useState, type ReactElement } from "react";
import {
  ArrowClockwise,
  ArrowUpRightSquare,
  ChevronLeft,
  ChevronRight,
  Search,
  StarFill,
} from "react-bootstrap-icons";
import { useTheme } from "../contexts/ThemeContext";
import { useSEO } from "../contexts/useSEO";
import {
  clearRepositoriesCache,
  fetchRepositoryShowcaseData,
  getRepositoriesCacheInfo,
} from "../services/RepositoryService";
import { RepositoryShowcaseViewModel } from "../models/Repository";
import {
  RepositorySortOption,
  filterRepositories,
  paginateRepositories,
  sortRepositories,
} from "../utils/repositoryFilters";

const repositoriesPerPage = 6;

const Repositories: React.FC = () => {
  const { theme } = useTheme();
  const { setTitle, setDescription } = useSEO();

  const [data, setData] = useState<RepositoryShowcaseViewModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cacheInfo, setCacheInfo] = useState(getRepositoriesCacheInfo());

  const [searchTerm, setSearchTerm] = useState("");
  const [languageFilter, setLanguageFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOption, setSortOption] = useState<RepositorySortOption>("featured");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setTitle("GitHub Repositories | BootstrapSpark");
    setDescription(
      "Explore Mark Hazleton's GitHub repositories with curated highlights, activity insights, and searchable discovery controls."
    );
  }, [setDescription, setTitle]);

  const loadData = async (forceRefresh = false) => {
    setLoading(true);
    setError(null);

    try {
      if (forceRefresh) {
        clearRepositoriesCache();
      }

      const showcaseData = await fetchRepositoryShowcaseData(forceRefresh);
      setData(showcaseData);
      setCacheInfo(getRepositoriesCacheInfo());
    } catch (err) {
      setError("Failed to load repository showcase data.");
      console.error("Error loading repositories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void Promise.resolve().then(() => loadData());
  }, []);

  const processedRepositories = useMemo(() => {
    if (!data) {
      return [];
    }

    const filtered = filterRepositories(
      data.repositories,
      searchTerm,
      languageFilter,
      statusFilter
    );
    return sortRepositories(filtered, sortOption);
  }, [data, languageFilter, searchTerm, sortOption, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(processedRepositories.length / repositoriesPerPage));
  const currentRepositories = paginateRepositories(
    processedRepositories,
    currentPage,
    repositoriesPerPage
  );

  const handlePageChange = (page: number) => {
    const boundedPage = Math.min(Math.max(page, 1), totalPages);
    setCurrentPage(boundedPage);

    window.scrollTo({
      top: document.getElementById("repositories-section")?.offsetTop || 0,
      behavior: "smooth",
    });
  };

  const renderPagination = () => {
    if (totalPages <= 1) {
      return null;
    }

    const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);
    const items: ReactElement[] = [];

    items.push(
      <li key="prev" className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
        <button
          className="page-link"
          aria-label="Previous page"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          <ChevronLeft size={16} />
        </button>
      </li>
    );

    for (const pageNumber of pageNumbers) {
      if (
        pageNumber === 1 ||
        pageNumber === totalPages ||
        (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
      ) {
        items.push(
          <li
            key={`page-${pageNumber}`}
            className={`page-item ${currentPage === pageNumber ? "active" : ""}`}
          >
            <button className="page-link" onClick={() => handlePageChange(pageNumber)}>
              {pageNumber}
            </button>
          </li>
        );
      } else if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) {
        items.push(
          <li key={`ellipsis-${pageNumber}`} className="page-item disabled">
            <span className="page-link">...</span>
          </li>
        );
      }
    }

    items.push(
      <li key="next" className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
        <button
          className="page-link"
          aria-label="Next page"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          <ChevronRight size={16} />
        </button>
      </li>
    );

    return (
      <nav aria-label="Repositories pagination" className="mt-4">
        <ul className="pagination justify-content-center mb-0">{items}</ul>
      </nav>
    );
  };

  if (loading) {
    return (
      <section className="py-5" id="repositories-section">
        <div className="container text-center">
          <h2 className="mb-4">GitHub Repositories</h2>
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className="py-5" id="repositories-section">
        <div className="container text-center">
          <h2 className="mb-4">GitHub Repositories</h2>
          <div className={`alert ${theme === "dark" ? "alert-dark" : "alert-danger"}`}>
            {error || "Repository data is currently unavailable."}
            <div className="mt-3">
              <button
                className={`btn btn-sm ${theme === "dark" ? "btn-outline-light" : "btn-outline-primary"}`}
                onClick={() => loadData(true)}
              >
                <ArrowClockwise className="me-1" /> Try Again
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const weeklyActivity = data.profile.weekly_activity || [];

  return (
    <section className="py-5 bg-theme" id="repositories-section">
      <div className="container">
        <header className="mb-4 repository-hero p-4 rounded-4 border-theme">
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
            <div>
              <h2 className="mb-2">GitHub Repository Showcase</h2>
              <p className="lead mb-1">
                Curated repositories and live activity from Mark Hazleton's public portfolio.
              </p>
              <p className="text-theme-muted mb-0">{data.sourceStatus.message}</p>
            </div>
            <div className="d-flex align-items-center gap-2">
              {cacheInfo.hasCache && (
                <small className="text-theme-muted">
                  Last updated: {cacheInfo.lastUpdated?.toLocaleString()} ({cacheInfo.source})
                </small>
              )}
              <button
                className={`btn btn-sm ${theme === "dark" ? "btn-outline-light" : "btn-outline-primary"}`}
                onClick={() => loadData(true)}
              >
                <ArrowClockwise className="me-1" /> Refresh
              </button>
            </div>
          </div>

          <div className="row g-3 mt-1">
            <div className="col-6 col-md-3">
              <div className="card h-100 repository-stat-card">
                <div className="card-body">
                  <h3 className="h6 text-theme-muted mb-1">Repositories</h3>
                  <p className="h2 mb-0">{data.profile.total_repositories}</p>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="card h-100 repository-stat-card">
                <div className="card-body">
                  <h3 className="h6 text-theme-muted mb-1">Stars</h3>
                  <p className="h2 mb-0">{data.profile.total_stars}</p>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="card h-100 repository-stat-card">
                <div className="card-body">
                  <h3 className="h6 text-theme-muted mb-1">Forks</h3>
                  <p className="h2 mb-0">{data.profile.total_forks}</p>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="card h-100 repository-stat-card">
                <div className="card-body">
                  <h3 className="h6 text-theme-muted mb-1">Commits</h3>
                  <p className="h2 mb-0">{data.profile.total_commits}</p>
                </div>
              </div>
            </div>
          </div>

          {weeklyActivity.length > 0 && (
            <div className="mt-4">
              <h3 className="h5 mb-2">Recent Activity</h3>
              <div className="row g-2">
                {weeklyActivity.slice(0, 4).map((week) => (
                  <div key={week.week} className="col-sm-6 col-lg-3">
                    <div className="card h-100 repository-activity-card">
                      <div className="card-body">
                        <p className="small text-theme-muted mb-1">{week.label}</p>
                        <p className="mb-1 fw-semibold">{week.commits} commits</p>
                        <p className="mb-0 small">{week.active_repos} active repos</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </header>

        <section className="mb-4" aria-label="Featured repositories">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="h4 mb-0">Featured Repositories</h3>
            <small className="text-theme-muted">
              Curated entries are preferred; automatic fallback is used when needed.
            </small>
          </div>
          <div className="row g-3">
            {data.featured.map((repo) => (
              <div className="col-md-6 col-lg-4" key={`featured-${repo.name}`}>
                <article className="card h-100 repository-card featured-repository border-warning-subtle">
                  <div className="card-body d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h4 className="h5 mb-0">{repo.name}</h4>
                      <span className="badge text-bg-warning text-uppercase">
                        <StarFill size={12} className="me-1" />
                        {repo.featuredSource}
                      </span>
                    </div>
                    <p className="text-theme-muted mb-2">{repo.summaryText}</p>
                    <div className="d-flex flex-wrap gap-2 mb-3">
                      <span className="badge text-bg-light border">{repo.stars} stars</span>
                      <span className="badge text-bg-light border">{repo.forks} forks</span>
                      <span className="badge text-bg-light border">
                        {repo.recentCommits90d} commits/90d
                      </span>
                    </div>
                    <div className="mt-auto d-flex gap-2 flex-wrap">
                      <a
                        className="btn btn-sm btn-primary"
                        href={repo.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Open ${repo.name} repository on GitHub`}
                      >
                        Open GitHub <ArrowUpRightSquare className="ms-1" />
                      </a>
                      {repo.siteUrl && (
                        <a
                          className="btn btn-sm btn-outline-secondary"
                          href={repo.siteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Open ${repo.name} live site`}
                        >
                          Live Site <ArrowUpRightSquare className="ms-1" />
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </section>

        <section className="card p-3 mb-4" aria-label="Repository discovery controls">
          <div className="row g-3">
            <div className="col-lg-5">
              <label htmlFor="repository-search" className="form-label">
                Search repositories
              </label>
              <div className="input-group">
                <span className="input-group-text">
                  <Search />
                </span>
                <input
                  id="repository-search"
                  type="text"
                  className="form-control"
                  placeholder="Search by name or description"
                  value={searchTerm}
                  onChange={(event) => {
                    setSearchTerm(event.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>

            <div className="col-sm-6 col-lg-3">
              <label htmlFor="repository-language" className="form-label">
                Language
              </label>
              <select
                id="repository-language"
                className="form-select"
                value={languageFilter}
                onChange={(event) => {
                  setLanguageFilter(event.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="all">All languages</option>
                {data.filters.languages.map((language) => (
                  <option value={language} key={language}>
                    {language}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-sm-6 col-lg-2">
              <label htmlFor="repository-status" className="form-label">
                Status
              </label>
              <select
                id="repository-status"
                className="form-select"
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(event.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="all">All status</option>
                {data.filters.statusTags.map((status) => (
                  <option value={status} key={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-sm-6 col-lg-2">
              <label htmlFor="repository-sort" className="form-label">
                Sort
              </label>
              <select
                id="repository-sort"
                className="form-select"
                value={sortOption}
                onChange={(event) => {
                  setSortOption(event.target.value as RepositorySortOption);
                  setCurrentPage(1);
                }}
              >
                <option value="featured">Featured score</option>
                <option value="activity">Activity</option>
                <option value="stars">Stars</option>
                <option value="updated">Recently updated</option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
              </select>
            </div>
          </div>
        </section>

        <section aria-label="Repository results">
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <p className="mb-0 text-theme-muted">
              Showing{" "}
              {processedRepositories.length === 0 ? 0 : (currentPage - 1) * repositoriesPerPage + 1}
              -{Math.min(currentPage * repositoriesPerPage, processedRepositories.length)} of{" "}
              {processedRepositories.length} repositories
            </p>
            {totalPages > 1 && (
              <small className="text-theme-muted">
                Page {currentPage} of {totalPages}
              </small>
            )}
          </div>

          {processedRepositories.length === 0 ? (
            <div className={`alert ${theme === "dark" ? "alert-dark" : "alert-info"}`}>
              <h4 className="h6">No repositories match your current filters.</h4>
              <p className="mb-2">Try clearing search text or switching language/status filters.</p>
              <button
                className={`btn btn-sm ${theme === "dark" ? "btn-outline-light" : "btn-outline-primary"}`}
                onClick={() => {
                  setSearchTerm("");
                  setLanguageFilter("all");
                  setStatusFilter("all");
                  setCurrentPage(1);
                }}
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="row g-3">
              {currentRepositories.map((repo) => (
                <div className="col-md-6 col-xl-4" key={repo.name}>
                  <article className="card h-100 repository-card">
                    <div className="card-body d-flex flex-column">
                      <h4 className="h5 mb-2">{repo.name}</h4>
                      <p className="text-theme-muted mb-3">{repo.description}</p>

                      <div className="d-flex flex-wrap gap-2 mb-3">
                        {repo.primaryLanguage && (
                          <span className="badge text-bg-secondary">{repo.primaryLanguage}</span>
                        )}
                        <span className="badge text-bg-light border">{repo.stars} stars</span>
                        <span className="badge text-bg-light border">{repo.forks} forks</span>
                        <span className="badge text-bg-light border">
                          {repo.recentCommits90d} commits/90d
                        </span>
                        {repo.statusTags.map((tag) => (
                          <span
                            className="badge text-bg-dark-subtle border"
                            key={`${repo.name}-${tag}`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="mt-auto d-flex gap-2 flex-wrap">
                        <a
                          className="btn btn-sm btn-primary"
                          href={repo.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Open ${repo.name} repository on GitHub`}
                        >
                          Open GitHub <ArrowUpRightSquare className="ms-1" />
                        </a>
                        {repo.siteUrl && (
                          <a
                            className="btn btn-sm btn-outline-secondary"
                            href={repo.siteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Open ${repo.name} live site`}
                          >
                            Live Site <ArrowUpRightSquare className="ms-1" />
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          )}

          {renderPagination()}
        </section>
      </div>
    </section>
  );
};

export default Repositories;
