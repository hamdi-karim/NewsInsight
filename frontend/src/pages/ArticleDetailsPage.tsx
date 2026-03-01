import { useParams, Link } from 'react-router';
import { useCachedArticle } from '../features/articles/useCachedArticle';
import { SOURCE_COLORS, SOURCE_LABELS } from '../features/articles/constants';
import type { Source } from '../domain/types';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

function BackToFeedLink() {
  return (
    <Link
      to="/"
      className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 19l-7-7 7-7"
        />
      </svg>
      Back to feed
    </Link>
  );
}

function ArticleNotFound() {
  return (
    <main className="flex-1 px-4 py-6 md:px-8">
      <div className="mx-auto max-w-3xl">
        <BackToFeedLink />

        <div className="mt-12 flex flex-col items-center text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mb-4 h-16 w-16 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-xl font-semibold text-gray-900">
            Article not found
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            This article may have expired from cache. Browse the feed to find
            it again.
          </p>
          <Link
            to="/"
            className="mt-6 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
          >
            Browse the feed
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function ArticleDetailsPage() {
  const { source, id } = useParams<{ source: string; id: string }>();
  const article = useCachedArticle(source, id);

  if (!article) return <ArticleNotFound />;

  const {
    source: articleSource,
    title,
    summary,
    imageUrl,
    publishedAt,
    author,
    category,
    url,
  } = article;

  return (
    <main className="flex-1 px-4 py-6 md:px-8">
      <article className="mx-auto max-w-3xl">
        <BackToFeedLink />

        {imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            className="mt-6 w-full rounded-xl object-cover max-h-[420px]"
          />
        ) : (
          <div className="mt-6 flex h-48 w-full items-center justify-center rounded-xl bg-gray-100 text-gray-400 md:h-64">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v12a2 2 0 01-2 2zM9 10l3 3m0 0l3-3m-3 3V4"
              />
            </svg>
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${SOURCE_COLORS[articleSource as Source]}`}
          >
            {SOURCE_LABELS[articleSource as Source]}
          </span>
          {category && (
            <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
              {category}
            </span>
          )}
        </div>

        <h1 className="mt-4 text-2xl font-bold leading-tight text-gray-900 md:text-3xl">
          {title}
        </h1>

        <div className="mt-3 flex flex-wrap items-center gap-1.5 text-sm text-gray-500">
          {author && (
            <>
              <span>{author}</span>
              <span aria-hidden="true">&middot;</span>
            </>
          )}
          <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>
        </div>

        {summary && (
          <p className="mt-6 text-base leading-relaxed text-gray-700">
            {summary}
          </p>
        )}

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
        >
          Read full article
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
      </article>
    </main>
  );
}
