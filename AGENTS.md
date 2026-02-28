# AGENTS.md - NewsInsight Architecture Contract

This document defines the architectural constraints, patterns, and decisions for the NewsInsight project. All AI agents and developers must adhere to these rules to prevent drift and ensure maintainability.

## 1. Project Overview
- **App**: NewsInsight, a news aggregator web application.
- **Goal**: Aggregate articles from 3 distinct sources (NewsAPI, The Guardian, NYT) into a unified, searchable, filterable, and personalized feed.
- **Target Users**: News consumers who want a single interface for multiple major publications.
- **Core Problem**: Fragmented news consumption; users currently visit multiple sites to get diverse perspectives.

## 2. Tech Stack

### Pinned Versions
- **React**: latest stable 19+
- **React Router**: latest stable 7+
- **TailwindCSS**: latest stable 4+
- **TanStack React Query**: latest stable 5+
- **Vite**: latest stable
- **TypeScript**: 5.x

### Stack
- **Frontend**: React 19.2.4 (Vite), TypeScript, React Router 7.5.3.
- **Styling**: TailwindCSS 4.2.1 (utility-first, no component libraries like MUI/Chakra).
- **State/Fetching**: TanStack React Query 5.x for server state; React Context + LocalStorage for client preferences.
- **Testing**: Vitest + React Testing Library (unit tests for adapters, hooks, and key components).
- **Backend**: Node.js/Express (lightweight proxy only).
- **Infrastructure**: Docker + Docker Compose.
- **Database**: None.
- **Auth**: None.

## 3. Architecture Decisions

### Folder Structure (Feature-Based)
Organize by domain feature, not technical role.
```
src/
  features/
    articles/       # Components, hooks, types specific to articles
    filters/        # Search, date range, source filter logic
    preferences/    # Personalization settings & persistence
  pages/            # Route entry points (HomePage, ArticleDetailsPage)
  services/         # API clients & adapters
  domain/           # Shared domain types (Article, ArticleQuery)
  components/       # Shared UI atoms (Button, Input, Card)
```

### Data Fetching (React Query)
- **Server State**: All API data must be fetched via React Query hooks (`useQuery`, `useInfiniteQuery`).
- **Caching**: Rely on React Query's cache; do not manually store API responses in Context/Redux.
- **Stale Time**: Set reasonable defaults (e.g., 5 minutes) to avoid thrashing the proxy.

### State Management (KISS)
- **Global Client State**: Use React Context only for `Preferences` (sources, authors, categories).
- **Persistence**: Sync `Preferences` to `localStorage`.
- **Local State**: Use `useState` for form inputs, toggles, and UI transients.
- **No Redux**: Strictly forbidden.

### API & Proxy Structure
- **Pattern**: Backend for Frontend (BFF) / Proxy.
- **Responsibility**: 
  - Store API keys securely (env vars).
  - Handle CORS.
  - Map provider-specific params if necessary.
- **Endpoints**:
  - `GET /api/newsapi/articles`
  - `GET /api/guardian/articles`
  - `GET /api/nyt/articles`

### API Response Shapes (Reference)

**NewsAPI** (`/everything`)
```json
{
  "articles": [
    {
      "title": "...",
      "description": "...",
      "url": "...",
      "urlToImage": "...",
      "publishedAt": "2026-02-19T19:00:00Z",
      "author": "...",
      "source": { "name": "..." }
    }
  ]
}
```

**NYT** (`/articlesearch.json`)
```json
{
  "response": {
    "docs": [
      {
        "_id": "nyt://article/...",
        "headline": { "main": "..." },
        "abstract": "...",
        "web_url": "...",
        "multimedia": [{ "url": "..." }],
        "pub_date": "...",
        "byline": { "original": "..." },
        "section_name": "..."
      }
    ]
  }
}
```

**Guardian** (`/search`)
```json
{
  "response": {
    "results": [
      {
        "id": "us-news/...",
        "webTitle": "...",
        "webUrl": "...",
        "webPublicationDate": "...",
        "sectionName": "...",
        "fields": {
          "trailText": "...",
          "thumbnail": "...",
          "byline": "..."
        }
      }
    ]
  }
}
```

### Error Handling
- **UI**: Display user-friendly error messages (toasts or banners) for network failures.
- **Resilience**: If one provider fails, the feed should still load results from the others (partial success).
- **Boundaries**: Use React Error Boundaries for critical UI crashes.

## 4. Design System Rules
- **No UI Libraries**: Build atoms (Button, Input, Select) from scratch using Tailwind.
- **Layout**: Mobile-first responsive design.
  - Mobile: Stacked layout, hamburger menu/drawers for filters.
  - Desktop: Sidebar for filters, grid/list for content.
- **Accessibility**: Semantic HTML (`<article>`, `<nav>`, `<main>`), correct ARIA roles, keyboard navigation support.

## 5. Core Models / Entities

**`Article` (Normalized)**
```typescript
interface Article {
  id: string;             // Stable ID (provider ID or hash of URL)
  source: 'newsapi' | 'guardian' | 'nyt';
  title: string;
  summary?: string;       // Abstract or description
  url: string;            // External canonical URL
  imageUrl?: string;
  publishedAt: string;    // ISO 8601
  author?: string;
  category?: string;      // Normalized if possible
}
```

**`ArticleQuery`**
```typescript
interface ArticleQuery {
  q?: string;
  from?: string;          // ISO Date
  to?: string;            // ISO Date
  category?: string;
  sources?: string[];     // Filter by source ID
}
```

## 6. Non-Goals
- **No Redux**: Complexity not justified.
- **No Class Components**: Functional components + hooks only.
- **No Database**: Personalization is client-side only.
- **No Auth**: Open access.
- **No Premature Optimization**: Do not memoize (`useMemo`/`useCallback`) unless profiling shows a bottleneck.

## 7. Development Rules
- **Reusability**: Extract a component if used in 2+ places.
- **Composition**: Prefer `children` prop over complex configuration objects.
- **Prop Drilling**: Max depth 2 levels. Use Composition or Context otherwise.
- **Types**: 
  - No `any`.
  - Interfaces for object shapes.
  - Discriminated unions for state variants.

## 8. Testing Strategy
- **Runner**: Vitest (co-located with source files as `*.test.ts` / `*.test.tsx`).
- **Component Tests**: React Testing Library (`@testing-library/react`).
- **Scope** (lightweight, not exhaustive):
  - **Adapters**: Unit test each provider adapter (NewsAPI, Guardian, NYT → `Article`). Feed in raw JSON fixture, assert normalized output.
  - **Merge/Dedupe/Sort**: Unit test the aggregation utility (correct ordering, duplicate removal).
  - **Key Components**: Render test for `ArticleCard` (renders title, source badge, date). Render test for filter controls (search input triggers callback on change).
  - **Hooks** (optional): Test `useArticles` with mocked fetch using `msw` or query client wrapper.
- **What NOT to test**: Tailwind class names, third-party library internals, pixel-perfect layout.

## 9. Anti-Patterns to Avoid

- **God Components**: Avoid `ArticleList` handling fetching, filtering, AND rendering. Split into `ArticleFeed` (logic) and `ArticleGrid` (ui).
- **Leaky Abstractions**: Do not use provider-specific fields (e.g., `nyt_id`, `webUrl`) directly in UI components. Always map to `Article` first.
- **Effect Chains**: Avoid `useEffect` setting state that triggers another `useEffect`. Derive state during render where possible.
- **Inline Styles**: Use Tailwind classes. Avoid `style={{ ... }}`.
- **Magic Strings**: Use constants or enums for source names, categories, and API routes.
