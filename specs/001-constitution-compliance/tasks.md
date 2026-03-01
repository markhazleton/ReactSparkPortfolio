# Tasks: Constitution Compliance - Critical Remediation

**Input**: Design documents from `.documentation/specs/001-constitution-compliance/`
**Prerequisites**: ../../.documentation/specs/001-constitution-compliance/plan.md ✅, spec.md ✅, ../../.documentation/specs/001-constitution-compliance/research.md ✅, ../../.documentation/specs/001-constitution-compliance/data-model.md ✅, ../../.documentation/specs/001-constitution-compliance/contracts/ ✅

**Feature Goal**: Resolve critical constitution violations by implementing testing infrastructure, runtime validation, quality gates, logging cleanup, and error boundaries to achieve >85% constitution compliance.

**Total Tasks**: 102 tasks across 9 phases (T001-T100 + T062a, T076a)  
**Estimated Time**: 6-8 hours (phased implementation)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story label (US1, US2, US3, US4, US5, US6)
- All tasks include exact file paths

## Path Conventions

This is a single-page web application with:

- Source code: `src/` at repository root
- Tests: `tests/` at repository root
- Configuration: Root level config files

---

## Phase 1: Setup (Project Infrastructure)

**Purpose**: Initialize testing infrastructure and dependencies  
**Duration**: ~30 minutes  
**Blocking**: Must complete before any other phase

- [x] T001 Install Vitest and React Testing Library dependencies

  ```bash
  npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @vitest/ui
  ```

- [x] T002 Create Vitest configuration file at vitest.config.ts per contracts/vitest-config.md

- [x] T003 Create test setup file at src/test/setup.ts with jsdom mocks and @testing-library/jest-dom imports

- [x] T004 Add test scripts to package.json and verify all three scripts exist: `test`, `test:ui`, and `test:coverage`

- [x] T005 Create tests directory structure: tests/unit/services/, tests/integration/

- [x] T006 Verify tsconfig.json includes test files in compilation scope

- [x] T007 Run `npm test` to verify Vitest configuration loads correctly (should report "No test files found")

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Install shared dependencies needed across multiple user stories  
**Duration**: ~15 minutes  
**Blocking**: Must complete before US3 (Zod) and US4 (Husky/Prettier)

- [x] T008 Install Zod library for runtime validation

  ```bash
  npm install zod
  ```

- [x] T009 Install Husky and lint-staged for pre-commit hooks

  ```bash
  npm install -D husky lint-staged prettier
  ```

- [x] T010 Initialize Husky hooks directory
  ```bash
  npx husky init
  ```

---

## Phase 3: User Story 1 - Testing Infrastructure Setup (Priority: P1) 🎯 MVP

**Story Goal**: Enable automated testing with Vitest + React Testing Library  
**Independent Test**: Run `npm test` and verify test runner executes successfully  
**Value Delivered**: Team can write and run tests (constitution Principle III)

### Verification Tests for User Story 1

- [x] T011 [US1] Create smoke test at tests/unit/smoke.test.ts to verify Vitest runs

- [x] T012 [US1] Test that coverage report generates with `npm run test:coverage`

- [x] T013 [US1] Test that test:ui command opens Vitest UI (`npm run test:ui`)

### Implementation for User Story 1

- [x] T014 [US1] Verify vitest.config.ts has coverage thresholds: 80% branch, 70% line, 80% function

- [x] T015 [US1] Verify src/test/setup.ts includes window.matchMedia mock for Bootstrap components

- [x] T016 [US1] Verify src/test/setup.ts includes localStorage mock

- [x] T017 [US1] Verify src/test/setup.ts includes IntersectionObserver mock

- [x] T018 [US1] Run `npm test` and confirm infrastructure is working

**US1 Complete**: ✅ Testing infrastructure ready for service tests

---

## Phase 4: User Story 2 - Service Layer Test Coverage (Priority: P2)

**Story Goal**: Comprehensive unit tests for all 3 service modules  
**Independent Test**: Run tests and verify >80% branch coverage for services  
**Value Delivered**: Data layer validated and protected from regressions

### Tests for User Story 2 - ProjectService

