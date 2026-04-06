# TailwindSpark Migration Specification: ReactSparkPortfolio Feature Replication

**Document Purpose:** Complete specification for implementing all ReactSparkPortfolio features in TailwindSpark  
**Source Application:** ReactSparkPortfolio (Bootstrap 5 + React)  
**Target Application:** TailwindSpark (Tailwind CSS + React)  
**Created:** March 1, 2026  
**Status:** Complete specification for implementation

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Architecture Overview](#architecture-overview)
3. [Application Routes & Pages](#application-routes--pages)
4. [Core Context Providers](#core-context-providers)
5. [Service Layer & API Integration](#service-layer--api-integration)
6. [Component Specifications](#component-specifications)
7. [Data Models & Validation](#data-models--validation)
8. [Configuration Requirements](#configuration-requirements)
9. [External Dependencies](#external-dependencies)
10. [Security & CSP Configuration](#security--csp-configuration)
11. [Build & Deployment](#build--deployment)
12. [Implementation Checklist](#implementation-checklist)

---

## 1. Executive Summary

ReactSparkPortfolio is a production-ready portfolio site demonstrating:
- **Frontend Stack:** React 19.2.4, TypeScript, Vite 7.3.1
- **UI Framework:** Bootstrap 5.3.8 (to be replaced with Tailwind CSS)
- **Real-time Features:** SignalR chat, live weather, dynamic content
- **Architecture:** Frontend-only SPA consuming external APIs
- **Deployment:** Dual deployment (Azure Static Web Apps + GitHub Pages)

**Migration Goal:** Replicate 100% of functionality using Tailwind CSS instead of Bootstrap.

---

## 2. Architecture Overview

### 2.1 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   React SPA (Vite + React)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Theme Context │  │  SEO Context │  │ Error Bounds │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└──────────┬──────────────┬──────────────┬────────────────────┘
           │              │              │
    ┌──────▼─────┐  ┌────▼─────┐  ┌────▼──────┐
    │ Azure      │  │ External │  │ SignalR   │
    │ Functions  │  │ APIs     │  │ WebSocket │
    │ (Proxies)  │  │          │  │           │
    └──────┬─────┘  └────┬─────┘  └────┬──────┘
           │              │              │
    ┌──────▼──────────────▼──────────────▼──────┐
    │      markhazleton.com Backend APIs        │
    │  ┌──────────┐ ┌──────────┐ ┌──────────┐  │
    │  │ Projects │ │   RSS    │ │   Chat   │  │
    │  │   JSON   │ │   Feed   │ │   Hub    │  │
    │  └──────────┘ └──────────┘ └──────────┘  │
    └───────────────────────────────────────────┘
```

### 2.2 Data Flow Patterns

**Service Layer Pattern:**
1. **Remote API** (primary) → **localStorage Cache** → **Local Fallback**
2. Cache validation by `app_version` to invalidate on deployments
3. Short cache TTL in dev (5 min), longer in prod (1 hour)

**Example: Project Service Flow**
```typescript
fetchProjectsData()
  ├─ Check localStorage cache (version-matched)
  │  └─ Valid? Return cached data
  ├─ Fetch from /api/proxy-projects (Azure Function)
  │  ├─ Success? Cache & return
  │  └─ Failure? Check stale cache
  └─ Fallback to local projects.json
```

---

## 3. Application Routes & Pages

### 3.1 Route Configuration

Implement in React Router (react-router-dom):

| Route | Component | Description | Key Features |
|-------|-----------|-------------|--------------|
| `/` | Hero | Landing page | Profile display, CTA buttons, tech stack showcase |
| `/about` | About | About page | Profile info, ReactSpark articles (filtered from RSS) |
| `/projects` | Projects | Portfolio showcase | Search, sort, pagination (6/page), cache refresh |
| `/articles` | Articles | RSS blog feed | Search, category filter, date sort, pagination (6/page) |
| `/joke` | Joke | Random jokes | API integration, like/save, history, share, chat explainer |
| `/weather` | WeatherForecast | Weather lookup | City search, Leaflet maps, multi-city display |
| `/variant` | VariantList | AI assistants | PromptSpark variant selector, category filter, chat modal |
| `*` | NotFound | 404 handler | Friendly error with navigation suggestions |

### 3.2 Routing Implementation

```typescript
// App.tsx structure
<BrowserRouter>
  <ThemeProvider>
    <SEOProvider>
      <ErrorBoundary>
        <UpdateNotification />
        <Header /> {/* Sticky top */}
        <main className="flex-grow-1 container-fluid py-5 mb-5">
          <Suspense fallback={<Spinner />}>
            <Routes>
              <Route path="/" element={<Hero />} />
              <Route path="/about" element={<About />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/articles" element={<Articles />} />
              <Route path="/joke" element={<Joke />} />
              <Route path="/weather" element={<WeatherForecast />} />
              <Route path="/variant" element={<VariantList />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer /> {/* mt-auto */}
      </ErrorBoundary>
    </SEOProvider>
  </ThemeProvider>
</BrowserRouter>
```

**Lazy Loading:**
```typescript
const Hero = lazy(() => import("./components/Hero"));
const About = lazy(() => import("./components/About"));
// ... all route components lazy loaded
```

---

## 4. Core Context Providers

### 4.1 ThemeContext

**Location:** `src/contexts/ThemeContext.tsx`

**Functionality:**
- Light/dark theme toggle
- Persists to `localStorage.theme`
- Applies `data-bs-theme` attribute (adapt to Tailwind's dark mode strategy)
- Detects system preference on first visit

**Implementation:**
```typescript
type ThemeType = "light" | "dark";

interface ThemeContextType {
  theme: ThemeType;
  toggleTheme: () => void;
}

// getInitialTheme():
// 1. Check localStorage.theme
// 2. Fallback to window.matchMedia('(prefers-color-scheme: dark)')
// 3. Default to 'light'

// Apply theme:
document.documentElement.setAttribute("data-bs-theme", theme);
// For Tailwind: use 'dark' class on <html> or config-based strategy
```

**Tailwind Adaptation:**
```typescript
// For Tailwind, apply dark class to document root
useEffect(() => {
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
  localStorage.setItem("theme", theme);
}, [theme]);
```

### 4.2 SEOContext

**Location:** `src/contexts/SEOContext.tsx`

**Functionality:**
- Dynamic `<title>` and meta description per route
- Open Graph meta tags
- Canonical URL management
- JSON-LD structured data

**Implementation:**
```typescript
interface SEOContextType {
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setOgImage?: (imageUrl: string) => void;
}

// Updates:
// - document.title
// - <meta name="description" content={description} />
// - <meta property="og:title" content={title} />
// - <meta property="og:description" content={description} />
// - <link rel="canonical" href={currentUrl} />
```

**Usage in Pages:**
```typescript
const { setTitle, setDescription } = useSEO();

useEffect(() => {
  setTitle("About | TailwindSpark");
  setDescription("Learn about TailwindSpark...");
}, [setTitle, setDescription]);
```

---

## 5. Service Layer & API Integration

### 5.1 ProjectService

**Location:** `src/services/ProjectService.ts`

**External API:** `https://markhazleton.com/projects.json`

**Proxy Routes:**
- Development: `/api/projects` (Vite proxy)
- Production: `/api/proxy-projects` (Azure Function)

**Features:**
- Cache in `localStorage.cachedProjectsData`
- Cache keys: `projectsLastUpdated`, `projectsCacheVersion`, `projectsCount`, `projectsSource`
- Invalidate cache on `app_version` mismatch
- Transform relative image URLs to `https://markhazleton.com/{path}`
- Add cache buster: `?v={timestamp}` to image URLs
- Zod validation with `ProjectDataArraySchema`

**Cache Logic:**
```typescript
const isCacheValid = 
  cachedVersion === currentVersion && 
  cacheAge < maxCacheAge;

// maxCacheAge: 5 min (dev), 1 hour (prod)
```

**Response Structure:**
```json
[
  {
    "id": 1,
    "image": "https://markhazleton.com/assets/img/frogsfolly.png",
    "p": "Frogsfolly",
    "d": "Description text...",
    "h": "https://frogsfolly.com"
  }
]
```

**Methods:**
- `fetchProjectsData(): Promise<ProjectData[]>`
- `clearProjectsCache(): void` - Removes all localStorage keys
- `getProjectsCacheInfo(): CacheInfo` - Returns cache metadata

### 5.2 RssService

**Location:** `src/services/RssService.ts`

**External API:** `https://markhazleton.com/rss.xml`

**Proxy Routes:**
- Development: `/api/rss` (Vite proxy)
- Production: `/api/proxy-rss` (Azure Function)

**Features:**
- Cache in `localStorage.cachedRssData` (raw XML)
- Cache TTL: 30 minutes
- Parses XML to structured data
- Zod validation with `RssArticleArraySchema`
- Fallback to local `/rss.xml` if API fails

**Parsing Logic:**
```typescript
const parseRssData = (rssData: string): RssArticle[] => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(rssData, "text/xml");
  const items = xmlDoc.querySelectorAll("item");
  
  return Array.from(items).map(item => ({
    title: item.querySelector("title")?.textContent || "",
    link: item.querySelector("link")?.textContent || "",
    pubDate: item.querySelector("pubDate")?.textContent || "",
    category: item.querySelector("category")?.textContent,
    description: item.querySelector("description")?.textContent,
    thumbnail: extractImageFromContent(item.querySelector("content:encoded")),
  }));
};
```

**RssArticle Type:**
```typescript
interface RssArticle {
  title: string;
  link: string; // Valid URL
  pubDate: string;
  category?: string;
  description?: string;
  thumbnail?: string;
  imageUrl?: string;
}
```

### 5.3 JokeService

**Location:** `src/services/JokeService.ts`

**External API:** `https://v2.jokeapi.dev`

**Proxy Routes:**
- Development: `/api/joke` (Vite proxy)
- Production: `/api/proxy-joke` (Azure Function)

**Request Parameters:**
- `category`: Any, Programming, Dark, etc.
- `safeMode`: boolean (default: true)

**Response Types:**
```typescript
type Joke = 
  | { type: "single"; joke: string; category: string; id: number; }
  | { type: "twopart"; setup: string; delivery: string; category: string; id: number; };
```

**Fallback Joke:**
```typescript
const fallbackJoke: Joke = {
  error: false,
  category: "Programming",
  type: "single",
  joke: "Why do programmers prefer dark mode? Because light attracts bugs! 🐛",
  id: 0,
};
```

**Methods:**
- `fetchJoke(category?: string, safeMode?: boolean): Promise<Joke>`
- Singleton pattern: `JokeService.getInstance()`

### 5.4 WeatherService (Implicit)

**External API:** `https://webspark.markhazleton.com/api/asyncspark/openweatherapi/weather`

**Direct API Call** (no proxy needed - CORS enabled on backend)

**Request:**
```
GET /api/asyncspark/openweatherapi/weather?location=Dallas
```

**Response Structure:**
```typescript
interface WeatherData {
  success: boolean;
  location: {
    name: string;
    latitude: number;
    longitude: number;
  };
  currentConditions: {
    temperature: number; // Fahrenheit
    feelsLike?: number;
    conditionsDescription: string;
    humidity: number; // Percentage
    cloudCover: number;
    windSpeed: number; // mph
    visibility: number; // meters
  };
  fetchTime: string; // ISO timestamp
}
```

**Error Handling:**
- 429 status: Rate limit exceeded
- Display user-friendly error messages
- No caching (real-time data)

### 5.5 PromptSparkService (Implicit)

**External API:** `https://webspark.markhazleton.com/api/PromptSpark/Variant`

**Variant Structure:**
```typescript
interface Variant {
  id: string;
  name: string;
  description?: string;
  systemPrompt?: string;
  temperature?: number;
}
```

**Enhancement Logic:**
```typescript
// Categorize variants by name patterns
const categorizeVariant = (variant: Variant): EnhancedVariant => {
  let category = "General";
  const lowerName = variant.name.toLowerCase();
  
  if (lowerName.includes("gpt")) category = "GPT Models";
  else if (lowerName.includes("code") || lowerName.includes("dev")) category = "Development";
  else if (lowerName.includes("creative")) category = "Creative";
  else if (lowerName.includes("data")) category = "Data Analysis";
  
  return {
    ...variant,
    category,
    featured: lowerName.includes("4") || lowerName.includes("latest"),
  };
};
```

---

## 6. Component Specifications

### 6.1 Layout Components

#### Header Component

**File:** `src/components/Header.tsx`

**Features:**
- Sticky navigation bar
- Active route highlighting
- Theme toggle button (Sun/Moon icons)
- Responsive hamburger menu
- Logo with subtitle
- Skip to main content link (accessibility)

**Navigation Items:**
```typescript
const navItems = [
  { path: "/", label: "Home", icon: <House /> },
  { path: "/about", label: "About", icon: <Person /> },
  { path: "/projects", label: "Projects", icon: <Briefcase /> },
  { path: "/articles", label: "Articles", icon: <JournalText /> },
  { path: "/joke", label: "Joke", icon: <EmojiLaughing /> },
  { path: "/weather", label: "Weather", icon: <Cloud /> },
  { path: "/variant", label: "AI Chat", icon: <CpuFill /> },
];
```

**Active State Detection:**
```typescript
const isActive = (path: string) => location.pathname === path;
```

**Tailwind Implementation:**
- Replace `navbar-expand-lg` with Tailwind responsive utilities
- Use `sticky top-0 z-50` for sticky header
- Theme toggle with `dark:bg-gray-800` variants
- Mobile menu with `md:hidden` and state toggle

#### Footer Component

**File:** `src/components/Footer.tsx`

**Features:**
- Build date/time display (injected via Vite define)
- Central Standard Time formatting
- Social links (GitHub, LinkedIn)
- Copyright notice
- Responsive 3-column layout (mobile stacks)

**Build Date Injection:**
```typescript
// vite.config.ts
define: {
  __BUILD_DATE__: JSON.stringify(buildDate),
}

// Footer.tsx
const buildDate = __BUILD_DATE__;
const formatBuildDateTime = () => {
  const date = new Date(buildDate);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "America/Chicago",
    timeZoneName: "short",
  }).format(date);
};
```

#### ErrorBoundary Component

**File:** `src/components/ErrorBoundary.tsx`

**Features:**
- Catches React component errors
- Displays user-friendly error page
- Logs errors to console
- "Go Home" button for recovery
- Prevents full app crash

**Implementation:**
```typescript
class ErrorBoundary extends React.Component<Props, State> {
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container">
          <h1>Oops! Something went wrong</h1>
          <p>{this.state.error?.message}</p>
          <Link to="/">Go Home</Link>
        </div>
      );
    }
    return this.props.children;
  }
}
```

#### UpdateNotification Component

**File:** `src/components/UpdateNotification.tsx`

**Features:**
- Detects version changes (compares deployed `version.json` to localStorage)
- Toast notification with "Update" and "Dismiss" buttons
- Hard refresh on update (clears cache)
- Version check hook: `useVersionCheck()`

**Version Check Logic:**
```typescript
// useVersionCheck hook
const useVersionCheck = () => {
  const [hasUpdate, setHasUpdate] = useState(false);
  
  useEffect(() => {
    const checkVersion = async () => {
      const response = await fetch('/version.json?t=' + Date.now());
      const { version: deployedVersion } = await response.json();
      const storedVersion = localStorage.getItem("app_version");
      
      if (storedVersion && deployedVersion !== storedVersion) {
        setHasUpdate(true);
      }
      localStorage.setItem("app_version", deployedVersion);
    };
    
    checkVersion();
    const interval = setInterval(checkVersion, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);
  
  const handleUpdate = () => {
    localStorage.clear();
    window.location.reload();
  };
  
  return { hasUpdate, handleUpdate };
};
```

### 6.2 Page Components

#### Hero Component

**File:** `src/components/Hero.tsx`

**Data Source:** `src/data/profile.json`

**Features:**
- Large hero banner with gradient background
- Profile name, profession, introduction
- CTA buttons (primary + secondary)
- GitHub repository link
- LinkedIn profile link
- Technology stack showcase with icons
- SEO meta tag updates

**Profile Data Structure:**
```json
{
  "name": "ReactSpark",
  "createdBy": "Mark Hazleton",
  "profession": "Dynamic React Frontend",
  "introduction": "Description...",
  "ctaText": "Explore WebSpark",
  "ctaLink": "https://markhazleton.com",
  "skills": ["React 18+", "Vite", "TypeScript", ...]
}
```

**Technology Stack Icons:**
```typescript
const techIcons = [
  { icon: <Braces />, label: "React 19", color: "text-info" },
  { icon: <Bootstrap />, label: "Bootstrap 5", color: "text-purple" },
  { icon: <FileEarmarkCode />, label: "TypeScript", color: "text-primary" },
  { icon: <LightningCharge />, label: "Vite", color: "text-warning" },
  // ... more icons
];
```

**Tailwind Adaptation:**
```tsx
<section className="py-20 bg-gradient-to-br from-blue-600 to-purple-700">
  <div className="container mx-auto px-4">
    <div className="text-center text-white">
      <h1 className="text-5xl font-bold mb-4">{profile.name}</h1>
      <h2 className="text-3xl font-light mb-4">{profile.profession}</h2>
      <p className="text-xl max-w-3xl mx-auto mb-8 opacity-90">
        {profile.introduction}
      </p>
      <div className="flex gap-4 justify-center">
        <a href={profile.ctaLink} className="btn-primary">
          {profile.ctaText}
        </a>
        <a href="..." className="btn-secondary">
          View on GitHub
        </a>
      </div>
    </div>
  </div>
</section>
```

#### Projects Component

**File:** `src/components/Projects.tsx`

**Data Source:** `ProjectService.fetchProjectsData()`

**Features:**
- Search by project name or description
- Sort by: name (asc/desc), id (asc/desc)
- Pagination: 6 projects per page
- Cache refresh button with loading state
- Cache info display (source, count, last updated)
- Project cards with image, title, description, link
- Placeholder for failed image loads
- Responsive grid layout

**State Management:**
```typescript
const [projects, setProjects] = useState<Project[]>([]);
const [loading, setLoading] = useState<boolean>(true);
const [error, setError] = useState<string | null>(null);
const [searchTerm, setSearchTerm] = useState("");
const [currentPage, setCurrentPage] = useState(1);
const [sortOption, setSortOption] = useState<SortOption>("id-desc");
const projectsPerPage = 6;
```

**Filtering & Sorting:**
```typescript
const filteredProjects = projects.filter(project =>
  searchTerm === "" || 
  project.p.toLowerCase().includes(searchTerm.toLowerCase()) ||
  project.d.toLowerCase().includes(searchTerm.toLowerCase())
);

const sortedProjects = [...filteredProjects].sort((a, b) => {
  switch (sortOption) {
    case "name-asc": return a.p.localeCompare(b.p);
    case "name-desc": return b.p.localeCompare(a.p);
    case "id-asc": return a.id - b.id;
    case "id-desc": return b.id - a.id;
  }
});
```

**Pagination Controls:**
```typescript
const totalPages = Math.ceil(sortedProjects.length / projectsPerPage);
const currentProjects = sortedProjects.slice(
  (currentPage - 1) * projectsPerPage,
  currentPage * projectsPerPage
);

// Render: Previous | 1 ... 3 4 5 ... 10 | Next
// Show current, first, last, +/-1 from current
```

**Project Card Layout:**
```tsx
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
  {currentProjects.map(project => (
    <div key={project.id} className="card">
      <img src={project.image} alt={project.p} className="card-img" />
      <div className="card-body">
        <h3 className="text-xl font-bold">{project.p}</h3>
        <p className="text-gray-600">{project.d}</p>
        <a href={project.h} target="_blank" className="btn-link">
          View Project →
        </a>
      </div>
    </div>
  ))}
</div>
```

#### Articles Component

**File:** `src/components/Articles.tsx`

**Data Source:** `RssService.fetchRssFeed()`

**Features:**
- Search by article title
- Filter by category (extracted from RSS)
- Sort by date: newest/oldest
- Pagination: 6 articles per page
- Force refresh button (clears cache)
- Data source indicator (remote/cache/local)
- Article cards with title, date, category badge, description, link
- Date formatting with `date-fns`

**State Management:**
```typescript
const [articles, setArticles] = useState<RssArticle[]>([]);
const [searchTerm, setSearchTerm] = useState<string>("");
const [filter, setFilter] = useState<string>("all");
const [categories, setCategories] = useState<string[]>(["all"]);
const [sortDirection, setSortDirection] = useState<"newest" | "oldest">("newest");
const [currentPage, setCurrentPage] = useState<number>(1);
const articlesPerPage = 6;
```

**Category Extraction:**
```typescript
const categorySet = new Set<string>(["all"]);
articleData.forEach(article => {
  if (article.category) categorySet.add(article.category);
});
setCategories(Array.from(categorySet));
```

**Filtering & Sorting:**
```typescript
const filteredArticles = articles.filter(article => {
  const matchesSearch = 
    searchTerm === "" || 
    article.title.toLowerCase().includes(searchTerm.toLowerCase());
  
  const matchesFilter = filter === "all" || article.category === filter;
  
  return matchesSearch && matchesFilter;
});

const sortedArticles = [...filteredArticles].sort((a, b) => {
  const dateA = new Date(a.pubDate).getTime();
  const dateB = new Date(b.pubDate).getTime();
  return sortDirection === "newest" ? dateB - dateA : dateA - dateB;
});
```

**Article Card Layout:**
```tsx
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
  {currentArticles.map((article, index) => (
    <div key={index} className="card">
      <div className="card-body">
        <div className="flex items-center justify-between mb-2">
          <Badge>{article.category || "General"}</Badge>
          <span className="text-sm text-gray-500">
            {format(new Date(article.pubDate), "MMMM d, yyyy")}
          </span>
        </div>
        <h3 className="text-xl font-bold mb-2">{article.title}</h3>
        <p className="text-gray-600 mb-4">{article.description}</p>
        <a href={article.link} target="_blank" className="btn-link">
          Read Article →
        </a>
      </div>
    </div>
  ))}
</div>
```

#### Joke Component

**File:** `src/components/Joke.tsx`

**Data Source:** `JokeService.fetchJoke()`

**Features:**
- Fetch random joke on load and refresh
- Display single-line or two-part jokes
- Like/unlike functionality (localStorage persistence)
- Bookmark/save jokes (localStorage persistence)
- Copy to clipboard
- Share via Web Share API
- Joke history (last 10 jokes)
- Saved jokes view (accordion)
- AI chat modal for joke explanation
- Toast notifications for actions

**State Management:**
```typescript
const [joke, setJoke] = useState<Joke | null>(null);
const [loading, setLoading] = useState<boolean>(false);
const [error, setError] = useState<boolean>(false);
const [showModal, setShowModal] = useState<boolean>(false);
const [likedJokes, setLikedJokes] = useState<number[]>(() => {
  const saved = localStorage.getItem("likedJokes");
  return saved ? JSON.parse(saved) : [];
});
const [history, setHistory] = useState<Joke[]>(() => {
  const saved = localStorage.getItem("jokeHistory");
  return saved ? JSON.parse(saved) : [];
});
const [savedJokes, setSavedJokes] = useState<Joke[]>(() => {
  const saved = localStorage.getItem("userSavedJokes");
  return saved ? JSON.parse(saved) : [];
});
```

**Joke Display:**
```tsx
{joke && (
  <div className="joke-card">
    {joke.type === "single" ? (
      <p className="text-2xl">{joke.joke}</p>
    ) : (
      <>
        <p className="text-xl font-semibold">{joke.setup}</p>
        <p className="text-2xl mt-4">{joke.delivery}</p>
      </>
    )}
  </div>
)}
```

**Action Buttons:**
```tsx
<div className="flex gap-2 justify-center mt-4">
  <Button onClick={fetchJoke} disabled={loading}>
    <ArrowRepeat /> New Joke
  </Button>
  <Button onClick={() => updateLikedJokes(joke.id)}>
    {likedJokes.includes(joke.id) ? <HeartFill /> : <Heart />}
  </Button>
  <Button onClick={() => saveJoke(joke)}>
    {savedJokes.some(s => s.id === joke.id) ? <BookmarkFill /> : <BookmarkPlus />}
  </Button>
  <Button onClick={handleShare}>
    <Share /> Share
  </Button>
  <Button onClick={handleCopy}>
    <Clipboard /> Copy
  </Button>
  <Button onClick={() => handleJokeExplainer(joke)}>
    <QuestionCircle /> Explain
  </Button>
</div>
```

**Web Share API:**
```typescript
const handleShare = async () => {
  if (navigator.share && joke) {
    try {
      await navigator.share({
        title: "Check out this joke!",
        text: joke.type === "single" 
          ? joke.joke 
          : `${joke.setup}\n\n${joke.delivery}`,
      });
    } catch (err) {
      console.log("Share failed", err);
    }
  }
};
```

**Chat Explainer Modal:**
```tsx
<Modal show={showModal} onHide={handleCloseModal} size="lg">
  <Modal.Header closeButton>
    <Modal.Title>Joke Explainer AI</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Chat 
      variantName="JokeExplainer" 
      initialMessage={formatJokeForExplanation(jokeToExplain)}
      isInModal={true}
    />
  </Modal.Body>
</Modal>
```

#### WeatherForecast Component

**File:** `src/components/WeatherForecast.tsx`

**Data Source:** `https://webspark.markhazleton.com/api/asyncspark/openweatherapi/weather`

**Features:**
- Search weather by city name
- Display current conditions (temp, feels-like, humidity, wind, visibility, cloud cover)
- Weather icons based on conditions
- Interactive Leaflet map showing city location
- Recent searches (localStorage, max 5)
- Default cities on load (Dallas, Wichita)
- Multi-city comparison view
- Refresh capability
- Error handling (rate limiting, invalid city)

**State Management:**
```typescript
const [city, setCity] = useState<string>("");
const [loading, setLoading] = useState<boolean>(false);
const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
const [initialWeatherData, setInitialWeatherData] = useState<WeatherResults>({});
const [error, setError] = useState<string>("");
const [recentSearches, setRecentSearches] = useState<string[]>(() => {
  const saved = localStorage.getItem("weatherSearches");
  return saved ? JSON.parse(saved) : ["Dallas", "Wichita"];
});
```

**Fetch Weather:**
```typescript
const fetchWeather = async (searchCity: string) => {
  setLoading(true);
  setError("");
  
  try {
    const url = `https://webspark.markhazleton.com/api/asyncspark/openweatherapi/weather?location=${searchCity}`;
    const response = await fetch(url);
    
    if (response.status === 429) {
      throw new Error("Rate limit exceeded");
    }
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.success) {
      setWeatherData(data);
      saveSearch(searchCity);
    }
  } catch (err) {
    setError(err.message || "Failed to fetch weather data");
  } finally {
    setLoading(false);
  }
};
```

**Weather Display:**
```tsx
{weatherData && (
  <div className="weather-card">
    <h2 className="text-3xl font-bold">{weatherData.location.name}</h2>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
      <div className="stat">
        <Thermometer size={24} />
        <span className="text-2xl">{weatherData.currentConditions.temperature}°F</span>
        <span className="text-sm text-gray-500">Temperature</span>
      </div>
      <div className="stat">
        <Droplet size={24} />
        <span className="text-2xl">{weatherData.currentConditions.humidity}%</span>
        <span className="text-sm text-gray-500">Humidity</span>
      </div>
      <div className="stat">
        <Wind size={24} />
        <span className="text-2xl">{weatherData.currentConditions.windSpeed} mph</span>
        <span className="text-sm text-gray-500">Wind Speed</span>
      </div>
      {/* More stats... */}
    </div>
    <p className="text-lg mt-4">{weatherData.currentConditions.conditionsDescription}</p>
  </div>
)}
```

**MapComponent Integration:**
```tsx
<MapComponent 
  latitude={weatherData.location.latitude}
  longitude={weatherData.location.longitude}
  cityName={weatherData.location.name}
/>
```

#### MapComponent

**File:** `src/components/MapComponent.tsx`

**Dependencies:** `leaflet`, `react-leaflet`

**Features:**
- Displays city location on interactive map
- Marker with city name popup
- Tile layer from OpenStreetMap
- Responsive sizing
- Theme-aware styling

**Implementation:**
```tsx
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface MapComponentProps {
  latitude: number;
  longitude: number;
  cityName: string;
}

const MapComponent: React.FC<MapComponentProps> = ({ latitude, longitude, cityName }) => {
  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={10}
      style={{ height: '400px', width: '100%' }}
      className="rounded-lg shadow-md"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[latitude, longitude]}>
        <Popup>{cityName}</Popup>
      </Marker>
    </MapContainer>
  );
};
```

**Leaflet Icon Fix:**
```typescript
// Fix for default marker icon in Webpack/Vite
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;
```

#### VariantList Component

**File:** `src/components/VariantList.tsx`

**Data Source:** `https://webspark.markhazleton.com/api/PromptSpark/Variant`

**Features:**
- Fetch AI assistant variants from API
- Categorize variants (GPT Models, Development, Creative, Data Analysis, General)
- Mark featured variants (show top 3)
- Search by name or description
- Filter by category
- Card grid layout with variant info
- "Start Chat" button opens modal with Chat component
- Description toggle for each variant
- Theme-aware styling

**State Management:**
```typescript
const [selectedVariant, setSelectedVariant] = useState<EnhancedVariant | null>(null);
const [searchTerm, setSearchTerm] = useState("");
const [activeCategory, setActiveCategory] = useState("all");
const [showDescription, setShowDescription] = useState<string | null>(null);
```

**Variant Enhancement:**
```typescript
const enhancedVariants: EnhancedVariant[] = useMemo(() => {
  return rawVariants.map(variant => {
    let category = "General";
    let featured = false;
    
    const lowerName = variant.name.toLowerCase();
    
    if (lowerName.includes("gpt")) category = "GPT Models";
    else if (lowerName.includes("code") || lowerName.includes("dev")) category = "Development";
    else if (lowerName.includes("creative")) category = "Creative";
    else if (lowerName.includes("data")) category = "Data Analysis";
    
    if (lowerName.includes("4") || lowerName.includes("latest")) {
      featured = true;
    }
    
    return {
      ...variant,
      category,
      featured,
      description: variant.description || `Chat with ${variant.name}`,
    };
  });
}, [rawVariants]);
```

**Featured Variants Section:**
```tsx
<div className="mb-8">
  <h3 className="text-2xl font-bold mb-4 flex items-center">
    <Star className="text-yellow-500 mr-2" /> Featured Assistants
  </h3>
  <div className="grid md:grid-cols-3 gap-4">
    {featuredVariants.slice(0, 3).map(variant => (
      <div key={variant.id} className="card border-2 border-yellow-400">
        <div className="card-body">
          <h4 className="font-bold text-lg">{variant.name}</h4>
          <Badge>{variant.category}</Badge>
          <Button onClick={() => handleStartChat(variant)} className="mt-4">
            <ChatDots /> Start Chat
          </Button>
        </div>
      </div>
    ))}
  </div>
</div>
```

**Chat Modal:**
```tsx
<Modal show={!!selectedVariant} onHide={handleCloseModal} size="lg" fullscreen="md-down">
  <Modal.Header closeButton>
    <Modal.Title>Chat with {selectedVariant?.name}</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {selectedVariant && (
      <Chat 
        variantName={selectedVariant.name} 
        isInModal={true}
      />
    )}
  </Modal.Body>
</Modal>
```

#### Chat Component

**File:** `src/components/Chat.tsx`

**SignalR Hub:** `wss://webspark.markhazleton.com/chatHub`

**Features:**
- Real-time bidirectional messaging via SignalR
- Message streaming with typing indicators
- Markdown rendering for bot responses (ReactMarkdown)
- User name input (persisted to localStorage)
- Conversation ID generation
- Automatic reconnection on connection loss
- Modal and embedded display modes
- Message sanitization (XSS prevention)
- Connection status indicators

**Props:**
```typescript
interface ChatProps {
  variantName: string; // AI persona/variant name
  initialMessage?: string; // Auto-send on mount
  isInModal?: boolean; // Display mode
}
```

**State Management:**
```typescript
const [messages, setMessages] = useState<Message[]>([]);
const [userName, setUserName] = useState(() => 
  localStorage.getItem("chatUserName") || ""
);
const [userInput, setUserInput] = useState("");
const [chatInput, setChatInput] = useState("");
const [isBotTyping, setIsBotTyping] = useState(false);
const [isConnecting, setIsConnecting] = useState(true);
const [connectionError, setConnectionError] = useState<string | null>(null);

const connection = useRef<signalR.HubConnection | null>(null);
const conversationId = useRef<string>(Date.now().toString());
```

**SignalR Connection Setup:**
```typescript
const setupSignalRConnection = async () => {
  const hubUrl = import.meta.env.VITE_SIGNALR_HUB_URL || 
    "https://webspark.markhazleton.com/chatHub";
  
  connection.current = new signalR.HubConnectionBuilder()
    .withUrl(hubUrl, {
      skipNegotiation: false,
      withCredentials: false,
      timeout: 30000,
      transport: signalR.HttpTransportType.WebSockets | 
                signalR.HttpTransportType.ServerSentEvents |
                signalR.HttpTransportType.LongPolling,
    })
    .withAutomaticReconnect([0, 2000, 10000, 30000])
    .configureLogging(signalR.LogLevel.Information)
    .build();
  
  connection.current.on("ReceiveMessage", handleReceiveMessage);
  
  connection.current.onclose((error) => {
    console.log("SignalR connection closed:", error);
    // Retry logic...
  });
  
  connection.current.onreconnecting(() => {
    setIsConnecting(true);
  });
  
  connection.current.onreconnected(() => {
    setIsConnecting(false);
    setConnectionError(null);
  });
  
  await connection.current.start();
  setIsConnecting(false);
};
```

**Message Streaming:**
```typescript
const handleReceiveMessage = (user: string, messageChunk: string) => {
  if (user === variantName) {
    // Bot message - accumulate chunks
    setIsBotTyping(true);
    streamingBuffer.current += sanitizeInput(messageChunk);
    
    if (streamingTimeoutRef.current) clearTimeout(streamingTimeoutRef.current);
    
    if (isFirstChunk.current) {
      addNewMessage(messageChunk, user, true);
      isFirstChunk.current = false;
    } else {
      updateLastMessage(messageChunk);
    }
    
    streamingTimeoutRef.current = setTimeout(() => {
      isFirstChunk.current = true;
      streamingBuffer.current = "";
      setIsBotTyping(false);
    }, 1000);
  } else {
    addNewMessage(messageChunk, user, false);
  }
};
```

**Send Message:**
```typescript
const sendMessage = async () => {
  if (!chatInput.trim() || !connection.current) return;
  
  try {
    await connection.current.invoke(
      "SendMessage",
      userName,
      chatInput,
      conversationId.current,
      variantName
    );
    
    setChatInput("");
  } catch (err) {
    console.error("Failed to send message:", err);
  }
};
```

**Message Display:**
```tsx
<div className="messages-container max-h-96 overflow-y-auto">
  {messages.map(message => (
    <div 
      key={message.id} 
      className={`message ${message.user === userName ? 'user' : 'bot'}`}
    >
      <div className="message-header">
        <strong>{message.user}</strong>
        <span className="text-xs text-gray-500">{message.timestamp}</span>
      </div>
      <div className="message-body">
        {message.user === variantName ? (
          <ReactMarkdown>{message.content}</ReactMarkdown>
        ) : (
          <p>{message.content}</p>
        )}
      </div>
    </div>
  ))}
  {isBotTyping && (
    <div className="typing-indicator">
      <Spinner size="sm" /> {variantName} is typing...
    </div>
  )}
</div>
```

**User Name Setup:**
```tsx
{!userName && (
  <div className="user-setup p-4 bg-blue-50 rounded">
    <p className="mb-2">Please enter your name to start chatting:</p>
    <Form.Group>
      <Form.Control
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setUserName(userInput);
            localStorage.setItem("chatUserName", userInput);
          }
        }}
        placeholder="Your name"
      />
      <Button onClick={() => {
        setUserName(userInput);
        localStorage.setItem("chatUserName", userInput);
      }}>
        Start Chat
      </Button>
    </Form.Group>
  </div>
)}
```

#### About Component

**File:** `src/components/About.tsx`

**Data Sources:**
- `src/data/profile.json` (profile info)
- `RssService.fetchRssFeed()` (filtered for ReactSpark articles)

**Features:**
- Profile information display
- Recent ReactSpark articles (filtered by category, max 3)
- Technology stack cards
- GitHub/LinkedIn links
- SEO meta updates

**ReactSpark Articles Filtering:**
```typescript
const loadReactSparkArticles = async () => {
  const articles = await fetchRssFeed();
  
  const filteredArticles = articles.filter(article =>
    article.category?.toLowerCase() === "reactspark" ||
    article.title.toLowerCase().includes("reactspark")
  );
  
  const sortedArticles = filteredArticles
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
    .slice(0, 3);
  
  setReactSparkArticles(sortedArticles);
};
```

**Layout:**
```tsx
<div className="container py-12">
  <div className="text-center mb-8">
    <h1 className="text-4xl font-bold">{profile.name}</h1>
    <p className="text-xl mt-4">{profile.introduction}</p>
    <div className="flex gap-4 justify-center mt-6">
      <a href="..." className="btn-outline">View on GitHub</a>
      <a href="..." className="btn-outline">WebSpark Suite</a>
    </div>
  </div>
  
  <div className="grid md:grid-cols-2 gap-8">
    <div className="card">
      <h2 className="text-2xl font-bold mb-4">About ReactSpark</h2>
      <p>{profile.about}</p>
      <div className="tech-stack mt-4">
        {/* Technology icons */}
      </div>
    </div>
    
    <div className="card">
      <h2 className="text-2xl font-bold mb-4">Recent Articles</h2>
      {reactSparkArticles.map(article => (
        <div key={article.link} className="article-item">
          <h3 className="font-bold">{article.title}</h3>
          <p className="text-sm text-gray-500">
            {format(new Date(article.pubDate), "MMMM d, yyyy")}
          </p>
          <a href={article.link} className="text-blue-600">Read more →</a>
        </div>
      ))}
    </div>
  </div>
</div>
```

#### NotFound Component

**File:** `src/components/NotFound.tsx`

**Features:**
- 404 error page
- Friendly error message
- Navigation suggestions (Home, Projects, Articles)
- Search bar (optional)
- Theme-aware styling

**Implementation:**
```tsx
const NotFound: React.FC = () => {
  return (
    <div className="container py-20 text-center">
      <h1 className="text-6xl font-bold text-gray-300">404</h1>
      <h2 className="text-3xl font-semibold mt-4">Page Not Found</h2>
      <p className="text-xl mt-4 text-gray-600">
        The page you're looking for doesn't exist or has been moved.
      </p>
      
      <div className="flex gap-4 justify-center mt-8">
        <Link to="/" className="btn-primary">Go Home</Link>
        <Link to="/projects" className="btn-secondary">View Projects</Link>
        <Link to="/articles" className="btn-secondary">Read Articles</Link>
      </div>
    </div>
  );
};
```

---

## 7. Data Models & Validation

### 7.1 Project Model

**File:** `src/models/Project.tsx`

**Dependencies:** `zod` for runtime validation

**Schema:**
```typescript
import { z } from "zod";

export const ProjectDataSchema = z.object({
  id: z.number().int().positive({
    message: "Project ID must be a positive integer",
  }),
  image: z.string().min(1, {
    message: "Project image path cannot be empty",
  }),
  p: z.string().min(1, {
    message: "Project title cannot be empty",
  }),
  d: z.string().min(1, {
    message: "Project description cannot be empty",
  }),
  h: z.string().url({
    message: "Project link must be a valid URL",
  }),
});

export const ProjectDataArraySchema = z.array(ProjectDataSchema).min(1, {
  message: "Projects array cannot be empty",
});

export type ProjectData = z.infer<typeof ProjectDataSchema>;
export type ProjectDataArray = z.infer<typeof ProjectDataArraySchema>;
```

**Class Implementation:**
```typescript
class Project {
  id: number;
  image: string;
  p: string; // Title
  d: string; // Description
  h: string; // Link
  
  constructor(id: number, image: string, p: string, d: string, h: string) {
    this.id = id;
    this.image = image;
    this.p = p;
    this.d = d;
    this.h = h;
  }
  
  static async loadProjects(): Promise<Project[]> {
    const projectsData = await fetchProjectsData();
    return projectsData.map(proj => 
      new Project(proj.id, proj.image, proj.p, proj.d, proj.h)
    );
  }
  
  formatTitle(): string {
    return this.p.trim() !== "" ? this.p : "Untitled Project";
  }
  
  formatDescription(): string {
    return this.d.trim() !== "" ? this.d : "No description available.";
  }
  
  formatLink(): string {
    return this.h.trim() !== "" ? this.h : "#";
  }
}
```

### 7.2 Validation Usage in Services

**ProjectService Example:**
```typescript
try {
  const transformedProjects = projectsJsonData.map(project => {
    // Transform image URLs
    if (project.image && !project.image.startsWith("http")) {
      const imagePath = project.image.startsWith("/") 
        ? project.image.substring(1) 
        : project.image;
      project.image = addCacheBuster(`https://markhazleton.com/${imagePath}`);
    }
    return project;
  });
  
  // Validate with Zod
  const validatedProjects = ProjectDataArraySchema.parse(transformedProjects);
  
  console.log(`Successfully validated ${validatedProjects.length} projects`);
  return validatedProjects;
} catch (error) {
  if (error instanceof ZodError) {
    console.error("Validation failed:", error);
    // Fallback logic
  }
  throw error;
}
```

---

## 8. Configuration Requirements

### 8.1 Application Configuration

**File:** `src/config/AppConfig.ts`

```typescript
export const AppConfig = {
  hostedUrl: "https://tailwindspark.markhazleton.com", // UPDATE THIS
  siteTitle: "TailwindSpark Portfolio",
  siteDescription: "A portfolio website built with React, TypeScript, and Tailwind CSS",
  owner: "Mark Hazleton",
  githubRepo: "https://github.com/markhazleton/TailwindSpark", // UPDATE THIS
};

export default AppConfig;
```

### 8.2 Environment Variables

**File:** `.env` (development)

```bash
# SignalR Hub URL
VITE_SIGNALR_HUB_URL=https://webspark.markhazleton.com/chatHub

# Weather API (via webspark backend)
VITE_WEATHER_API_URL=https://webspark.markhazleton.com/api/asyncspark/openweatherapi/weather

# PromptSpark Variants API
VITE_PROMPTSPARK_API_URL=https://webspark.markhazleton.com/api/PromptSpark/Variant

# OpenWeatherMap API Key (if using direct API)
# VITE_OPENWEATHER_API_KEY=your_api_key_here
```

### 8.3 Vite Configuration

**File:** `vite.config.ts`

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";
import strip from "@rollup/plugin-strip";

const buildDate = new Date().toISOString();

export default defineConfig({
  base: "/",
  build: {
    outDir: "docs",
    rollupOptions: {
      output: {
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && /\.(png|jpg|jpeg|gif|svg|ico)$/.test(assetInfo.name)) {
            return "assets/img/[name]-[hash][extname]";
          }
          if (assetInfo.name && /\.(woff|woff2|eot|ttf|otf)$/.test(assetInfo.name)) {
            return "assets/fonts/[name]-[hash][extname]";
          }
          return "assets/[name]-[hash][extname]";
        },
      },
    },
  },
  define: {
    __BUILD_DATE__: JSON.stringify(buildDate),
  },
  server: {
    proxy: {
      "/api/projects": {
        target: "https://markhazleton.com",
        changeOrigin: true,
        rewrite: (path) => "/projects.json",
      },
      "/api/rss": {
        target: "https://markhazleton.com",
        changeOrigin: true,
        rewrite: (path) => "/rss.xml",
      },
      "/api/joke": {
        target: "https://v2.jokeapi.dev",
        changeOrigin: true,
        rewrite: (path) => path.replace("/api/joke", "/joke/Any"),
      },
    },
  },
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        { src: "public/robots.txt", dest: "" },
        { src: "public/sitemap.xml", dest: "" },
        { src: "public/rss.xml", dest: "" },
      ],
    }),
    // Create .nojekyll for GitHub Pages
    {
      name: "create-nojekyll",
      closeBundle: () => {
        const fs = require("fs");
        fs.writeFileSync("docs/.nojekyll", "");
      },
    },
    // Strip console logs in production
    strip({
      include: ["**/*.ts", "**/*.tsx"],
      functions: ["console.log", "console.debug"],
    }),
  ],
});
```

### 8.4 Static Web App Configuration

**File:** `staticwebapp.config.json` (Azure deployment)

```json
{
  "navigationFallback": {
    "rewrite": "/index.html",
    "exclude": [
      "/images/*",
      "/css/*",
      "/assets/*",
      "/*.{ico,png,jpg,gif,svg,js,css,woff,woff2,xml,txt}"
    ]
  },
  "routes": [
    {
      "route": "/rss.xml",
      "headers": {
        "Content-Type": "application/xml",
        "cache-control": "public, max-age=3600"
      }
    },
    {
      "route": "/api/*",
      "methods": ["GET", "POST", "PUT", "DELETE"],
      "allowedRoles": ["anonymous"]
    },
    {
      "route": "/assets/*",
      "headers": {
        "cache-control": "public, max-age=31536000, immutable"
      }
    },
    {
      "route": "/index.html",
      "headers": {
        "cache-control": "no-cache, no-store, must-revalidate",
        "pragma": "no-cache",
        "expires": "0"
      }
    }
  ],
  "responseOverrides": {
    "404": {
      "rewrite": "/index.html",
      "statusCode": 200
    }
  },
  "globalHeaders": {
    "Cache-Control": "no-cache",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Content-Security-Policy": "default-src 'self'; connect-src 'self' https://markhazleton.com https://*.markhazleton.com https://v2.jokeapi.dev https://api.openweathermap.org wss://webspark.markhazleton.com ws://localhost:* http://localhost:*; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: http: blob:; font-src 'self' data: https:; media-src 'self' https: http:; worker-src 'self' blob:;",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept"
  }
}
```

**CSP WARNING:** Do NOT tighten this CSP! The site fetches all images and data from `markhazleton.com` and external APIs. See Security section for details.

### 8.5 Azure Functions (API Proxies)

**File:** `api/proxy-projects/index.js`

```javascript
const axios = require("axios");

const ALLOWED_ORIGINS = [
  "https://tailwindspark.markhazleton.com", // UPDATE THIS
  "https://markhazleton.github.io",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

module.exports = async function (context, req) {
  const origin = req.headers.origin || req.headers.referer;
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  
  context.res.headers = {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };
  
  if (req.method === "OPTIONS") {
    context.res = { status: 200, headers: context.res.headers };
    return;
  }
  
  try {
    const response = await axios.get("https://markhazleton.com/projects.json", {
      timeout: 5000,
      headers: { "User-Agent": "TailwindSpark/1.0" },
    });
    
    // Transform image URLs to absolute
    const transformedProjects = response.data.map(project => {
      if (project.image && !project.image.startsWith("http")) {
        const imagePath = project.image.startsWith("/") 
          ? project.image.substring(1) 
          : project.image;
        project.image = `https://markhazleton.com/${imagePath}`;
      }
      return project;
    });
    
    context.res = {
      status: 200,
      headers: context.res.headers,
      body: transformedProjects,
    };
  } catch (error) {
    context.log.error("Error fetching projects:", error.message);
    context.res = {
      status: 500,
      headers: context.res.headers,
      body: { error: error.message },
    };
  }
};
```

**File:** `api/proxy-rss/index.js`

```javascript
const axios = require("axios");

