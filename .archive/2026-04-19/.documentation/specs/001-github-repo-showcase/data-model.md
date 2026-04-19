# Data Model: GitHub Repository Showcase App

## Source Feed

### RepositoryFeed

Represents the full upstream JSON document fetched from the generated repository dataset.

| Field | Type | Required | Notes |
| ------ | ------ | ------ | ------ |
| `profile` | `ProfileSummary` | Yes | Top-level statistics and activity summaries for `markhazleton` |
| `repositories` | `RepositoryRecord[]` | Yes | Repository collection used to populate highlights and list views |
| `metadata` | `FeedMetadata` | Yes | Generator and schema metadata for freshness and compatibility messaging |

### FeedMetadata

| Field | Type | Required | Notes |
| ------ | ------ | ------ | ------ |
| `generated_at` | string | Yes | Feed generation timestamp used for freshness messaging |
| `schema_version` | string | Yes | Schema identifier used for compatibility checks |
| `source` | string | Optional | Upstream generator/source identifier when provided |

## Profile and Activity

### ProfileSummary

| Field | Type | Required | Notes |
| ------ | ------ | ------ | ------ |
| `username` | string | Yes | Expected to identify the GitHub account being showcased |
| `total_repositories` | number | Yes | Used in hero metrics |
| `total_stars` | number | Yes | Used in hero metrics |
| `total_forks` | number | Yes | Used in hero metrics |
| `total_commits` | number | Yes | Used in hero metrics |
| `activity_calendar` | record of date to number | Optional | Supports compact freshness or activity storytelling |
| `weekly_activity` | `WeeklyActivity[]` | Optional | Supports recent activity summaries |

### WeeklyActivity

| Field | Type | Required | Notes |
| ------ | ------ | ------ | ------ |
| `week` | string | Yes | ISO-like week identifier |
| `label` | string | Yes | Human-readable label |
| `commits` | number | Yes | Weekly commit count |
| `active_repos` | number | Yes | Repositories active during the week |

## Repository Domain

### RepositoryRecord

Represents a single repository entry from the upstream feed after validation.

| Field | Type | Required | Notes |
| ------ | ------ | ------ | ------ |
| `name` | string | Yes | Primary repository identifier |
| `description` | string or null | Optional | Short GitHub description |
| `summary` | `RepositorySummary` | Optional | Curated or generated summary text |
| `url` | string | Yes | Canonical repository URL |
| `homepage` | string or null | Optional | External homepage if available |
| `has_pages` | boolean | Optional | Indicates GitHub Pages presence |
| `pages_url` | string or null | Optional | Public pages URL |
| `website_url` | string or null | Optional | Website destination used by the dataset |
| `stars` | number | Yes | Used in ranking and badges |
| `forks` | number | Yes | Used in ranking and badges |
| `watchers` | number | Optional | Secondary interest signal |
| `language` | string or null | Optional | Primary language label |
| `created_at` | string | Yes | ISO timestamp |
| `updated_at` | string | Yes | ISO timestamp |
| `pushed_at` | string | Yes | ISO timestamp |
| `total_commits` | number | Optional | Aggregate history cue |
| `recent_commits_90d` | number | Optional | Recent activity cue |
| `commit_history` | `CommitHistorySummary` | Optional | Activity and recency details |
| `tech_stack` | `TechStackSummary` or null | Optional | Dependency and ecosystem clues |
| `has_readme` | boolean | Optional | Repository maturity signal |
| `has_license` | boolean | Optional | Repository maturity signal |
| `has_ci_cd` | boolean | Optional | Repository maturity signal |
| `has_tests` | boolean | Optional | Repository maturity signal |
| `has_docs` | boolean | Optional | Repository maturity signal |
| `is_fork` | boolean | Optional | Filter/status cue |
| `is_private` | boolean | Optional | Should generally be false for displayable items |
| `is_archived` | boolean | Optional | Filter/status cue |
| `days_since_last_push` | number | Optional | Recency cue |
| `attention_score` | number | Optional | Relative importance or health input |
| `rank` | number | Optional | Upstream ranking cue |
| `composite_score` | number | Optional | Ranking cue |
| `screenshot` | `RepositoryScreenshot` or null | Optional | Hero or card media candidate |

### RepositorySummary

