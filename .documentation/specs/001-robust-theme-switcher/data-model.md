# Data Model: Robust Theme Switcher

## ThemeOption

Represents one officially supported theme in the selector and runtime theme system.

### Fields

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| `id` | string | Yes | Stable internal identifier used for persistence, routing state, and stylesheet lookup |
| `name` | string | Yes | User-facing display name |
| `description` | string | Yes | Short summary shown in the selector |
| `source` | `first-party` or `bootswatch` | Yes | Indicates whether the theme is maintained by BootstrapSpark or mapped from Bootswatch |
| `isDefault` | boolean | Yes | Marks the canonical BootstrapSpark fallback theme |
| `isSupported` | boolean | Yes | Marks whether the theme is selectable in production |
| `stylesheetHref` | string | Yes | Path to the static CSS asset that should be applied when the theme is active |
| `previewUrl` | string | No | Optional preview reference derived from Bootswatch metadata |
| `thumbnailUrl` | string | No | Optional thumbnail image used in selector cards |
| `colorModeHint` | `light` or `dark` or `mixed` | Yes | Helps the selector group themes and choose fallback affordances |
| `order` | number | Yes | Stable display ordering in curated lists |

### Validation Rules

- `id` must be unique within the supported catalog.
- Exactly one `ThemeOption` must have `isDefault = true`.
- All selectable themes must have `isSupported = true` and a valid `stylesheetHref`.
- Unsupported or experimental themes may exist in source metadata but must not be exposed in the selector.

## ThemePreference

Represents the user's persisted selection.

### Fields

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| `themeId` | string | Yes | Selected `ThemeOption.id` |
| `savedAt` | string | No | ISO timestamp of the last persisted update |
| `catalogVersion` | string | No | Optional version marker used to detect stale selections against a changed catalog |

### Validation Rules

- `themeId` must resolve to a current supported theme before activation.
- Invalid or stale preferences fall back to the single default theme.

## ThemeCatalog

Represents the validated collection of `ThemeOption` records used by the application.

### Fields

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| `version` | string | Yes | Version or revision identifier for the curated catalog |
| `themes` | ThemeOption[] | Yes | Ordered supported theme list |
| `generatedFrom` | string | No | Notes whether metadata originated from Bootswatch API mapping, manual curation, or mixed sources |

### Relationships

- One `ThemeCatalog` contains many `ThemeOption` records.
- One `ThemePreference` references exactly one valid `ThemeOption` by `themeId`.

## ThemeLoadState

Represents the active runtime state managed by `ThemeContext`.

### Fields

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| `activeTheme` | ThemeOption | Yes | Currently applied theme |
| `catalog` | ThemeCatalog | Yes | Current validated supported list |
| `status` | `idle` or `loading` or `ready` or `fallback` or `error` | Yes | State for startup and failure handling |
| `errorMessage` | string | No | User-safe message when enrichment or asset loading fails |

### State Transitions

1. `idle` → `loading` when the app initializes theme data.
2. `loading` → `ready` when the catalog validates and the active theme asset is applied.
3. `loading` → `fallback` when optional enrichment fails but the local catalog remains usable.
4. `loading` → `error` only if both catalog resolution and default-theme recovery fail.
5. `ready`/`fallback` → `loading` when a user selects a different theme.
6. `loading` → `ready` when the new theme asset applies and the preference is persisted.

## ThemeSupportMatrix

Represents the checklist of application surfaces that must remain valid under each supported theme.

### Coverage Dimensions

- Shared shell: header, footer, skip link, navigation, update notification
- Primary routes: home, about, projects, articles, joke, weather, community
- Showcase routes: components, advanced-components, data-tables
- Site demos: SaaS dashboard, team collaboration, product catalog
- UI states: hover, focus, active, disabled, alerts, cards, forms, dropdowns, tables