module.exports = async function (context, req) {
  // Same CORS setup as proxy-projects
  
  try {
    const response = await axios.get("https://markhazleton.com/rss.xml", {
      timeout: 5000,
      headers: {
        "User-Agent": "TailwindSpark/1.0",
        "Accept": "application/xml, text/xml, application/rss+xml",
      },
    });
    
    context.res = {
      status: 200,
      headers: {
        ...context.res.headers,
        "Content-Type": "application/xml",
      },
      body: response.data,
    };
  } catch (error) {
    context.log.error("Error fetching RSS:", error.message);
    context.res = {
      status: 500,
      headers: context.res.headers,
      body: `<error>${error.message}</error>`,
    };
  }
};
```

**File:** `api/proxy-joke/index.js`

```javascript
const axios = require("axios");

module.exports = async function (context, req) {
  // Same CORS setup
  
  const category = req.query.category || "Any";
  const safeMode = req.query.safeMode !== "false";
  
  try {
    const url = `https://v2.jokeapi.dev/joke/${category}${safeMode ? "?safe-mode" : ""}`;
    const response = await axios.get(url, {
      timeout: 5000,
      headers: { "User-Agent": "TailwindSpark/1.0" },
    });
    
    context.res = {
      status: 200,
      headers: context.res.headers,
      body: response.data,
    };
  } catch (error) {
    context.log.error("Error fetching joke:", error.message);
    context.res = {
      status: 500,
      headers: context.res.headers,
      body: { error: error.message },
    };
  }
};
```

**File:** `api/proxy-projects/function.json`, `api/proxy-rss/function.json`, `api/proxy-joke/function.json`

```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["get", "options"],
      "route": "proxy-projects"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

