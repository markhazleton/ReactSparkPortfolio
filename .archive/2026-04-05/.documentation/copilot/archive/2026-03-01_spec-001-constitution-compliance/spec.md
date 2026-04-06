# Feature Specification: Constitution Compliance - Critical Remediation

**Feature Branch**: `001-constitution-compliance`  
**Created**: 2026-03-01  
**Status**: Draft  
**Input**: User description: "Address critical issues found during site audit: implement testing infrastructure, runtime validation, remove console statements, configure quality gates, and add error boundaries to achieve constitution compliance"

**Audit Reference**: [2026-03-01 Site Audit Results](../../.documentation/copilot/audit/2026-03-01_results.md)

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Testing Infrastructure Setup (Priority: P1)

**As a** developer working on ReactSparkPortfolio  
**I want** a complete testing infrastructure with Vitest and React Testing Library configured  
**So that** I can write and run automated tests to prevent regressions and ensure code quality

**Why this priority**: This is marked as NON-NEGOTIABLE in Constitution Principle III. Without testing infrastructure, the project cannot meet mandatory constitution requirements. This blocks all future development work as tests are required before merge.

**Constitution Alignment**: Implements Principle III - Testing (MANDATORY - NON-NEGOTIABLE)

**Independent Test**: Can be fully tested by installing dependencies, running `npm test`, and verifying that the test runner executes successfully. Delivers immediate value by enabling test-driven development.

**Acceptance Scenarios**:

1. **Given** a fresh checkout of the repository, **When** I run `npm install`, **Then** Vitest and React Testing Library dependencies are installed successfully
2. **Given** the testing infrastructure is configured, **When** I run `npm test`, **Then** the test runner executes and reports zero tests found (initially)
3. **Given** the testing infrastructure is configured, **When** I run `npm run test:coverage`, **Then** coverage reports are generated with configured thresholds (80% branch, 70% line, 80% function)
4. **Given** I create a simple test file, **When** I run `npm test`, **Then** the test executes and results are displayed
5. **Given** tests are failing, **When** I try to commit, **Then** pre-commit hooks prevent the commit (after P3 is complete)

---

### User Story 2 - Service Layer Test Coverage (Priority: P2)

**As a** developer maintaining the project  
**I want** comprehensive unit tests for all service layer modules  
**So that** data fetching, caching, and fallback logic is validated and protected from regressions

**Why this priority**: Service layer is critical infrastructure handling external API calls, caching, and fallback strategies. These must be tested before component tests to establish a stable foundation.

**Independent Test**: Can be tested by running service-specific tests and verifying all fetch, cache, and fallback scenarios pass. Delivers value by ensuring data layer reliability.

**Acceptance Scenarios**:

1. **Given** ProjectService tests exist, **When** I run tests, **Then** remote fetch, cache hit, cache miss, and local fallback scenarios all pass
2. **Given** JokeService tests exist, **When** I run tests, **Then** API integration, filtering, and error handling scenarios all pass
3. **Given** RssService tests exist, **When** I run tests, **Then** RSS parsing, caching, and error handling scenarios all pass
4. **Given** all service tests are written, **When** I run coverage report, **Then** service layer shows >80% branch coverage
5. **Given** a service API changes, **When** tests run, **Then** breaking changes are immediately detected

---

### User Story 3 - Runtime Validation with Zod (Priority: P3)

**As a** developer consuming external APIs  
**I want** runtime validation using Zod schemas for all external data  
**So that** invalid or malformed data from external sources is caught before causing runtime errors

**Why this priority**: This addresses Constitution Principle VIII (Input Validation & Security) and is critical for security and stability. Must be completed before deploying to production.

**Constitution Alignment**: Implements Principle VIII - Input Validation & Security (MANDATORY)

**Independent Test**: Can be tested by sending malformed data to validation schemas and verifying appropriate errors are thrown. Delivers value by preventing data corruption and crashes.

**Acceptance Scenarios**:

1. **Given** Zod is installed, **When** I import it in a service, **Then** the import succeeds without errors
2. **Given** ProjectDataSchema is defined, **When** valid project data is passed to it, **Then** validation succeeds and returns typed data
3. **Given** ProjectDataSchema is defined, **When** invalid data is passed to it, **Then** validation fails with descriptive error message
4. **Given** all services use Zod validation, **When** external API returns unexpected data shape, **Then** the error is caught at the validation layer with actionable message
5. **Given** runtime validation is implemented, **When** I fetch data from any external source, **Then** all data passes through validation schemas

---

### User Story 4 - Code Quality Gates with Husky & Prettier (Priority: P4)

