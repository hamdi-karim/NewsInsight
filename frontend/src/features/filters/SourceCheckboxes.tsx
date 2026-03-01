import type { Source } from '../../domain/types';
import { SOURCE_LABELS, SOURCE_COLORS } from '../articles/constants';

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
    onChange(next);
  }

  return (
    <fieldset className="space-y-2">
      <legend className="text-xs font-semibold uppercase tracking-wide text-gray-500">
        Sources
      </legend>

      <div className="space-y-1.5">
        {ALL_SOURCES.map((source) => (
          <label
            key={source}
            className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-gray-50"
          >
            <input
              type="checkbox"
              checked={value.length === 0 || value.includes(source)}
              onChange={() => toggle(source)}
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
  );
}
