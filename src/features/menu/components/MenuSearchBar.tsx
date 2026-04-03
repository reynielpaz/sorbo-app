import type { ChangeEvent } from 'react';
import { Search, X } from 'lucide-react';

interface MenuSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  placeholder?: string;
}

export function MenuSearchBar({
  value,
  onChange,
  onClear,
  placeholder = 'Busca tu antojo',
}: MenuSearchBarProps) {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange(event.target.value);
  }

  return (
    <div className="relative rounded-[20px] border border-white/[0.05] bg-[linear-gradient(180deg,rgba(255,255,255,0.032)_0%,rgba(255,255,255,0.014)_100%)] px-0.5 py-0.5 shadow-[0_10px_20px_rgba(0,0,0,0.14),inset_0_1px_0_rgba(255,255,255,0.03)]">
      <Search
        size={15}
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/26"
        aria-hidden="true"
      />

      <input
        type="text"
        inputMode="search"
        enterKeyHint="search"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        autoComplete="off"
        className="h-11 w-full rounded-[19px] border border-transparent bg-[linear-gradient(180deg,rgba(10,12,18,0.78)_0%,rgba(8,10,14,0.92)_100%)] pl-11 pr-11 text-[14px] text-white outline-none transition-[border-color,background-color,box-shadow] duration-200 placeholder:text-white/26 focus:border-[rgba(233,216,179,0.08)] focus:bg-[linear-gradient(180deg,rgba(12,14,20,0.8)_0%,rgba(9,11,16,0.94)_100%)] focus:shadow-[0_0_0_3px_rgba(233,216,179,0.02)]"
      />

      {value ? (
        <button
          type="button"
          onClick={onClear}
          aria-label="Limpiar búsqueda"
          className="absolute right-2 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-white/42 transition-colors duration-200 hover:bg-white/[0.045] hover:text-white/78"
        >
          <X size={15} />
        </button>
      ) : null}
    </div>
  );
}
