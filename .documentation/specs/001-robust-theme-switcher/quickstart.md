# Quickstart: Robust Theme Switcher

## Prerequisites

- Node.js compatible with the repository toolchain
- Project dependencies installed with `npm install`

## Local Development

1. Start the app with `npm run dev`.
2. Open the local site in the browser.
3. Open `/themes` from the header entry point and confirm BootstrapSpark plus the full Bootswatch catalog renders.

## Feature Verification Flow

1. Open the dedicated theme selector entry point.
2. Confirm BootstrapSpark plus every available Bootswatch theme is shown.
3. Select a non-default theme and verify the visual treatment changes immediately.
4. Refresh the page and navigate to at least one primary route and one showcase/site-demo route.
5. Confirm the selected theme remains active.
6. Re-select the BootstrapSpark default theme and confirm it behaves like any other catalog option.

## Fallback Verification

1. Simulate optional Bootswatch metadata unavailability.
2. Confirm the selector still renders the locally maintained supported-theme catalog.
3. Confirm a previously saved invalid theme ID falls back to the default theme without blocking navigation.
4. Simulate a stylesheet load failure and confirm BootstrapSpark is restored with a user-safe status message.

## Responsive Verification

1. Open the theme selector on a mobile-width viewport and confirm the summary card, theme cards, and active-theme status remain visible without obscuring navigation.
2. Repeat on a desktop-width viewport and confirm the same controls remain reachable.

## Performance Verification

1. Run the theme performance validation test.
2. Confirm the reported `latencyMs` stays below 1000ms for the supported-theme switch path under local execution.

## Validation Commands

- `npm run lint`
- `npm run type-check`
- `npm run test -- --run tests/unit/theme tests/contract/theme tests/integration/theme`
- `npm run build`

## Execution Notes

- 2026-04-13: `npm run type-check` passed.
- 2026-04-13: `npm run lint` passed with existing React Fast Refresh warnings in `src/models/Project.tsx`.
- 2026-04-13: `npm run test -- --run tests/unit/theme tests/contract/theme tests/integration/theme` passed with 11 files and 16 tests.
- 2026-04-13: `npm run build` passed and emitted the BootstrapSpark and Bootswatch theme assets into `docs/themes/`.

## Manual Review Matrix

Review the following surfaces under each supported theme:

- Shared shell: header, footer, skip link, navbar, update notification
- Primary routes: home, about, projects, articles, joke, weather, community
- Showcase routes: components, advanced-components, data-tables
- Site demos: SaaS dashboard, team collaboration, product catalog
- Interaction states: hover, focus, active, disabled, dropdowns, alerts, forms, cards, tables
- Theme failure paths: metadata outage fallback, invalid saved preference fallback, stylesheet rollback to BootstrapSpark
- Selector layouts: mobile and desktop widths