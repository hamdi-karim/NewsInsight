import type {
  ArticleQuery,
  NewsApiResponse,
  GuardianResponse,
  NytResponse,
} from '../domain/types';

export function buildQueryString(query: ArticleQuery, page?: number): string {
  const params = new URLSearchParams();
  if (query.q) params.set('q', query.q);
  if (query.from) params.set('from', query.from);
  if (query.to) params.set('to', query.to);
  if (query.category) params.set('category', query.category);
  if (page) params.set('page', String(page));
  return params.toString();
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const message = (body as Record<string, unknown>)?.error
      ? String((body as { error: { message?: string } }).error.message)
      : `Request failed with status ${response.status}`;
    throw new Error(message);
  }
  return response.json() as Promise<T>;
}

export function fetchNewsApiArticles(
  query: ArticleQuery,
  page?: number,
): Promise<NewsApiResponse> {
  return fetchJson<NewsApiResponse>(
    `/api/newsapi/articles?${buildQueryString(query, page)}`,
  );
}

export function fetchGuardianArticles(
  query: ArticleQuery,
  page?: number,
): Promise<GuardianResponse> {
  return fetchJson<GuardianResponse>(
    `/api/guardian/articles?${buildQueryString(query, page)}`,
  );
}

export function fetchNytArticles(
  query: ArticleQuery,
  page?: number,
): Promise<NytResponse> {
  return fetchJson<NytResponse>(
    `/api/nyt/articles?${buildQueryString(query, page)}`,
  );
}
