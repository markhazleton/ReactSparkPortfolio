# Research: GitHub Repository Showcase App

## Decision 1: Use the existing BootstrapSpark remote-cache-local fallback pattern

- Decision: Implement repository ingestion with the same layered strategy used by Projects and RSS: development proxy, production Azure Function proxy, localStorage cache, and embedded JSON fallback.
- Rationale: This repository already relies on that pattern for external content and the constitution requires graceful degradation when remote services fail.
- Alternatives considered:
  - Direct browser fetch from the GitHub raw URL only. Rejected because production reliability and CORS behavior would be weaker than the existing site pattern.
  - Build-time-only data ingestion. Rejected because the rest of BootstrapSpark favors runtime refresh with cache fallback rather than requiring a rebuild for fresh data.

## Decision 2: Model the source as a profile-plus-repositories feed, then adapt it to UI view models

- Decision: Preserve the upstream dataset shape in validation and service parsing, then derive page-specific view models for spotlight cards, filters, and summary metrics.
- Rationale: The source feed contains more information than the UI needs on first render, including profile metrics, weekly activity, and rich per-repository metadata. Separating raw-source parsing from display mapping keeps validation strict and UI code simpler.
- Alternatives considered:
  - Flatten the source schema directly into component props. Rejected because it would couple the UI too tightly to a large external payload.
  - Ignore profile and activity metadata and render only repository cards. Rejected because the spec calls for a showcase experience, not a plain repository list.

## Decision 3: Define featured repositories as curated-first with automatic fallback

- Decision: If the dataset exposes an explicit featured or curated designation, honor it first. Otherwise, compute featured repositories from repository quality and activity cues already in the feed.
- Rationale: This resolves the clarified spec requirement while preserving intentional curation and still allowing the app to work if curated metadata is not present.
- Alternatives considered:
  - Manual curation only. Rejected because the page could degrade to no featured content when explicit curation is absent.
  - Metrics-only ranking. Rejected because it removes editorial control from the showcase experience.

## Decision 4: Add a dedicated repository service, model, route, and proxy rather than extending Projects

- Decision: Create `RepositoryService`, `Repository` model/schema, a dedicated `Repositories` component, a new route, and a matching Azure Function proxy.
- Rationale: The repository feed has a richer schema and different browsing goals than the simpler projects dataset. Keeping it separate preserves clean architecture and keeps the Projects feature focused.
- Alternatives considered:
  - Extend the Projects page to support multiple data modes. Rejected because it would blend two unrelated information architectures into one component.
  - Render repository data inside an existing demo/showcase page. Rejected because the feature is part of the Apps information architecture and should remain discoverable there.

## Decision 5: Treat the external JSON feed as a runtime contract and validate it with Zod

- Decision: Create Zod schemas for the top-level profile object, weekly activity items, and repository records before any caching or UI mapping occurs.
- Rationale: The constitution explicitly requires runtime validation for external data. Early validation also gives predictable fallback behavior and cleaner tests.
- Alternatives considered:
  - Trust the remote JSON and validate only selected fields late in the UI. Rejected because it increases risk of runtime breakage and contradicts the repo's validation standard.
  - Validate only the repository array. Rejected because profile metrics and activity summaries are also central to the planned showcase.

## Decision 6: Keep the UI contract centered on Bootstrap-first presentation with existing route and test patterns

- Decision: Build the new page with the same route wiring, lazy loading, theme compatibility, and test layout already used in BootstrapSpark, while pushing the visuals further through stronger metric panels, spotlight sections, and richer card treatment.
- Rationale: The feature should look more theatrical than Projects and Articles, but still feel native to the site and fit existing maintenance patterns.
- Alternatives considered:
  - Introduce a new charting or motion library. Rejected at planning time because the feature can achieve the required polish using the current stack and should minimize new dependencies.
  - Reuse the Projects layout almost unchanged. Rejected because the spec explicitly calls for a more world-class showcase feel.