---

## 9. External Dependencies

### 9.1 NPM Dependencies

**Core Dependencies:**
```json
{
  "dependencies": {
    "@microsoft/signalr": "^10.0.0",
    "axios": "^1.13.6",
    "date-fns": "^4.1.0",
    "leaflet": "^1.9.4",
    "react": "^19.2.4",
    "react-dom": "^19.2.4",
    "react-leaflet": "^5.0.0",
    "react-markdown": "^10.1.0",
    "react-router-dom": "^7.13.1",
    "zod": "^4.3.6"
  }
}
```

**REMOVE Bootstrap Dependencies:**
```json
{
  "bootstrap": "^5.3.8",  // REMOVE
  "react-bootstrap": "^2.10.10",  // REMOVE
  "react-bootstrap-icons": "^1.11.6"  // KEEP or replace with alternatives
}
```

**ADD Tailwind Dependencies:**
```json
{
  "devDependencies": {
    "tailwindcss": "^3.4.1",
    "autoprefixer": "^10.4.17",
    "postcss": "^8.4.35"
  }
}
```

### 9.2 Tailwind CSS Setup

**File:** `tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        // Add more custom colors as needed
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
```

**File:** `postcss.config.js`

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

**File:** `src/index.css` or `src/styles/main.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .btn-primary {
    @apply bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200;
  }
  
  .btn-secondary {
    @apply bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200;
  }
  
  .btn-outline {
    @apply border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200;
  }
  
  .card {
    @apply bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden;
  }
  
  .card-body {
    @apply p-6;
  }
  
  /* Add more custom components */
}
```

