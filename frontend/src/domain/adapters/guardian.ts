import type { Article, GuardianRawArticle } from '../types';

export function adaptGuardianArticles(raw: GuardianRawArticle[]): Article[] {
  return raw.map((a) => ({
    id: a.id,
    source: 'guardian' as const,
    title: a.webTitle,
    summary: a.fields?.trailText ?? undefined,
    url: a.webUrl,
    imageUrl: a.fields?.thumbnail ?? undefined,
    publishedAt: a.webPublicationDate,
    author: a.fields?.byline ?? undefined,
    category: a.sectionName ?? undefined,
  }));
}
