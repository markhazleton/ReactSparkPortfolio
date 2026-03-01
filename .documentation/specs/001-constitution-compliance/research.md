# Research: Constitution Compliance - Critical Remediation

**Feature**: 001-constitution-compliance  
**Phase**: Phase 0 - Outline & Research  
**Date**: 2026-03-01

## Research Questions & Findings

### Q1: Which testing framework best suits React 19 + Vite 7 + TypeScript 5.9?

**Decision**: Vitest  
**Rationale**:
- Native Vite integration (already using Vite 7.3.1)
- ~10x faster than Jest for Vite projects
- ESM-first design matches project's `"type": "module"` configuration
- Drop-in Jest API compatibility for easy migration
- Built-in TypeScript support without additional configuration
- Excellent React 19 support via @testing-library/react
- Active maintenance and growing ecosystem

**Alternatives Considered**:
- **Jest**: Industry standard but requires complex ESM configuration, slower with Vite
- **Testing Library alone**: Not a full test runner, needs Jest or Vitest underneath
- **Cypress Component Testing**: Overkill for unit/integration tests, better for E2E

**Implementation Requirements**:
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @vitest/ui
```

**Configuration**: vitest.config.ts with jsdom environment, coverage thresholds, globals enabled

---

### Q2: How should Zod schemas relate to existing TypeScript interfaces?

**Decision**: Colocate Zod schemas with TypeScript interfaces, export both  
**Rationale**:
- Zod schemas can infer TypeScript types: `type X = z.infer<typeof XSchema>`
- Keeps validation logic near type definitions for maintainability
- Allows gradual migration (keep existing interfaces, add schemas)
- Single source of truth per entity

**Pattern**:
```typescript
// src/models/Project.tsx
import { z } from 'zod';

// Zod schema (runtime validation)
export const ProjectDataSchema = z.object({
  id: z.number(),
  image: z.string(),
  p: z.string(),
  d: z.string(),
  h: z.string().url()
});

// TypeScript interface (can be inferred or explicit)
export type ProjectData = z.infer<typeof ProjectDataSchema>;

// Or keep existing interface for backward compatibility
export interface ProjectData {
  id: number;
  image: string;
  p: string;
  d: string;
  h: string;
}
```

**Alternatives Considered**:
- **Separate schema files**: Creates duplication, hard to keep in sync
- **Replace TypeScript with Zod entirely**: Breaking change, loses compile-time benefits
- **Yup or Joi**: Less TypeScript-native, weaker type inference

---

### Q3: Best practices for Husky + lint-staged + Prettier in TypeScript/React projects

**Decision**: Standard Husky 9.x setup with lint-staged for performance  
**Rationale**:
- Lint-staged only runs on changed files (fast: <10s for typical commits)
- Husky 9 uses simpler `.husky/` directory structure
- Automatic installation via `prepare` script in package.json
- Works seamlessly with ESLint (already configured) and TypeScript

**Configuration**:
```json
// package.json
{
  "scripts": {
    "prepare": "husky install"
  },
  "lint-staged": {
    "*.{ts,tsx,js,jsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md,css,scss}": [
      "prettier --write"
    ]
  }
}
```

``bash
# .husky/pre-commit
npm run lint-staged
npm run type-check
```

**Prettier Configuration**:
- Single quotes: false (React/JSX preference)
- Semi: true (explicit statement termination)
- Tab width: 2 (matches existing code style)
- Print width100 (reasonable line length)
- Trailing commas: es5 (clean diffs)

---

### Q4: Error Boundary patterns for React 19 with React Router 7

**Decision**: Single global ErrorBoundary with optional error-specific fallbacks  
**Rationale**:
- React 19 still requires class components for `componentDidCatch`
- React Router 7 doesn't have built-in error boundaries (unlike Remix/Next.js)
- Global boundary catches unhandled errors app-wide
- Can add route-specific boundaries later for granularity

**Pattern**:
```typescript
// src/components/ErrorBoundary.tsx
class ErrorBoundary extends Component<Props, State> {
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Future: Send to Sentry/error tracking service
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <DefaultErrorUI />;
    }
    return this.props.children;
  }
}
```

**Usage in App.tsx**:
```typescript
<ErrorBoundary>
  <Router>
    <Routes>
      {/* All routes protected */}
    </Routes>
  </Router>
</ErrorBoundary>
```

**Alternatives Considered**:
- **Route-level boundaries**: More granular but overkill for current app size (13 components)
- **react-error-boundary package**: Adds dependency for functionality we can implement simply
- **Suspense boundaries**: Different purpose (async loading, not errors)

---

### Q5: How to verify @rollup/plugin-strip is removing console statements?

**Decision**: Manual inspection + automated grep check in CI  
**Rationale**:
- Plugin is already configured in vite.config.ts
- Production build should already strip console statements
- Add CI check to verify no console statements in built output
- Add manual review step in PR checklist

**Verification Process**:
1. Remove console statements from source (P5)
2. Build production: `npm run build`
3. Inspect `docs/assets/*.js` for console references: `grep -r "console\." docs/assets/`
4. Should return zero matches (or only legitimate comments)

**CI Integration** (future enhancement):
```yaml
- name: Verify no console statements in build
  run: |
    npm run build
    if grep -r "console\." docs/assets/; then
      echo "ERROR: Console statements found in production build"
      exit 1
    fi
```

**Current Status**: Plugin already configured with `['console.log', 'console.warn', 'console.error']`

---

### Q6: Testing strategy for services with localStorage caching

**Decision**: Mock localStorage and test all cache scenarios  
**Rationale**:
- Services use complex caching logic (remote → cache → local fallback)
- localStorage must be mocked in jsdom environment
- Need to test: cache hit, cache miss, cache expiry, version invalidation

**Mock Pattern**:
```typescript
// tests/unit/services/ProjectService.test.ts
const mockLocalStorage = {
  store: {} as Record<string, string>,
  getItem: vi.fn((key) => mockLocalStorage.store[key] || null),
  setItem: vi.fn((key, value) => { mockLocalStorage.store[key] = value; }),
  removeItem: vi.fn((key) => { delete mockLocalStorage.store[key]; }),
  clear: vi.fn(() => { mockLocalStorage.store = {}; })
};

beforeEach(() => {
  global.localStorage = mockLocalStorage as any;
  mockLocalStorage.store = {};
});
```

**Test Scenarios**:
1. Remote fetch success → verify data + cache update
2. Remote fetch fail + cache hit → verify cached data used
3. Remote fetch fail + cache miss → verify local fallback
4. Cache expiry (>1 hour) → verify fresh fetch attempted
5. Version change → verify cache invalidated

---

## Summary

All research questions resolved with clear decisions and implementation paths:

1. **Vitest** for testing framework (native Vite integration)
2. **Colocated Zod schemas** with existing models
3. **Husky + lint-staged + Prettier** standard configuration
4. **Class-based ErrorBoundary** wrapping router
5. **Manual verification** of console statement removal (plugin already configured)
6. **localStorage mocking** for service tests

**No unresolved NEEDS CLARIFICATION items.**  
Ready to proceed to Phase 1 (Design & Contracts).
