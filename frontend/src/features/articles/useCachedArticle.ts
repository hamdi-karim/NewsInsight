import { useQueryClient } from '@tanstack/react-query';
import type { Article, Source, SourceResult } from '../../domain/types';

interface CachedArticlesData {
  articles: Article[];
  sourceResults: SourceResult[];
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

  const entries = queryClient.getQueriesData<CachedArticlesData>({
    queryKey: ['articles'],
  });

  for (const [, data] of entries) {
    const match = data?.articles.find(
      (a) => a.source === source && a.id === id,
    );
    if (match) return match;
  }

  return undefined;
}
