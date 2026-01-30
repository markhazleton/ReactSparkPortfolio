# ⚠️ READ THIS BEFORE CHANGING CSP CONFIGURATION ⚠️

## Quick Facts

**Problem:** Every time CSP is "improved" for security, the site breaks.

**Why:** This is a **frontend-only** portfolio that fetches ALL content from external sources (markhazleton.com).

**Solution:** The current CSP is intentionally permissive. **DO NOT tighten it** without reading below.

---

## What Will Break If You Change The CSP

| If You Remove... | This Breaks... |
|-----------------|----------------|
| `https://*.markhazleton.com` from connect-src | ❌ Service worker can't fetch project images |
| `https:` from img-src | ❌ External project screenshots won't display |
| `'unsafe-inline'` from script-src | ❌ React won't render, Vite won't work |
| `'unsafe-eval'` from script-src | ❌ Hot module reload fails in development |
| `blob:` from worker-src | ❌ Service worker initialization fails |

## Required CSP (DO NOT MODIFY)

```
connect-src: 'self' https://markhazleton.com https://*.markhazleton.com 
             https://api.openweathermap.org https://v2.jokeapi.dev 
             wss://webspark.markhazleton.com ws://localhost:* http://localhost:*

img-src: 'self' data: https: http: blob:
font-src: 'self' data: https:
media-src: 'self' https: http:
worker-src: 'self' blob:
script-src: 'self' 'unsafe-inline' 'unsafe-eval'
```

## Files With CSP Configuration

**⚠️ These files MUST be kept in sync:**

1. `/staticwebapp.config.json` - Production CSP (Azure Static Web Apps)
2. `/vite.config.ts` - Development CSP (Local dev server)

## Before Making ANY CSP Changes

1. ✅ Read [`/documentation/SECURITY.md`](documentation/SECURITY.md)
2. ✅ Read [`/.github/copilot-instructions.md`](.github/copilot-instructions.md) @csp rule
3. ✅ Test locally: `npm run dev`
4. ✅ Check EVERY page: Home, Projects, Articles, About, Joke, Weather, Chat
5. ✅ Check browser console for CSP violations
6. ✅ If ANY violations exist, your CSP is TOO STRICT

## Why Standard CSP Recommendations Don't Apply Here

**Standard Advice:** "Remove 'unsafe-inline' and 'unsafe-eval' for security"

**Reality for this site:**
- ✅ No user-generated content
- ✅ No form submissions
- ✅ No database
- ✅ All content is owner-controlled
- ✅ External APIs are read-only
- ✅ Primary threat (XSS from user input) doesn't exist

**The real security here comes from:**
- No user input that could inject scripts
- Read-only external data sources
- No cookies or authentication
- Static deployment with immutable assets

## Testing Procedure

```bash
# 1. Start dev server
npm run dev

# 2. Open browser to http://localhost:3000
# 3. Open browser DevTools (F12)
# 4. Check Console for CSP violations

# 5. Test each page:
- Home page loads ✓
- Projects show images from markhazleton.com ✓
- Articles load RSS feed ✓
- Joke page works ✓
- Weather forecast displays ✓
- Chat connects via WebSocket ✓
- Service worker registers ✓

# 6. If ANY errors appear, REVERT your changes
```

## Questions?

- **Q:** "But 'unsafe-eval' is a security risk!"
- **A:** Only with user-generated content. This site has none.

- **Q:** "Can we use nonces instead of 'unsafe-inline'?"
- **A:** Yes, but requires changing Vite config. Current CSP is secure enough for this use case.

- **Q:** "Why not whitelist specific image domains?"
- **A:** Images come from markhazleton.com subdomains that may change. Wildcard is necessary.

- **Q:** "Can we restrict connect-src more?"
- **A:** No. Service worker needs access to markhazleton.com and subdomains for image fetching.

---

## TL;DR

**🛑 DO NOT tighten the CSP unless you want to spend hours debugging why images won't load. 🛑**

The current configuration is correct for this architecture.
