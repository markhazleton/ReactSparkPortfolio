# API Dependencies

## Overview

This document outlines all external API dependencies used by the ReactSparkPortfolio application. The app integrates with multiple WebSpark ecosystem APIs and third-party services to provide a rich, dynamic user experience.

## Internal WebSpark APIs

### 1. PromptSpark Variants API

- **Endpoint**: `https://webspark.markhazleton.com/api/PromptSpark/Variant`
- **Purpose**: Fetches AI assistant variants/configurations for the PromptSpark page
- **Method**: GET
- **Authentication**: None (public endpoint)
- **Used By**: `VariantList.tsx`
- **Response Format**: JSON array of variant objects
- **Dependencies**: WebSpark backend infrastructure

**curl Example:**

```bash
curl -X GET "https://webspark.markhazleton.com/api/PromptSpark/Variant" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json"
```

**Response Structure:**

```json
[
  {
    "id": "variant-id",
    "name": "Assistant Name",
    "description": "Assistant description",
    "systemPrompt": "System prompt text",
    "userPrompt": "User prompt template",
    "temperature": 0.7,
    "maxTokens": 2000
  }
]
```

### 2. Weather API (OpenWeather via AsyncSpark)

- **Endpoint**: `https://webspark.markhazleton.com/api/asyncspark/openweatherapi/weather`
- **Purpose**: Provides weather data for various cities through WebSpark proxy
- **Method**: GET
- **Parameters**: `location` (city name)
- **Authentication**: None (proxied through WebSpark)
- **Used By**: `WeatherForecast.tsx`
- **Response Format**: JSON weather object
- **Dependencies**: WebSpark AsyncSpark service, OpenWeather API

**curl Examples:**

```bash
# Default cities
curl -X GET "https://webspark.markhazleton.com/api/asyncspark/openweatherapi/weather?location=Dallas"
curl -X GET "https://webspark.markhazleton.com/api/asyncspark/openweatherapi/weather?location=Austin"

# Custom search
curl -X GET "https://webspark.markhazleton.com/api/asyncspark/openweatherapi/weather?location=New%20York"
```

**Response Structure:**

```json
{
  "success": true,
  "location": {
    "name": "Dallas",
    "country": "US"
  },
  "current": {
    "temperature": 25.5,
    "description": "Clear sky",
    "humidity": 45,
    "windSpeed": 10.2
  },
  "fetchTime": "2025-09-02T10:30:00Z"
}
```

### 3. SignalR Chat Hub

- **Endpoint**: `https://webspark.markhazleton.com/chatHub`
- **Purpose**: Real-time chat functionality with AI assistants
- **Protocol**: WebSocket (SignalR)
- **Authentication**: None (public hub)
- **Used By**: `Chat.tsx`
- **Methods**: `SendMessage`, `ReceiveMessage`
- **Dependencies**: WebSpark SignalR infrastructure

**Connection Example:**

```javascript
// SignalR connection (not curl-able)
const connection = new signalR.HubConnectionBuilder()
  .withUrl('https://webspark.markhazleton.com/chatHub')
  .build();
```

**Hub Methods:**

- `SendMessage(user, message, conversationId, variantName)`
- `ReceiveMessage(user, messageChunk)` (incoming)

## External Third-Party APIs

### 4. JokeAPI

- **Endpoint**: `https://v2.jokeapi.dev/joke/Any`
- **Purpose**: Provides random jokes for entertainment component
- **Method**: GET
- **Parameters**: `safe-mode` (enables safe content filter)
- **Authentication**: None (public API)
- **Used By**: `Joke.tsx`
- **Response Format**: JSON joke object
- **Rate Limits**: 120 requests per minute
- **Documentation**: <https://v2.jokeapi.dev/>

**curl Example:**

```bash
curl -X GET "https://v2.jokeapi.dev/joke/Any?safe-mode" \
  -H "Accept: application/json"
```

**Response Structure:**

```json
{
  "error": false,
  "category": "Programming",
  "type": "single",
  "joke": "Why do programmers prefer dark mode? Because light attracts bugs!",
  "flags": {
    "nsfw": false,
    "religious": false,
    "political": false,
    "racist": false,
    "sexist": false,
    "explicit": false
  },
  "id": 12345,
  "safe": true,
  "lang": "en"
}
```

## RSS/Content APIs

### 5. Mark Hazleton's Blog RSS

