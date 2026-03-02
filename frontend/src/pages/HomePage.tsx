import { useCallback, useEffect, useState } from 'react';
import type { ArticleQuery } from '../domain/types';
import { usePreferences } from '../features/preferences/usePreferences';
import { buildQueryFromPreferences } from '../features/preferences/types';
import { useArticles } from '../features/articles/useArticles';
import ArticleFeed from '../features/articles/ArticleFeed';
import FilterPanel from '../features/filters/FilterPanel';
import SearchInput from '../features/filters/SearchInput';
import {
  loadSessionQuery,
  saveSessionQuery,
  clearSessionQuery,
} from '../features/filters/sessionQuery';

const DISPLAY_PAGE_SIZE = 12;

export default function HomePage() {
  const { preferences } = usePreferences();
  const [query, setQuery] = useState<ArticleQuery>(
    () => loadSessionQuery() ?? buildQueryFromPreferences(preferences),
  );

  const [displayCount, setDisplayCount] = useState(DISPLAY_PAGE_SIZE);
  const [prevQuery, setPrevQuery] = useState(query);
  if (prevQuery !== query) {
    setPrevQuery(query);
    setDisplayCount(DISPLAY_PAGE_SIZE);
  }

  const [prevPrefs, setPrevPrefs] = useState(preferences);
  if (prevPrefs !== preferences) {
    setPrevPrefs(preferences);
    setQuery(buildQueryFromPreferences(preferences));
  }

  useEffect(() => {
    saveSessionQuery(query);
  }, [query]);

  const handleQueryChange = useCallback(
    (patch: Partial<ArticleQuery>) =>
      setQuery((prev) => ({ ...prev, ...patch })),
    [],
  );

  const handleReset = useCallback(() => {
    clearSessionQuery();
    setQuery({});
  }, []);

  const {
    articles,
    sourceResults,
    isLoading,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useArticles(query);

  const visibleArticles = articles.slice(0, displayCount);
  const hasMoreToShow = displayCount < articles.length || hasNextPage;

  const handleLoadMore = useCallback(() => {
    const nextCount = displayCount + DISPLAY_PAGE_SIZE;
    setDisplayCount(nextCount);
    if (nextCount > articles.length && hasNextPage) {
      fetchNextPage();
    }
  }, [displayCount, articles.length, hasNextPage, fetchNextPage]);

  return (
    <main className="flex-1 px-4 py-6 md:px-8">
      <h2 className="mb-6 text-2xl font-bold text-gray-900">Latest News</h2>

      <div className="md:flex md:gap-8">
        <FilterPanel
          query={query}
          onQueryChange={handleQueryChange}
          onReset={handleReset}
        />

        <div className="min-w-0 flex-1">
          <div className="mb-6">
            <SearchInput
              value={query.q ?? ''}
              onChange={(q) => handleQueryChange({ q: q || undefined })}
            />
          </div>

          <ArticleFeed
            articles={visibleArticles}
            sourceResults={sourceResults}
            isLoading={isLoading}
            onRetry={refetch}
            hasNextPage={hasMoreToShow}
            isFetchingNextPage={isFetchingNextPage}
            onLoadMore={handleLoadMore}
          />
        </div>
      </div>
    </main>
  );
}
