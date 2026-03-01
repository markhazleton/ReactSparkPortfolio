# Contract: Vitest Configuration

**Configuration File**: vitest.config.ts  
**Purpose**: Define testing infrastructure configuration for React + TypeScript project  
**Format**: TypeScript configuration file  

## Configuration Definition

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/test/',
        '*.config.*',
        'docs/',
        'dist/',
        '.documentation/',
        'scripts/',
        '**/*.d.ts',
        '**/*.test.ts',
        '**/*.test.tsx'
      ],
      lines: 70,
      branches: 80,
      functions: 80,
      statements: 70,
      all: true
    },
    include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx', 'src/**/*.test.ts', 'src/**/*.test.tsx'],
    exclude: ['node_modules', 'docs', 'dist', '.documentation']
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@tests': path.resolve(__dirname, './tests')
    }
  }
});
```

## Configuration Specifications

### Test Environment

| Setting | Value | Purpose |
|---------|-------|---------|
| `globals` | `true` | Enable global test APIs (describe, it, expect) without imports |
| `environment` | `'jsdom'` | DOM environment for React component testing |
| `setupFiles` | `'./src/test/setup.ts'` | Run setup before each test file |
| `css` | `true` | Enable CSS processing in tests |

### Coverage Thresholds

| Metric | Threshold | Constitution Requirement |
|--------|-----------|--------------------------|
| Lines | 70% | Minimum line coverage |
| Branches | 80% | Critical decision paths |
| Functions | 80% | Function execution coverage |
| Statements | 70% | Statement execution coverage |

**Gate Behavior**: If any threshold is not met, `npm run test:coverage` exits with error code 1, blocking merge in CI.

### Coverage Reporting

| Reporter | Output | Purpose |
|----------|--------|---------|
| `text` | Terminal output | Developer feedback |
| `json` | coverage/coverage-final.json | CI integration |
| `html` | coverage/index.html | Detailed browsable report |
| `lcov` | coverage/lcov.info | Third-party tool integration |

### File Patterns

**Included**:
- `tests/**/*.test.ts`
- `tests/**/*.test.tsx`
- `src/**/*.test.ts` (if colocated tests added later)
- `src/**/*.test.tsx`

**Excluded from coverage**:
- `node_modules/` - Third-party code
- `src/test/` - Test infrastructure
- `*.config.*` - Configuration files
- `docs/` - Build output
- `.documentation/` - Documentation
- `**/*.d.ts` - Type declarations
- `**/*.test.ts(x)` - Test files themselves

## Test Setup File Contract

**File**: `src/test/setup.ts`

```typescript
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock window.matchMedia (required for Bootstrap components)
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

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock as any;

// Mock IntersectionObserver (if needed for components)
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() { return []; }
  unobserve() {}
} as any;
```

## Package.json Scripts Contract

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:run": "vitest run"
  }
}
```

### Script Definitions

| Script | Command | Purpose | Exit Behavior |
|--------|---------|---------|---------------|
| `test` | `vitest` | Run tests in watch mode | Stays open for development |
| `test:ui` | `vitest --ui` | Open browser-based UI | Opens browser, stays open |
| `test:coverage`| `vitest --coverage` | Generate coverage report | Exits with code 1 if thresholds not met |
| `test:run` | `vitest run` | Run tests once (CI mode) | Exits after completion |

## Example Test Structure

```typescript
// tests/unit/services/ProjectService.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fetchProjectsData } from '@/services/ProjectService';

describe('ProjectService', () => {
  beforeEach(() => {
    global.localStorage.clear();
    vi.clearAllMocks();
  });

  describe('fetchProjectsData', () => {
    it('should fetch and validate projects from remote source', async () => {
      // Test implementation
    });

    it('should fall back to cache when remote fails', async () => {
      // Test implementation
    });

    it('should throw on invalid data shape', async () => {
      // Test implementation
    });
  });
});
```

## CI Integration

```yaml
# .github/workflows/test.yml
- name: Run tests
  run: npm test -- --run

- name: Check coverage thresholds
  run: npm run test:coverage
```

## Troubleshooting

### Issue: "Cannot find module '@testing-library/jest-dom'"
**Solution**: Ensure `@testing-library/jest-dom` is installed:
```bash
npm install -D @testing-library/jest-dom
```

### Issue: "ReferenceError: describe is not defined"
**Solution**: Ensure `globals: true` in vitest.config.ts

### Issue: "jsdom not found"
**Solution**: Install jsdom:
```bash
npm install -D jsdom
```

### Issue: Coverage thresholds not met
**Solution**: Write more tests or adjust thresholds (requires justification per constitution)

## Version History

- **v1.0.0** (2026-03-01): Initial Vitest configuration contract