- **Primary Endpoint**: `https://markhazleton.com/rss.xml`
- **Fallback Endpoint**: `https://reactspark.markhazleton.com/rss.xml`
- **Purpose**: Fetches blog articles for Articles and About pages
- **Method**: GET
- **Authentication**: None (public RSS feed)
- **Used By**: `RssService.ts`, `About.tsx`, `Articles.tsx`
- **Response Format**: XML (RSS 2.0)
- **Caching**: localStorage with fallback strategy

**curl Example:**

```bash
curl -X GET "https://markhazleton.com/rss.xml" \
  -H "Accept: application/xml, text/xml, application/rss+xml, */*" \
  -H "Cache-Control: no-cache"
```

**Fallback Strategy:**

1. Try direct fetch from source
2. Use cached data from localStorage
3. Fetch from local file (`/rss.xml`)

## Azure Functions (Serverless APIs)

### 6. RSS Proxy Function

- **Endpoint**: `https://reactspark.markhazleton.com/api/proxy-rss`
- **Purpose**: CORS-enabled RSS proxy to avoid browser CORS issues
- **Method**: GET
- **Headers**: `X-RSS-Source` (optional, defaults to Mark's blog)
- **Authentication**: Anonymous
- **Used By**: Potential fallback for RSS service
- **Response Format**: XML or JSON error
- **Dependencies**: Azure Functions runtime

**curl Example:**

```bash
curl -X GET "https://reactspark.markhazleton.com/api/proxy-rss" \
  -H "Accept: application/xml" \
  -H "X-RSS-Source: https://markhazleton.com/rss.xml"
```

## Error Handling & Fallback Strategies

### RSS Service Fallback Chain

1. **Primary**: Direct fetch from `https://markhazleton.com/rss.xml`
2. **Secondary**: Use cached data from localStorage
3. **Tertiary**: Fetch from local file `/rss.xml`
4. **Final**: Show error message

### Weather Service Error Handling

- Display user-friendly error messages
- Maintain recent search history in localStorage
- Graceful degradation for failed requests

### PromptSpark API Error Handling

- Loading states during fetch operations
- Error messages for failed requests
- Retry mechanisms for transient failures

### Chat Service Error Handling

- Connection retry logic for SignalR
- Graceful fallback when hub is unavailable
- Message queuing for offline scenarios

## Configuration

### Environment Variables

- `VITE_BASE_URL`: Base URL for the application
- `OPENWEATHER_API_KEY`: Direct OpenWeather access (if bypassing WebSpark)

### Static Configuration

Located in `src/config/AppConfig.ts`:

```typescript
export const AppConfig = {
  hostedUrl: "https://reactspark.markhazleton.com",
  siteTitle: "React Spark Portfolio",
  owner: "Mark Hazleton",
  githubRepo: "https://github.com/markhazleton/ReactSparkPortfolio",
};
```

## Performance Considerations

### Caching Strategies

- **RSS Data**: localStorage caching with timestamp
- **Weather Data**: Recent searches cached locally
- **Variants**: No caching (always fresh data)

### Loading States

All API calls implement proper loading states and error boundaries to maintain good user experience.

### Rate Limiting

- **JokeAPI**: 120 requests/minute
- **WebSpark APIs**: No documented limits
- **RSS Feeds**: Cached to minimize requests

## Security Considerations

### CORS Handling

- WebSpark APIs: Properly configured CORS headers
- JokeAPI: Public API with CORS enabled
- RSS Feeds: Potential CORS issues handled via proxy function

### Data Sanitization

- User inputs sanitized in chat components
- RSS content parsed safely using DOMParser
- XSS protection in place for dynamic content

## Monitoring & Debugging

### Error Logging

All API calls include comprehensive error logging to browser console with context information.

### Network Tab Monitoring

Use browser DevTools Network tab to monitor:

- API response times
- Failed requests
- CORS issues
- Rate limiting responses

### Service Health Checks

Consider implementing health check endpoints for:

- WebSpark API availability
- SignalR hub connectivity
- RSS feed accessibility

## Dependencies Update Schedule

### Regular Updates

- Monitor JokeAPI for changes or deprecation
- Keep axios and SignalR libraries updated
- Verify WebSpark API compatibility

### Breaking Changes

- WebSpark API changes coordinated with backend team
- Third-party API deprecation notices monitored
- Fallback strategies tested regularly

---

*Last Updated: September 2, 2025*
*Document Version: 1.0*
