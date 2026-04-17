import { RepositoryCardViewModel } from "../models/Repository";

export type RepositorySortOption =
  | "featured"
  | "activity"
  | "stars"
  | "updated"
  | "name-asc"
  | "name-desc";

const hasTag = (repo: RepositoryCardViewModel, tag: string): boolean =>
  repo.statusTags.some((value) => value.toLowerCase() === tag.toLowerCase());

export const filterRepositories = (
  repositories: RepositoryCardViewModel[],
  searchTerm: string,
  languageFilter: string,
  statusFilter: string
): RepositoryCardViewModel[] => {
  const normalizedSearch = searchTerm.trim().toLowerCase();

  return repositories.filter((repo) => {
    const matchesSearch =
      normalizedSearch.length === 0 ||
      repo.name.toLowerCase().includes(normalizedSearch) ||
      repo.description.toLowerCase().includes(normalizedSearch) ||
      repo.summaryText.toLowerCase().includes(normalizedSearch);

    const matchesLanguage = languageFilter === "all" || repo.primaryLanguage === languageFilter;
    const matchesStatus = statusFilter === "all" || hasTag(repo, statusFilter);

    return matchesSearch && matchesLanguage && matchesStatus;
  });
};

export const sortRepositories = (
  repositories: RepositoryCardViewModel[],
  sortOption: RepositorySortOption
): RepositoryCardViewModel[] => {
  const clone = [...repositories];

  switch (sortOption) {
    case "name-asc":
      return clone.sort((a, b) => a.name.localeCompare(b.name));
    case "name-desc":
      return clone.sort((a, b) => b.name.localeCompare(a.name));
    case "activity":
      return clone.sort((a, b) => b.sortMetrics.activity - a.sortMetrics.activity);
    case "stars":
      return clone.sort((a, b) => b.stars - a.stars);
    case "updated":
      return clone.sort((a, b) => b.sortMetrics.recency - a.sortMetrics.recency);
    case "featured":
    default:
      return clone.sort((a, b) => b.sortMetrics.score - a.sortMetrics.score);
  }
};

export const paginateRepositories = (
  repositories: RepositoryCardViewModel[],
  currentPage: number,
  pageSize: number
): RepositoryCardViewModel[] => {
  const startIndex = (currentPage - 1) * pageSize;
  return repositories.slice(startIndex, startIndex + pageSize);
};
