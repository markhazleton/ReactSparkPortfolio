import { z } from "zod";

const optionalUrlSchema = z.preprocess((value) => {
  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();
  return trimmed.length === 0 ? null : trimmed;
}, z.string().url().nullable().optional());

export const FeedMetadataSchema = z.object({
  generated_at: z.string().min(1, { message: "metadata.generated_at is required" }),
  schema_version: z.string().min(1, { message: "metadata.schema_version is required" }),
  source: z.string().min(1).optional(),
});

export const WeeklyActivitySchema = z.object({
  week: z.string().min(1),
  label: z.string().min(1),
  commits: z.number().int().nonnegative(),
  active_repos: z.number().int().nonnegative(),
});

export const ProfileSummarySchema = z.object({
  username: z.string().min(1),
  total_repositories: z.number().int().nonnegative(),
  total_stars: z.number().int().nonnegative(),
  total_forks: z.number().int().nonnegative(),
  total_commits: z.number().int().nonnegative(),
  activity_calendar: z.record(z.string(), z.number().int().nonnegative()).optional(),
  weekly_activity: z.array(WeeklyActivitySchema).optional(),
});

export const RepositorySummarySchema = z.object({
  text: z.string().min(1),
  ai_generated: z.boolean().optional(),
  generation_method: z.string().nullable().optional(),
  confidence_score: z.number().nullable().optional(),
});

export const CommitHistorySummarySchema = z.object({
  total_commits: z.number().int().nonnegative().optional(),
  recent_90d: z.number().int().nonnegative().optional(),
  last_commit_date: z.string().optional(),
  patterns: z.array(z.string()).optional(),
  days_since_last_commit: z.number().int().nonnegative().optional(),
});

export const RepositoryRecordSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullable().optional(),
  summary: RepositorySummarySchema.optional(),
  url: z.string().url(),
  homepage: optionalUrlSchema,
  has_pages: z.boolean().optional(),
  pages_url: optionalUrlSchema,
  website_url: optionalUrlSchema,
  stars: z.number().int().nonnegative(),
  forks: z.number().int().nonnegative(),
  watchers: z.number().int().nonnegative().optional(),
  language: z.string().nullable().optional(),
  created_at: z.string().min(1),
  updated_at: z.string().min(1),
  pushed_at: z.string().min(1),
  total_commits: z.number().int().nonnegative().optional(),
  recent_commits_90d: z.number().int().nonnegative().optional(),
  commit_history: CommitHistorySummarySchema.optional(),
  has_readme: z.boolean().optional(),
  has_license: z.boolean().optional(),
  has_ci_cd: z.boolean().optional(),
  has_tests: z.boolean().optional(),
  has_docs: z.boolean().optional(),
  is_fork: z.boolean().optional(),
  is_private: z.boolean().optional(),
  is_archived: z.boolean().optional(),
  days_since_last_push: z.number().int().nonnegative().optional(),
  attention_score: z.number().optional(),
  rank: z.number().optional(),
  composite_score: z.number().optional(),
  curated: z.boolean().optional(),
  is_featured: z.boolean().optional(),
});

export const RepositoryFeedSchema = z.object({
  profile: ProfileSummarySchema,
  repositories: z.array(RepositoryRecordSchema),
  metadata: FeedMetadataSchema,
});

export type FeedMetadata = z.infer<typeof FeedMetadataSchema>;
export type WeeklyActivity = z.infer<typeof WeeklyActivitySchema>;
export type ProfileSummary = z.infer<typeof ProfileSummarySchema>;
export type RepositorySummary = z.infer<typeof RepositorySummarySchema>;
export type CommitHistorySummary = z.infer<typeof CommitHistorySummarySchema>;
export type RepositoryRecord = z.infer<typeof RepositoryRecordSchema>;
export type RepositoryFeed = z.infer<typeof RepositoryFeedSchema>;

export type RepositorySource = "remote" | "cache" | "local";

export interface SourceStatus {
  source: RepositorySource;
  lastUpdated: string | null;
  count: number;
  message: string;
}

export interface RepositoryCardViewModel {
  name: string;
  description: string;
  summaryText: string;
  primaryLanguage: string | null;
  repoUrl: string;
  siteUrl: string | null;
  stars: number;
  forks: number;
  recentCommits90d: number;
  statusTags: string[];
  featuredSource: "curated" | "automatic" | "none";
  sortMetrics: {
    activity: number;
    score: number;
    recency: number;
  };
}

export interface RepositoryFilterCatalog {
  languages: string[];
  statusTags: string[];
}