### 9.3 Icon Library

**Option 1: Continue using react-bootstrap-icons**
```bash
npm install react-bootstrap-icons
```

**Option 2: Switch to Heroicons (Tailwind-native)**
```bash
npm install @heroicons/react
```

**Usage:**
```typescript
// Bootstrap Icons
import { House, Person, Briefcase } from "react-bootstrap-icons";

// Heroicons
import { HomeIcon, UserIcon, BriefcaseIcon } from '@heroicons/react/24/outline';
```

### 9.4 Form Components

Bootstrap forms need to be replaced with Tailwind equivalents:

**Bootstrap:**
```tsx
<Form>
  <Form.Group>
    <Form.Label>Search</Form.Label>
    <Form.Control type="text" placeholder="..." />
  </Form.Group>
</Form>
```

**Tailwind:**
```tsx
<form className="space-y-4">
  <div>
    <label className="block text-sm font-medium mb-2">Search</label>
    <input 
      type="text" 
      placeholder="..."
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
    />
  </div>
</form>
```

### 9.5 Modal Components

Bootstrap modals need custom implementation:

**Bootstrap:**
```tsx
<Modal show={show} onHide={handleClose}>
  <Modal.Header closeButton>
    <Modal.Title>Title</Modal.Title>
  </Modal.Header>
  <Modal.Body>Content</Modal.Body>
</Modal>
```