- [x] T019 [P] [US2] Create tests/unit/services/ProjectService.test.ts with describe block and beforeEach setup

- [x] T020 [P] [US2] Write test: "should fetch projects from remote source successfully" in tests/unit/services/ProjectService.test.ts

- [x] T021 [P] [US2] Write test: "should use cached data when available and fresh" in tests/unit/services/ProjectService.test.ts

- [x] T022 [P] [US2] Write test: "should fall back to cache when remote fetch fails" in tests/unit/services/ProjectService.test.ts

- [x] T023 [P] [US2] Write test: "should fall back to local JSON when cache and remote both fail" in tests/unit/services/ProjectService.test.ts

- [x] T024 [P] [US2] Write test: "should invalidate cache on version change" in tests/unit/services/ProjectService.test.ts

- [x] T025 [P] [US2] Write test: "should invalidate cache when expired (>1 hour)" in tests/unit/services/ProjectService.test.ts

### Tests for User Story 2 - JokeService

- [x] T026 [P] [US2] Create tests/unit/services/JokeService.test.ts with describe block

- [x] T027 [P] [US2] Write test: "should fetch joke from API successfully" in tests/unit/services/JokeService.test.ts

- [x] T028 [P] [US2] Write test: "should filter jokes by category" in tests/unit/services/JokeService.test.ts

- [x] T029 [P] [US2] Write test: "should handle single-part jokes" in tests/unit/services/JokeService.test.ts

- [x] T030 [P] [US2] Write test: "should handle two-part jokes" in tests/unit/services/JokeService.test.ts

- [x] T031 [P] [US2] Write test: "should handle API errors gracefully" in tests/unit/services/JokeService.test.ts

### Tests for User Story 2 - RssService

- [x] T032 [P] [US2] Create tests/unit/services/RssService.test.ts with describe block

- [x] T033 [P] [US2] Write test: "should fetch and parse RSS feed successfully" in tests/unit/services/RssService.test.ts

- [x] T034 [P] [US2] Write test: "should cache RSS feed data" in tests/unit/services/RssService.test.ts

- [x] T035 [P] [US2] Write test: "should handle malformed RSS data" in tests/unit/services/RssService.test.ts

- [x] T036 [P] [US2] Write test: "should filter articles by category" in tests/unit/services/RssService.test.ts

### Verification for User Story 2

- [x] T037 [US2] Run `npm run test:coverage` and verify service layer shows >80% branch coverage

- [x] T038 [US2] Review coverage HTML report and identify any untested paths in services

**US2 Complete**: ✅ All 3 services have comprehensive test coverage

---

## Phase 5: User Story 3 - Runtime Validation with Zod (Priority: P3)

**Story Goal**: Add runtime validation for all external API data  
**Independent Test**: Send invalid data to schemas and verify errors are thrown  
**Value Delivered**: Security and stability through data validation (constitution Principle VIII)

### Implementation for User Story 3 - ProjectData Schema

- [x] T039 [P] [US3] Add ProjectDataSchema to src/models/Project.tsx per contracts/project-schema.md

- [x] T040 [P] [US3] Add ProjectDataArraySchema to src/models/Project.tsx

- [x] T041 [P] [US3] Export z.infer types from src/models/Project.tsx

- [x] T042 [US3] Update src/services/ProjectService.ts to import and use ProjectDataArraySchema.parse()

- [x] T043 [US3] Add Zod validation error handling with fallback to cache in src/services/ProjectService.ts

### Implementation for User Story 3 - JokeAPI Schema

- [x] T044 [P] [US3] Create JokeAPIResponseSchema in src/services/JokeService.ts with discriminated union (single/twopart)

- [x] T045 [P] [US3] Add SingleJokeSchema definition in src/services/JokeService.ts

- [x] T046 [P] [US3] Add TwoPartJokeSchema definition in src/services/JokeService.ts

- [x] T047 [US3] Update fetchJokeFromAPI() in src/services/JokeService.ts to validate with JokeAPIResponseSchema.parse()

- [x] T048 [US3] Add Zod validation error handling in src/services/JokeService.ts

