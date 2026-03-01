import { useState } from 'react';
import type { SourceResult } from '../../domain/types';
import { SOURCE_LABELS } from './constants';

export default function ErrorBanner({
  sourceResults,
}: {
  sourceResults: SourceResult[];
}) {
  const failures = sourceResults.filter((r) => r.status === 'error');
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  if (failures.length === 0) return null;

  const visible = failures.filter((f) => !dismissed.has(f.source));
  if (visible.length === 0) return null;

  function dismiss(source: string) {
    setDismissed((prev) => new Set(prev).add(source));
  }

  return (
    <div className="space-y-2">
      {visible.map((r) => (
        <div
          key={r.source}
          role="alert"
          className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mt-0.5 h-5 w-5 shrink-0 text-amber-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.168 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
          <p className="flex-1 text-sm text-amber-800">
            <span className="font-medium">{SOURCE_LABELS[r.source]}</span> is
            currently unavailable.{' '}
            {r.status === 'error' && (
              <span className="text-amber-600">{r.error}</span>
            )}
          </p>
          <button
            type="button"
            onClick={() => dismiss(r.source)}
            className="shrink-0 rounded p-1 text-amber-500 hover:bg-amber-100 hover:text-amber-700"
            aria-label={`Dismiss ${SOURCE_LABELS[r.source]} error`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
