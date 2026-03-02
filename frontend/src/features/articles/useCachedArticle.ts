import { useQueryClient, type InfiniteData } from '@tanstack/react-query';
import type { Article, Source, SourceResult } from '../../domain/types';

interface PageData {
  articles: Article[];
  sourceResults: SourceResult[];
  page: number;
}

const VALID_SOURCES: Set<string> = new Set<Source>([
  'newsapi',
  'guardian',
  'nyt',
]);

export function useCachedArticle(
  source: string | undefined,
  id: string | undefined,
): Article | undefined {
  const queryClient = useQueryClient();

  if (!source || !id || !VALID_SOURCES.has(source)) return undefined;

  const entries = queryClient.getQueriesData<InfiniteData<PageData>>({
    queryKey: ['articles'],
  });

  for (const [, data] of entries) {
    if (!data?.pages) continue;
    for (const page of data.pages) {
      const match = page.articles.find(
        (a) => a.source === source && a.id === id,
      );
      if (match) return match;
    }
  }

  return undefined;
}
