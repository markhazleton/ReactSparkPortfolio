# Quickstart: GitHub Repository Showcase App

## Goal

Validate the repository showcase feature end to end inside BootstrapSpark during implementation.

## Prerequisites

- Node.js version compatible with the existing Vite and Vitest toolchain
- npm dependencies installed in the repository root
- Active feature branch: `001-github-repo-showcase`

## Build and Run

1. Install dependencies if needed.

```powershell
npm install
```

2. Start the local development experience.

```powershell
npm run dev
```

3. Open the app at the local Vite URL and navigate to the new repository showcase route from the Apps menu.

## Implementation Validation Checklist

1. Confirm the header exposes a repository showcase entry and the route loads without errors.
2. Confirm the page displays a distinct repository-focused hero area rather than reusing Projects wording.
3. Confirm repository data loads through the development proxy and exposes profile metrics plus repository cards.
4. Confirm featured repositories appear using curated-first logic, with automatic fallback when curated metadata is not available.
5. Confirm search, filter, and sort controls update the visible list and handle zero-match states gracefully.
6. Confirm the page reports freshness or fallback source information in a user-friendly way.
7. Confirm phone-width and desktop-width layouts both preserve the main interactions.
8. Confirm keyboard navigation reaches search, filters, sort controls, and outbound links.

## Automated Verification

Run the project quality gates after implementation changes.

```powershell
npm run lint
npm run type-check
npm run test:coverage
npm run build
```

## Expected Test Coverage Additions

- Unit tests for repository schema parsing and view-model mapping
- Unit tests for repository service cache and fallback behavior
- Contract tests for the repository feed shape
- Integration or component tests for route rendering, empty states, and discovery controls

## Production-Specific Checks

1. Validate the production proxy path serves repository data through the Azure Function endpoint.
2. Confirm CSP and CORS remain compatible with the new repository data source.
3. Confirm the generated site still builds to `docs/` and the route works in preview or deployed environments.