**Tailwind (using HeadlessUI):**
```bash
npm install @headlessui/react
```

```tsx
import { Dialog } from '@headlessui/react';

<Dialog open={show} onClose={handleClose}>
  <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
  <div className="fixed inset-0 flex items-center justify-center p-4">
    <Dialog.Panel className="w-full max-w-md bg-white rounded-lg shadow-xl">
      <Dialog.Title className="text-lg font-semibold p-4 border-b">
        Title
      </Dialog.Title>
      <div className="p-4">
        Content
      </div>
    </Dialog.Panel>
  </div>
</Dialog>
```

### 9.6 Spinner/Loading Components

**Bootstrap:**
```tsx
<Spinner animation="border" />
```

**Tailwind:**
```tsx
<div className="flex justify-center items-center">
  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
</div>
```

Or use a custom component:
```tsx
const Spinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };
  
  return (
    <div className={`animate-spin rounded-full border-b-2 border-primary-600 ${sizes[size]}`} />
  );
};
```

---

## 10. Security & CSP Configuration

### 10.1 Content Security Policy (CSP)

**CRITICAL: DO NOT TIGHTEN THE CSP!**

This application is a **frontend-only SPA** that pulls ALL content from external sources:
- Project images: `https://markhazleton.com/img/*.png`
- JSON data: `https://markhazleton.com/projects.json`, `rss.xml`
- Weather API: `https://webspark.markhazleton.com/api/asyncspark/openweatherapi/weather`
- Joke API: `https://v2.jokeapi.dev`
- SignalR WebSocket: `wss://webspark.markhazleton.com/chatHub`

