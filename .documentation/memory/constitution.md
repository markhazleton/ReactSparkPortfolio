<!--
  SYNC IMPACT REPORT
  ==================
  Version Change: Template → 1.0.0 (MAJOR - Initial formal constitution)
  
  Modified Principles:
  - Created 10 core principles from discovered patterns
  - Added Testing as NON-NEGOTIABLE mandatory requirement
  - Formalized Type Safety, Code Quality, Documentation requirements
  - Added Error Handling, Logging, Security, Styling, Quality Gates principles
  
  Added Sections:
  - Additional Standards (Performance, SEO, Deployment)
  - Comprehensive Governance section with enforcement rules
  
  Templates Status:
  ✅ plan-template.md - Constitution Check section validated
  ✅ spec-template.md - User story prioritization aligns with testing requirement
  ✅ tasks-template.md - Task organization supports principle enforcement
  
  Follow-up Actions:
  - Add testing infrastructure (Vitest + React Testing Library)
  - Configure Prettier for code formatting
  - Add pre-commit hooks (Husky + lint-staged)
  - Implement React Error Boundaries
  - Add Zod for runtime validation
  - Update README.md to reference constitution
  
  Suggested Commit Message:
  docs: establish ReactSparkPortfolio constitution v1.0.0
  
  - Formalize 10 core development principles from codebase analysis
  - Add mandatory testing requirements with coverage thresholds
  - Define type safety, security, and quality standards
  - Establish governance and enforcement procedures
-->

# ReactSparkPortfolio Constitution

## Core Principles

### I. Type Safety (MANDATORY)

**All code must use TypeScript with strict mode enabled.**

- TypeScript `strict: true` MUST be enforced in tsconfig.json
- All React components SHOULD use `React.FC` or explicit typing
- Interfaces and type definitions MUST be used for all data structures
- No `any` types except with explicit justification and comment

**Rationale**: Type safety prevents runtime errors, improves IDE support, and makes refactoring safer. The codebase demonstrates strong TypeScript adoption with strict mode enabled and comprehensive type definitions across 35 source files.

---

### II. Code Quality & Linting (MANDATORY)

**ESLint must be configured and passing for all code.**

- ESLint with typescript-eslint, react-hooks, react-refresh plugins MUST be configured
- All code MUST pass `npm run lint` without errors
- Linting rules MUST include React best practices (hooks, refresh)
- Prettier MUST be configured for consistent code formatting

**Rationale**: Automated linting catches bugs early and enforces consistent code style. ESLint configuration exists but Prettier integration needs formalization to ensure uniform formatting.

---

### III. Testing (MANDATORY - NON-NEGOTIABLE)

**All new code must have automated tests with enforced coverage thresholds.**

- Testing infrastructure (Vitest/Jest) MUST be configured
- All new features MUST have corresponding tests before merge
- Services and business logic MUST have unit tests
- Components SHOULD have component tests
- Minimum coverage thresholds MUST be enforced in CI:
  - 80% branch coverage
  - 70% line coverage
  - 80% function coverage
- Coverage reports MUST be generated on every CI run

**Rationale**: Testing prevents regressions and enables confident refactoring. Current codebase has 0 test files—this is the highest priority gap. Try-catch blocks throughout the code show error-handling awareness that should be complemented by comprehensive test coverage.

---

### IV. Documentation (MANDATORY)

**All exported code must be documented with JSDoc comments.**

- All exported functions MUST have JSDoc comments explaining purpose, parameters, and return values
- All exported components MUST have JSDoc comments describing props and behavior
- All exported types/interfaces SHOULD have documentation
- Complex logic SHOULD have inline comments explaining rationale
- README and other documentation MUST be kept up-to-date

**Rationale**: Good documentation enables team collaboration and future maintenance. ProjectService demonstrates excellent JSDoc examples that should be the standard across all exports.

---

### V. Component Architecture (MANDATORY)

**Clear separation of concerns with defined project structure.**

- Component-based architecture MUST be maintained:
  - `/components` - React components
  - `/services` - API and data services
  - `/contexts` - React context providers
  - `/hooks` - Custom React hooks
  - `/utils` - Pure utility functions
  - `/models` - Type definitions and data models
- Components MUST be single-responsibility focused
- Services MUST handle all external API calls
- Contexts SHOULD be used for global state (theme, SEO)

**Rationale**: Clear architectural boundaries improve maintainability and testability. The existing structure demonstrates good separation with dedicated directories for each concern.

---

### VI. Error Handling & Resilience (MANDATORY)

**All code must handle errors gracefully without crashing the application.**

- React Error Boundaries MUST be implemented for component error isolation
- All async operations MUST use try-catch blocks
- API failures MUST fallback gracefully (cache, local data, user notification)
- Error messages MUST be user-friendly and actionable
- Console errors in production MUST be minimized

**Rationale**: Graceful degradation ensures the application remains usable even when external services fail. ProjectService's sophisticated fallback strategy (remote → cache → local) exemplifies this principle.

