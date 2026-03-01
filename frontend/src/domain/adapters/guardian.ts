import type { Article, GuardianRawArticle } from '../types';
import { normalizeSummaryText } from './text';

export function adaptGuardianArticles(raw: GuardianRawArticle[]): Article[] {
  return raw.map((a) => ({
    id: a.id,
    source: 'guardian' as const,
    title: a.webTitle,
    summary: normalizeSummaryText(a.fields?.trailText),
    url: a.webUrl,
    imageUrl: a.fields?.thumbnail ?? undefined,
    publishedAt: a.webPublicationDate,
    author: a.fields?.byline ?? undefined,
    category: a.sectionName ?? undefined,
  }));
}
