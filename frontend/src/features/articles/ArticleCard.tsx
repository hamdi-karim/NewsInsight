import { Link } from 'react-router';
import type { Article } from '../../domain/types';
import { SOURCE_CARD_BACKGROUNDS, SOURCE_COLORS, SOURCE_LABELS } from './constants';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
  className?: string;
}

export default function ArticleCard({ article, featured, className }: ArticleCardProps) {
  const {
    id,
    source,
    title,
    summary,
    imageUrl,
    publishedAt,
    author,
    category,
  } = article;

  const articleUrl = `/article/${source}/${encodeURIComponent(id)}`;

  if (featured) {
    return (
      <article className={`flex flex-col overflow-hidden rounded-2xl ${SOURCE_CARD_BACKGROUNDS[source]} p-6 ${className ?? ''}`}>
        <Link to={articleUrl} className="mb-2 text-xl font-bold leading-snug text-gray-900 hover:text-gray-700">
          {title}
        </Link>

        {summary && (
          <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-gray-700">
            {summary}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <span className="font-semibold uppercase tracking-wide">{SOURCE_LABELS[source]}</span>
            {author && (
              <>
                <span aria-hidden="true">,</span>
                <span className="truncate max-w-[160px]">{author}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-3">
            <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>
            <Link to={articleUrl} aria-label="Read article" className="text-gray-600 hover:text-gray-900">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
              </svg>
            </Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className={`flex flex-col overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-gray-200 transition-shadow hover:shadow-md ${className ?? ''}`}>
      <Link
        to={articleUrl}
        className="block"
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            className="h-48 w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-48 w-full items-center justify-center bg-gray-100 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12"
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
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${SOURCE_COLORS[source]}`}
          >
            {SOURCE_LABELS[source]}
          </span>
          {category && (
            <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
              {category}
            </span>
          )}
        </div>

        <Link
          to={articleUrl}
          className="mb-2 text-base font-semibold leading-snug text-gray-900 hover:text-blue-700"
        >
          {title}
        </Link>

        {summary && (
          <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-gray-600">
            {summary}
          </p>
        )}

        <div className="mt-auto flex items-center gap-1 text-xs text-gray-500">
          {author && (
            <>
              <span className="truncate max-w-[160px]">{author}</span>
              <span aria-hidden="true">&middot;</span>
            </>
          )}
          <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>
        </div>
      </div>
    </article>
  );
}
