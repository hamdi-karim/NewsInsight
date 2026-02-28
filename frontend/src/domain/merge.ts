import type { Article, SourceResult } from './types';

export function dedupeByUrl(articles: Article[]): Article[] {
  const seen = new Set<string>();
  return articles.filter((a) => {
    if (seen.has(a.url)) return false;
    seen.add(a.url);
    return true;
  });
}

export function sortByDate(articles: Article[]): Article[] {
  return [...articles].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export function mergeArticles(results: SourceResult[]): Article[] {
  const all = results
    .filter((r): r is Extract<SourceResult, { status: 'success' }> => r.status === 'success')
    .flatMap((r) => r.articles);

  return sortByDate(dedupeByUrl(all));
}
