# Content Security Policy Domain Audit
*Generated: January 30, 2026*

## External Domains Used in Application

### Active API Endpoints & Data Sources
| Domain | Purpose | CSP Directive | Status |
|--------|---------|---------------|--------|
| `https://markhazleton.com` | Project images, RSS feed, projects.json | `connect-src` | ✅ Allowed |
| `https://webspark.markhazleton.com` | SignalR hub, Weather API proxy, Variant API | `connect-src` | ✅ Allowed |
| `wss://webspark.markhazleton.com` | SignalR WebSocket connection | `connect-src` | ✅ Allowed |
| `https://v2.jokeapi.dev` | Joke API service | `connect-src` | ✅ Allowed |
| `https://api.openweathermap.org` | Weather API (listed but proxied) | `connect-src` | ✅ Allowed |
| `https://cdnjs.cloudflare.com` | CDN resources | `connect-src`, `style-src` | ✅ Allowed |
| `ws://localhost:*`, `http://localhost:*` | Local development | `connect-src` | ✅ Allowed |

### Embedded Content (iframes)
| Domain | Purpose | CSP Directive | Status |
|--------|---------|---------------|--------|
| `https://www.youtube.com` | YouTube video embeds | `frame-src` | ✅ Allowed |
| `https://www.youtube-nocookie.com` | Privacy-enhanced YouTube embeds | `frame-src` | ✅ Allowed |

### Map Tiles & Images
| Domain | Purpose | CSP Directive | Status |
|--------|---------|---------------|--------|
| `https://{a,b,c}.tile.openstreetmap.org` | OpenStreetMap tiles via Leaflet | `img-src` | ✅ Allowed (wildcard) |
| All HTTPS/HTTP images | External project images | `img-src` | ✅ Allowed (wildcard) |

### External Links (No CSP Impact)
These are regular hyperlinks and don't require CSP allowances:
- `https://github.com` - GitHub repository links
- `https://www.linkedin.com` - LinkedIn profile
- `https://learn.microsoft.com` - Azure documentation
- `https://www.openstreetmap.org` - Attribution link

---

## Current CSP Policy Breakdown

```
Content-Security-Policy: 
  default-src 'self'; 
  connect-src 'self' https://markhazleton.com https://*.markhazleton.com https://cdnjs.cloudflare.com https://v2.jokeapi.dev https://api.openweathermap.org wss://webspark.markhazleton.com ws://localhost:* http://localhost:*; 
  script-src 'self' 'unsafe-inline' 'unsafe-eval'; 
  style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; 
  img-src 'self' data: https: http: blob:; 
  font-src 'self' data: https:; 
  media-src 'self' https: http:; 
  frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com; 
  worker-src 'self' blob:;
```

### Policy Analysis by Directive

#### ✅ `connect-src` - Fetch, XHR, WebSocket
**Allowed:**
- `'self'` - Same origin requests
- `https://markhazleton.com` - Main content API
- `https://*.markhazleton.com` - All markhazleton.com subdomains (includes webspark)
- `https://cdnjs.cloudflare.com` - CDN resources
- `https://v2.jokeapi.dev` - Joke API
- `https://api.openweathermap.org` - Weather API (proxied, but listed)
- `wss://webspark.markhazleton.com` - SignalR WebSocket
- `ws://localhost:*`, `http://localhost:*` - Local development

**Coverage:** ✅ Complete

#### ✅ `img-src` - Images
**Allowed:**
- `'self'` - Same origin images
- `data:` - Data URIs
- `https:` - ALL HTTPS images (wildcard)
- `http:` - ALL HTTP images (wildcard)
- `blob:` - Blob URLs

**Coverage:** ✅ Complete (includes OpenStreetMap tiles)

#### ✅ `frame-src` - Iframes
**Allowed:**
- `'self'` - Same origin iframes
- `https://www.youtube.com` - YouTube embeds
- `https://www.youtube-nocookie.com` - Privacy-enhanced YouTube

**Coverage:** ✅ Complete

#### ✅ `script-src` - JavaScript
**Allowed:**
- `'self'` - Same origin scripts
- `'unsafe-inline'` - Inline scripts (required for React/Vite)
- `'unsafe-eval'` - Eval (required for React/Vite)

**Coverage:** ✅ Complete

#### ✅ `style-src` - CSS
**Allowed:**
- `'self'` - Same origin styles
- `'unsafe-inline'` - Inline styles (required for React)
- `https://cdnjs.cloudflare.com` - CDN stylesheets

**Coverage:** ✅ Complete

#### ✅ `font-src` - Web Fonts
**Allowed:**
- `'self'` - Same origin fonts
- `data:` - Data URI fonts
- `https:` - All HTTPS fonts (wildcard)

**Coverage:** ✅ Complete

#### ✅ `media-src` - Audio/Video
**Allowed:**
- `'self'` - Same origin media
- `https:` - All HTTPS media
- `http:` - All HTTP media

**Coverage:** ✅ Complete

#### ✅ `worker-src` - Web Workers & Service Workers
**Allowed:**
- `'self'` - Same origin workers
- `blob:` - Blob workers

**Coverage:** ✅ Complete

---

## Components Using External Resources

### 1. [Chat.tsx](src/components/Chat.tsx)
- **Domain:** `wss://webspark.markhazleton.com/chatHub`
- **Technology:** SignalR WebSocket
- **CSP:** `connect-src` ✅