export interface RepositoryShowcaseViewModel {
  profile: ProfileSummary;
  featured: RepositoryCardViewModel[];
  repositories: RepositoryCardViewModel[];
  filters: RepositoryFilterCatalog;
  sourceStatus: SourceStatus;
}

const extractRecencyScore = (repo: RepositoryRecord): number => {
  const dateValue = Date.parse(repo.pushed_at);
  return Number.isFinite(dateValue) ? dateValue : 0;
};

const buildStatusTags = (repo: RepositoryRecord): string[] => {
  const tags: string[] = [];
  if (repo.is_archived) tags.push("archived");
  if (repo.is_fork) tags.push("fork");
  if (repo.has_pages) tags.push("pages");
  if (repo.has_tests) tags.push("tests");
  if (repo.has_ci_cd) tags.push("ci/cd");
  if (repo.has_docs) tags.push("docs");
  if (repo.curated || repo.is_featured) tags.push("featured");
  return tags;
};

const getRepositoryScore = (repo: RepositoryRecord): number => {
  return (
    (repo.composite_score ?? 0) * 5 +
    (repo.attention_score ?? 0) * 2 +
    (repo.recent_commits_90d ?? 0) * 2 +
    (repo.stars ?? 0) +
    (repo.forks ?? 0)
  );
};

export const createRepositoryCardViewModel = (
  repo: RepositoryRecord,
  featuredSource: "curated" | "automatic" | "none" = "none"
): RepositoryCardViewModel => {
  const fallbackDescription = "No description is available yet.";
  const description =
    repo.description && repo.description.trim() ? repo.description : fallbackDescription;
  const summaryText = repo.summary?.text?.trim() || description;

  return {
    name: repo.name,
    description,
    summaryText,
    primaryLanguage: repo.language ?? null,
    repoUrl: repo.url,
    siteUrl: repo.website_url ?? repo.homepage ?? repo.pages_url ?? null,
    stars: repo.stars,
    forks: repo.forks,
    recentCommits90d: repo.recent_commits_90d ?? repo.commit_history?.recent_90d ?? 0,
    statusTags: buildStatusTags(repo),
    featuredSource,
    sortMetrics: {
      activity: repo.recent_commits_90d ?? repo.commit_history?.recent_90d ?? 0,
      score: getRepositoryScore(repo),
      recency: extractRecencyScore(repo),
    },
  };
};

export const selectFeaturedRepositories = (
  repositories: RepositoryRecord[],
  maxItems = 3
): RepositoryCardViewModel[] => {
  const curated = repositories.filter((repo) => repo.curated || repo.is_featured);
  const selected =
    curated.length > 0
      ? curated.slice(0, maxItems).map((repo) => createRepositoryCardViewModel(repo, "curated"))
      : [...repositories]
          .sort((a, b) => getRepositoryScore(b) - getRepositoryScore(a))
          .slice(0, maxItems)
          .map((repo) => createRepositoryCardViewModel(repo, "automatic"));

  return selected;
};

export const deriveFilterCatalog = (
  repositories: RepositoryCardViewModel[]
): RepositoryFilterCatalog => {
  const languageSet = new Set<string>();
  const statusSet = new Set<string>();

  for (const repo of repositories) {
    if (repo.primaryLanguage) {
      languageSet.add(repo.primaryLanguage);
    }
    for (const tag of repo.statusTags) {
      statusSet.add(tag);
    }
  }

  return {
    languages: [...languageSet].sort((a, b) => a.localeCompare(b)),
    statusTags: [...statusSet].sort((a, b) => a.localeCompare(b)),
  };
};

export const createSourceStatusMessage = (source: RepositorySource): string => {
  switch (source) {
    case "remote":
      return "Showing the latest repository feed from the remote source.";
    case "cache":
      return "Showing cached repository data while the latest feed is unavailable.";
    case "local":
      return "Showing embedded fallback repository data.";
    default:
      return "Showing repository data.";
  }
};

export const buildShowcaseViewModel = (
  feed: RepositoryFeed,
  source: RepositorySource,
  lastUpdated: string | null
): RepositoryShowcaseViewModel => {
  const publicRepositories = feed.repositories.filter((repo) => !repo.is_private);
  const repositories = publicRepositories.map((repo) =>
    createRepositoryCardViewModel(repo, "none")
  );

  return {
    profile: feed.profile,
    featured: selectFeaturedRepositories(publicRepositories),
    repositories,
    filters: deriveFilterCatalog(repositories),
    sourceStatus: {
      source,
      lastUpdated,
      count: repositories.length,
      message: createSourceStatusMessage(source),
    },
  };
};
