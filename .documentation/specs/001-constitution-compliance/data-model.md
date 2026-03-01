# Data Model: Constitution Compliance - Critical Remediation

**Feature**: 001-constitution-compliance  
**Phase**: Phase 1 - Design & Contracts  
**Date**: 2026-03-01

## Overview

This feature introduces runtime validation schemas and error handling types without modifying existing data structures. All entities are additive to current architecture.

---

## Entities

### Validation Schemas

Zod schemas that provide runtime validation for external API data.

#### ProjectDataSchema

**Purpose**: Validate project data from markhazleton.com API  
**Location**: `src/models/Project.tsx`  
**Relationships**: Used by ProjectService.fetchProjectsData()

**Schema Definition**:
```typescript
import { z } from 'zod';

export const ProjectDataSchema = z.object({
  id: z.number().int().positive(),
  image: z.string().min(1),
  p: z.string().min(1),        // Title
  d: z.string().min(1),        // Description
  h: z.string().url()          // Link URL
});

export const ProjectDataArraySchema = z.array(ProjectDataSchema);
```

**Validation Rules**:
- `id`: Must be positive integer
- `image`: Non-empty string (URL path to image)
- `p`: Non-empty string (project title)
- `d`: Non-empty string (project description)
- `h`: Valid URL (project link)

**Error Handling**: Throws ZodError with detailed path information on validation failure

---

#### JokeAPIResponseSchema

**Purpose**: Validate joke responses from JokeAPI (v2.jokeapi.dev)  
**Location**: `src/services/JokeService.ts` (colocated with service)  
**Relationships**: Used by JokeService.fetchJokeFromAPI()

**Schema Definition**:
```typescript
import { z } from 'zod';

// Single-part joke schema
const SingleJokeSchema = z.object({
  error: z.boolean(),
  category: z.string(),
  type: z.literal('single'),
  joke: z.string(),
  flags: z.object({
    nsfw: z.boolean(),
    religious: z.boolean(),
    political: z.boolean(),
    racist: z.boolean(),
    sexist: z.boolean(),
    explicit: z.boolean()
  }),
  id: z.number(),
  safe: z.boolean(),
  lang: z.string()
});

// Two-part joke schema
const TwoPartJokeSchema = z.object({
  error: z.boolean(),
  category: z.string(),
  type: z.literal('twopart'),
  setup: z.string(),
  delivery: z.string(),
  flags: z.object({
    nsfw: z.boolean(),
    religious: z.boolean(),
    political: z.boolean(),
    racist: z.boolean(),
    sexist: z.boolean(),
    explicit: z.boolean()
  }),
  id: z.number(),
  safe: z.boolean(),
  lang: z.string()
});

// Union type for API response
export const JokeAPIResponseSchema = z.union([
  SingleJokeSchema,
  TwoPartJokeSchema
]);
```

**Validation Rules**:
- `type`: Must be 'single' or 'twopart'
- For single jokes: `joke` field required
- For twopart jokes: `setup` and `delivery` fields required
- `flags`: All flag fields must be boolean
- `id`: Must be number
- Discriminated union based on `type` field

---

#### RssArticleSchema

**Purpose**: Validate RSS feed article data from markhazleton.com  
**Location**: `src/services/RssService.ts` (colocated with service)  
**Relationships**: Used by RssService.fetchRssFeed()

**Schema Definition**:
```typescript
import { z } from 'zod';

export const RssArticleSchema = z.object({
  title: z.string(),
  link: z.string().url(),
  pubDate: z.string(),         // ISO date string
  creator: z.string().optional(),
  category: z.string().optional(),
  description: z.string().optional(),
  content: z.string().optional(),
  guid: z.string().optional()
});

export const RssArticleArraySchema = z.array(RssArticleSchema);
```

**Validation Rules**:
- `title`: Required non-empty string
- `link`: Required valid URL
- `pubDate`: Required string (date format validated by Date constructor)
- Optional fields: creator, category, description, content, guid

---

### Error Handling Types

#### ErrorBoundaryState

**Purpose**: Track error state in ErrorBoundary component  
**Location**: `src/components/ErrorBoundary.tsx`

