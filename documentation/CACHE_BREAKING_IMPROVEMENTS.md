# Cache Breaking & CSP Improvements

## Overview
This document outlines the comprehensive cache breaking and Content Security Policy (CSP) improvements implemented in the ReactSpark application.

## Implemented Features

### 1. Enhanced Cache Busting

#### Image Cache Busting
- **Development Mode**: Uses timestamp-based cache busting (`?v=<timestamp>`)
- **Production Mode**: Uses build version-based cache busting (`?v=<BUILD_DATE>`)
- Applies to all image URLs including external resources
- Located in: `src/utils/imageUtils.ts`

#### Version-Aware Caching
- LocalStorage caches now track the app version
- Caches are automatically invalidated when app version changes
- Prevents stale data from being served after deployments
- Implemented in: `src/services/ProjectService.ts`

#### HTTP Header-Based Version Detection
- Checks `ETag` and `Last-Modified` headers from server
- Stores and compares headers to detect new versions
- Provides additional layer of cache invalidation
- Located in: `src/utils/version.ts`

### 2. CSP Compliance Improvements

#### Removed Inline Styles
Replaced inline `style` attributes with CSS classes to improve CSP compliance:

**Before:**
```tsx
style={{fontSize: '0.7rem'}}
style={{maxWidth: '80%'}}
style={{width: "32px", height: "32px", minWidth: "32px"}}
```

**After:**
```tsx
className="header-subtitle"
className="chat-message"
className="article-badge"
```

New styles added to: `src/scss/components/_utilities.scss`

#### Current CSP Policy
The application uses a comprehensive CSP that includes:
- `connect-src`: Allows connections to required APIs and WebSocket endpoints
- `script-src`: Allows self and inline scripts (needed for Vite)
- `style-src`: Allows self and inline styles (needed for dynamic theming)
- `img-src`: Allows images from all HTTPS sources
- `font-src`: Allows fonts from configured sources
- `worker-src`: Allows web workers for PWA functionality

### 3. Cache Management

#### Automatic Cache Invalidation
Caches are automatically invalidated when:
1. App version changes (build version from `__BUILD_DATE__`)
2. Cache age exceeds threshold (5 min dev, 1 hour prod)
3. ETag or Last-Modified headers change
4. User manually clears cache

#### Manual Cache Clearing
Development mode provides `clearAllCaches()` function:
- Clears all localStorage
- Unregisters service workers
- Clears browser Cache API
- Forces page reload

Production mode provides `VersionManager.forceRefresh()`:
- Same functionality as dev mode
- Accessible through UI update notifications

### 4. Cache Layers

The application implements multiple cache layers:

1. **Browser HTTP Cache**: Controlled by server headers
2. **Service Worker Cache**: For offline support (if implemented)
3. **LocalStorage Cache**: For API responses and static data
4. **In-Memory Cache**: For session-specific data

## Files Modified

### Core Files
- `src/utils/imageUtils.ts` - Enhanced cache busting logic
- `src/utils/version.ts` - ETag/Last-Modified tracking
- `src/services/ProjectService.ts` - Version-aware caching

### Component Files
- `src/components/Header.tsx` - Removed inline styles
- `src/components/Chat.tsx` - Removed inline styles
- `src/components/About.tsx` - Removed inline styles

### Style Files
- `src/scss/components/_utilities.scss` - New utility classes
- `src/scss/styles.scss` - Import new utilities

## Configuration Files
- `staticwebapp.config.json` - CSP headers for production
- `vite.config.ts` - CSP headers for development
- `index.html` - Meta CSP tag for fallback

## Benefits

### Performance
- Faster page loads with proper caching
- Reduced server requests with smart cache invalidation
- Optimized asset delivery with version-based cache keys

### Security
- Improved CSP compliance reduces XSS risks
- Reduced use of inline styles
- Better separation of content and presentation

### Developer Experience
- Easy cache clearing in development
- Automatic cache invalidation on version changes
- Clear cache management functions

### User Experience
- Faster subsequent page loads
- Automatic updates without manual cache clearing
- Offline support with proper fallbacks

## Testing

### Development Testing
1. Open browser console
2. Run `clearAllCaches()` to test cache clearing
3. Check console for cache hit/miss messages
4. Verify images have `?v=<timestamp>` parameter

### Production Testing
1. Deploy new version
2. Check for update notification
3. Verify new assets are loaded
4. Check that old caches are invalidated

## Future Improvements

### Potential Enhancements
1. Service Worker implementation for true offline support
2. Remove `'unsafe-inline'` from CSP by using nonces
3. Implement cache preloading strategies
4. Add cache size monitoring and cleanup
5. Implement background cache refresh
6. Add metrics for cache hit/miss rates

### Strict CSP Mode
To achieve strict CSP compliance:
1. Use nonce-based script loading
2. Move all inline styles to external CSS
3. Implement Content Security Policy Report-Only mode
4. Monitor CSP violations in production

## Debugging

### Common Issues

**Images not updating:**
- Check browser DevTools Network tab
- Verify cache buster parameter is present
- Clear browser cache manually if needed

**Cache not invalidating:**
- Check `app_version` in localStorage
- Verify build version is being set correctly
- Check console for cache validation messages

**CSP violations:**
- Open browser console for CSP errors
- Check which directive is being violated
- Update CSP policy in config files

### Debug Commands

Development mode console commands:
```javascript
// Clear all caches
clearAllCaches()

// Check cache info
localStorage.getItem('projectsCacheVersion')
localStorage.getItem('app_version')
```

## References

- [MDN: Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [MDN: HTTP Caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching)
- [Web.dev: Cache Strategies](https://web.dev/articles/service-worker-caching-and-http-caching)