| Field | Type | Required | Notes |
| ------ | ------ | ------ | ------ |
| `text` | string | Yes | Best short explanation of repository value |
| `ai_generated` | boolean | Optional | Source provenance indicator |
| `generation_method` | string or null | Optional | Provenance detail |
| `confidence_score` | number or null | Optional | Optional trust cue |

### CommitHistorySummary

| Field | Type | Required | Notes |
| ------ | ------ | ------ | ------ |
| `total_commits` | number | Optional | Aggregate count |
| `recent_90d` | number | Optional | Activity measure |
| `last_commit_date` | string | Optional | Recency display |
| `patterns` | string[] | Optional | Labels like `recently_updated` or `consistent` |
| `days_since_last_commit` | number | Optional | Supports freshness labels |

### TechStackSummary

| Field | Type | Required | Notes |
| ------ | ------ | ------ | ------ |
| `dependency_file_type` | string | Optional | Context for dependency data |
| `currency_score` | number | Optional | Dependency health cue |
| `outdated_count` | number | Optional | Maintenance cue |
| `total_dependencies` | number | Optional | Complexity cue |
| `dependencies` | `DependencyRecord[]` | Optional | Badge/filter candidate |

### DependencyRecord

| Field | Type | Required | Notes |
| ------ | ------ | ------ | ------ |
| `name` | string | Yes | Dependency name |
| `ecosystem` | string | Optional | npm, pypi, nuget, etc. |
| `current_version` | string or null | Optional | Display cue |
| `status` | string or null | Optional | Currency cue |
| `source_file` | string or null | Optional | Provenance |

### RepositoryScreenshot

| Field | Type | Required | Notes |
| ------ | ------ | ------ | ------ |
| `url` | string | Optional | Candidate showcase media |
| `captured_at` | string | Optional | Freshness cue |
| `width` | number | Optional | Media sizing metadata |
| `height` | number | Optional | Media sizing metadata |

## UI-Derived Models

### RepositoryShowcaseViewModel

A derived object prepared by the service layer for the page component.

| Field | Type | Notes |
| ------ | ------ | ------ |
| `profile` | `ProfileHeroMetrics` | Reduced metric payload for hero and summary sections |
| `featured` | `RepositoryCardViewModel[]` | Curated-first spotlight repositories |
| `repositories` | `RepositoryCardViewModel[]` | Searchable and sortable list records |
| `filters` | `RepositoryFilterCatalog` | Distinct filter values derived from validated data |
| `sourceStatus` | `SourceStatus` | Remote, cache, or embedded fallback state |

### RepositoryCardViewModel

| Field | Type | Notes |
| ------ | ------ | ------ |
| `name` | string | Display title |
| `description` | string | Non-empty description or fallback summary |
| `summaryText` | string | Richer explanatory text for spotlight or tooltips |
| `primaryLanguage` | string or null | Badge/filter cue |
| `repoUrl` | string | Main outbound destination |
| `siteUrl` | string or null | Optional live-site destination |
| `stars` | number | Metric badge |
| `forks` | number | Metric badge |
| `recentCommits90d` | number | Activity badge |
| `statusTags` | string[] | Derived labels such as featured, archived, pages, tested |
| `featuredSource` | `curated` or `automatic` or `none` | Clarified featured-state provenance |
| `sortMetrics` | object | Precomputed sort values for activity, score, recency |

### SourceStatus

| Field | Type | Notes |
| ------ | ------ | ------ |
| `source` | `remote` or `cache` or `local` | Current content source |
| `lastUpdated` | string or null | Cache/fetch timestamp |
| `count` | number | Repository count presented to the user |
| `message` | string | User-facing freshness or fallback message |

## Relationships

- One `RepositoryFeed` contains one `ProfileSummary` and many `RepositoryRecord` items.
- One `RepositoryRecord` may contribute to zero or more `RepositoryInsightGroup` buckets in the UI, such as featured, recent, or language-based groups.
- `RepositoryShowcaseViewModel` is derived from the validated feed and should never bypass schema parsing.
- Featured repositories are selected from `RepositoryRecord` items using curated designation first, then automatic ranking fallback if curated designation is absent.

## Validation Rules

- Reject feeds that omit the top-level `profile`, `repositories`, or `metadata` objects.
- Reject repository entries without a `name` or canonical `url`.
- Normalize null or empty descriptive fields into safe fallback strings before display.
- Exclude private repositories from rendered results if they ever appear in the source feed.
- Preserve archived and forked repositories, but label them so they do not overpower active featured work.
