# Quickstart Guide: Constitution Compliance Implementation

**Feature**: 001-constitution-compliance  
**Target Audience**: Developers implementing testing, validation, and quality gates  
**Time to Complete**: ~4-6 hours (phased implementation)

---

## Prerequisites

- Node.js 18+ installed
- npm 9+ installed
- ReactSparkPortfolio repository cloned
- On feature branch: `001-constitution-compliance`

---

## Phase 1: Testing Infrastructure Setup (1 hour)

### Step 1: Install Testing Dependencies

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @vitest/ui
```

### Step 2: Create Vitest Configuration

Create `vitest.config.ts` in project root:

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      lines: 70,
      branches: 80,
      functions: 80,
      statements: 70,
    },
  },
});
```

### Step 3: Create Test Setup File

Create `src/test/setup.ts`:

```typescript
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
```

### Step 4: Add Test Scripts to package.json

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
   "test:coverage": "vitest --coverage"
  }
}
```

### Step 5: Verify Configuration

```bash
npm test
```

Expected: Vitest runs, reports "No test files found" (expected at this stage)

---

## Phase 2: Write Service Tests (2 hours)

### Step 1: Create Test Directory Structure

```bash
mkdir -p tests/unit/services
```

### Step 2: Write ProjectService Tests

Create `tests/unit/services/ProjectService.test.ts`:

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fetchProjectsData } from '../../../src/services/ProjectService';

const mockLocalStorage = {
  store: {} as Record<string, string>,
  getItem: vi.fn((key) => mockLocalStorage.store[key] || null),
  setItem: vi.fn((key, value) => { mockLocalStorage.store[key] = value; }),
  removeItem: vi.fn((key) => { delete mockLocalStorage.store[key]; }),
  clear: vi.fn(() => { mockLocalStorage.store = {}; })
};

describe('ProjectService', () => {
  beforeEach(() => {
    global.localStorage = mockLocalStorage as any;
    mockLocalStorage.store = {};
    vi.clearAllMocks();
  });

  describe('fetchProjectsData', () => {
    it('should fetch projects from remote source', async () => {
      // Mock successful fetch
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [
          { id: 1, image: '/test.png', p: 'Test', d: 'Desc', h: 'https://example.com' }
        ]
      });

      const result = await fetchProjectsData();

      expect(result).toHaveLength(1);
      expect(result[0].p).toBe('Test');
    });

    it('should fall back to cache when fetch fails', async () => {
      // Set up cache
      const cachedData = [{ id: 1, image: '/test.png', p: 'Cached', d: 'Desc', h: 'https://example.com' }];
      mockLocalStorage.store['cachedProjectsData'] = JSON.stringify(cachedData);
      mockLocalStorage.store['projectsLastUpdated'] = new Date().toISOString();
      mockLocalStorage.store['projectsCacheVersion'] = '1.0.0';
      mockLocalStorage.store['app_version'] = '1.0.0';

      // Mock failed fetch
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      const result = await fetchProjectsData();

      expect(result).toHaveLength(1);
      expect(result[0].p).toBe('Cached');
    });
  });
});
```

### Step 3: Run Tests

```bash
npm test
```

Expected: 2/2 tests passing

### Step 4: Check Coverage

```bash
npm run test:coverage
```

Expected: Coverage report showing service coverage

---

## Phase 3: Add Runtime Validation (1 hour)

### Step 1: Install Zod

```bash
npm install zod
```

### Step 2: Add Schemas to Models

Edit `src/models/Project.tsx`, add:

```typescript
import { z } from 'zod';

export const ProjectDataSchema = z.object({
  id: z.number().int().positive(),
  image: z.string().min(1),
  p: z.string().min(1),
  d: z.string().min(1),
  h: z.string().url()
});

export type ProjectData = z.infer<typeof ProjectDataSchema>;
```

### Step 3: Use Schema in Service

Edit `src/services/ProjectService.ts`:

```typescript
import { ProjectDataSchema } from '../models/Project';

export const fetchProjectsData = async (): Promise<ProjectData[]> => {
  // ... existing fetch logic ...
  
  const rawData = await response.json();
  
  try {
    const validatedData = z.array(ProjectDataSchema).parse(rawData);
    return validatedData;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation failed:', error.errors);
      // Fall back to cache/local data
    }
    throw error;
  }
};
```