---

### VII. Logging & Observability (MANDATORY)

**Production code must not contain debug console statements.**

- Console.log/warn/error MAY be used during development
- All console statements MUST be stripped in production builds
- Vite strip plugin MUST be configured to remove console.* in production
- Critical errors SHOULD be logged to error tracking service
- Performance monitoring via Lighthouse scores SHOULD be tracked

**Rationale**: Clean production logs improve performance and prevent information leakage. The @rollup/plugin-strip configuration in vite.config.ts handles this automatically.

---

### VIII. Input Validation & Security (MANDATORY)

**All external data must be validated at runtime.**

- Runtime validation library (Zod) MUST be used for API responses
- User input MUST be validated before processing
- Environment variables MUST be validated at startup
- Content Security Policy MUST be maintained as documented in `.github/copilot-instructions.md`
- CSP configuration MUST be synchronized between:
  - `staticwebapp.config.json` (production)
  - `vite.config.ts` (development)
- Security headers (CSP, X-Frame-Options, X-Content-Type-Options, X-XSS-Protection) MUST be configured

**Rationale**: Runtime validation prevents security vulnerabilities and data corruption. CSP configuration protects against XSS attacks while allowing necessary external resources (markhazleton.com services, weather/joke APIs, WebSocket connections).

---

### IX. Styling Standards (MANDATORY)

**Consistent styling approach across the application.**

- Bootstrap 5 MUST be used for component library
- SCSS MUST be used for global styles and theming
- Component-specific styles MAY use separate .css files
- Theme switching (dark/light) MUST be supported via ThemeContext
- Responsive design MUST follow mobile-first approach
- Accessibility (WCAG 2.1 AA) SHOULD be maintained

**Rationale**: Consistent styling improves user experience and maintainability. Bootstrap 5 + SCSS infrastructure with ThemeContext provides a solid foundation for theme management.

---

### X. Code Quality Gates (MANDATORY)

**Pre-commit hooks and CI checks must enforce quality standards.**

- Pre-commit hooks MUST be configured with Husky + lint-staged
- Pre-commit checks MUST run:
  - ESLint on staged files
  - Prettier on staged files
  - TypeScript type-check
- CI pipeline MUST run:
  - Linting
  - Type checking
  - Tests with coverage
  - Build verification
- Failed quality checks MUST block commits/merges

**Rationale**: Automated quality gates prevent broken code from entering the repository. Azure Static Web Apps CI workflow provides deployment verification but needs enhancement with pre-commit hooks.

---

## Additional Standards

### Performance

- Bundle size SHOULD be monitored and optimized
- Code splitting SHOULD be used for route-based lazy loading
- Images MUST use cache-busting strategy via `imageUtils.ts` functions
- Asset optimization SHOULD be automated in build pipeline

**Rationale**: Vite's built-in code splitting and hash-based cache busting provide excellent performance foundations.

---

### SEO & Metadata

- Dynamic meta tags MUST be configured per page via SEOContext
- Sitemap and robots.txt MUST be generated during build
- Open Graph tags SHOULD be included
- JSON-LD structured data SHOULD be added where appropriate

**Rationale**: Build scripts (`generate-sitemap`, `generate-robots`, `generate-seo-files`) automate SEO file generation to ensure search engine discoverability.

---

### Deployment

- Dual deployment strategy MUST be maintained:
  - Azure Static Web Apps (primary production)
  - GitHub Pages (secondary/fallback)
- CSP configuration MUST be synchronized across environments
- Version tracking MUST be enabled via build date injection
- Service worker MUST clear on version changes

**Rationale**: Dual deployment provides redundancy. Version tracking via `__BUILD_DATE__` injection enables cache invalidation and troubleshooting.

---

## Governance

### Constitution Authority

- This Constitution supersedes informal practices and verbal agreements
- All code reviews MUST verify compliance with Constitution principles
- Any principle violation MUST be justified in PR description

### Amendment Process

- Constitution amendments require:
  1. Documented rationale for the change
  2. Review and approval by project maintainers
  3. Migration plan for existing code if applicable
  4. Version bump following semantic versioning
- Constitution reviews SHOULD occur quarterly or after major features
- Use `/speckit.evolve-constitution` to propose amendments based on findings

### Versioning

- Constitution versions follow semantic versioning (MAJOR.MINOR.PATCH):
  - **MAJOR**: Backward-incompatible governance changes or principle removals/redefinitions
  - **MINOR**: New principles added or materially expanded guidance
  - **PATCH**: Clarifications, wording fixes, non-semantic refinements

### Enforcement

- Code that violates MUST principles MUST NOT be merged
- Code that violates SHOULD principles REQUIRES justification in PR
- Pre-commit hooks and CI pipelines enforce automated checks
- Manual review enforces principles that cannot be automated
- `/speckit.pr-review` command performs constitution-aware PR reviews

---

**Version**: 1.0.0 | **Ratified**: 2026-03-01 | **Last Amended**: 2026-03-01
