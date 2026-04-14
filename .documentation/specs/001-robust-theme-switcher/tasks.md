# Tasks: Robust Theme Switcher

**Input**: Design documents from `/.documentation/specs/001-robust-theme-switcher/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/theme-catalog-contract.md, quickstart.md

**Tests**: Required for this feature. The constitution and implementation plan require automated test coverage for theme state transitions, fallback handling, selector interactions, and route-level regression surfaces.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Rationale Summary

### Core Problem

BootstrapSpark's current light/dark toggle does not scale to a richer theme catalog, gives users no dedicated place to compare themes, and does not guarantee stable behavior across BootstrapSpark plus the full available Bootswatch theme set.

### Decision Summary

Implement a full Bootswatch theme system backed by a local supported-theme catalog, precompiled Bootswatch and BootstrapSpark theme assets, and a dedicated selector experience with immediate persistence. Treat Bootswatch API metadata as optional enrichment rather than a runtime requirement.

### Key Drivers

- Theme variety is part of BootstrapSpark's product value as a showcase site.
- The feature must remain functional when external metadata is unavailable.
- The supported theme set must include BootstrapSpark plus every available Bootswatch theme while remaining verifiable across shared routes and showcase pages.

### Reviewer Guidance

Reviewers should focus on correctness of theme persistence, asset loading, catalog validation, selector usability, and cross-route Bootstrap compatibility under the supported theme set.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (`[US1]`, `[US2]`, `[US3]`)
- Include repo-relative file paths in descriptions

## Path Conventions

- Single project web app: `src/`, `public/`, `tests/` at repository root
- Feature docs: `.documentation/specs/001-robust-theme-switcher/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare the repository for BootstrapSpark plus full Bootswatch theme assets and theme-domain implementation work.

- [X] T001 Add the Bootswatch package dependency and any required theme asset support scripts in package.json
- [X] T002 [P] Configure static theme asset hosting and copy behavior in vite.config.ts
- [X] T003 [P] Create the initial feature module files at src/models/theme/themeCatalog.ts, src/services/theme/themeCatalogService.ts, src/services/theme/themeStylesheetService.ts, src/data/theme-catalog/supportedThemes.ts, src/components/theme/ThemeSelectorPage.tsx, src/components/theme/ThemeSelectorCard.tsx, and src/components/theme/ThemeStatusNotice.tsx

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core theme infrastructure that MUST be complete before any user story can be implemented.

**⚠️ CRITICAL**: No user story work should begin until this phase is complete.

- [X] T004 [P] Define `ThemeOption`, `ThemePreference`, `ThemeCatalog`, `ThemeLoadState`, and Zod validation schemas in src/models/theme/themeCatalog.ts
- [X] T005 [P] Create the supported-theme catalog including the BootstrapSpark default theme plus every available Bootswatch theme in src/data/theme-catalog/supportedThemes.ts
- [X] T006 [P] Add static stylesheet assets in public/themes/bootstrapspark.css and the Bootswatch theme folders under public/themes/
- [X] T007 Implement local-catalog loading, optional Bootswatch metadata mapping, and fallback validation in src/services/theme/themeCatalogService.ts
- [X] T008 Implement active stylesheet mounting, load-failure detection, and recovery-to-default behavior in src/services/theme/themeStylesheetService.ts
- [X] T009 Add a dedicated theme stylesheet mount target and app bootstrap integration in src/App.tsx and src/main.tsx

**Checkpoint**: Foundation ready. User story implementation can now proceed.

---

## Phase 3: User Story 1 - Select and Keep a Preferred Theme (Priority: P1) 🎯 MVP

**Goal**: Let visitors activate a supported theme immediately and keep that preference across navigation and future visits.

**Independent Test**: From the existing app shell, activate a non-default supported theme, refresh the page, navigate across multiple routes, and confirm the same theme remains active; also verify an invalid saved theme falls back to the BootstrapSpark default.

### Tests for User Story 1

- [X] T010 [P] [US1] Add unit tests for preference validation, invalid saved theme fallback, and catalog resolution in tests/unit/theme/themeCatalogService.test.ts
- [X] T011 [P] [US1] Add integration tests for immediate apply-and-persist behavior in tests/integration/theme/themePersistenceFlow.test.tsx
- [X] T012 [P] [US1] Add automated failure-path tests for Bootswatch metadata outage, local-catalog-only fallback, and stylesheet rollback in tests/integration/theme/themeFallbackRecovery.test.tsx

### Implementation for User Story 1

- [X] T013 [US1] Replace the binary theme state with a catalog-backed provider and apply-and-persist action in src/contexts/ThemeContext.tsx
- [X] T014 [P] [US1] Add theme preference parsing and storage helpers in src/utils/themePreference.ts
- [X] T015 [US1] Wire provider initialization and active theme bootstrap behavior in src/App.tsx
- [X] T016 [US1] Update the existing global theme affordance to reflect active catalog state in src/components/Header.tsx

