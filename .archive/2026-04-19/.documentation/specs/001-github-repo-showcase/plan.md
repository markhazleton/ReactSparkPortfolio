# Implementation Plan: GitHub Repository Showcase App

**Branch**: `001-github-repo-showcase` | **Date**: 2026-04-17 | **Spec**: [.documentation/specs/001-github-repo-showcase/spec.md](./spec.md)
**Input**: Feature specification from `.documentation/specs/001-github-repo-showcase/spec.md`

## Summary

Build a new repository showcase app inside BootstrapSpark that presents Mark Hazleton's GitHub repository portfolio with a dedicated route, curated-first featured highlights, recent activity context, client-side discovery controls, and resilient data loading. The implementation will follow the existing Projects and Articles pattern: typed model + Zod validation, development proxy + Azure Function proxy, local embedded fallback data, generated sitemap/SEO route integration, polished Bootstrap-first UI, and layered test coverage across service, contract, and component flows.

## Technical Context

**Language/Version**: TypeScript 5.9.x, React 19, Node.js-based Vite toolchain  
**Primary Dependencies**: React Router, React Bootstrap, Bootstrap 5, React Bootstrap Icons, Zod, Vitest, Testing Library  
**Storage**: Browser localStorage cache for fetched dataset metadata and payload; embedded JSON fallback in `src/data/`  
**Testing**: Vitest, @testing-library/react, @testing-library/user-event, jsdom, existing contract/integration/unit test layout  
**Target Platform**: Static React web app deployed to Azure Static Web Apps and GitHub Pages, with Azure Function proxy endpoints for production data access  
**Project Type**: Single web application  
**Performance Goals**: Repository route renders meaningful above-the-fold content quickly, keeps client-side filtering and sorting instantaneous for the expected repository set, and preserves responsive interaction on phone and desktop layouts  
**Constraints**: Must preserve BootstrapSpark architecture and Bootstrap 5 styling, must validate external data with Zod, must provide graceful fallback when remote data is unavailable, must maintain keyboard accessibility, must keep CSP and proxy configuration aligned across Vite and Azure deployment  
**Scale/Scope**: One new app route plus supporting service/model/data/proxy/SEO/test updates; current dataset size is roughly dozens of repositories with profile metrics and weekly activity, but the design should remain workable as the dataset grows modestly over time

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Type Safety**: PASS. New repository models, service responses, and derived view models will be fully typed in TypeScript with strict-mode-safe parsing.
- **Code Quality & Linting**: PASS. The feature fits existing linted React + TypeScript patterns and should not require rule exceptions.
- **Testing**: PASS WITH REQUIRED WORK. Implementation must add automated coverage for schema parsing, fallback behavior, and repository UI flows before merge.
- **Documentation**: PASS. Feature artifacts remain under `.documentation/specs/001-github-repo-showcase/` and should stay synchronized with the delivered behavior.
- **Component Architecture**: PASS. Work cleanly maps to `src/components`, `src/services`, `src/models`, `src/data`, and `tests/`.
- **Error Handling & Resilience**: PASS WITH REQUIRED WORK. The data service must mirror the existing multi-layer fallback pattern used by Projects and RSS.
- **Logging & Observability**: PASS. Existing development-time logging is acceptable, but production behavior must continue to rely on the configured strip step.
- **Input Validation & Security**: PASS WITH REQUIRED WORK. Remote repository data must be validated with Zod, and any new proxy endpoint must respect current CORS and CSP expectations.
- **Styling Standards**: PASS. The feature is explicitly Bootstrap-first and should integrate with current theme support and SCSS structure.
- **Code Quality Gates**: PASS. The plan remains compatible with existing lint, type-check, test, and build commands.

**Post-Design Re-check**: No constitutional conflicts were introduced by the chosen design. The main enforcement items for implementation are Zod runtime validation, resilient fallback behavior, Bootstrap/theming consistency, and new automated tests.

## Project Structure

### Documentation (this feature)

```text
.documentation/specs/001-github-repo-showcase/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── repository-showcase-contract.md
├── checklists/
│   └── requirements.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── Header.tsx
│   └── Repositories.tsx
├── config/
│   └── AppConfig.ts
├── data/
│   └── repositories.json
├── models/
│   └── Repository.ts
├── services/
│   └── RepositoryService.ts
├── utils/
│   └── generateSitemap.ts
├── App.tsx
└── test/

api/
└── proxy-repositories/
    ├── function.json
    ├── index.js
    └── package.json

tests/
├── contract/
│   └── repositories/
├── integration/
│   └── repositories/
└── unit/
    ├── components/
    ├── models/
    └── services/
```

**Structure Decision**: Keep the feature inside the existing single-app React frontend with a matching Azure Function proxy, following the same service/model/component separation already used by Projects and Articles.

## Implementation Strategy

### Phase 0: Research Completion

- Confirm the remote repository dataset shape and select the subset of fields the UI will depend on directly.
- Lock the ingestion pattern to the existing remote → cache → embedded fallback model already used in BootstrapSpark.
- Define the featured-repository rule as curated-first with automatic fallback when curated metadata is absent.
- Choose a UI composition that showcases profile metrics, featured repositories, activity context, and a searchable/sortable repository collection without introducing new design systems.

### Phase 1: Design Artifacts

- Define a typed repository domain model covering top-level profile metrics, weekly activity summaries, explicit feed metadata, and individual repository records.
- Document the repository data contract for development proxy, production proxy, and embedded fallback expectations.
- Document a quickstart flow that validates route wiring, remote data loading, fallback behavior, and test execution.
- Update agent context from the completed plan so downstream task generation sees the selected stack and feature shape.

### Phase 2: Implementation Slices

- **Slice 1: Data foundation**
  Add repository model schemas, service fetch logic, curated-first featured selection, private-repository exclusion, explicit feed metadata handling, embedded fallback data, and production/development proxy support.
- **Slice 2: Route and navigation**
  Register the repository route, lazy-load the page, expose it through the Apps navigation structure, and include the route in generated sitemap/SEO output.
- **Slice 3: Showcase experience**
  Build the page layout with hero metrics, recent activity summaries, featured spotlight treatment, repository cards, retry-capable error states, and strong Bootstrap-forward presentation.
- **Slice 4: Discovery controls**
  Add search, filtering, sorting, paging/grouping, empty states, and freshness messaging.
- **Slice 5: Validation and resilience**
  Add tests for schemas, service fallback behavior, private-repository exclusion, generated sitemap coverage, retry behavior, and critical UI flows; then run lint, type-check, tests, and build verification.

## Complexity Tracking

No constitution exceptions or unusual complexity justifications are required at planning time. The feature extends existing site patterns rather than introducing a new subsystem or architecture tier.