**Required CSP Directives:**

```
default-src 'self';

connect-src 'self' 
  https://markhazleton.com 
  https://*.markhazleton.com 
  https://v2.jokeapi.dev 
  https://api.openweathermap.org 
  wss://webspark.markhazleton.com 
  ws://localhost:* 
  http://localhost:*;

script-src 'self' 'unsafe-inline' 'unsafe-eval';  
  // Required for React + Vite development

style-src 'self' 'unsafe-inline';  
  // Required for Tailwind + dynamic styles

img-src 'self' data: https: http: blob:;  
  // Allows all HTTPS images (needed for markhazleton.com CDN)

font-src 'self' data: https:;

media-src 'self' https: http:;

worker-src 'self' blob:;  
  // Required for service workers

frame-src 'self' https://www.youtube.com;
```

### 10.2 What Will Break If CSP Is Tightened

❌ **Removing wildcard subdomains** `https://*.markhazleton.com`
- Service worker can't fetch images from CDN

❌ **Removing `https:` from `img-src`**
- External project screenshots won't load
- User-generated content images fail

❌ **Removing `'unsafe-inline'` from `script-src`**
- React/Vite won't work in development
- Dynamic component loading fails

❌ **Removing `'unsafe-eval'` from `script-src`**
- Vite HMR (Hot Module Replacement) breaks
- Development becomes impossible

