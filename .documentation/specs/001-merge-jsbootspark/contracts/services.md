# Service Contracts: Merge JsBootSpark

**Feature**: 001-merge-jsbootspark
**Date**: 2026-04-13

## SongService

**File**: `src/services/SongService.ts`
**Pattern**: Follows existing `ProjectService.ts` pattern (async fetch with fallback)

### Interface

```typescript
/** Load and parse all songs from CSV */
export const fetchAllSongs: () => Promise<Song[]>

/** Get a single song by rank (1-indexed) */
export const getSongById: (id: number) => Promise<Song | null>

/** Filter songs by search query across title, channel, category */
export const searchSongs: (songs: Song[], query: string) => Song[]

/** Sort songs by a given column */
export const sortSongs: (songs: Song[], column: SortableColumn, direction: SortDirection) => Song[]

/** Export songs array to CSV string */
export const exportToCsv: (songs: Song[]) => string

/** Export songs array to JSON string */
export const exportToJson: (songs: Song[]) => string
```

### Behavior

- `fetchAllSongs()` imports CSV via Vite `?raw`, parses rows, validates each with `SongSchema`, returns validated array
- Invalid rows are skipped with a console.warn (stripped in production)
- Results are cached in module-level variable (songs don't change at runtime)
- All functions are pure except `fetchAllSongs` (I/O)

## ContactFormService (optional, client-side only)

**File**: Inline in `Contact.tsx` or `src/services/ContactFormService.ts`

### Interface

```typescript
/** Validate contact form data, returns validated data or Zod errors */
export const validateContactForm: (data: unknown) => ContactFormData | ZodError
```

### Behavior

- Uses `ContactFormSchema.safeParse()` for validation
- No network calls — form submission is a UI demo only
- Success state shown via React state, not API response