### Implementation for User Story 3 - RssArticle Schema

- [x] T049 [P] [US3] Create RssArticleSchema in src/services/RssService.ts

- [x] T050 [US3] Update fetchRssFeed() in src/services/RssService.ts to validate with RssArticleArraySchema.parse()

- [x] T051 [US3] Add Zod validation error handling in src/services/RssService.ts

### Verification for User Story 3

- [x] T052 [US3] Update ProjectService tests to verify Zod validation rejects invalid data

- [x] T053 [US3] Update JokeService tests to verify Zod validation rejects invalid data

- [x] T054 [US3] Update RssService tests to verify Zod validation rejects invalid data

- [x] T055 [US3] Run `npm test` and verify all services still pass with Zod validation

**US3 Complete**: ✅ All external APIs validated with Zod schemas

---

## Phase 6: User Story 4 - Code Quality Gates with Husky & Prettier (Priority: P4)

**Story Goal**: Automated pre-commit hooks enforce linting and formatting  
**Independent Test**: Attempt to commit poorly formatted code and verify it's blocked  
**Value Delivered**: Automated quality enforcement (constitution Principles II & X)

### Implementation for User Story 4 - Prettier

- [x] T056 [US4] Create .prettierrc configuration file with semi: true, singleQuote: false, printWidth: 100

- [x] T057 [US4] Create .prettierignore with node_modules, docs, dist, build

- [x] T058 [US4] Add format script to package.json: `prettier --write .`

### Implementation for User Story 4 - Husky & lint-staged

- [x] T059 [US4] Create .husky/pre-commit hook file with `npm run lint-staged` command

- [x] T060 [US4] Add lint-staged configuration to package.json for \*.{ts,tsx,js,jsx} files

- [x] T061 [US4] Add lint-staged configuration to package.json for \*.{json,md,css,scss} files

- [x] T062 [US4] Add prepare script to package.json: `husky install`

- [x] T062a [US4] Add TypeScript type-check to lint-staged configuration in package.json (addresses FR-023)

### Verification for User Story 4

- [x] T063 [US4] Run `npm run format` and verify all files are formatted consistently

- [x] T064 [US4] Create a test commit with poorly formatted code and verify pre-commit hook blocks it

- [x] T065 [US4] Verify pre-commit hook auto-formats files before commit

**US4 Complete**: ✅ Pre-commit hooks enforcing code quality

---

## Phase 7: User Story 5 - Production Logging Cleanup (Priority: P5)

**Story Goal**: Remove all console statements from production source code  
**Independent Test**: Search source for console.\* and verify none exist  
**Value Delivered**: Clean production code (constitution Principle VII)

### Implementation for User Story 5

- [x] T066 [P] [US5] Remove console.error from src/components/About.tsx (line 55, 74)

- [x] T067 [P] [US5] Remove console.error from src/components/Articles.tsx (lines 88, 114, 201)

- [x] T068 [P] [US5] Remove console.log/error from src/components/Chat.tsx (17 occurrences, lines 115-253)

- [x] T069 [P] [US5] Remove console.log from src/components/Contact.tsx (line 19)

- [x] T070 [P] [US5] Remove console.error from src/components/Footer.tsx (line 26)

- [x] T071 [P] [US5] Remove console.error from src/components/Joke.tsx (line 106)

- [x] T072 [P] [US5] Remove console.log statements from src/services/ProjectService.ts (multiple instances)

- [x] T073 [P] [US5] Remove console.error statements from src/services/JokeService.ts

- [x] T074 [P] [US5] Remove console.error statements from src/services/RssService.ts

### Verification for User Story 5

- [x] T075 [US5] Run `grep -r "console\." src/` and verify no matches (or only in comments)

- [x] T076 [US5] Run `npm run build` to create production build

- [x] T076a [US5] Verify vite.config.ts has @rollup/plugin-strip configured correctly to remove console statements (addresses FR-027)

- [x] T077 [US5] Run `grep -r "console\." docs/assets/` and verify no console statements in built output

**US5 Complete**: ✅ All console statements removed from source and production build

---

## Phase 8: User Story 6 - Error Boundary Implementation (Priority: P6)

