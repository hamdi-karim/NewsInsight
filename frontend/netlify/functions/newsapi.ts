import { config } from './_shared/config.js';
import {
  buildSearchParams,
  validateApiKey,
  jsonResponse,
  errorResponse,
} from './_shared/api-helpers.js';
import type { NewsApiResponse } from './_shared/types.js';

const NEWSAPI_EVERYTHING = 'https://newsapi.org/v2/everything';
const NEWSAPI_TOP_HEADLINES = 'https://newsapi.org/v2/top-headlines';

interface NewsApiRequestInput {
  q?: string;
  from?: string;
  to?: string;
  page?: string;
}

function resolveNewsApiRequest(input: NewsApiRequestInput) {
  const { q, from, to, page } = input;
  const hasDateFilter = Boolean(from) || Boolean(to);
  const useEverything = Boolean(q) || hasDateFilter;

  return {
    base: useEverything ? NEWSAPI_EVERYTHING : NEWSAPI_TOP_HEADLINES,
    params: {
      q: q || (hasDateFilter ? 'news' : undefined),
      from: useEverything ? from : undefined,
      to: useEverything ? to : undefined,
      ...(!useEverything && { country: 'us' }),
      page,
      pageSize: 20 as const,
      language: useEverything ? ('en' as const) : undefined,
      sortBy: useEverything ? ('publishedAt' as const) : undefined,
    },
  };
}

export default async (request: Request) => {
  try {
    validateApiKey(config.newsApiKey, 'newsapi');

    const url = new URL(request.url);
    const input: NewsApiRequestInput = {
      q: url.searchParams.get('q') ?? undefined,
      from: url.searchParams.get('from') ?? undefined,
      to: url.searchParams.get('to') ?? undefined,
      page: url.searchParams.get('page') ?? undefined,
    };

    const { base, params: rawParams } = resolveNewsApiRequest(input);
    const params = buildSearchParams(rawParams);

    const response = await fetch(`${base}?${params}`, {
      headers: { 'X-Api-Key': config.newsApiKey },
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      const message =
        (body as Record<string, string> | null)?.message ??
        `NewsAPI returned ${response.status}`;
      return errorResponse('newsapi', message, response.status);
    }

    const data = (await response.json()) as NewsApiResponse;
    return jsonResponse(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    const status = message.includes('aborted') ? 504 : 500;
    return errorResponse('newsapi', message, status);
  }
};