❌ **Removing `blob:` from `worker-src`**
- Service worker fails to initialize
- Offline functionality broken

### 10.3 CORS Configuration

**Azure Functions must allow:**
- `https://tailwindspark.markhazleton.com` (production)
- `https://markhazleton.github.io` (GitHub Pages)
- `http://localhost:*` (development)
- `http://127.0.0.1:*` (development)

**Vite dev server proxy handles CORS in development:**
```typescript
server: {
  proxy: {
    "/api/projects": {
      target: "https://markhazleton.com",
      changeOrigin: true,  // Critical for CORS
    },
  },
},
```

### 10.4 Authentication & Authorization

**Current State:** None required (all endpoints are public)

**If Adding Protected Features:**
1. Azure AD B2C integration
2. JWT token validation in Azure Functions
3. Protected routes in React Router:

```typescript
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Usage
<Route path="/admin" element={
  <ProtectedRoute>
    <AdminPanel />
  </ProtectedRoute>
} />
```

---

## 11. Build & Deployment

### 11.1 Build Scripts

**File:** `package.json`

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build --mode production",
    "build:analyze": "npm run build && npx vite-bundle-analyzer docs",
    "preview": "vite preview",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "type-check": "tsc --noEmit",
    "test": "vitest",
    "test:coverage": "vitest run --coverage",
    "generate-sitemap": "node --import tsx ./src/utils/generateSitemap.ts",
    "generate-robots": "node --import tsx ./src/utils/generateRobotsTxt.ts",
    "generate-seo-files": "npm run generate-sitemap && npm run generate-robots"
  }
}
```

### 11.2 Pre-Build SEO Generation

**File:** `src/utils/generateSitemap.ts`

```typescript
import fs from "fs";
import path from "path";
import AppConfig from "../config/AppConfig";

const routes = [
  { path: "", priority: 1.0, changefreq: "weekly" },
  { path: "about", priority: 0.8, changefreq: "monthly" },
  { path: "projects", priority: 0.9, changefreq: "weekly" },
  { path: "articles", priority: 0.9, changefreq: "daily" },
  { path: "joke", priority: 0.5, changefreq: "daily" },
  { path: "weather", priority: 0.6, changefreq: "daily" },
  { path: "variant", priority: 0.7, changefreq: "weekly" },
];

const generateSitemap = () => {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `  <url>
    <loc>${AppConfig.hostedUrl}/${route.path}</loc>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </url>`).join('\n')}
</urlset>`;

  const publicDir = path.resolve(__dirname, "../../public");
  fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemap);
  console.log("✅ Sitemap generated at public/sitemap.xml");
};

generateSitemap();
```

**File:** `src/utils/generateRobotsTxt.ts`

```typescript
import fs from "fs";
import path from "path";
import AppConfig from "../config/AppConfig";

const generateRobotsTxt = () => {
  const robots = `User-agent: *
Allow: /

Sitemap: ${AppConfig.hostedUrl}/sitemap.xml`;

  const publicDir = path.resolve(__dirname, "../../public");
  fs.writeFileSync(path.join(publicDir, "robots.txt"), robots);
  console.log("✅ robots.txt generated at public/robots.txt");
};

generateRobotsTxt();
```

### 11.3 Version Tracking

**File:** `src/utils/version.ts`

```typescript
// This file is auto-generated during build
export const APP_VERSION = "__VERSION__";
export const BUILD_DATE = "__BUILD_DATE__";

// Generate version.json
import fs from "fs";
import path from "path";

const versionData = {
  version: process.env.npm_package_version || "1.0.0",
  buildDate: new Date().toISOString(),
};

const publicDir = path.resolve(__dirname, "../../public");
fs.writeFileSync(
  path.join(publicDir, "version.json"),
  JSON.stringify(versionData, null, 2)
);
```

### 11.4 GitHub Actions Workflow

**File:** `.github/workflows/azure-static-web-apps.yml`

```yaml
name: Azure Static Web Apps CI/CD

on:
  push:
    branches:
      - main
  pull_request:
    types: [opened, synchronize, reopened, closed]
    branches:
      - main

jobs:
  build_and_deploy_job:
    if: github.event_name == 'push' || (github.event_name == 'pull_request' && github.event.action != 'closed')
    runs-on: ubuntu-latest
    name: Build and Deploy Job
    steps:
      - uses: actions/checkout@v3
        with:
          submodules: true
          
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run linting
        run: npm run lint
        
      - name: Run type check
        run: npm run type-check
        
      - name: Generate SEO files
        run: npm run generate-seo-files
        
      - name: Build application
        run: npm run build
        
      - name: Build And Deploy
        id: builddeploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "/"
          api_location: "api"
          output_location: "docs"
          
  close_pull_request_job:
    if: github.event_name == 'pull_request' && github.event.action == 'closed'
    runs-on: ubuntu-latest
    name: Close Pull Request Job
    steps:
      - name: Close Pull Request
        id: closepullrequest
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          action: "close"
```

### 11.5 GitHub Pages Deployment

**File:** `.github/workflows/github-pages.yml`

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
        
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Generate SEO files
        run: npm run generate-seo-files
        
      - name: Build
        run: npm run build
        
      - name: Setup Pages
        uses: actions/configure-pages@v3
        
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v2
        with:
          path: './docs'
          
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v2
```

### 11.6 Build Optimization

**Code Splitting:**
```typescript
// Automatically handled by Vite with dynamic imports
const Hero = lazy(() => import("./components/Hero"));