**Story Goal**: Component errors isolated and handled gracefully  
**Independent Test**: Throw component error and verify boundary catches it  
**Value Delivered**: Resilient error handling (constitution Principle VI)

### Implementation for User Story 6

- [x] T078 [US6] Create src/components/ErrorBoundary.tsx class component with getDerivedStateFromError

- [x] T079 [US6] Implement componentDidCatch lifecycle method in src/components/ErrorBoundary.tsx

- [x] T080 [US6] Create fallback UI with Alert component in src/components/ErrorBoundary.tsx

- [x] T081 [US6] Add refresh button and actionable error message to ErrorBoundary fallback

- [x] T082 [US6] Export ErrorBoundary from src/components/ErrorBoundary.tsx

- [x] T083 [US6] Import ErrorBoundary in src/App.tsx

- [x] T084 [US6] Wrap Router with ErrorBoundary in src/App.tsx

### Tests for User Story 6

- [x] T085 [US6] Create tests/unit/components/ErrorBoundary.test.tsx

- [x] T086 [US6] Write test: "should render children when no error" in ErrorBoundary.test.tsx

- [x] T087 [US6] Write test: "should catch errors and display fallback UI" in ErrorBoundary.test.tsx

- [x] T088 [US6] Write test: "should render custom fallback when provided" in ErrorBoundary.test.tsx

### Verification for User Story 6

- [x] T089 [US6] Run `npm test` and verify ErrorBoundary tests pass

- [x] T090 [US6] Manually test by adding throw statement in a component and verifying fallback displays

**US6 Complete**: ✅ Error boundaries protecting application routes

---

## Phase 9: Final Polish & Verification

**Purpose**: Cross-cutting concerns and final verification  
**Duration**: ~30 minutes

- [x] T091 Run full test suite with `npm test` and verify all tests pass

- [x] T092 Run `npm run test:coverage` and verify meets thresholds: 80% branch, 70% line, 80% function

- [x] T093 Run `npm run lint` and verify no linting errors

- [x] T094 Run `npm run type-check` and verify no TypeScript errors

- [x] T095 Run `npm run build` and verify production build succeeds

- [x] T096 Verify production build size is acceptable (no significant bloat from new dependencies)

- [x] T097 Update README.md with new test commands and pre-commit hook information

- [x] T098 Run site audit again: `.\.documentation\scripts\powershell\site-audit.ps1 -Json` and verify improved compliance

- [x] T099 Document any remaining TODOs or future enhancements in project backlog

- [x] T100 Create PR with all changes and request constitution-aware review

---

## Dependencies & Execution Order

### Phase Dependencies (Must Execute in Order)

```
Phase 1 (Setup)
   ↓
Phase 2 (Foundational)
   ↓
Phase 3 (US1 - Testing Infrastructure) ← BLOCKING for all test-writing tasks
   ↓
├─→ Phase 4 (US2 - Service Tests)
├─→ Phase 5 (US3 - Zod Validation)
├─→ Phase 6 (US4 - Husky/Prettier)
├─→ Phase 7 (US5 - Logging Cleanup)
└─→ Phase 8 (US6 - Error Boundaries)
   ↓
Phase 9 (Final Polish)
```

### User Story Dependencies

