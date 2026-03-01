import { useCallback, useState } from 'react';
import type { ArticleQuery } from '../domain/types';
import { useArticles } from '../features/articles/useArticles';
import ArticleFeed from '../features/articles/ArticleFeed';
import FilterPanel from '../features/filters/FilterPanel';
import SearchInput from '../features/filters/SearchInput';

const INITIAL_QUERY: ArticleQuery = {};

export default function HomePage() {
  const [query, setQuery] = useState<ArticleQuery>(INITIAL_QUERY);

  const handleQueryChange = useCallback(
    (patch: Partial<ArticleQuery>) =>
      setQuery((prev) => ({ ...prev, ...patch })),
    [],
  );

  const handleReset = useCallback(() => setQuery(INITIAL_QUERY), []);

  const { articles, sourceResults, isLoading } = useArticles(query);

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
              onChange={(q) => handleQueryChange({ q: q || undefined, page: undefined })}
            />
          </div>

          <ArticleFeed
            articles={articles}
            sourceResults={sourceResults}
            isLoading={isLoading}
          />
        </div>
      </div>
    </main>
  );
}
