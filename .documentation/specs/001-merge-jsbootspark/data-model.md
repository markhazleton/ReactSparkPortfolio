# Data Model: Merge JsBootSpark into ReactSparkPortfolio

**Feature**: 001-merge-jsbootspark
**Date**: 2026-04-13

## Entities

### Song

Represents a YouTube song record parsed from the CSV data file.

| Field | Type | Required | Validation | Source |
|-------|------|----------|------------|--------|
| rank | number | yes | positive integer, 1-100 | derived from row index |
| title | string | yes | min length 1 | CSV `title` column |
| fullTitle | string | no | — | CSV `fulltitle` column |
| description | string | no | max 500 chars (truncated) | CSV `description` column |
| viewCount | number | yes | non-negative integer | CSV `view_count` column |
| viewCountFormatted | string | yes | computed (e.g. "2.1B") | derived from viewCount |
| duration | string | no | MM:SS format | CSV `duration_string` column |
| durationSeconds | number | no | non-negative integer | CSV `duration` column |
| channel | string | yes | min length 1 | CSV `channel` column |
| channelUrl | string | no | valid URL or empty | CSV `channel_url` column |
| channelFollowerCount | number | no | non-negative integer | CSV `channel_follower_count` column |
| categories | string | no | — | CSV `categories` column |
| tags | string | no | — | CSV `tags` column |
| liveStatus | string | no | — | CSV `live_status` column |
| thumbnail | string | no | valid URL or empty | CSV `thumbnail` column |

**State transitions**: None (read-only data).

**Relationships**: None (standalone entity).

### ContactFormData

Represents a contact form submission with client-side validation.

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| name | string | yes | min 2 chars, max 100 chars |
| email | string | yes | valid email format (Zod .email()) |
| message | string | yes | min 10 chars, max 2000 chars |

**State transitions**: Empty → Validating → Valid/Invalid → Submitted (client-side only).

### ComponentExample (conceptual — no Zod schema needed)

Static data embedded in JSX. No runtime model required.

| Field | Type | Description |
|-------|------|-------------|
| id | string | Anchor ID for navigation (e.g., "buttons", "accordion") |
| title | string | Display name (e.g., "Buttons", "Accordion") |
| category | enum | "basic" or "advanced" |
| icon | string | Bootstrap Icons class name |

### DataTableState (UI state — React hook, not a model file)

| Field | Type | Description |
|-------|------|-------------|
| searchQuery | string | Current search filter text |
| sortColumn | string | Column key currently sorted by |
| sortDirection | enum | "asc" or "desc" |
| currentPage | number | Current pagination page (1-indexed) |
| pageSize | number | Rows per page (default 10) |
| filteredData | Song[] | Songs matching current search |
| sortedData | Song[] | Filtered songs in current sort order |
| pageData | Song[] | Current page slice of sorted data |
| totalPages | number | Computed from filteredData.length / pageSize |