- **US1 BLOCKS**: US2 (can't write tests without infrastructure)
- **US2 INDEPENDENT**: No dependencies after US1
- **US3 INDEPENDENT**: No dependencies after Phase 2 (Zod installed)
- **US4 INDEPENDENT**: No dependencies after Phase 2 (Husky installed)
- **US5 INDEPENDENT**: Can start anytime
- **US6 INDEPENDENT**: Can start anytime

### Within Each User Story

**User Story 2** (Service Tests):

- Tests can all run in parallel (marked with [P])
- Each service test suite is independent

**User Story 3** (Zod Validation):

- Schema definitions can run in parallel (marked with [P])
- Service updates must happen after their schema is defined
- Tests must run after service updates

**User Story 5** (Logging Cleanup):

- All cleanup tasks can run in parallel (marked with [P])
- Verification must happen after all cleanup

**User Story 6** (Error Boundaries):

- Implementation before tests
- Tests can run in parallel

### Parallel Opportunities

**Maximum parallelization** (independent streams):

1. **Stream 1** (Critical Path):
   - T001-T018 (US1 - Testing Infrastructure)
   - T019-T038 (US2 - Service Tests)

2. **Stream 2** (Validation):
   - T008 (Install Zod)
   - T039-T055 (US3 - Zod Validation)

3. **Stream 3** (Quality Gates):
   - T009-T010 (Install Husky/Prettier)
   - T056-T065, T062a (US4 - Quality Gates)

4. **Stream 4** (Cleanup):
   - T066-T077, T076a (US5 - Logging Cleanup) - can start anytime

5. **Stream 5** (Error Handling):
   - T078-T090 (US6 - Error Boundaries) - can start anytime

---

## Parallel Example: User Story 2 (Service Tests)

**Scenario**: 3 developers implementing service tests simultaneously

**Developer A** (ProjectService):

```bash
# T019-T025: Write all ProjectService tests
git checkout -b us2-project-tests
# Implement T019-T025
git commit -m "test: add ProjectService test suite"
```

**Developer B** (JokeService):

```bash
# T026-T031: Write all JokeService tests
git checkout -b us2-joke-tests
# Implement T026-T031
git commit -m "test: add JokeService test suite"
```

**Developer C** (RssService):

```bash
# T032-T036: Write all RssService tests
git checkout -b us2-rss-tests
# Implement T032-T036
git commit -m "test: add RssService test suite"
```

**Merge Order**: Any order (no conflicts, different files)

---

## Implementation Strategy

### MVP First (User Story 1 Only)

**Absolute minimum for constitution compliance:**

```bash
# Phase 1 + Phase 2 + Phase 3 only
Tasks: T001-T018
Time: ~1 hour
Result: Testing infrastructure operational
```

This delivers **immediate value**: Team can start writing tests.

### Incremental Delivery

**Week 1**: US1 + US2 (Testing infrastructure + Service tests)

- Deliverable: >80% service layer coverage
- Constitution improvement: Principle III partially addressed

**Week 2**: US3 + US4 (Zod validation + Quality gates)

- Deliverable: Runtime validation + Pre-commit hooks
- Constitution improvement: Principles VIII, II, X addressed

**Week 3**: US5 + US6 + Polish (Logging cleanup + Error boundaries + Verification)

- Deliverable: Production-ready codebase
- Constitution improvement: Principles VII, VI addressed
- **Final Result**: 42% → >85% compliance

### Parallel Team Strategy

**If 3+ developers available:**

- **Dev 1** (Critical Path): T001-T018 → T019-T025 → T037-T038
- **Dev 2** (Validation): T026-T031 + T039-T055
- **Dev 3** (Quality + Cleanup): T032-T036 + T056-T065, T062a + T066-T077, T076a
- **Dev 4** (Error Handling): T078-T090

**Convergence**: All streams merge for Phase 9 (Final Polish)

---

## Notes

- **Total Tasks**: 102 tasks (T001-T100 + T062a, T076a)
- **Parallelizable**: 47 tasks marked with [P]
- **Time Estimate**:
  - Sequential: ~8-10 hours
  - With 3 developers: ~4-6 hours
  - MVP only (US1): ~1 hour
- **Constitution Impact**:
  - Before: 42% compliance (3 CRITICAL violations)
  - After: >85% compliance (all MANDATORY principles passing)

- **Risk Mitigation**:
  - US1 completion gates all future work (ensures testability)
  - Each user story independently testable
  - Parallel tasks minimize dependencies
  - Incremental delivery allows early feedback

- **Success Metrics**:
  - All 102 tasks completed ✓
  - Test coverage >80% branch, >70% line ✓
  - Zero console statements in production ✓
  - Pre-commit hooks operational ✓
  - Error boundaries protecting routes ✓
  - Constitution re-audit shows >85% ✓

---

**Tasks Generated**: 2026-03-01  
**Ready for Implementation**: ✅  
**Next Step**: Begin Phase 1 (T001-T007) or run `/speckit.implement` for guided execution
