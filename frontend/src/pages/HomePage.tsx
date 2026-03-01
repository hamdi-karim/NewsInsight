import { useArticles } from '../features/articles/useArticles';
import ArticleFeed from '../features/articles/ArticleFeed';

export default function HomePage() {
  const { articles, sourceResults, isLoading } = useArticles({});

  return (
    <main className="flex-1 px-4 py-6 md:px-8">
      <h2 className="mb-6 text-2xl font-bold text-gray-900">Latest News</h2>
      <ArticleFeed
        articles={articles}
        sourceResults={sourceResults}
        isLoading={isLoading}
      />
    </main>
  );
}