**Checkpoint**: User Story 1 should be independently functional and testable as the MVP.

---

## Phase 4: User Story 2 - Browse and Compare Themes Before Choosing (Priority: P2)

**Goal**: Provide a dedicated theme selector that presents BootstrapSpark plus every available Bootswatch theme, clearly identifies the active choice, and surfaces optional preview metadata.

**Independent Test**: Open the dedicated selector, confirm BootstrapSpark plus every available Bootswatch theme is displayed, review their descriptions/preview cues, activate a new theme, and verify the selector reflects the active theme without losing app context.

### Tests for User Story 2

- [X] T017 [P] [US2] Add component and interaction tests for the selector page, active-theme states, and keyboard navigation in tests/integration/theme/themeSelectorPage.test.tsx
- [X] T018 [P] [US2] Add contract tests for catalog-to-selector view-model mapping in tests/contract/theme/themeCatalog.contract.test.ts
- [X] T019 [P] [US2] Add responsive viewport validation for mobile and desktop selector behavior in tests/integration/theme/themeSelectorResponsive.test.tsx

### Implementation for User Story 2

- [X] T020 [P] [US2] Build the selector page and theme card presentation in src/components/theme/ThemeSelectorPage.tsx and src/components/theme/ThemeSelectorCard.tsx
- [X] T021 [P] [US2] Add selector-specific styles and theme card layout rules in src/scss/components/theme-selector.scss and src/scss/styles.scss
- [X] T022 [US2] Register the dedicated theme selector route in src/App.tsx
- [X] T023 [US2] Add the selector entry point to global navigation in src/components/Header.tsx
- [X] T024 [US2] Surface selector loading, fallback, asset-recovery, and active-theme status messaging in src/components/theme/ThemeStatusNotice.tsx and src/components/theme/ThemeSelectorPage.tsx

**Checkpoint**: User Stories 1 and 2 should both work independently.

---

## Phase 5: User Story 3 - Experience Reliable Styling Across the Site (Priority: P3)

**Goal**: Ensure BootstrapSpark plus the full available Bootswatch theme set remains readable, navigable, and visually stable across the shared shell, primary routes, showcase pages, and site demos.

**Independent Test**: Activate each supported theme and verify the shared shell, primary routes, showcase pages, and site demos remain usable, with visible hover/focus/active/disabled states for key Bootstrap components.

### Tests for User Story 3

- [X] T025 [P] [US3] Add shell-level regression coverage for theme-sensitive shared UI in tests/integration/theme/themeShellRegression.test.tsx
- [X] T026 [P] [US3] Add route-level regression coverage for showcase and site-demo surfaces in tests/integration/theme/themeRouteCoverage.test.tsx
- [X] T027 [P] [US3] Add measurable switch-latency validation and reporting for the under-1-second target in tests/integration/theme/themePerformanceValidation.test.tsx

### Implementation for User Story 3

- [X] T028 [US3] Audit and remediate shared shell theme compatibility in src/components/Header.tsx, src/components/Footer.tsx, and src/scss/components/theme.scss
- [X] T029 [US3] Audit and remediate primary route surfaces in src/components/Hero.tsx, src/components/About.tsx, src/components/Projects.tsx, src/components/Articles.tsx, src/components/Joke.tsx, src/components/WeatherForecast.tsx, and src/components/Contact.tsx
- [X] T030 [US3] Audit and remediate showcase and site-demo surfaces in src/components/Components.tsx, src/components/AdvancedComponents.tsx, src/components/DataTables.tsx, src/components/SiteDemoSaasDashboard.tsx, src/components/SiteDemoTeamCollaboration.tsx, and src/components/SiteDemoProductCatalog.tsx
- [X] T031 [US3] Record supported-theme review coverage, responsive validation, and switch-latency outcomes in .documentation/specs/001-robust-theme-switcher/quickstart.md

**Checkpoint**: All user stories should now be independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Finish documentation, validation, and cross-story cleanup.

