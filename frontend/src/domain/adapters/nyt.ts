import type { Article, NytRawArticle } from '../types';
import { normalizeSummaryText } from './text';

const NYT_IMAGE_BASE = 'https://static01.nyt.com/';

function buildNytImageUrl(
  multimedia?: { default?: { url: string }; thumbnail?: { url: string } }
): string | undefined {
  const url = multimedia?.default?.url ?? multimedia?.thumbnail?.url;
  if (!url) return undefined;
  if (url.startsWith('http')) return url;
  return `${NYT_IMAGE_BASE}${url}`;
}

export function adaptNytArticles(raw: NytRawArticle[]): Article[] {
  return raw.map((a) => ({
    id: a.web_url,
    source: 'nyt' as const,
    title: a.headline.main,
    summary: normalizeSummaryText(a.abstract),
    url: a.web_url,
    imageUrl: buildNytImageUrl(a.multimedia),
    publishedAt: a.pub_date,
    author: a.byline?.original ?? undefined,
    category: a.section_name ?? undefined,
  }));
}