**As a** developer contributing to the project  
**I want** automated pre-commit hooks that enforce linting and formatting  
**So that** code quality standards are automatically maintained and bad code never reaches the repository

**Why this priority**: This addresses Constitution Principles II and X (Code Quality & Linting, Code Quality Gates). Prevents quality issues from entering codebase but can be implemented after critical functionality is tested.

**Constitution Alignment**: Implements Principles II & X - Code Quality & Linting, Code Quality Gates (MANDATORY)

**Independent Test**: Can be tested by attempting to commit poorly formatted or failing lint code and verifying the commit is blocked. Delivers value by automating code quality enforcement.

**Acceptance Scenarios**:

1. **Given** Husky is configured, **When** I make a commit, **Then** pre-commit hooks execute automatically
2. **Given** I have files with linting errors, **When** I attempt to commit, **Then** the commit is blocked with clear error messages
3. **Given** I have files with formatting inconsistencies, **When** pre-commit runs, **Then** Prettier auto-formats the files
4. **Given** Prettier configuration exists, **When** I run `npm run format`, **Then** all files are formatted consistently
5. **Given** I have TypeScript errors, **When** I attempt to commit, **Then** type-check fails and commit is blocked

---

### User Story 5 - Production Logging Cleanup (Priority: P5)

**As a** developer preparing code for production  
**I want** all console.log/error statements removed from source code  
**So that** production builds are clean, performant, and don't leak debugging information

**Why this priority**: This addresses Constitution Principle VII (Logging & Observability). While important, existing rollup plugin may already strip console statements in production. This work validates that behavior and cleans up source code.

**Constitution Alignment**: Implements Principle VII - Logging & Observability (MANDATORY)

**Independent Test**: Can be tested by searching source code for console statements and verifying none exist, or that build process removes them. Delivers value through cleaner codebase and better performance.

**Acceptance Scenarios**:

1. **Given** I search src/ directory for console statements, **When** search completes, **Then** zero console.log/error/warn statements are found (or only in development-only code paths)
2. **Given** production build is created, **When** I inspect the built JavaScript, **Then** no console statements exist in the output
3. **Given** error occurs in production, **When** error is caught, **Then** it's handled gracefully without console logging
4. **Given** development mode is running, **When** errors occur, **Then** appropriate error tracking is in place (if applicable)
5. **Given** build process runs, **When** @rollup/plugin-strip executes, **Then** all console statements are removed from output

---

### User Story 6 - Error Boundary Implementation (Priority: P6)

**As a** user of the ReactSparkPortfolio application  
**I want** component errors to be isolated and handled gracefully  
**So that** a single component failure doesn't crash the entire application

**Why this priority**: This addresses Constitution Principle VI (Error Handling & Resilience). Important for resilience but lower priority than testing and validation since existing error handling is already in place via try-catch blocks.

**Constitution Alignment**: Implements Principle VI - Error Handling & Resilience (MANDATORY)

**Independent Test**: Can be tested by intentionally throwing errors in components and verifying the error boundary catches them and displays fallback UI. Delivers value through improved user experience during failures.

**Acceptance Scenarios**:

1. **Given** ErrorBoundary component exists, **When** I import it in App.tsx, **Then** import succeeds and component renders children
2. **Given** a component throws an error, **When** the error propagates, **Then** ErrorBoundary catches it and displays fallback UI
3. **Given** ErrorBoundary catches an error, **When** error occurs, **Then** error details are logged (but not to console in production)
4. **Given** ErrorBoundary displays fallback, **When** user sees the message, **Then** they are offered actionable recovery options (refresh, contact support)
5. **Given** multiple routes exist, **When** one route's component errors, **Then** other routes remain functional

---

### Edge Cases

- **What happens when** a test fails in CI but passes locally? → Ensure CI environment matches local environment configuration
- **What happens when** Zod validation fails for cached data after a schema change? → Clear cache on app version change (already implemented via version checking)
- **What happens when** pre-commit hooks take too long to run? → Configure lint-staged to only check changed files
- **What happens when** external API changes data format without warning? → Zod validation catches it immediately and prevents propagation
- **What happens when** error boundary itself errors? → React's built-in error fallback kicks in, or implement nested boundaries
- **What happens when** tests need to run but testing infrastructure isn't yet configured? → P1 blocks all other work until complete
- **What happens when** team members don't have Husky hooks installed? → Husky installation is automatic on `npm install` via prepare script
- **What happens when** coverage thresholds aren't met? → Build fails in CI, preventing merge until coverage improves

