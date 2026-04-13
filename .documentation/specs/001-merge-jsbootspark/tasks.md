# Tasks: Merge JsBootSpark into ReactSparkPortfolio

**Input**: Design documents from `/.documentation/specs/001-merge-jsbootspark/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are included per constitution requirement III (all new features MUST have corresponding tests before merge).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Rationale Summary

### Core Problem

Two separate Bootstrap-based portfolio/showcase repositories exist with overlapping purpose but different tech stacks. Maintaining both creates duplicate effort and fragments the "Spark" brand.

### Decision Summary

Absorb all unique user-facing features from JsBootSpark into ReactSparkPortfolio as React/TypeScript components, then rename to BootstrapSpark.

### Key Drivers

- Reduce maintenance burden of two overlapping repos
- Consolidate Bootstrap demonstration content into one React application
- Align naming with the Spark project family (TailwindSpark ↔ BootstrapSpark)

### Reviewer Guidance

- Verify TypeScript strict compliance and Zod validation on all new code
- Ensure no Express/EJS patterns leak into the React SPA
- Confirm existing features remain functional (zero regression)
- Validate rename doesn't break Azure SWA deployment

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Copy data assets and prepare shared foundations needed by multiple user stories

- [X] T001 Copy YouTube CSV data file from JsBootSpark to `src/data/youtube-top-100-songs-2025.csv`
- [X] T002 [P] Create Song model with Zod schema in `src/models/Song.ts` (entity: rank, title, fullTitle, description, viewCount, duration, channel, channelUrl, channelFollowerCount, categories, tags, liveStatus, thumbnail)
- [X] T003 [P] Create ContactForm model with Zod schema in `src/models/ContactForm.ts` (fields: name, email, message with validation rules from data-model.md)
- [X] T004 Create SongService in `src/services/SongService.ts` with functions: fetchAllSongs (CSV parse via ?raw import + Zod validation), getSongById, searchSongs, sortSongs, exportToCsv, exportToJson
- [X] T005 [P] Create useDataTable custom hook in `src/hooks/useDataTable.ts` for table state management (search, sort, pagination)

**Checkpoint**: Shared models, services, and hooks ready for component development

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Configure routing and navigation for all new pages — MUST complete before user stories

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T006 Add lazy imports for new components (Components, AdvancedComponents, DataTables, SongDetail, Contact) in `src/App.tsx`
- [X] T007 Add new Route entries in `src/App.tsx`: /components, /advanced-components, /data-tables, /song/:id, /contact
- [X] T008 Update Header navigation in `src/components/Header.tsx` to add "Showcase" dropdown (Components, Advanced Components, Data Tables) and "Contact" nav link

**Checkpoint**: Foundation ready — all new routes resolve and nav links work (pages can be stub components initially)

---

## Phase 3: User Story 1 — Bootstrap Component Showcase (Priority: P1) 🎯 MVP

**Goal**: Visitors can browse a comprehensive library of Bootstrap 5 components with live interactive examples

**Independent Test**: Navigate to /components and /advanced-components; verify all component sections render with interactive demos

### Implementation for User Story 1

- [X] T009 [US1] Create Components page in `src/components/Components.tsx` with sidebar navigation and basic Bootstrap 5 component sections: Buttons, Typography, Cards, Alerts, Forms, Modals, Tables, Icons - each with live interactive demos
- [X] T010 [P] [US1] Create AdvancedComponents page in `src/components/AdvancedComponents.tsx` with sidebar navigation and advanced Bootstrap 5 component sections: Accordion, Carousel, Offcanvas, Tabs, Collapse, Dropdowns, Tooltips/Popovers, Progress Bars, Spinners, Badges, Breadcrumbs - each with live interactive demos
- [X] T011 [US1] Add SEO metadata for /components route ("Components | BootstrapSpark") and /advanced-components route ("Advanced Components | BootstrapSpark") using SEOContext
- [X] T012 [P] [US1] Add /components and /advanced-components to sitemap generation in `src/utils/generateSitemap.ts`

### Tests for User Story 1

- [X] T013 [P] [US1] Write component test for Components page in `tests/unit/components/Components.test.tsx` - verify renders, sidebar nav links work, key sections present
- [X] T014 [P] [US1] Write component test for AdvancedComponents page in `tests/unit/components/AdvancedComponents.test.tsx` - verify renders, sidebar nav links work, key sections present

**Checkpoint**: User Story 1 complete — /components and /advanced-components fully functional with interactive Bootstrap demos

---

## Phase 4: User Story 2 — Data Tables with YouTube Top 100 Songs (Priority: P2)

**Goal**: Users can view an interactive data table of YouTube Top 100 Songs with sort, search, pagination, and export

**Independent Test**: Navigate to /data-tables, verify songs load, search filters, columns sort, pagination works, export downloads valid files

### Implementation for User Story 2

- [X] T015 [US2] Create DataTables page in `src/components/DataTables.tsx` using SongService and useDataTable hook - display paginated table with rank, title, channel, views, duration columns; include search input, sortable column headers, pagination controls, and CSV/JSON export buttons
- [X] T016 [US2] Add SEO metadata for /data-tables route ("Data Tables | BootstrapSpark") using SEOContext
- [X] T017 [P] [US2] Add /data-tables to sitemap generation in `src/utils/generateSitemap.ts`

### Tests for User Story 2

- [X] T018 [P] [US2] Write unit tests for SongService in `tests/unit/services/SongService.test.ts` - test CSV parsing, search filtering, sorting, export functions, invalid data handling
- [X] T019 [P] [US2] Write component test for DataTables page in `tests/unit/components/DataTables.test.tsx` - verify renders, table displays data, search filters, pagination changes pages

**Checkpoint**: User Story 2 complete — /data-tables fully functional with all table interactions

---

## Phase 5: User Story 5 — Project Rename to BootstrapSpark (Priority: P2)

**Goal**: All user-visible branding reflects "BootstrapSpark" with zero instances of "ReactSparkPortfolio"

**Independent Test**: Inspect package.json name, HTML title, header, footer, about page, README, SEO metadata — all reference "BootstrapSpark"

### Implementation for User Story 5

- [X] T020 [P] [US5] Update `package.json` name field to "bootstrapspark"
- [X] T021 [P] [US5] Update `src/config/AppConfig.ts` - siteTitle to "BootstrapSpark", hostedUrl, githubRepo, siteDescription
- [X] T022 [P] [US5] Update `index.html` - page title to "BootstrapSpark"
- [X] T023 [US5] Update `src/components/Header.tsx` - brand text to "BootstrapSpark"
- [X] T024 [US5] Update `src/components/Footer.tsx` - footer brand text to "BootstrapSpark"
- [X] T025 [US5] Update `src/components/Hero.tsx` - hero branding text to "BootstrapSpark"
- [X] T026 [P] [US5] Update `src/components/About.tsx` - any references to "ReactSparkPortfolio" -> "BootstrapSpark"
- [X] T027 [P] [US5] Update `README.md` - project name, description, and all references to "BootstrapSpark"
- [X] T028 [US5] Update `src/utils/generateSitemap.ts` and `src/utils/generateRobotsTxt.ts` - site URL references
- [X] T029 [US5] Update `.documentation/memory/constitution.md` header from "ReactSparkPortfolio Constitution" to "BootstrapSpark Constitution"
- [X] T030 [US5] Search entire codebase for remaining "ReactSparkPortfolio" references and update all instances

**Checkpoint**: User Story 5 complete — all branding is "BootstrapSpark", zero "ReactSparkPortfolio" in production output

---

## Phase 6: User Story 3 — Song Detail View (Priority: P3)

**Goal**: Users can click a song in the data table to see a detailed view with full metadata

**Independent Test**: Click a song row in data table → navigates to /song/:id with full metadata; click back → returns to table

**Dependencies**: Requires Phase 4 (US2) — SongService and DataTables must exist for drill-down navigation

### Implementation for User Story 3

- [X] T031 [US3] Create SongDetail page in `src/components/SongDetail.tsx` - display full song metadata (title, channel, views, duration, followers, categories, tags, thumbnail, description) with back-navigation link to /data-tables; handle invalid ID with "Song not found" fallback
- [X] T032 [US3] Update DataTables component in `src/components/DataTables.tsx` - make song rows clickable with React Router Link to /song/:id
- [X] T033 [P] [US3] Add SEO metadata for /song/:id route ("{Song Title} | BootstrapSpark") using SEOContext

### Tests for User Story 3

- [X] T034 [P] [US3] Write component test for SongDetail page in `tests/unit/components/SongDetail.test.tsx` - verify renders with valid song, shows "not found" for invalid ID, back link navigates to /data-tables

**Checkpoint**: User Story 3 complete — song detail drill-down works end-to-end

---

## Phase 7: User Story 4 — Contact Form (Priority: P3)

**Goal**: Users can submit a contact form with client-side validation providing immediate feedback

**Independent Test**: Navigate to /contact, submit with valid data → success message; submit with invalid data → validation errors

### Implementation for User Story 4

- [X] T035 [US4] Create or update Contact page in `src/components/Contact.tsx` - form with name, email, message fields using ContactForm Zod schema for validation; show field-specific validation errors on invalid submit; show success confirmation on valid submit
- [X] T036 [P] [US4] Add SEO metadata for /contact route ("Contact | BootstrapSpark") using SEOContext
- [X] T037 [P] [US4] Add /contact to sitemap generation in `src/utils/generateSitemap.ts`

### Tests for User Story 4

- [X] T038 [P] [US4] Write unit tests for ContactForm model in `tests/unit/models/ContactForm.test.ts` - test validation accepts valid data, rejects invalid name/email/message
- [X] T039 [P] [US4] Write component test for Contact page in `tests/unit/components/Contact.test.tsx` - verify form renders, validation errors display, success state on valid submit

**Checkpoint**: User Story 4 complete — contact form with full client-side validation

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final integration, regression check, and quality validation

- [X] T040 Run `npm run lint` and fix any linting errors across all new files
- [X] T041 Run `npm run test` and ensure all tests pass with coverage thresholds (80% branch, 70% line, 80% function)
- [X] T042 Run `npm run build` and verify production build succeeds with no errors
- [X] T043 Verify all existing routes still function (/, /about, /projects, /articles, /joke, /weather, /variant) — regression check per SC-002
- [X] T044 Verify dark/light theme toggle works on all new pages per FR-011
- [X] T045 Run quickstart.md validation — complete all verification steps from `.documentation/specs/001-merge-jsbootspark/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on T002, T003 (models) for type imports — BLOCKS all user stories
- **US1 (Phase 3)**: Depends on Phase 2 completion — No dependencies on other stories
- **US2 (Phase 4)**: Depends on Phase 1 (T001, T002, T004, T005) and Phase 2 — No dependencies on other stories
- **US5 (Phase 5)**: Depends on Phase 2 — No dependencies on other stories (can run in parallel with US1/US2)
- **US3 (Phase 6)**: Depends on Phase 4 (US2) — needs DataTables and SongService
- **US4 (Phase 7)**: Depends on Phase 1 (T003) and Phase 2 — No dependencies on other stories
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