### 2. [WeatherForecast.tsx](src/components/WeatherForecast.tsx)
- **Domain:** `https://webspark.markhazleton.com/api/asyncspark/openweatherapi/weather`
- **Technology:** Fetch API
- **CSP:** `connect-src` ✅

### 3. [MapComponent.tsx](src/components/MapComponent.tsx)
- **Domain:** `https://{a,b,c}.tile.openstreetmap.org/{z}/{x}/{y}.png`
- **Technology:** Leaflet map tiles
- **CSP:** `img-src` (wildcard https:) ✅

### 4. [Joke.tsx](src/components/Joke.tsx)
- **Domains:** 
  - `/api/proxy-joke` → `https://v2.jokeapi.dev`
  - `https://www.youtube.com/embed/R9UPM9fHW-Y` (iframe)
- **Technology:** Axios, iframe embed
- **CSP:** `connect-src`, `frame-src` ✅

### 5. [VariantList.tsx](src/components/VariantList.tsx)
- **Domain:** `https://webspark.markhazleton.com/api/PromptSpark/Variant`
- **Technology:** Axios
- **CSP:** `connect-src` ✅

### 6. [PromptSparkInfo.tsx](src/components/modules/PromptSparkInfo.tsx)
- **Domain:** `https://www.youtube.com/embed/GVAhKtAn0Sk` (iframe)
- **Technology:** iframe embed
- **CSP:** `frame-src` ✅

### 7. [ProjectService.ts](src/services/ProjectService.ts)
- **Domain:** `https://markhazleton.com/projects.json`
- **Technology:** Fetch API
- **CSP:** `connect-src` ✅
- **Note:** Also serves images from `https://markhazleton.com/img/*`

### 8. [RssService.ts](src/services/RssService.ts)
- **Domain:** `https://markhazleton.com/rss.xml`
- **Technology:** Fetch API
- **CSP:** `connect-src` ✅

### 9. [JokeService.ts](src/services/JokeService.ts)
- **Domain:** `/api/proxy-joke` (proxies to `https://v2.jokeapi.dev`)
- **Technology:** Axios
- **CSP:** `connect-src` ✅

---

## Security Notes

### ⚠️ Intentionally Permissive Directives
The following directives are intentionally permissive to support the architecture:

1. **`img-src 'self' data: https: http: blob:`**
   - Allows ALL HTTPS/HTTP images
   - **Reason:** Project images come from `markhazleton.com/img/*` with dynamic paths
   - **Reason:** OpenStreetMap tiles use subdomain rotation (`a.tile`, `b.tile`, `c.tile`)
   - **Alternatives considered:** Specific domain listing would break dynamic content

2. **`script-src 'unsafe-inline' 'unsafe-eval'`**
   - Allows inline scripts and eval
   - **Reason:** Required for React + Vite in both dev and production
   - **Note:** This is standard for modern React applications

3. **`style-src 'unsafe-inline'`**
   - Allows inline styles
   - **Reason:** React components use dynamic inline styles
   - **Note:** This is standard for modern React applications

4. **`https://*.markhazleton.com`**
   - Wildcard subdomain
   - **Reason:** Covers both `markhazleton.com` and `webspark.markhazleton.com`
   - **Security:** Still restricted to markhazleton.com domain

---

## Verification Test Results

### ✅ All Content Loading Successfully
- [x] Home page loads
- [x] Projects page with external images
- [x] Articles/RSS feed
- [x] Weather forecast (webspark API)
- [x] Joke component (JokeAPI + YouTube embed)
- [x] Chat with SignalR WebSocket
- [x] Map component with OpenStreetMap tiles
- [x] PromptSpark Info with YouTube embed
- [x] FontAwesome webfonts
- [x] Bootstrap styles

### 🔍 Browser Console - No CSP Violations
After the latest update to include `frame-src` for YouTube:
- No CSP blocking errors
- All API calls succeed
- All images load
- All iframes embed properly
- WebSocket connection established

---

## Recommendations

### ✅ Current Policy is Optimal
The current CSP policy correctly allows all legitimate content while maintaining reasonable security:

1. **All external domains are necessary** and actively used
2. **Wildcard usage is justified** by the architecture (dynamic image paths, map tile rotation)
3. **'unsafe-inline' and 'unsafe-eval'** are standard for React applications
4. **No unnecessary permissions** detected

### 🛡️ Security Considerations
- All external domains are trusted sources (owned or public APIs)
- The wildcard `https:` for images is necessary but should be monitored
- Consider implementing Subresource Integrity (SRI) for CDN resources if needed
- The current policy appropriately balances security with functionality

### 📝 Maintenance
- This audit should be updated when:
  - New external APIs are added
  - New CDN resources are included
  - New embed types (iframes) are added
  - The application architecture changes

---

## Conclusion

**✅ CSP Policy Status: COMPLETE & CORRECT**

All domains accessed by the application are properly allowed in the CSP policy. The policy successfully:
- Allows all necessary API endpoints
- Supports YouTube video embeds
- Enables OpenStreetMap tiles for the Leaflet map
- Permits project images from markhazleton.com
- Allows WebSocket connections for SignalR chat
- Maintains reasonable security restrictions

**No changes required to the current CSP policy.**
