# NewsInsight

Live Preview: https://newsinsight7.netlify.app/


A news aggregator web application that pulls articles from three major sources -- **NewsAPI**, **The Guardian**, and **The New York Times** -- into a single, searchable, filterable, and personalizable feed.

## Features

- **Unified feed** from three independent news providers, merged, deduplicated, and sorted by date.
- **Search** with debounced full-text query across all sources.
- **Filters** for date, category, and source selection.
- **Personalization** -- save preferred sources and category to localStorage; applied as defaults on each visit.
- **Partial failure resilience** -- if one provider is down, the other two still display results with an informational banner.
- **Responsive design** -- mobile-first layout with collapsible filters, accessible touch targets, and a desktop sidebar.
- **Article detail page** with cache-first loading and external link to the original article.

## Architecture

```
Browser  -->  Nginx (static + reverse proxy)  -->  Express proxy  -->  NewsAPI / Guardian / NYT
```

- **Frontend** (`frontend/`): React 19, TypeScript, Vite, TailwindCSS 4, React Router 7, TanStack React Query 5.
- **Proxy server** (`server/`): Express 5, TypeScript. Stores API keys server-side and forwards requests to each provider. No database, no auth.
- **Infrastructure**: Docker Compose runs both services. Nginx serves the SPA and proxies `/api/*` to the Express server.

The architectural contract is documented in [`AGENTS.md`](AGENTS.md).

## Prerequisites

- [Node.js](https://nodejs.org/) 22+ (for local development)
- [Docker](https://www.docker.com/) and Docker Compose (for containerized deployment)
- API keys from each news provider:

| Provider | Sign-up URL |
|----------|-------------|
| NewsAPI | https://newsapi.org/register |
| The Guardian | https://open-platform.theguardian.com/access/ |
| New York Times | https://developer.nytimes.com/accounts/create |

## Quick Start (Docker)

1. **Clone the repository** and navigate into it:

   ```bash
   cd NewsInsight
   ```

2. **Create your environment file** from the template:

   ```bash
   cp .env.example .env
   ```

3. **Fill in your API keys** in `.env`:

   ```
   NEWSAPI_KEY=your_actual_newsapi_key
   GUARDIAN_API_KEY=your_actual_guardian_key
   NYT_API_KEY=your_actual_nyt_key
   ```

4. **Build and start** both services:

   ```bash
   docker compose up --build
   ```

5. Open **http://localhost** in your browser (or the port set via `FRONTEND_PORT`).

## Local Development

### Server

```bash
cd server
cp .env.example .env   # fill in API keys
npm install
npm run dev            # starts on http://localhost:3001
```

### Frontend

```bash
cd frontend
npm install
npm run dev            # starts on http://localhost:5173, proxied to server
```

The Vite dev server proxies `/api` requests to `http://localhost:3001` automatically.

## Testing

Both packages use [Vitest](https://vitest.dev/).

```bash
# Frontend tests (adapters, merge utils, component render tests)
cd frontend && npm test

# Server tests (route resolver logic)
cd server && npm test
```

## Project Structure

```
NewsInsight/
  AGENTS.md                  # Architecture contract
  docker-compose.yml         # Container orchestration
  .env.example               # Environment variable template
  frontend/
    netlify.toml             # Netlify build config & redirects
    netlify/
      functions/             # Serverless functions (Netlify deployment)
        newsapi.ts
        guardian.ts
        nyt.ts
        _shared/             # Shared helpers for functions
    src/
      components/            # Shared UI atoms (Layout, ErrorBoundary)
      domain/                # Article type, adapters, merge/dedupe/sort
      features/
        articles/            # ArticleCard, ArticleFeed, useArticles
        filters/             # Search, date, category, source controls
        preferences/         # Context, localStorage sync, panel UI
      pages/                 # HomePage, ArticleDetailsPage
      services/              # API client functions
  server/
    src/
      routes/                # newsapi, guardian, nyt proxy routes
      config.ts              # Environment variable loader
```

## Deployment (Netlify)

The app is deployed to [Netlify](https://www.netlify.com/) on the free tier. The frontend SPA is served from Netlify's CDN, and the Express proxy routes run as Netlify Functions (serverless).

### Setup

1. **Connect the repo** in the [Netlify dashboard](https://app.netlify.com/):
   - Import from GitHub
   - Set **Base directory** to `frontend`
   - Build command and publish directory are auto-detected from `netlify.toml`

2. **Add environment variables** in Site settings > Environment variables:

   | Variable | Description |
   |----------|-------------|
   | `NEWSAPI_KEY` | NewsAPI API key |
   | `GUARDIAN_API_KEY` | Guardian API key |
   | `NYT_API_KEY` | NYT API key |

3. **Deploy** -- Netlify auto-deploys on every push to `main`. Pull requests get preview deployments automatically.

### How it works

- `frontend/netlify.toml` configures the build and redirect rules
- `frontend/netlify/functions/` contains serverless functions that replace the Express proxy
- Redirect rules map `/api/newsapi/articles` -> the `newsapi` function (etc.), so the frontend code is unchanged
- API keys are stored as Netlify environment variables and injected at runtime via `process.env`

## Trade-offs and Decisions

- **No database or auth**: Personalization lives in the browser's localStorage. This keeps the architecture simple and avoids server-side session management
- **Express proxy (BFF)**: API keys never reach the browser. The server acts as a thin pass-through, adding keys and handling CORS.
- **No Redux**: React Context + React Query covers all state management needs without the need for additional complexity
- **TailwindCSS (no component library)**: All UI is built from Tailwind utilities for full control over design and bundle size.
- **`Promise.allSettled` for resilience**: Each provider fetch runs independently. A single failure degrades gracefully instead of blocking the entire feed.