// Manual chunk splitting in vite.config.ts
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        vendor: ['react', 'react-dom', 'react-router-dom'],
        ui: ['@headlessui/react'],
        maps: ['leaflet', 'react-leaflet'],
        markdown: ['react-markdown'],
        signalr: ['@microsoft/signalr'],
      },
    },
  },
},
```

**Asset Optimization:**
```typescript
// vite.config.ts
build: {
  assetsInlineLimit: 4096, // Inline assets < 4kb
  cssCodeSplit: true,
  sourcemap: false, // Disable in production
  minify: 'terser',
  terserOptions: {
    compress: {
      drop_console: true,
      drop_debugger: true,
    },
  },
},
```

---

## 12. Implementation Checklist

### 12.1 Phase 1: Foundation Setup

- [ ] Initialize new TailwindSpark repository
- [ ] Install core dependencies (React, TypeScript, Vite)
- [ ] Configure Tailwind CSS
- [ ] Set up ESLint + Prettier
- [ ] Configure TypeScript (strict mode)
- [ ] Set up folder structure (`src/`, `src/components/`, `src/services/`, etc.)
- [ ] Create AppConfig.ts with site-specific values
- [ ] Set up environment variables (.env)
- [ ] Configure Vite (proxies, build options, define)
- [ ] Create version.json generation script

### 12.2 Phase 2: Context Providers

- [ ] Implement ThemeContext with Tailwind dark mode
- [ ] Implement SEOContext with dynamic meta tags
- [ ] Create ErrorBoundary component
- [ ] Implement useVersionCheck hook
- [ ] Create UpdateNotification component

### 12.3 Phase 3: Layout Components

- [ ] Build Header component (Tailwind navbar)
- [ ] Build Footer component
- [ ] Create Spinner/Loading component
- [ ] Create NotFound page
- [ ] Set up routing in App.tsx with lazy loading

### 12.4 Phase 4: Service Layer

- [ ] Implement ProjectService with caching
- [ ] Implement RssService with XML parsing
- [ ] Implement JokeService singleton
- [ ] Create Zod schemas for validation
- [ ] Set up Axios interceptors (if needed)
- [ ] Implement cache utility functions
- [ ] Create image utility (cache busting)

### 12.5 Phase 5: Data Models

- [ ] Create Project model with Zod schemas
- [ ] Create type definitions for all data structures
- [ ] Implement validation helpers

### 12.6 Phase 6: Page Components

- [ ] Build Hero component (replace Bootstrap with Tailwind)
- [ ] Build About component
- [ ] Build Projects component (search, sort, pagination)
- [ ] Build Articles component (RSS feed display)
- [ ] Build Joke component (API integration + features)
- [ ] Build WeatherForecast component
- [ ] Build VariantList component
- [ ] Implement MapComponent (Leaflet)
- [ ] Build Chat component (SignalR)

### 12.7 Phase 7: UI Components (Tailwind Replacements)

- [ ] Create custom Button components
- [ ] Create custom Card components
- [ ] Create custom Form components
- [ ] Create custom Modal component (HeadlessUI)
- [ ] Create custom Alert/Toast components
- [ ] Create custom Badge components
- [ ] Create custom Pagination component
- [ ] Create custom Accordion component
- [ ] Create custom InputGroup components

### 12.8 Phase 8: API Proxies (Azure Functions)

- [ ] Create proxy-projects Azure Function
- [ ] Create proxy-rss Azure Function
- [ ] Create proxy-joke Azure Function
- [ ] Configure function.json for each
- [ ] Set up CORS whitelist
- [ ] Test all proxies locally
- [ ] Deploy to Azure

### 12.9 Phase 9: Testing

- [ ] Write unit tests for services
- [ ] Write unit tests for utility functions
- [ ] Write integration tests for components
- [ ] Test all routes
- [ ] Test dark/light theme switching
- [ ] Test all API integrations
- [ ] Test caching mechanisms
- [ ] Test error boundaries
- [ ] Test version checking
- [ ] Test responsive design (mobile/tablet/desktop)
- [ ] Test SignalR connection and reconnection
- [ ] Test map functionality
- [ ] Cross-browser testing

### 12.10 Phase 10: SEO & Accessibility

- [ ] Generate sitemap.xml
- [ ] Generate robots.txt
- [ ] Implement structured data (JSON-LD)
- [ ] Add Open Graph meta tags
- [ ] Add Twitter Card meta tags
- [ ] Test with Lighthouse (Performance, Accessibility, SEO)
- [ ] Ensure WCAG 2.1 AA compliance
- [ ] Add skip navigation links
- [ ] Test keyboard navigation
- [ ] Test screen reader compatibility

### 12.11 Phase 11: Security

- [ ] Configure CSP headers (staticwebapp.config.json)
- [ ] Test CSP in production
- [ ] Implement input sanitization
- [ ] Validate all user inputs
- [ ] Test CORS configuration
- [ ] Security audit of dependencies (npm audit)
- [ ] Test rate limiting on external APIs

### 12.12 Phase 12: Deployment

- [ ] Set up Azure Static Web Apps resource
- [ ] Configure custom domain
- [ ] Set up SSL certificate
- [ ] Create GitHub Actions workflow (Azure)
- [ ] Create GitHub Actions workflow (GitHub Pages)
- [ ] Test deployment pipeline
- [ ] Configure environment secrets
- [ ] Set up monitoring/analytics
- [ ] Create deployment documentation

### 12.13 Phase 13: Documentation

- [ ] Write README.md
- [ ] Document all components
- [ ] Document all services
- [ ] Document API proxies
- [ ] Create CONTRIBUTING.md
- [ ] Create CHANGELOG.md
- [ ] Document deployment process
- [ ] Create troubleshooting guide

### 12.14 Phase 14: Performance Optimization

- [ ] Implement code splitting
- [ ] Optimize images (lazy loading, WebP format)
- [ ] Implement service worker (optional)
- [ ] Enable compression (gzip/brotli)
- [ ] Optimize bundle size
- [ ] Implement critical CSS
- [ ] Test with WebPageTest
- [ ] Optimize Core Web Vitals (LCP, FID, CLS)

### 12.15 Phase 15: Final Review

- [ ] Code review
- [ ] Security review
- [ ] Performance review
- [ ] Accessibility review
- [ ] SEO review
- [ ] Documentation review
- [ ] User acceptance testing
- [ ] Launch to production

---

## 13. Migration Notes

### 13.1 Bootstrap to Tailwind Component Mapping

| Bootstrap Component | Tailwind Equivalent |
|---------------------|---------------------|
| `Container` | `<div className="container mx-auto">` |
| `Row` | `<div className="flex flex-wrap">` or `grid` |
| `Col` | `<div className="flex-1">` or `grid` columns |
| `Button` | Custom button classes |
| `Card` | Custom card classes |
| `Modal` | HeadlessUI Dialog |
| `Form.Control` | Custom input classes |
| `Alert` | Custom alert classes |
| `Badge` | Custom badge classes |
| `Spinner` | Custom spinner component |
| `Navbar` | Custom navbar with Tailwind |
| `Dropdown` | HeadlessUI Menu |
| `Accordion` | HeadlessUI Disclosure |
| `Toast` | Custom toast notification |
| `Pagination` | Custom pagination component |

### 13.2 Bootstrap Utilities to Tailwind

| Bootstrap | Tailwind |
|-----------|----------|
| `d-flex` | `flex` |
| `justify-content-center` | `justify-center` |
| `align-items-center` | `items-center` |
| `mb-3` | `mb-3` (same number scale) |
| `p-4` | `p-4` (same number scale) |
| `text-center` | `text-center` |
| `bg-primary` | `bg-primary-600` |
| `text-white` | `text-white` |
| `rounded` | `rounded` or `rounded-lg` |
| `shadow` | `shadow` or `shadow-md` |
| `border` | `border` |
| `w-100` | `w-full` |
| `h-100` | `h-full` |

### 13.3 Common Pitfalls

1. **Dark Mode:** Bootstrap uses `data-bs-theme`, Tailwind uses `dark:` prefix with class-based strategy
2. **Breakpoints:** Bootstrap: `sm`, `md`, `lg`, `xl`, `xxl` / Tailwind: `sm`, `md`, `lg`, `xl`, `2xl`
3. **Spacing Scale:** Both use similar scales, but Tailwind is more granular
4. **Component State:** Bootstrap has built-in JS, Tailwind needs custom state management
5. **Icons:** Bootstrap Icons can still be used, or switch to Heroicons

### 13.4 Testing Strategy

1. **Visual Regression Testing:** Compare Bootstrap version to Tailwind version
2. **Functional Testing:** Ensure all features work identically
3. **Performance Testing:** Compare bundle sizes and load times
4. **Accessibility Testing:** Verify no regressions in a11y
5. **Cross-browser Testing:** Test on Chrome, Firefox, Safari, Edge

---

## 14. Appendices

### Appendix A: External API Documentation

**Projects API:**
- URL: `https://markhazleton.com/projects.json`
- Method: GET
- Response: JSON array of projects
- No authentication required
- Rate limit: None

**RSS Feed:**
- URL: `https://markhazleton.com/rss.xml`
- Method: GET
- Response: XML RSS 2.0 format
- No authentication required
- Rate limit: None

**Joke API:**
- URL: `https://v2.jokeapi.dev`
- Docs: https://v2.jokeapi.dev
- Method: GET
- Response: JSON
- Rate limit: 120 requests/minute
- No authentication required

**Weather API:**
- URL: `https://webspark.markhazleton.com/api/asyncspark/openweatherapi/weather`
- Method: GET
- Query params: `location` (city name)
- Rate limit: Backend-dependent (OpenWeatherMap free tier)
- No authentication required (handled by backend)

**PromptSpark Variants:**
- URL: `https://webspark.markhazleton.com/api/PromptSpark/Variant`
- Method: GET
- Response: JSON array of variants
- No authentication required
- Rate limit: None

**SignalR Chat Hub:**
- URL: `wss://webspark.markhazleton.com/chatHub`
- Protocol: SignalR (WebSocket/SSE/Long Polling fallback)
- Methods: `SendMessage(userName, message, conversationId, variantName)`
- Events: `ReceiveMessage(user, messageChunk)`
- No authentication required
- Rate limit: None (but messages are rate-limited server-side)

### Appendix B: Local Development Setup

```bash
# Clone repository
git clone https://github.com/markhazleton/TailwindSpark.git
cd TailwindSpark

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development server
npm run dev

# In another terminal, start Azure Functions (if testing locally)
cd api
npm install
npm start
```

**Development URLs:**
- Frontend: http://localhost:3000
- Azure Functions: http://localhost:7071
- Vite proxies handle API calls in dev

### Appendix C: Troubleshooting

**Issue: SignalR connection fails**
- Check network tab for WebSocket errors
- Verify CORS configuration
- Try fallback to SSE or Long Polling
- Check firewall/proxy settings

**Issue: Images not loading**
- Verify CSP allows HTTPS images
- Check image URL transformation in service
- Verify cache buster is appended
- Check network tab for 404s

**Issue: Cache not invalidating**
- Clear localStorage manually
- Check `app_version` in localStorage
- Verify version.json is deployed
- Check cache TTL settings

**Issue: Build fails**
- Run `npm run type-check` to find TypeScript errors
- Run `npm run lint` to find linting issues
- Check Node.js version (requires 20+)
- Clear node_modules and reinstall

**Issue: Dark mode not working**
- Verify `dark` class is applied to `<html>`
- Check Tailwind config `darkMode: 'class'`
- Verify theme state in localStorage
- Check ThemeContext provider wraps app

---

## END OF SPECIFICATION

**Document Version:** 1.0  
**Last Updated:** March 1, 2026  
**Total Pages:** ~50  
**Estimated Implementation Time:** 4-6 weeks (1 developer)

**Next Steps:**
1. Review this specification with stakeholders
2. Set up TailwindSpark repository
3. Begin Phase 1 implementation
4. Track progress against checklist
5. Deploy MVP to staging environment
6. Conduct user acceptance testing
7. Launch to production

**Questions/Clarifications:**
- Contact: Mark Hazleton
- Repository: https://github.com/markhazleton/ReactSparkPortfolio
- Live Demo: https://reactspark.markhazleton.com
