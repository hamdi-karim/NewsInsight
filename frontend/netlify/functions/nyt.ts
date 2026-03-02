import { config } from './_shared/config.js';
import {
  buildSearchParams,
  toNytDate,
  validateApiKey,
  jsonResponse,
  errorResponse,
} from './_shared/api-helpers.js';
import type { NytResponse } from './_shared/types.js';

const NYT_BASE = 'https://api.nytimes.com/svc/search/v2/articlesearch.json';

const NYT_CATEGORY_MAP: Record<string, string> = {
  business: 'desk:"Business" OR section.name:"Business"',
  entertainment: 'section.name:"Arts" OR desk:("Arts&Leisure", "Culture")',
  environment: 'section.name:"Climate" OR desk:"Climate"',
  health: 'section.name:"Health"',
  politics: 'desk:"Politics" OR section.name:"U.S."',
  science: 'section.name:"Science" OR desk:"Science"',
  sport: 'section.name:"Sports" OR desk:"Sports"',
  technology: 'desk:"Technology"',
  world: 'section.name:"World" OR desk:"Foreign"',
};

export default async (request: Request) => {
  try {
    validateApiKey(config.nytApiKey, 'nyt');

    const url = new URL(request.url);
    const q = url.searchParams.get('q') ?? undefined;
    const from = url.searchParams.get('from') ?? undefined;
    const to = url.searchParams.get('to') ?? undefined;
    const category = url.searchParams.get('category') ?? undefined;
    const page = url.searchParams.get('page') ?? undefined;

    const nytPage = page ? Math.max(0, Number(page) - 1) : undefined;
    const fq = category ? NYT_CATEGORY_MAP[category] : undefined;

    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const nytEndDate = to ? toNytDate(to) : undefined;

    const params = buildSearchParams({
      q,
      begin_date: from ? toNytDate(from) : undefined,
      end_date: nytEndDate && nytEndDate < today ? nytEndDate : undefined,
      fq,
      page: nytPage,
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
      return errorResponse('nyt', message, response.status);
    }

    const data = (await response.json()) as NytResponse;
    if (!data.response.docs) {
      data.response.docs = [];
    }
    return jsonResponse(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    const status = message.includes('aborted') ? 504 : 500;
    return errorResponse('nyt', message, status);
  }
};
