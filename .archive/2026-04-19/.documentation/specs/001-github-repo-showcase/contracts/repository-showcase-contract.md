# Contract: Repository Showcase Data Flow

## Purpose

Define the expected interface between BootstrapSpark and the Mark Hazleton repository dataset for the GitHub Repository Showcase app.

## Endpoints

### Development Fetch Contract

- Route: `/api/repositories`
- Transport: Vite development proxy
- Upstream source: raw or hosted repository dataset for `markhazleton`
- Method: `GET`
- Expected content type: `application/json`

### Production Fetch Contract

- Route: `/api/proxy-repositories`
- Transport: Azure Function HTTP endpoint
- Upstream source: hosted repository dataset for `markhazleton`
- Method: `GET`
- Expected content type: `application/json`

### Embedded Fallback Contract

- Path: `src/data/repositories.json`
- Purpose: last-resort bundled fallback when remote and cached data are unavailable

## Response Shape

The application expects a JSON object with this top-level structure:

```json
{
  "profile": {},
  "repositories": [],
  "metadata": {}
}
```

## Required Top-Level Fields

| Field | Type | Required | Description |
| ------ | ------ | ------ | ------ |
| `profile.username` | string | Yes | GitHub account identifier |
| `profile.total_repositories` | number | Yes | Repository count for hero summary |
| `profile.total_stars` | number | Yes | Aggregate stars metric |
| `profile.total_forks` | number | Yes | Aggregate forks metric |
| `profile.total_commits` | number | Yes | Aggregate commit metric |
| `repositories` | array | Yes | Repository collection |
| `metadata.generated_at` | string | Yes | Feed generation timestamp |
| `metadata.schema_version` | string | Yes | Feed schema identifier |

## Minimum Repository Record

Each rendered repository must provide at least:

```json
{
  "name": "BootstrapSpark",
  "url": "https://github.com/markhazleton/BootstrapSpark",
  "description": "...",
  "stars": 0,
  "forks": 0,
  "language": "TypeScript",
  "updated_at": "2026-04-14T00:25:37+00:00",
  "pushed_at": "2026-04-14T03:25:09+00:00"
}
```

Additional fields such as `summary`, `recent_commits_90d`, `commit_history`, `attention_score`, `rank`, `composite_score`, `has_pages`, `has_tests`, and `screenshot` may be used to enrich the experience and support automatic featured fallback.

## Behavioral Rules

- The service must validate the full payload with Zod before caching or UI mapping.
- If remote fetch fails, the service may serve cached data if available and still structurally valid.
- If both remote and cache are unavailable or invalid, the service must fall back to the embedded JSON snapshot.
- Private repositories must not be rendered even if they appear unexpectedly in the source payload.
- Archived and forked repositories may be rendered but must be visually labeled.
- Featured status must prefer explicit curated designation if the feed exposes one; otherwise the service may derive featured records from ranking, score, recency, and quality cues.

## Cache Contract

Suggested cache metadata keys:

- `cachedRepositoriesData`
- `repositoriesLastUpdated`
- `repositoriesCount`
- `repositoriesSource`
- `repositoriesCacheVersion`

## Error Contract

If no valid source is available, the UI must show:

- A non-breaking error state
- A clear user-facing recovery message
- A retry affordance when practical

The UI must never render a blank route caused by an unhandled repository feed failure.
