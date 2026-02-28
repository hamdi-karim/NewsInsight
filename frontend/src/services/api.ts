import type {
  ArticleQuery,
  NewsApiResponse,
  GuardianResponse,
  NytResponse,
} from '../domain/types';

function buildQueryString(query: ArticleQuery): string {
  const params = new URLSearchParams();
  if (query.q) params.set('q', query.q);
  if (query.from) params.set('from', query.from);
  if (query.to) params.set('to', query.to);
  if (query.category) params.set('category', query.category);
  if (query.page) params.set('page', String(query.page));
  return params.toString();
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const message =
      (body as Record<string, unknown>)?.error
        ? String((body as { error: { message?: string } }).error.message)
        : `Request failed with status ${response.status}`;
    throw new Error(message);
  }
  return response.json() as Promise<T>;
}

export function fetchNewsApiArticles(
  query: ArticleQuery,
): Promise<NewsApiResponse> {
  return fetchJson<NewsApiResponse>(
    `/api/newsapi/articles?${buildQueryString(query)}`,
  );
}

export function fetchGuardianArticles(
  query: ArticleQuery,
): Promise<GuardianResponse> {
  return fetchJson<GuardianResponse>(
    `/api/guardian/articles?${buildQueryString(query)}`,
  );
}

export function fetchNytArticles(
  query: ArticleQuery,
): Promise<NytResponse> {
  return fetchJson<NytResponse>(
    `/api/nyt/articles?${buildQueryString(query)}`,
  );
}
