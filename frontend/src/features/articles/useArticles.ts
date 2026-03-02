import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import type {
  Article,
  ArticleQuery,
  NytRawArticle,
  NytResponse,
  Source,
  SourceResult,
} from '../../domain/types';
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

const PAGE_SIZE_NEWSAPI = 20;
const PAGE_SIZE_GUARDIAN = 20;
const PAGE_SIZE_NYT = 10;

export interface UseArticlesResult {
  articles: Article[];
  sourceResults: SourceResult[];
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}

export function normalizeNytDocs(raw: NytResponse): NytRawArticle[] {
  const docs = raw.response?.docs;
  return Array.isArray(docs) ? docs : [];
}

interface PipelineResult {
  articles: Article[];
  total: number;
}

const PROVIDER_PIPELINES: {
  source: Source;
  pageSize: number;
  fetch: (q: ArticleQuery, page: number) => Promise<PipelineResult>;
}[] = [
  {
    source: 'newsapi',
    pageSize: PAGE_SIZE_NEWSAPI,
    fetch: async (q, page) => {
      const raw = await fetchNewsApiArticles(q, page);
      return {
        articles: adaptNewsApiArticles(raw.articles),
        total: raw.totalResults,
      };
    },
  },
  {
    source: 'guardian',
    pageSize: PAGE_SIZE_GUARDIAN,
    fetch: async (q, page) => {
      const raw = await fetchGuardianArticles(q, page);
      return {
        articles: adaptGuardianArticles(raw.response.results),
        total: raw.response.total,
      };
    },
  },
  {
    source: 'nyt',
    pageSize: PAGE_SIZE_NYT,
    fetch: async (q, page) => {
      const raw = await fetchNytArticles(q, page);
      return {
        articles: adaptNytArticles(normalizeNytDocs(raw)),
        total: raw.response?.meta?.hits ?? 0,
      };
    },
  },
];

interface PageData {
  articles: Article[];
  sourceResults: SourceResult[];
  page: number;
}

async function fetchAllArticles(
  query: ArticleQuery,
  page: number,
): Promise<PageData> {
  const pipelines = PROVIDER_PIPELINES.filter(
    (p) => !query.sources?.length || query.sources.includes(p.source),
  );

  const settled = await Promise.allSettled(
    pipelines.map((p) => p.fetch(query, page)),
  );

  const sourceResults: SourceResult[] = settled.map((result, i) => {
    const { source } = pipelines[i];
    if (result.status === 'fulfilled') {
      return {
        source,
        status: 'success' as const,
        articles: result.value.articles,
        total: result.value.total,
      };
    }
    return {
      source,
      status: 'error' as const,
      error:
        result.reason instanceof Error
          ? result.reason.message
          : 'Unknown error',
    };
  });

  return { articles: mergeArticles(sourceResults), sourceResults, page };
}

function hasMorePages(sourceResults: SourceResult[], page: number): boolean {
  return sourceResults.some((r) => {
    if (r.status !== 'success') return false;
    const pipeline = PROVIDER_PIPELINES.find((p) => p.source === r.source);
    if (!pipeline) return false;
    return r.total > page * pipeline.pageSize;
  });
}

export function useArticles(query: ArticleQuery): UseArticlesResult {
  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['articles', query],
    queryFn: ({ pageParam }) => fetchAllArticles(query, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      hasMorePages(lastPage.sourceResults, lastPage.page)
        ? lastPage.page + 1
        : undefined,
    staleTime: 5 * 60 * 1000,
  });

  const articles = useMemo(() => {
    if (!data) return [];
    const all = data.pages.flatMap((p) => p.articles);
    return mergeArticles(
      [{ source: 'newsapi', status: 'success' as const, articles: all, total: all.length }],
    );
  }, [data]);

  const sourceResults = data?.pages[data.pages.length - 1]?.sourceResults ?? [];

  return {
    articles,
    sourceResults,
    isLoading,
    isError,
    refetch: () => { refetch(); },
    fetchNextPage: () => { fetchNextPage(); },
    hasNextPage: hasNextPage ?? false,
    isFetchingNextPage,
  };
}
