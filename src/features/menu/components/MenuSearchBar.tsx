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
    <div className="relative rounded-[18px] border border-white/[0.045] bg-black/[0.24] px-0.5 py-0.5">
      <Search
        size={14}
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/36"
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
        className="h-10 w-full rounded-[17px] border border-transparent bg-[rgba(5,7,11,0.72)] pl-10 pr-10 text-[14px] text-white/90 outline-none transition-[border-color,background-color] duration-200 placeholder:text-white/38 focus:border-white/[0.045] focus:bg-black/[0.32]"
      />

      {value ? (
        <button
          type="button"
          onClick={onClear}
          aria-label="Limpiar búsqueda"
          className="absolute right-2 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-white/42 transition-colors duration-200 hover:bg-black/[0.32] hover:text-white/78"
        >
          <X size={15} />
        </button>
      ) : null}
    </div>
  );
}
