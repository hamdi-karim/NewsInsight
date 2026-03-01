import { useEffect, useRef, useState } from "react";
import { useDebounce } from "./useDebounce";

interface SearchInputProps {
  value: string;
  onChange: (q: string) => void;
}

export default function SearchInput({ value, onChange }: SearchInputProps) {
  const [local, setLocal] = useState(value);
  const debounced = useDebounce(local);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocal(value);
  }, [value]);

  useEffect(() => {
    if (debounced !== value) {
      onChange(debounced);
    }
  }, [debounced, onChange, value]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      setLocal("");
      inputRef.current?.blur();
    }
  }

  return (
    <div role="search" className="relative">
      <label htmlFor="search-input" className="sr-only">
        Search articles
      </label>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
          clipRule="evenodd"
        />
      </svg>

      <input
        ref={inputRef}
        id="search-input"
        type="text"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search stories, topics, or articles..."
        className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-12 pr-14 text-base text-gray-900 placeholder:text-gray-400 focus:border-gray-300 focus:bg-white focus:ring-0 focus:outline-none"
      />

      {local && (
        <kbd
          onClick={() => {
            setLocal("");
            inputRef.current?.focus();
          }}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer select-none rounded-md border border-gray-200 bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-400 transition-colors hover:text-gray-600"
          role="button"
          tabIndex={0}
          aria-label="Clear search (Escape)"
        >
          x
        </kbd>
      )}
    </div>
  );
}
