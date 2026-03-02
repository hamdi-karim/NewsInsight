import { useEffect, useRef, useState } from 'react';
import type { Source } from '../../domain/types';
import type { Preferences } from './types';
import { usePreferences } from './PreferencesContext';
import { SOURCE_LABELS, SOURCE_COLORS } from '../articles/constants';
import { CATEGORY_OPTIONS } from '../filters/constants';

const ALL_SOURCES: Source[] = ['newsapi', 'guardian', 'nyt'];

interface PreferencesPanelProps {
  open: boolean;
  onClose: () => void;
}

export default function PreferencesPanel({ open, onClose }: PreferencesPanelProps) {
  const { preferences, setPreferences } = usePreferences();
  const [draft, setDraft] = useState<Preferences>(preferences);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) setDraft(preferences);
  }, [open, preferences]);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();

    return () => {
      previouslyFocused?.focus();
    };
  }, [open]);

  if (!open) return null;

  function toggleSource(source: Source) {
    setDraft((prev) => {
      const next = prev.sources.includes(source)
        ? prev.sources.filter((s) => s !== source)
        : [...prev.sources, source];
      return { ...prev, sources: next };
    });
  }

  function handleSave() {
    setPreferences(draft);
    onClose();
  }

  function handleReset() {
    const cleared: Preferences = { sources: [], category: '' };
    setDraft(cleared);
  }

  const hasChanges =
    JSON.stringify(draft) !== JSON.stringify(preferences);

  const hasAnyPrefs =
    draft.sources.length > 0 || draft.category !== '';

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24"
      role="dialog"
      aria-modal="true"
      aria-label="Personalization settings"
    >
      <div
        className="fixed inset-0 bg-black/40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        tabIndex={-1}
        className="relative z-10 w-full max-w-md rounded-xl bg-white shadow-2xl ring-1 ring-gray-200 mx-4 focus:outline-none"
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Personalization
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close settings"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>

        <div className="space-y-6 px-6 py-5">
          <p className="text-sm text-gray-500">
            Choose your default sources and category. These are applied when the feed loads but can be overridden with filters.
          </p>

          <fieldset className="space-y-2">
            <legend className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Preferred Sources
            </legend>
            <p className="text-xs text-gray-400">
              Leave all unchecked to see every source.
            </p>
            <div className="space-y-1.5">
              {ALL_SOURCES.map((source) => (
                <label
                  key={source}
                  className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2.5 transition-colors hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={draft.sources.includes(source)}
                    onChange={() => toggleSource(source)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${SOURCE_COLORS[source]}`}
                  >
                    {SOURCE_LABELS[source]}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="space-y-1">
            <label
              htmlFor="pref-category"
              className="text-xs font-semibold uppercase tracking-wide text-gray-500"
            >
              Preferred Category
            </label>
            <select
              id="pref-category"
              value={draft.category}
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, category: e.target.value }))
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            >
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
          <button
            type="button"
            onClick={handleReset}
            disabled={!hasAnyPrefs}
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Reset defaults
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!hasChanges}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
