import { Router } from 'express';
import { config } from '../config.js';
import {
  buildSearchParams,
  formatProxyError,
  validateApiKey,
} from '../utils/api-helpers.js';
import type { NewsApiResponse } from '../types/provider-responses.js';

const NEWSAPI_BASE = 'https://newsapi.org/v2/everything';

const router = Router();

router.get('/articles', async (req, res) => {
  try {
    validateApiKey(config.newsApiKey, 'newsapi');

    const { q, from, to, page } = req.query as Record<string, string | undefined>;

    const params = buildSearchParams({
      q,
      from,
      to,
      page,
      pageSize: 20,
      language: 'en',
      sortBy: 'publishedAt',
    });

    const response = await fetch(`${NEWSAPI_BASE}?${params}`, {
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