- **US1 (P1)**: Independent — can start after Phase 2
- **US2 (P2)**: Independent — can start after Phase 2
- **US5 (P2)**: Independent — can start after Phase 2
- **US3 (P3)**: Depends on US2 (needs DataTables for drill-down)
- **US4 (P3)**: Independent — can start after Phase 2

### Within Each User Story

- Models before services
- Services before components
- Core implementation before SEO/sitemap
- Story complete before moving to next priority

### Parallel Opportunities

- T002, T003, T005 can run in parallel (different files)
- T009, T010 can run in parallel (different component files)
- T020, T021, T022, T026, T027 can run in parallel (different files, rename tasks)
- US1, US2, US5 can all start in parallel after Phase 2
- All test tasks marked [P] can run in parallel with each other

---

## Parallel Example: Phase 1 Setup

```text
# These can run simultaneously:
T002: Create Song model in src/models/Song.ts
T003: Create ContactForm model in src/models/ContactForm.ts
T005: Create useDataTable hook in src/hooks/useDataTable.ts
```

## Parallel Example: User Story 1

```text
# These can run simultaneously:
T009: Create Components.tsx
T010: Create AdvancedComponents.tsx

# After both complete:
T013: Test Components.tsx
T014: Test AdvancedComponents.tsx
```