**Type Definition**:
```typescript
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}
```

**Fields**:
- `hasError`: Boolean flag indicating if error was caught
- `error`: Optional Error object with stack trace
- `errorInfo`: Optional React ErrorInfo with component stack

**State Transitions**:
- Initial: `{ hasError: false }`
- On Error: `{ hasError: true, error: Error, errorInfo: ErrorInfo }`
- On Reset: `{ hasError: false }` (future enhancement)

---

#### ErrorBoundaryProps

**Purpose**: Configure ErrorBoundary behavior  
**Location**: `src/components/ErrorBoundary.tsx`

**Type Definition**:
```typescript
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}
```

**Fields**:
- `children`: Components to render and protect
- `fallback`: Optional custom error UI (defaults to built-in error page)
- `onError`: Optional callback for error tracking/logging (future Sentry integration)

---

### Test Fixture Types

These types support test infrastructure but don't represent production data.

#### MockLocalStorage

**Purpose**: Mock localStorage interface for testing  
**Location**: `tests/unit/services/*.test.ts`

**Type Definition**:
```typescript
interface MockLocalStorage {
  store: Record<string, string>;
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
  clear: () => void;
}
```

---

#### TestCoverageConfig

**Purpose**: Define coverage thresholds for Vitest  
**Location**: `vitest.config.ts`

**Type Definition**:
```typescript
interface CoverageConfig {
  provider: 'v8' | 'istanbul';
  reporter: string[];
  lines: number;      // 70
  branches: number;   // 80
  functions: number;  // 80
  statements: number; // 70
}
```

---

## Relationships

```
External APIs
     ↓
Validation Schemas (Zod)
     ↓
Services (validated data)
     ↓
Components
     ↓
ErrorBoundary (catches errors)
     ↓
User sees fallback UI
```

**Key Relationships**:
1. **ProjectDataSchema validates data** → ProjectService → Projects component
2. **JokeAPIResponseSchema validates data** → JokeService → Joke component
3. **RssArticleSchema validates data** → RssService → About/Articles components
4. **ErrorBoundary wraps** → All routes → Catches component errors
5. **MockLocalStorage used in** → All service tests → Isolation from real localStorage

---

## Validation Flow

```
API Response
     ↓
[Zod Schema Parse]
     ↓
  Valid? ─── YES ──→ Return typed data
     ↓
    NO
     ↓
[ZodError thrown]
     ↓
[Service catch block]
     ↓
[Fallback to cache/local]
     ↓
[User sees fallback data or error]
```

---

## State Machines

### ErrorBoundary State Machine

```
┌─────────────┐
│   Initial   │
│ hasError =  │
│    false    │
└──────┬──────┘
       │
       │ Component throws error
       ↓
┌─────────────┐
│    Error    │
│ hasError =  │
│    true     │
│ error set   │
└──────┬──────┘
       │
       │ User refreshes or navigates
       ↓
┌─────────────┐
│   Initial   │
│  (reset)    │
└─────────────┘
```

**Transitions**:
- **Initial → Error**: Component throws during render/lifecycle
- **Error → Initial**: Page refresh or navigation (automatic React reset)
- **Error → Error**: Sequential errors (boundary catches each)

---

## Migration Strategy

All schemas are **additive** - no existing types are removed:

1. **Phase 1**: Add Zod schemas alongside existing TypeScript interfaces
2. **Phase 2**: Update services to validate API responses with Zod
3. **Phase 3**: Optionally replace TypeScript interfaces with `z.infer<>` (future)

**Backward Compatibility**: Existing code continues to work. Validation failures trigger existing error handling paths (try-catch fallbacks already in place).

---

## Performance Considerations

- **Zod parsing**: ~0.1-1ms overhead per API call (negligible)
- **ErrorBoundary**: Zero overhead when no errors (component passthrough)
- **localStorage mocking**: Test-only, no production impact

**Optimization Notes**:
- Zod schemas compiled once at module load
- No recursive validation (flat object structures)
- Error boundaries use React's built-in error handling (no polyfills needed)
