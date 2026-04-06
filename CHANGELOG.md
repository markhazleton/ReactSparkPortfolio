# Changelog

Archive-run entries (operational decisions, rationale, and archived artifacts) are recorded here.
For versioned release history, see [.documentation/CHANGELOG.md](.documentation/CHANGELOG.md).

---

## [2026-04-06] Archive Run

### Archived

- `.documentation/copilot/archive/README.md` — copilot archive README; directory emptied by prior archive runs, README described defunct workflow now superseded by top-level `.archive/` pattern
- `.documentation/copilot/harvest-2026-04-06.md` — completed harvest report confirming no actionable items found; session artifact with no enduring value

### Key decisions preserved

- **Copilot archive cleanup**: The `.documentation/copilot/archive/` subdirectory pattern is fully retired. All working-doc archival now flows through `.archive/YYYY-MM-DD/` at the repo root.

---

## [2026-04-05] Archive Run

### Archived

- `.documentation/copilot/archive/2026-03-01_cache-breaking-improvements.md` — completed session doc; key patterns captured in `.documentation/CACHE_BUSTING.md`
- `.documentation/copilot/archive/2026-03-01_consolidation-complete.md` — pure audit trail for completed branch cleanup; no lasting value
- `.documentation/copilot/archive/2026-03-01_csp-domain-audit.md` — completed security audit; CSP allowlist rationale captured in `.documentation/SECURITY.md`
- `.documentation/copilot/archive/2026-03-01_dependabot-checklist.md` — time-bound execution checklist; superseded by completed merge
- `.documentation/copilot/archive/2026-03-01_dependabot-remediation.md` — completed PR remediation plan; key process patterns noted below
- `.documentation/copilot/archive/2026-03-01_dependabot-summary.md` — Dependabot management system overview; superseded by current workflow
- `.documentation/copilot/archive/2026-03-01_sass-improvements-summary.md` — completed SCSS modernization; patterns captured in `.documentation/ARCHITECTURE.md`
- `.documentation/copilot/archive/2026-03-01_sass-migration-plan.md` — completed SASS deprecation migration (@import→@use); work done
- `.documentation/copilot/archive/2026-03-01_tailwindspark-migration-spec.md` — migration spec (cancelled/deferred); data flow and service patterns captured in `.documentation/ARCHITECTURE.md`
- `.documentation/copilot/archive/2026-03-01_test-coverage-improvement-plan.md` — completed test coverage plan; testing strategy captured in `.documentation/CONTRIBUTING.md`
- `.documentation/copilot/archive/2026-03-01_spec-001-constitution-compliance/` — completed constitution compliance spec (tasks done, ratified in constitution v1.1.1)

### Key Decisions Preserved

- **Cache busting strategy**: Timestamp-based in dev, build-date-based in prod. Version-aware localStorage checks invalidate stale cache automatically on deploy. TTL: 5 min (dev), 1 hour (prod). Pattern lives in `imageUtils.ts` and `version.ts`.
- **Cache layer architecture**: Browser HTTP → Service Worker → LocalStorage → In-memory. Future caching decisions should follow this hierarchy.
- **CSP intentional permissiveness**: `'unsafe-inline'` and `'unsafe-eval'` are required by React/Vite — not negligence. Wildcards (`https:` for images, `https://*.markhazleton.com` for subdomains) are justified and documented.
- **Dependency update phasing**: Group by risk level (critical security → medium → low). Test APIs after HTTP client updates (axios proxy routes). Monitor prod for 48 hours post-deploy. Flag dependency PRs 🔴🟡🟢 by severity.
- **SCSS modernization**: CSS custom properties (`--pattern-dot-size`, `--animation-duration`, `--focus-color`) replace hardcoded values. `focus-visible` with 2px outline/2px offset is the project's accessibility pattern. Mobile-first breakpoint: `max-width: 768px`.
- **SASS deprecation pathway**: `@import` → `@use` with namespacing; `map-get()` → `map.get()`; `lighten()`/`darken()` → `color.scale()`/`color.adjust()`. Applied to: `styles.scss`, `variables`, component SCSS files.
- **Service data flow**: Remote API → localStorage cache (TTL-aware) → Local fallback. Implemented in `ProjectService`, `ArticleService`. Pattern ensures resilience when external APIs are unavailable.
- **Testing priority order**: Utility functions and models first (high ROI), then service edge cases, then components. Vitest is the configured test runner. Target: Function ≥60%, Branch ≥70% (interim), 80% (stretch).
- **Constitution compliance**: Constitution v1.1.1 ratified 2026-03-01 enforcing TypeScript strict mode, no TODO/FIXME in code, root-level README.md only, quarterly doc audits, and spec archival after merge.
