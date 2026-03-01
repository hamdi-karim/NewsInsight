import { useState } from 'react';
import type { Source, ArticleQuery } from '../../domain/types';
import DateFilter from './DateFilter';
import CategorySelect from './CategorySelect';
import SourceCheckboxes from './SourceCheckboxes';

interface FilterPanelProps {
  query: ArticleQuery;
  onQueryChange: (patch: Partial<ArticleQuery>) => void;
  onReset: () => void;
}

const EMPTY_SOURCES: Source[] = [];

export default function FilterPanel({
  query,
  onQueryChange,
  onReset,
}: FilterPanelProps) {
  const [open, setOpen] = useState(false);

  const hasActiveFilters =
    Boolean(query.from) ||
    Boolean(query.category) ||
    (query.sources?.length ?? 0) > 0;

  const filters = (
    <div className="space-y-5">
      <DateFilter
        value={query.from ?? ''}
        onChange={(date) =>
          onQueryChange({ from: date, to: date, page: undefined })
        }
      />

      <CategorySelect
        value={query.category ?? ''}
        onChange={(category) => onQueryChange({ category, page: undefined })}
      />

      <SourceCheckboxes
        value={query.sources ?? EMPTY_SOURCES}
        onChange={(sources) =>
          onQueryChange({
            sources: sources.length > 0 ? sources : undefined,
            page: undefined,
          })
        }
      />

      {hasActiveFilters && (
        <button
          type="button"
          onClick={onReset}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
        >
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <div className="md:hidden">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="mb-4 flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
          aria-expanded={open}
          aria-controls="mobile-filters"
        >
          <span className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 01.628.74v2.288a2.25 2.25 0 01-.659 1.59l-4.682 4.683a2.25 2.25 0 00-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 018 18.25v-5.757a2.25 2.25 0 00-.659-1.591L2.659 6.22A2.25 2.25 0 012 4.629V2.34a.75.75 0 01.628-.74z"
                clipRule="evenodd"
              />
            </svg>
            Filters
            {hasActiveFilters && (
              <span className="rounded-full bg-blue-100 px-1.5 py-0.5 text-xs font-semibold text-blue-700">
                Active
              </span>
            )}
          </span>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className={`h-5 w-5 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.22 8.22a.75.75 0 011.06 0L10 11.94l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.22 9.28a.75.75 0 010-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {open && (
          <div
            id="mobile-filters"
            className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
          >
            {filters}
          </div>
        )}
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden md:block md:w-72 md:shrink-0">
        <div className="sticky top-6 space-y-1">
          <h3 className="mb-3 text-sm font-semibold text-gray-900">Filters</h3>
          {filters}
        </div>
      </aside>
    </>
  );
}