## Parallel Example: User Story 5 Rename

```text
# These can run simultaneously (all different files):
T020: Update package.json
T021: Update AppConfig.ts
T022: Update index.html
T026: Update About.tsx
T027: Update README.md
```

---

## Gate Acknowledgements

- Gate: analyze
- Concern: analyze.md not yet generated (required gate per spec frontmatter)
- Decision: proceed — tasks generated from fully-passing checklist and complete plan artifacts
- Recorded By: Mark Hazleton
- Date: 2026-04-13

- Gate: critic
- Concern: critic.md not yet generated (required gate per spec frontmatter)
- Decision: proceed — can run /devspark.analyze and /devspark.critic before implementation if desired
- Recorded By: Mark Hazleton
- Date: 2026-04-13

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001–T005)
2. Complete Phase 2: Foundational (T006–T008)
3. Complete Phase 3: User Story 1 — Bootstrap Component Showcase (T009–T014)
4. **STOP and VALIDATE**: Test /components and /advanced-components independently
5. Deploy/demo if ready — site is already a useful Bootstrap reference

### Incremental Delivery

1. Phase 1 + Phase 2 → Foundation ready (routing, nav, models, services)
2. Add US1 → Component Showcase → Test → Deploy (MVP!)
3. Add US2 → Data Tables → Test → Deploy
4. Add US5 → Rename to BootstrapSpark → Test → Deploy
5. Add US3 → Song Detail → Test → Deploy
6. Add US4 → Contact Form → Test → Deploy
7. Phase 8 → Final polish, regression check, full build validation

### Single Developer Strategy

Since this is a single-developer project:
1. Complete phases sequentially: Setup → Foundation → US1 → US2 → US5 → US3 → US4 → Polish
2. Within each phase, leverage [P] tasks for faster context switching
3. Commit after each completed checkpoint

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable (except US3 depends on US2)
- Constitution requires tests for all new features — test tasks are included
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
