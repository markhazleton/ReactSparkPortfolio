# Route Contracts: Merge JsBootSpark

**Feature**: 001-merge-jsbootspark
**Date**: 2026-04-13

## New Routes

### GET /components

**Purpose**: Display basic Bootstrap 5 component showcase
**Component**: `Components.tsx` (lazy loaded)
**Nav location**: Showcase dropdown → "Components"
**Data requirements**: None (static JSX)
**SEO title**: "Components | BootstrapSpark"
**SEO description**: "Browse Bootstrap 5 basic components with live interactive examples"

### GET /advanced-components

**Purpose**: Display advanced Bootstrap 5 component showcase
**Component**: `AdvancedComponents.tsx` (lazy loaded)
**Nav location**: Showcase dropdown → "Advanced Components"
**Data requirements**: None (static JSX)
**SEO title**: "Advanced Components | BootstrapSpark"
**SEO description**: "Explore advanced Bootstrap 5 components including accordion, carousel, offcanvas, and more"

### GET /data-tables

**Purpose**: Interactive data table with YouTube Top 100 Songs
**Component**: `DataTables.tsx` (lazy loaded)
**Nav location**: Showcase dropdown → "Data Tables"
**Data requirements**: `youtube-top-100-songs-2025.csv` parsed via `SongService`
**SEO title**: "Data Tables | BootstrapSpark"
**SEO description**: "Interactive data table showcase with sorting, search, pagination, and export"

### GET /song/:id

**Purpose**: Detail view for a single song
**Component**: `SongDetail.tsx` (lazy loaded)
**Nav location**: Not in nav (linked from DataTables rows)
**Data requirements**: Single song from `SongService.getSongById(id)`
**URL params**: `id` — 1-indexed song rank (integer, 1-100)
**Error states**: Invalid ID → "Song not found" with back link
**SEO title**: "{Song Title} | BootstrapSpark"

### GET /contact

**Purpose**: Contact form with client-side validation
**Component**: `Contact.tsx` (existing, enhanced with Zod validation)
**Nav location**: Top-level nav link "Contact"
**Data requirements**: None
**SEO title**: "Contact | BootstrapSpark"

## Modified Routes

### GET / (Home)

**Changes**: Update Hero branding from "React Spark Portfolio" to "BootstrapSpark"

### All existing routes

**Changes**: Header nav updated with new dropdown and links. Footer branding updated.

## SPA Routing Notes

- All routes handled client-side via React Router
- `staticwebapp.config.json` already configured for SPA fallback (`navigationFallback`)
- New routes need entries in `generateSitemap.ts` for SEO
