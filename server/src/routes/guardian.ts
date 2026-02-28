import { Router } from 'express';
import { config } from '../config.js';
import {
  buildSearchParams,
  formatProxyError,
  toGuardianDate,
  validateApiKey,
} from '../utils/api-helpers.js';
import type { GuardianResponse } from '../types/provider-responses.js';

const GUARDIAN_BASE = 'https://content.guardianapis.com/search';

const router = Router();

router.get('/articles', async (req, res) => {
  try {
    validateApiKey(config.guardianApiKey, 'guardian');

    const { q, from, to, category, page } = req.query as Record<
      string,
      string | undefined
    >;

    const params = buildSearchParams({
      q,
      'from-date': from ? toGuardianDate(from) : undefined,
      'to-date': to ? toGuardianDate(to) : undefined,
      section: category,
      page,
      'page-size': 20,
      'show-fields': 'trailText,thumbnail,byline',
      'api-key': config.guardianApiKey,
    });

    const response = await fetch(`${GUARDIAN_BASE}?${params}`, {
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      const guardianBody = body as { response?: { message?: string } } | null;
      const message =
        guardianBody?.response?.message ??
        `Guardian API returned ${response.status}`;
      res
        .status(response.status)
        .json(formatProxyError('guardian', message, response.status));
      return;
    }

    const data: GuardianResponse = await response.json();
    res.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    const status = message.includes('aborted') ? 504 : 500;
    res.status(status).json(formatProxyError('guardian', message));
  }
});

export default router;
