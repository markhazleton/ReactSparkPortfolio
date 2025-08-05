# SASS Migration Plan

## Immediate Actions Required

### 1. Replace @import with @use

```scss
// OLD (deprecated)
@import "./variables.scss";
@import "bootstrap/scss/bootstrap.scss";

// NEW (modern)
@use "./variables" as vars;
@use "bootstrap/scss/bootstrap" as bootstrap;
```

### 2. Replace color functions

```scss
// OLD (deprecated)
lighten(map-get($theme-colors, "light"), 3%)
darken($white, 10%)

// NEW (modern)
color.scale($color, $lightness: 54.6428571429%)
color.adjust($color, $lightness: 3%)
```

### 3. Replace map-get with map.get

```scss
// OLD
map-get($theme-colors, "light")

// NEW
@use "sass:map";
map.get($theme-colors, "light")
```

## Files to Update

- src/scss/styles.scss
- src/scss/variables/_colors.scss
- All component SCSS files

## Timeline: High Priority (Complete within 1-2 weeks)
