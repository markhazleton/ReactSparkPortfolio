---

description: "Executable task list for the GitHub Repository Showcase feature"
---

# Tasks: GitHub Repository Showcase App

**Input**: Design documents from `.documentation/specs/001-github-repo-showcase/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/repository-showcase-contract.md, quickstart.md

**Tests**: Included. The plan, quickstart, and constitution require automated coverage for schema parsing, fallback behavior, and primary UI flows.

**Organization**: Tasks are grouped by user story to enable independent implementation and validation.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel when dependencies are satisfied
- **[Story]**: User story label for story-specific tasks only
- Each task includes exact file paths

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare the repository showcase file structure and feature-specific test surfaces.

- [X] T001 Create repository model and service scaffolds in `src/models/Repository.ts` and `src/services/RepositoryService.ts`
- [X] T002 [P] Create repository page and route test scaffolds in `src/components/Repositories.tsx` and `tests/integration/repositories/RepositoriesPage.test.tsx`
- [X] T003 [P] Create repository proxy scaffolds in `api/proxy-repositories/function.json`, `api/proxy-repositories/index.js`, and `api/proxy-repositories/package.json`
- [X] T004 [P] Create repository data and test scaffolds in `src/data/repositories.json`, `tests/unit/models/Repository.test.ts`, `tests/unit/services/RepositoryService.test.ts`, and `tests/contract/repositories/repositoryFeed.contract.test.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build the validated data pipeline and runtime plumbing required by all user stories.

**⚠️ CRITICAL**: No user story work should start until this phase is complete.

- [X] T005 Implement Zod schemas and typed repository feed exports, including explicit `FeedMetadata` fields for freshness and schema compatibility, in `src/models/Repository.ts`
- [X] T006 [P] Add the embedded repository fallback snapshot in `src/data/repositories.json`
- [X] T007 Implement repository fetch, validation, cache metadata, private-repository exclusion, curated-first featured selection with automatic fallback ranking, and fallback mapping in `src/services/RepositoryService.ts`
- [X] T008 [P] Add the development proxy route for `/api/repositories` in `vite.config.ts`
- [X] T009 Implement the production repository proxy in `api/proxy-repositories/index.js`
- [X] T010 [P] Configure the repository proxy function metadata and dependencies in `api/proxy-repositories/function.json` and `api/proxy-repositories/package.json`
- [X] T011 Add contract coverage for the feed shape, explicit metadata fields, and minimum required repository fields in `tests/contract/repositories/repositoryFeed.contract.test.ts`
- [X] T012 Add unit coverage for schema parsing, view-model derivation, and invalid feed rejection in `tests/unit/models/Repository.test.ts`
- [X] T013 Add unit coverage for remote, cache, and local fallback behavior, private-repository exclusion, and retry-ready failure handling in `tests/unit/services/RepositoryService.test.ts`

**Checkpoint**: Repository data can be loaded, validated, cached, and served through both development and production integration paths.

---

## Phase 3: User Story 1 - Browse Repository Portfolio (Priority: P1) 🎯 MVP

**Goal**: Deliver a dedicated repository showcase route with a strong opening narrative, featured highlights, and a browsable list of repositories.

**Independent Test**: Navigate to the repository showcase route from the app navigation and verify that the page renders profile metrics, recent activity context, featured repositories, and a repository collection from validated data without relying on search or filter interactions.

### Tests for User Story 1

- [X] T014 [P] [US1] Add route and first-render integration coverage for hero metrics, recent activity context, and featured spotlight rendering in `tests/integration/repositories/RepositoriesPage.test.tsx`

### Implementation for User Story 1

- [X] T015 [US1] Register the lazy-loaded repository route in `src/App.tsx`
- [X] T016 [US1] Add the repository showcase entry to the Apps navigation and generated sitemap route list in `src/components/Header.tsx` and `src/utils/generateSitemap.ts`
- [X] T017 [US1] Implement the repository page shell, hero metrics, recent activity summary, source-status messaging, retry-capable error state, and featured spotlight section in `src/components/Repositories.tsx`
- [X] T018 [US1] Connect the repository page to `RepositoryService` and render the base repository collection in `src/components/Repositories.tsx`
- [X] T019 [US1] Add page-level SEO copy and accessible section structure in `src/components/Repositories.tsx`

**Checkpoint**: User Story 1 is independently functional and demoable as the MVP.

---

## Phase 4: User Story 2 - Narrow to Relevant Repositories (Priority: P2)

**Goal**: Let visitors search, filter, sort, and refine the repository collection to find relevant work quickly.

**Independent Test**: Enter a search term, apply at least one filter or sort option, and verify that the visible repository results update correctly and recover cleanly from zero-result combinations.

### Tests for User Story 2

- [X] T020 [P] [US2] Add integration coverage for search, filter, sort, and zero-state behavior in `tests/integration/repositories/RepositoriesPage.test.tsx`

### Implementation for User Story 2

- [X] T021 [P] [US2] Create repository discovery helpers for filtering, sorting, and derived filter catalogs in `src/utils/repositoryFilters.ts`
- [X] T022 [US2] Add searchable and sortable repository view state to `src/components/Repositories.tsx`
- [X] T023 [US2] Implement filter controls, result counts, and zero-match recovery messaging in `src/components/Repositories.tsx`
- [X] T024 [US2] Add responsive list management for larger result sets, including paging or grouped presentation, in `src/components/Repositories.tsx`

