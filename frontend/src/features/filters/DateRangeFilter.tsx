interface DateRangeFilterProps {
  from: string;
  to: string;
  onChange: (range: { from?: string; to?: string }) => void;
}

const TODAY = new Date().toISOString().slice(0, 10);

export default function DateRangeFilter({
  from,
  to,
  onChange,
}: DateRangeFilterProps) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-xs font-semibold uppercase tracking-wide text-gray-500">
        Date Range
      </legend>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label htmlFor="date-from" className="sr-only">
            From date
          </label>
          <input
            id="date-from"
            type="date"
            value={from}
            max={to || TODAY}
            onChange={(e) => onChange({ from: e.target.value || undefined, to: to || undefined })}
            className="w-full rounded-lg border border-gray-300 bg-white px-2.5 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="date-to" className="sr-only">
            To date
          </label>
          <input
            id="date-to"
            type="date"
            value={to}
            min={from || undefined}
            max={TODAY}
            onChange={(e) => onChange({ from: from || undefined, to: e.target.value || undefined })}
            className="w-full rounded-lg border border-gray-300 bg-white px-2.5 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex justify-between text-[11px] text-gray-400 px-0.5">
        <span>From</span>
        <span>To</span>
      </div>
    </fieldset>
  );
}