### Step 4: Test Validation

Add test case:

```typescript
it('should reject invalid project data', async () => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => [
      { id: -1, image: '', p: '', d: '', h: 'not-a-url' } // Invalid
    ]
  });

  await expect(fetchProjectsData()).rejects.toThrow();
});
```

---

## Phase 4: Configure Quality Gates (30 minutes)

### Step 1: Install Husky and Prettier

```bash
npm install -D husky lint-staged prettier
npx husky init
```

### Step 2: Create Prettier Configuration

Create `.prettierrc`:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": false,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always"
}
```

### Step 3: Configure lint-staged

Add to `package.json`:

```json
{
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

### Step 4: Set Up Pre-commit Hook

Edit `.husky/pre-commit`:

```bash
npm run lint-staged
```

### Step 5: Add Prepare Script

Add to `package.json`:

```json
{
  "scripts": {
    "prepare": "husky install"
  }
}
```

### Step 6: Test Hook

```bash
git add .
git commit -m "test: verify pre-commit hooks"
```

Expected: ESLint and Prettier run before commit

---

## Phase 5: Clean Console Statements (30 minutes)

### Step 1: Find Console Statements

```bash
grep -r "console\." src/
```

### Step 2: Remove or Replace

Replace console.error with proper error handling:

**Before**:
```typescript
} catch (error) {
  console.error('Error:', error);
}
```

**After**:
```typescript
} catch (error) {
  // Error will be caught by ErrorBoundary or shown in UI
  throw error;
}
```

### Step 3: Verify Build Strips Remaining Logs

```bash
npm run build
grep -r "console\." docs/assets/
```

Expected: No matches (or only in comments)

---

## Phase 6: Add Error Boundaries (30 minutes)

### Step 1: Create ErrorBoundary Component

Create `src/components/ErrorBoundary.tsx`:

```typescript
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, Container } from 'react-bootstrap';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <Container className="mt-5">
          <Alert variant="danger">
            <Alert.Heading>Something went wrong</Alert.Heading>
            <p>We're sorry for the inconvenience. Please try refreshing the page.</p>
            <button onClick={() => window.location.reload()}>Refresh Page</button>
          </Alert>
        </Container>
      );
    }

    return this.props.children;
  }
}
```

### Step 2: Wrap App  with ErrorBoundary

Edit `src/App.tsx`:

```typescript
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        {/* existing routes */}
      </Router>
    </ErrorBoundary>
  );
}
```

### Step 3: Test Error Boundary

Create a test component that throws:

```typescript
// src/components/__tests__/ErrorBoundary.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from '../ErrorBoundary';

const ThrowError = () => {
  throw new Error('Test error');
};

describe('ErrorBoundary', () => {
  it('should catch errors and display fallback', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });
});
```

---

## Verification Checklist

After completing all phases, verify:

- [ ] `npm test` runs successfully
- [ ] `npm run test:coverage` shows >70% line, >80% branch coverage
- [ ] Zod validation schemas exist for all external APIs
- [ ] Pre-commit hooks run on git commit
- [ ] No console.* statements in src/ (except in comments)
- [ ] ErrorBoundary wraps main app routes
- [ ] Production build (`npm run build`) succeeds
- [ ] Site audit re-run shows improved compliance score

---

## Troubleshooting

### Tests Won't Run
```bash
# Clear cache
rm -rf node_modules/.vite
npm test
```

### Coverage Too Low
- Write more tests for untested files
- Check `coverage/index.html` for gaps
- Focus on service layer first

### Pre-commit Hooks Not Running
```bash
# Reinstall hooks
rm -rf .husky
npx husky init
```

### Zod Validation Failing
- Check API response format
- Use `console.log(error.errors)` to see specific validation failures
- Adjust schema to match actual API response

---

## Next Steps

After this feature is complete:
1. Run `/speckit.site-audit` to verify improvements
2. Create PR with all changes
3. Request constitution-aware review: `/speckit.pr-review`
4. After merge, plan next priority features (component JSDoc, additional tests)

---

## Support

- **Questions**: Check `.documentation/specs/001-constitution-compliance/` folder
- **Issues**: Reference audit findings in `.documentation/copilot/audit/2026-03-01_results.md`
- **Constitution**: See `.documentation/memory/constitution.md` for complete principles
