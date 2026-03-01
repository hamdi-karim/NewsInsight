import type { Article, NewsApiRawArticle } from '../types';
import { normalizeSummaryText } from './text';

export function adaptNewsApiArticles(raw: NewsApiRawArticle[]): Article[] {
  return raw
    .filter((a) => a.title !== '[Removed]')
    .map((a) => ({
      id: a.url,
      source: 'newsapi' as const,
      title: a.title,
      summary: normalizeSummaryText(a.description),
      url: a.url,
      imageUrl: a.urlToImage ?? undefined,
      publishedAt: a.publishedAt,
      author: a.author ?? undefined,
      category: a.source.name,
    }));
}