## Requirements _(mandatory)_

### Functional Requirements

#### Testing Infrastructure (P1)

- **FR-001**: System MUST have Vitest configured as the test runner with jsdom environment for React components
- **FR-002**: System MUST have @testing-library/react installed for component testing
- **FR-003**: System MUST have @testing-library/jest-dom installed for DOM assertions
- **FR-004**: System MUST have coverage reporting configured with thresholds: 80% branch, 70% line, 80% function
- **FR-005**: System MUST have test setup file that configures globals and jsdom environment
- **FR-006**: Package.json MUST include test scripts: `test`, `test:ui`, and `test:coverage`

#### Service Layer Tests (P2)

- **FR-007**: ProjectService MUST have unit tests covering: remote fetch, cache hit, cache miss, local fallback, and error scenarios
- **FR-008**: JokeService MUST have unit tests covering: API integration, category filtering, error handling, and caching
- **FR-009**: RssService MUST have unit tests covering: RSS feed parsing, caching, and error scenarios
- **FR-010**: All service tests MUST achieve minimum 80% branch coverage
- **FR-011**: Tests MUST mock external API calls to ensure deterministic test execution

#### Runtime Validation (P3)

- **FR-012**: System MUST have Zod library installed for runtime validation
- **FR-013**: System MUST define Zod schemas for ProjectData matching existing TypeScript interfaces
- **FR-014**: System MUST define Zod schemas for JokeAPI responses
- **FR-015**: System MUST define Zod schemas for RSS feed data structures
- **FR-016**: All external API responses MUST be validated through Zod schemas before use
- **FR-017**: Validation failures MUST throw descriptive errors that identify the invalid field

#### Code Quality Gates (P4)

- **FR-018**: System MUST have Husky installed and configured for Git hooks
- **FR-019**: System MUST have lint-staged configured to run on pre-commit
- **FR-020**: System MUST have Prettier configuration file (.prettierrc) with project standards
- **FR-021**: Pre-commit hook MUST run ESLint on staged TypeScript/JavaScript files
- **FR-022**: Pre-commit hook MUST run Prettier formatting on staged files
- **FR-023**: Pre-commit hook MUST run TypeScript type-check before allowing commit (implemented via lint-staged)
- **FR-024**: Package.json MUST include `prepare` script to install Husky hooks automatically

#### Production Logging (P5)

- **FR-025**: Source code MUST NOT contain console.log statements except in development-only code paths
- **FR-026**: Source code MUST NOT contain console.error statements; errors MUST use proper error handling
- **FR-027**: Build process MUST verify @rollup/plugin-strip removes console statements in production
- **FR-028**: Error handling MUST use try-catch blocks with appropriate user feedback instead of console logging

#### Error Boundaries (P6)

- **FR-029**: System MUST have ErrorBoundary class component implementing componentDidCatch
- **FR-030**: ErrorBoundary MUST catch component render errors and display user-friendly fallback UI
- **FR-031**: ErrorBoundary MUST provide fallback UI with option to refresh or contact support
- **FR-032**: App.tsx MUST wrap route components with ErrorBoundary for error isolation
- **FR-033**: ErrorBoundary errors SHOULD be sent to error tracking service (future enhancement)

### Key Entities

- **Test Suite**: Collection of test files organized by type (unit, integration, contract) covering services, utilities, and components
- **Validation Schema**: Zod schema definitions that mirror TypeScript interfaces but provide runtime validation
- **Error Boundary**: React class component that catches rendering errors and provides fallback UI
- **Pre-commit Hook**: Git hook configuration that runs quality checks before allowing commits
- **Coverage Report**: Generated HTML and terminal output showing test coverage metrics per file and overall

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Constitution compliance score increases from 42% to >85% (passing grade)
- **SC-002**: Test coverage reaches minimum thresholds: 80% branch, 70% line, 80% function coverage
- **SC-003**: All 3 critical violations from audit (TEST1, TEST2, VALID1) are resolved
- **SC-004**: All 5 high priority violations from audit (LOG1-3, QUAL1-2, ERR1) are resolved
- **SC-005**: CI pipeline successfully runs tests and blocks merge on test failures or coverage drops
- **SC-006**: Developer can run `npm test` and see results for all services within 5 seconds
- **SC-007**: Pre-commit hooks execute in <10 seconds for typical commit with 5-10 changed files
- **SC-008**: Production build contains zero console.log/error statements (verified by inspection)
- **SC-009**: Component errors are gracefully handled without crashing entire application
- **SC-010**: Re-audit shows PASS status for all MANDATORY constitution principles
