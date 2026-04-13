# Quickstart: 001-merge-jsbootspark

**Branch**: `001-merge-jsbootspark`

## Setup

```bash
git checkout 001-merge-jsbootspark
npm install
npm run dev
```

## Verify Existing Features (Regression Check)

1. Open http://localhost:5173
2. Navigate to each existing route: /, /about, /projects, /articles, /joke, /weather, /variant
3. Confirm all pages load and function correctly
4. Toggle dark/light theme — verify it persists

## Verify New Features

1. Navigate to /components — verify basic Bootstrap component showcase
2. Navigate to /advanced-components — verify advanced components with interactive demos
3. Navigate to /data-tables — verify YouTube Top 100 songs table loads
   - Type in search box → table filters
   - Click column headers → table sorts
   - Click pagination → pages change
   - Click CSV/JSON export → file downloads
4. Click a song row → navigates to /song/:id with full detail
5. Navigate to /community (and /contact alias) — verify Community & Contributing content, GitHub contribution links, and discussions/support CTAs
6. Check branding: header, footer, page title all say "BootstrapSpark"

## Run Tests

```bash
npm run test
npm run lint
npm run build
```

## Key Files

| What | Where |
|------|-------|
| Song model + Zod schema | `src/models/Song.ts` |
| Contact form schema | `src/models/ContactForm.ts` |
| Song data service | `src/services/SongService.ts` |
| CSV data file | `src/data/youtube-top-100-songs-2025.csv` |
| App routes | `src/App.tsx` |
| Branding config | `src/config/AppConfig.ts` |
| Nav updates | `src/components/Header.tsx` |
