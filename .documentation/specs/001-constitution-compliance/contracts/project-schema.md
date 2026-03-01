# Contract: ProjectData Validation Schema

**Schema Name**: ProjectDataSchema  
**Purpose**: Runtime validation for project data from markhazleton.com API  
**Format**: Zod schema (TypeScript)  

## Schema Definition

```typescript
import { z } from 'zod';

/**
 * Validation schema for individual project data from external API
 */
export const ProjectDataSchema = z.object({
  id: z.number().int().positive({
    message: "Project ID must be a positive integer"
  }),
  image: z.string().min(1, {
    message: "Project image path cannot be empty"
  }),
  p: z.string().min(1, {
    message: "Project title cannot be empty"
  }),
  d: z.string().min(1, {
    message: "Project description cannot be empty"
  }),
  h: z.string().url({
    message: "Project link must be a valid URL"
  })
});

/**
 * Validation schema for array of projects from API endpoint
 */
export const ProjectDataArraySchema = z.array(ProjectDataSchema).min(1, {
  message: "Projects array cannot be empty"
});

// Inferred TypeScript types
export type ProjectData = z.infer<typeof ProjectDataSchema>;
export type ProjectDataArray = z.infer<typeof ProjectDataArraySchema>;
```

## Field Specifications

| Field | Type | Constraints | Error Message |
|-------|------|-------------|---------------|
| `id` | number | Integer, >0 | "Project ID must be a positive integer" |
| `image` | string | Min length 1 | "Project image path cannot be empty" |
| `p` | string | Min length 1 | "Project title cannot be empty" |
| `d` | string | Min length 1 | "Project description cannot be empty" |
| `h` | string | Valid URL | "Project link must be a valid URL" |

## Example Valid Data

```json
{
  "id": 1,
  "image": "/img/projects/controlorigins.png",
  "p": "Control Origins Framework",
  "d": "Enterprise web application framework built on ASP.NET Core",
  "h": "https://github.com/controlorigins"
}
```

## Example Invalid Data & Errors

### Invalid ID (not positive):
```json
{
  "id": -1,
  ...
}
```
**Error**: `ZodError: [{ "code": "too_small", "path": ["id"], "message": "Project ID must be a positive integer" }]`

### Invalid URL:
```json
{
  ...
  "h": "not-a-url"
}
```
**Error**: `ZodError: [{ "code": "invalid_string", "path": ["h"], "message": "Project link must be a valid URL" }]`

### Empty title:
```json
{
  ...
  "p": ""
}
```
**Error**: `ZodError: [{ "code": "too_small", "path": ["p"], "message": "Project title cannot be empty" }]`

## Usage in Code

```typescript
// src/services/ProjectService.ts
import { ProjectDataArraySchema } from '../models/Project';

export const fetchProjectsData = async (): Promise<ProjectData[]> => {
  const response = await fetch(projectsSourceUrl);
  const rawData = await response.json();
  
  try {
    // Validate runtime data against schema
    const validatedData = ProjectDataArraySchema.parse(rawData);
    return validatedData;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Project data validation failed:', error.errors);
      // Fallback to cached or local data
      throw new Error(`Invalid project data from API: ${error.message}`);
    }
    throw error;
  }
};
```

## Test Cases

### should validate correct project data
```typescript
const validProject = {
  id: 1,
  image: "/img/test.png",
  p: "Test Project",
  d: "Test Description",
  h: "https://example.com"
};

expect(() => ProjectDataSchema.parse(validProject)).not.toThrow();
```

### should reject invalid ID types
```typescript
const invalidProject = { ...validProject, id: "1" }; // string instead of number
expect(() => ProjectDataSchema.parse(invalidProject)).toThrow(ZodError);
```

### should reject invalid URLs
```typescript
const invalidProject = { ...validProject, h: "not-a-url" };
expect(() => ProjectDataSchema.parse(invalidProject)).toThrow(ZodError);
```

### should reject empty required fields
```typescript
const invalidProject = { ...validProject, p: "" };
expect(() => ProjectDataSchema.parse(invalidProject)).toThrow(ZodError);
```

## Migration Path

1. **Step 1**: Add schema to `src/models/Project.tsx` alongside existing interface
2. **Step 2**: Import and use in `ProjectService.fetchProjectsData()`
3. **Step 3**: Add try-catch around validation with fallback to existing error handling
4. **Step 4**: Test with invalid data to verify error messages
5. **Step 5**: Deploy and monitor for validation errors in production

## API Contract

**Endpoint**: `https://markhazleton.com/projects.json` (production)  
**Endpoint**: `/api/projects` (development proxy)

**Expected Response**:
```json
[
  {
    "id": 1,
    "image": "/img/projects/example.png",
    "p": "Project Title",
    "d": "Project Description",
    "h": "https://project-url.com"
  },
  ...
]
```

**Contract Guarantee**: If API returns data that doesn't match this schema, the service will:
1. Log detailed validation error
2. Attempt to use cached data
3. If no cache, fall back to local `projects.json`
4. Display user-friendly error message if all fallbacks fail

## Version History

- **v1.0.0** (2026-03-01): Initial contract definition