- [X] T032 [P] Add JSDoc for exported theme models and services in src/models/theme/themeCatalog.ts, src/services/theme/themeCatalogService.ts, and src/services/theme/themeStylesheetService.ts
- [X] T033 [P] Add unit coverage for any shared helpers introduced during implementation in tests/unit/theme/themePreference.test.ts
- [X] T034 [P] Validate packaged theme assets in the built docs output in tests/integration/theme/themeAssetPackaging.test.ts
- [X] T035 Run final validation commands and update execution notes in .documentation/specs/001-robust-theme-switcher/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion; blocks all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational completion; defines the MVP runtime.
- **User Story 2 (Phase 4)**: Depends on User Story 1 because the dedicated selector needs the catalog-backed provider and active-theme behavior in place.
- **User Story 3 (Phase 5)**: Depends on User Stories 1 and 2 so compatibility work covers the completed theme runtime and selector surfaces.
- **Polish (Phase 6)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Foundational and is independently testable.
- **User Story 2 (P2)**: Starts after User Story 1 runtime infrastructure is available; remains independently testable once delivered.
- **User Story 3 (P3)**: Starts after User Stories 1 and 2 because it validates and remediates their combined surface area.

### Within Each User Story

- Tests should be written before or alongside implementation and must fail before implementation is considered complete.
- Types and validation precede service wiring.
- Service wiring precedes UI integration.
- Route/shell integration precedes final regression checks.

### Parallel Opportunities

- `T002` and `T003` can run in parallel after `T001`.
- `T004`, `T005`, and `T006` can run in parallel in the Foundational phase.
- Within each story, the tasks marked `[P]` can run in parallel once prior dependencies are complete.

---

## Parallel Example: User Story 1

```bash
# Launch User Story 1 tests together:
Task: "Add unit tests for preference validation, invalid saved theme fallback, and catalog resolution in tests/unit/theme/themeCatalogService.test.ts"
Task: "Add integration tests for immediate apply-and-persist behavior in tests/integration/theme/themePersistenceFlow.test.tsx"
Task: "Add automated failure-path tests for Bootswatch metadata outage, local-catalog-only fallback, and stylesheet rollback in tests/integration/theme/themeFallbackRecovery.test.tsx"

# Launch helper work in parallel after provider requirements are understood:
Task: "Add theme preference parsing and storage helpers in src/utils/themePreference.ts"
Task: "Update the existing global theme affordance to reflect active catalog state in src/components/Header.tsx"
```

---

## Parallel Example: User Story 2

```bash
# Build selector UI pieces together:
Task: "Build the selector page and theme card presentation in src/components/theme/ThemeSelectorPage.tsx and src/components/theme/ThemeSelectorCard.tsx"
Task: "Add selector-specific styles and theme card layout rules in src/scss/components/theme-selector.scss and src/scss/styles.scss"
Task: "Add responsive viewport validation for mobile and desktop selector behavior in tests/integration/theme/themeSelectorResponsive.test.tsx"

# Validate mapping and UI behavior in parallel:
Task: "Add contract tests for catalog-to-selector view-model mapping in tests/contract/theme/themeCatalog.contract.test.ts"
Task: "Add component and interaction tests for the selector page and active-theme states in tests/integration/theme/themeSelectorPage.test.tsx"
```

---

## Parallel Example: User Story 3

```bash
# Split compatibility work by surface area:
Task: "Audit and remediate shared shell theme compatibility in src/components/Header.tsx, src/components/Footer.tsx, and src/scss/components/theme.scss"
Task: "Audit and remediate primary route surfaces in src/components/Hero.tsx, src/components/About.tsx, src/components/Projects.tsx, src/components/Articles.tsx, src/components/Joke.tsx, src/components/WeatherForecast.tsx, and src/components/Contact.tsx"
Task: "Audit and remediate showcase and site-demo surfaces in src/components/Components.tsx, src/components/AdvancedComponents.tsx, src/components/DataTables.tsx, src/components/SiteDemoSaasDashboard.tsx, src/components/SiteDemoTeamCollaboration.tsx, and src/components/SiteDemoProductCatalog.tsx"
Task: "Add measurable switch-latency validation and reporting for the under-1-second target in tests/integration/theme/themePerformanceValidation.test.tsx"
```

---

## Gate Acknowledgements

No unresolved checklist, analyze, or critic findings were present at task-generation time.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Setup and Foundational phases.
2. Complete User Story 1.
3. Validate persistence, fallback, and cross-route theme application.
4. Stop and confirm the MVP before expanding to the dedicated selector.

### Incremental Delivery

1. Deliver catalog-backed runtime theming and persistence.
2. Add the dedicated selector and navigation entry point.
3. Complete cross-route compatibility remediation and regression coverage.
4. Finish with documentation, JSDoc, and command validation.

### Parallel Team Strategy

1. One developer handles foundational catalog/schema/service work.
2. One developer handles selector UI and styling once the provider contract stabilizes.
3. One developer handles regression coverage and route-surface remediation after the selector is in place.

---

## Notes

- Total tasks: 35
- Tasks per user story: US1 = 7, US2 = 8, US3 = 7
- Setup/foundational/polish tasks: 13
- All tasks follow the required checklist format with checkbox, ID, optional `[P]`, required story label for story phases, and exact file paths.