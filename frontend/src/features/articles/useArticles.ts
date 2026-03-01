import { useQuery } from '@tanstack/react-query';
import type { Article, ArticleQuery, Source, SourceResult } from '../../domain/types';
import {
  fetchNewsApiArticles,
  fetchGuardianArticles,
  fetchNytArticles,
} from '../../services/api';
import {
  adaptNewsApiArticles,
  adaptGuardianArticles,
  adaptNytArticles,
} from '../../domain/adapters';
import { mergeArticles } from '../../domain/merge';

interface UseArticlesResult {
  articles: Article[];
  sourceResults: SourceResult[];
  isLoading: boolean;
  isError: boolean;
}

const PROVIDER_PIPELINES: {
  source: Source;
  fetch: (q: ArticleQuery) => Promise<Article[]>;
}[] = [
  {
    source: 'newsapi',
    fetch: async (q) => {
      const raw = await fetchNewsApiArticles(q);
      return adaptNewsApiArticles(raw.articles);
    },
  },
  {
    source: 'guardian',
    fetch: async (q) => {
      const raw = await fetchGuardianArticles(q);
      return adaptGuardianArticles(raw.response.results);
    },
  },
  {
    source: 'nyt',
    fetch: async (q) => {
      const raw = await fetchNytArticles(q);
      return adaptNytArticles(raw.response.docs);
    },
  },
];

async function fetchAllArticles(
  query: ArticleQuery,
): Promise<{ articles: Article[]; sourceResults: SourceResult[] }> {
  const pipelines = PROVIDER_PIPELINES.filter(
    (p) => !query.sources?.length || query.sources.includes(p.source),
  );

  const settled = await Promise.allSettled(
    pipelines.map((p) => p.fetch(query)),
  );

  const sourceResults: SourceResult[] = settled.map((result, i) => {
    const { source } = pipelines[i];
    if (result.status === 'fulfilled') {
      return { source, status: 'success' as const, articles: result.value };
    }
    return {
      source,
      status: 'error' as const,
      error: result.reason instanceof Error ? result.reason.message : 'Unknown error',
    };
  });

  return { articles: mergeArticles(sourceResults), sourceResults };
}

export function useArticles(query: ArticleQuery): UseArticlesResult {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['articles', query],
    queryFn: () => fetchAllArticles(query),
    staleTime: 5 * 60 * 1000,
  });

  return {
    articles: data?.articles ?? [],
    sourceResults: data?.sourceResults ?? [],
    isLoading,
    isError,
  };
}
