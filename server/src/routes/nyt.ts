import { Router } from 'express';
import { config } from '../config.js';
import {
  buildSearchParams,
  formatProxyError,
  toNytDate,
  validateApiKey,
} from '../utils/api-helpers.js';
import type { NytResponse } from '../types/provider-responses.js';

const NYT_BASE = 'https://api.nytimes.com/svc/search/v2/articlesearch.json';

const router = Router();

router.get('/articles', async (req, res) => {
  try {
    validateApiKey(config.nytApiKey, 'nyt');

    const { q, from, to, category, page } = req.query as Record<
      string,
      string | undefined
    >;

    const nytPage = page ? Math.max(0, Number(page) - 1) : undefined;

    const fq = category
      ? `section_name:("${category}") OR subsection_name:("${category}")`
      : undefined;

    const params = buildSearchParams({
      q,
      begin_date: from ? toNytDate(from) : undefined,
      end_date: to ? toNytDate(to) : undefined,
      fq,
      page: nytPage,
      sort: 'newest',
      'api-key': config.nytApiKey,
    });

    const response = await fetch(`${NYT_BASE}?${params}`, {
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      const nytBody = body as {
        fault?: { faultstring?: string };
        errors?: string[];
      } | null;
      const message =
        nytBody?.fault?.faultstring ??
        nytBody?.errors?.[0] ??
        `NYT API returned ${response.status}`;
      res
        .status(response.status)
        .json(formatProxyError('nyt', message, response.status));
      return;
    }

    const data: NytResponse = await response.json();
    res.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    const status = message.includes('aborted') ? 504 : 500;
    res.status(status).json(formatProxyError('nyt', message));
  }
});

export default router;
