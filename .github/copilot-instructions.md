- @azure Rule - Use Azure Best Practices: When generating code for Azure, running terminal commands for Azure, or performing operations related to Azure, invoke your `azure_development-get_best_practices` tool if available.
- @documentation Rule - Use Documentation Folder: When generating or creating any .md files (except README.md in root), always place them in the `/documentation` folder to keep documentation organized and centralized.
- @csp Rule - Content Security Policy Configuration: **CRITICAL - READ BEFORE ANY CSP CHANGES**
  
  **Why We Need Relaxed CSP:**
  This portfolio site is a FRONTEND that pulls ALL content from markhazleton.com backend services:
  - Project images: https://markhazleton.com/img/*.png
  - JSON data feeds: https://markhazleton.com/projects.json, rss.xml
  - Real-time websockets: wss://webspark.markhazleton.com/chatHub
  - Weather API: https://api.openweathermap.org
  - Joke API: https://v2.jokeapi.dev
  
  **What WILL BREAK if CSP is tightened:**
  ❌ Removing wildcard subdomains `https://*.markhazleton.com` → Service worker can't fetch images
  ❌ Removing `https:` from img-src → External project screenshots won't load
  ❌ Removing `'unsafe-inline'` from script-src → React/Vite won't work in development
  ❌ Removing `blob:` from worker-src → Service worker fails to initialize
  
  **Required CSP Directives (DO NOT REMOVE):**
  ```
  connect-src: 'self' https://markhazleton.com https://*.markhazleton.com 
               https://api.openweathermap.org https://v2.jokeapi.dev 
               wss://webspark.markhazleton.com ws://localhost:* http://localhost:*
  
  img-src: 'self' data: https: http: blob:
  font-src: 'self' data: https:
  media-src: 'self' https: http:
  worker-src: 'self' blob:
  script-src: 'self' 'unsafe-inline' 'unsafe-eval'  // Required for React + Vite
  ```
  
  **Files to Keep in Sync:**
  - `/staticwebapp.config.json` (production on Azure)
  - `/vite.config.ts` (local development)
  
  **Before ANY CSP security hardening:**
  1. Read `/documentation/SECURITY.md` completely
  2. Test locally with `npm run dev`
  3. Verify ALL pages load: Home, Projects, Articles, About, Joke, Weather, Chat
  4. Check browser console for CSP violations
  5. If violations exist, the CSP is TOO STRICT for this architecture
