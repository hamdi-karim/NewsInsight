interface DateFilterProps {
  value: string;
  onChange: (date: string | undefined) => void;
}

const TODAY = new Date().toISOString().slice(0, 10);

export default function DateFilter({ value, onChange }: DateFilterProps) {
  return (
    <div className="space-y-1">
      <label
        htmlFor="date-filter"
        className="text-xs font-semibold uppercase tracking-wide text-gray-500"
      >
        Date
      </label>

      <input
        id="date-filter"
        type="date"
        value={value}
        max={TODAY}
        onChange={(e) => onChange(e.target.value || undefined)}
        className="w-full rounded-lg border border-gray-300 bg-white px-2.5 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
      />
    </div>
  );
}
