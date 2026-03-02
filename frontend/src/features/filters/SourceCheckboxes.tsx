import type { Source } from '../../domain/types';
import { SOURCE_LABELS, SOURCE_COLOR_SCHEMES } from '../articles/constants';

const ALL_SOURCES: Source[] = ['newsapi', 'guardian', 'nyt'];

interface SourceCheckboxesProps {
  value: Source[];
  onChange: (sources: Source[]) => void;
}

export default function SourceCheckboxes({
  value,
  onChange,
}: SourceCheckboxesProps) {
  function toggle(source: Source) {
    const next = value.includes(source)
      ? value.filter((s) => s !== source)
      : [...value, source];

    onChange(next.length === 0 ? [] : next);
  }

  return (
    <fieldset className="space-y-2">
      <legend className="text-xs font-semibold uppercase tracking-wide text-gray-500">
        Sources
      </legend>

      <div role="group" className="space-y-1.5">
        {ALL_SOURCES.map((source) => {
          const active = value.includes(source);
          const colors = SOURCE_COLOR_SCHEMES[source];

          return (
            <button
              key={source}
              type="button"
              aria-pressed={active}
              onClick={() => toggle(source)}
              className={`w-full cursor-pointer rounded-xl px-4 py-3 text-left text-sm font-semibold transition-colors hover:brightness-95 ${active ? colors.active : colors.inactive}`}
            >
              {SOURCE_LABELS[source]}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
