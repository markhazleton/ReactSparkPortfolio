# Contract: Theme Catalog and Selection

## Purpose

Define the contract between the theme selector UI, theme runtime state, local curated catalog, and optional Bootswatch metadata mapping.

## Internal Catalog Contract

Each supported theme must be normalized into the following shape before the selector or `ThemeContext` consumes it.

```ts
type ThemeCatalogContract = {
  version: string;
  themes: ThemeOptionContract[];
};

type ThemeOptionContract = {
  id: string;
  name: string;
  description: string;
  source: "first-party" | "bootswatch";
  isDefault: boolean;
  isSupported: boolean;
  stylesheetHref: string;
  previewUrl?: string;
  thumbnailUrl?: string;
  colorModeHint: "light" | "dark" | "mixed";
  order: number;
};
```

## Bootswatch API Mapping Contract

When Bootswatch API data is consumed during curation or refresh, only the fields required by the app contract are mapped forward.

| Bootswatch API field | Internal field | Notes |
| ----- | ----- | ----- |
| `name` | `name` | Display name preserved |
| derived slug | `id` | Normalized stable identifier |
| `description` | `description` | Shown in selector cards |
| `thumbnail` | `thumbnailUrl` | Optional selector thumbnail |
| `preview` | `previewUrl` | Optional external preview reference |
| curated stylesheet path | `stylesheetHref` | Resolved to the app's hosted static asset, not the remote API URL |

The following Bootswatch fields are not required for runtime correctness in the first implementation: `css`, `cssMin`, `cssCdn`, `scss`, `scssVariables`, RTL variants.

## Theme Selection Contract

### Input

- `themeId: string`

### Output

- Active stylesheet target updated
- Persisted `ThemePreference.themeId`
- Active-theme state updated for UI affordances

### Rules

1. Selecting a valid supported theme must apply and persist in the same interaction.
2. Selecting an invalid or unsupported theme ID must resolve to the default theme.
3. Failure to enrich metadata must not block selection of supported themes.
4. Failure to resolve a non-default theme asset must recover to the default theme and expose a user-safe error state.

## UI Contract

The dedicated selector must receive enough data to:

- display the active theme clearly,
- distinguish first-party and external themes,
- render optional preview metadata when available,
- present only supported themes as selectable,
- remain usable on mobile and desktop layouts.

Minimum selector view model:

```ts
type ThemeSelectorViewModel = {
  activeThemeId: string;
  themes: ThemeOptionContract[];
  status: "loading" | "ready" | "fallback" | "error";
  errorMessage?: string;
};
```