**Checkpoint**: User Stories 1 and 2 both work independently, with discovery controls usable on phone and desktop layouts.

---

## Phase 5: User Story 3 - Decide What to Open Next (Priority: P3)

**Goal**: Help visitors understand repository value quickly and choose the right outbound GitHub destination.

**Independent Test**: Compare multiple repositories on the page and confirm that each entry exposes enough context, status, and outbound actions for a user to decide what to open next without leaving the site blindly.

### Tests for User Story 3

- [X] T025 [P] [US3] Add integration coverage for repository CTA links, badges, and featured/fallback distinction in `tests/integration/repositories/RepositoriesPage.test.tsx`

### Implementation for User Story 3

- [X] T026 [US3] Enrich repository cards with summary text, activity badges, and status tags in `src/components/Repositories.tsx`
- [X] T027 [US3] Add outbound GitHub and live-site call-to-action handling with accessible labels in `src/components/Repositories.tsx`

**Checkpoint**: All user stories are independently functional, and repository entries provide clear decision support before outbound navigation.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Finish theme fit, resilience, and full verification across the feature.

- [X] T029 [P] Refine Bootstrap styling, theme compatibility, and responsive polish for the repository showcase in `src/components/Repositories.tsx` and `src/css/styles.css`
- [X] T030 [P] Add any missing accessibility, error-state, and retry-affordance assertions to `tests/integration/repositories/RepositoriesPage.test.tsx`
- [X] T031 Run full quality verification with `npm run lint`, `npm run type-check`, `npm run test:coverage`, and `npm run build`
- [X] T032 Run the quickstart validation scenarios from `.documentation/specs/001-github-repo-showcase/quickstart.md` and update feature docs if behavior drift is discovered

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1: Setup** has no dependencies and can start immediately.
- **Phase 2: Foundational** depends on setup and blocks all user story work.
- **Phase 3: User Story 1** depends on foundational completion and defines the MVP.
- **Phase 4: User Story 2** depends on foundational completion and builds on the repository page surface from User Story 1.
- **Phase 5: User Story 3** depends on foundational completion and can overlap with later User Story 2 work once the page shell exists.
- **Phase 6: Polish** depends on the desired user stories being complete.

### User Story Dependencies

- **US1**: Starts after foundational work and has no dependency on other stories.
- **US2**: Starts after foundational work but benefits from the route and page shell delivered in US1.
- **US3**: Starts after foundational work but benefits from the card and spotlight structure delivered in US1.

### Within Each User Story

- Write or update the story tests before finalizing the implementation.
- Route and navigation changes should land before user-facing page validation.
- Shared data logic belongs in the foundational phase or service layer, not duplicated in UI tasks.
- Curated-first featured selection is part of the foundational service behavior and must land before US1 is declared MVP-complete.

### Parallel Opportunities

- T002, T003, and T004 can run in parallel after T001 begins the feature scaffolding.
- T006, T008, T009, and T010 can run in parallel after the model and service shapes are known.
- T011, T012, and T013 can run in parallel once the foundational implementation stabilizes.
- T021 can run in parallel with early US3 card-detail work after the base page exists.
- T029 and T030 can run in parallel during polish.

---

## Parallel Example: User Story 1

```text
Task: "T014 [US1] Add route and first-render integration coverage in tests/integration/repositories/RepositoriesPage.test.tsx"
Task: "T016 [US1] Add the repository showcase entry to the Apps navigation in src/components/Header.tsx"

Task: "T017 [US1] Implement the repository page shell, hero metrics, source-status messaging, and featured spotlight section in src/components/Repositories.tsx"
Task: "T015 [US1] Register the lazy-loaded repository route in src/App.tsx"
```

## Parallel Example: User Story 2

```text
Task: "T020 [US2] Add integration coverage for search, filter, sort, and zero-state behavior in tests/integration/repositories/RepositoriesPage.test.tsx"
Task: "T021 [US2] Create repository discovery helpers for filtering, sorting, and derived filter catalogs in src/utils/repositoryFilters.ts"
```

## Parallel Example: User Story 3

```text
Task: "T025 [US3] Add integration coverage for repository CTA links, badges, and featured/fallback distinction in tests/integration/repositories/RepositoriesPage.test.tsx"
Task: "T026 [US3] Enrich repository cards with summary text, activity badges, and status tags in src/components/Repositories.tsx"
```

---

## Implementation Strategy

### MVP First

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational.
3. Complete Phase 3: User Story 1.
4. Stop and validate the repository route as the MVP before expanding discovery and decision-support behavior.

### Incremental Delivery

1. Ship the validated data pipeline and base repository showcase route.
2. Add discovery controls for narrowing the collection.
3. Add richer repository decision support, CTA behavior, and featured fallback refinement.
4. Finish with polish and full verification.

### Gate Notes

- The feature metadata requires `checklist`, `analyze`, and `critic` gates.
- The requirements checklist exists and is complete.
- No existing `analyze.md`, `critic.md`, or other gate findings were present when tasks were generated.

## Gate Acknowledgements

- 2026-04-17: User approved proceeding with implementation despite unresolved `analyze` and `critic` gate artifacts.

---

## Notes

- All tasks follow the required checklist format.
- Exact file paths are included for every task.
- Suggested MVP scope: complete through T019 (User Story 1).
- Total tasks: 31.
- Task count by story: US1 = 6, US2 = 5, US3 = 3.