import { useArticles } from '../features/articles/useArticles';

const SOURCE_COLORS: Record<string, string> = {
  newsapi: 'bg-blue-100 text-blue-800',
  guardian: 'bg-yellow-100 text-yellow-800',
  nyt: 'bg-green-100 text-green-800',
};

export default function HomePage() {
  const { articles, sourceResults, isLoading } = useArticles({ q: 'latest' });

  const errors = sourceResults.filter((r) => r.status === 'error');

  return (
    <main className="flex-1 p-4 md:p-8">
      <h2 className="text-2xl font-bold text-gray-900">Latest News</h2>

      {errors.length > 0 && (
        <div className="mt-2 space-y-1">
          {errors.map((r) => (
            <p key={r.source} className="text-sm text-red-600">
              {r.source} failed: {r.status === 'error' ? r.error : ''}
            </p>
          ))}
        </div>
      )}

      {isLoading && <p className="mt-4 text-gray-500">Loading articles...</p>}

      {!isLoading && articles.length === 0 && (
        <p className="mt-4 text-gray-500">No articles found.</p>
      )}

      <ul className="mt-4 space-y-3">
        {articles.map((a) => (
          <li key={a.id} className="flex items-start gap-3 border-b border-gray-100 pb-3">
            <span
              className={`shrink-0 rounded px-2 py-0.5 text-xs font-medium ${SOURCE_COLORS[a.source] ?? 'bg-gray-100 text-gray-800'}`}
            >
              {a.source}
            </span>
            <div className="min-w-0">
              <a
                href={a.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-gray-900 hover:text-blue-600"
              >
                {a.title}
              </a>
              <p className="mt-0.5 text-xs text-gray-500">
                {a.author && <span>{a.author} &middot; </span>}
                {new Date(a.publishedAt).toLocaleDateString()}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
