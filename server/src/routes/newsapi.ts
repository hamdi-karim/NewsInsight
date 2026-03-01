import { Router } from 'express';
import { config } from '../config.js';
import {
  buildSearchParams,
  formatProxyError,
  validateApiKey,
} from '../utils/api-helpers.js';
import type { NewsApiResponse } from '../types/provider-responses.js';

const NEWSAPI_EVERYTHING = 'https://newsapi.org/v2/everything';
const NEWSAPI_TOP_HEADLINES = 'https://newsapi.org/v2/top-headlines';

export interface NewsApiRequestInput {
  q?: string;
  from?: string;
  to?: string;
  page?: string;
}

export function resolveNewsApiRequest(input: NewsApiRequestInput) {
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

const router = Router();

router.get('/articles', async (req, res) => {
  try {
    validateApiKey(config.newsApiKey, 'newsapi');

    const input = req.query as Record<string, string | undefined>;
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
      res
        .status(response.status)
        .json(formatProxyError('newsapi', message, response.status));
      return;
    }

    const data: NewsApiResponse = await response.json();
    res.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    const status = message.includes('aborted') ? 504 : 500;
    res.status(status).json(formatProxyError('newsapi', message));
  }
});

export default router;
