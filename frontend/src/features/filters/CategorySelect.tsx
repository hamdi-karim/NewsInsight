import { CATEGORY_OPTIONS } from './constants';

interface CategorySelectProps {
  value: string;
  onChange: (category: string | undefined) => void;
}

export default function CategorySelect({
  value,
  onChange,
}: CategorySelectProps) {
  return (
    <div className="space-y-1">
      <label
        htmlFor="category-select"
        className="text-xs font-semibold uppercase tracking-wide text-gray-500"
      >
        Category
      </label>

      <select
        id="category-select"
        value={value}
        onChange={(e) => onChange(e.target.value || undefined)}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
      >
        {CATEGORY_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
