import { config } from './_shared/config.js';
import {
  buildSearchParams,
  toGuardianDate,
  validateApiKey,
  jsonResponse,
  errorResponse,
} from './_shared/api-helpers.js';
import type { GuardianResponse } from './_shared/types.js';

const GUARDIAN_BASE = 'https://content.guardianapis.com/search';

export default async (request: Request) => {
  try {
    validateApiKey(config.guardianApiKey, 'guardian');

    const url = new URL(request.url);
    const q = url.searchParams.get('q') ?? undefined;
    const from = url.searchParams.get('from') ?? undefined;
    const to = url.searchParams.get('to') ?? undefined;
    const category = url.searchParams.get('category') ?? undefined;
    const page = url.searchParams.get('page') ?? undefined;

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
      return errorResponse('guardian', message, response.status);
    }

    const data = (await response.json()) as GuardianResponse;
    return jsonResponse(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    const status = message.includes('aborted') ? 504 : 500;
    return errorResponse('guardian', message, status);
  }
};
