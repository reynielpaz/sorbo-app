import type { Category } from '@/types';
import { cn } from '@/utils/cn';

interface MenuCategoryRailProps {
  categories: Category[];
  activeCategorySlug: string | null;
  countsByCategory: Record<string, number>;
  totalCount: number;
  onSelect: (slug: string | null) => void;
}

interface RailChipProps {
  label: string;
  count?: number;
  isActive: boolean;
  onClick: () => void;
}

function RailChip({ label, count, isActive, onClick }: RailChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3 text-left transition-[border-color,background,color,transform] duration-200 hover:-translate-y-px',
        isActive
          ? 'border-[rgba(212,168,83,0.3)] bg-[linear-gradient(135deg,#E8C068_0%,#D4A853_48%,#B8923A_100%)] text-[#120E09] shadow-[0_6px_12px_rgba(0,0,0,0.1)]'
          : 'border-white/[0.04] bg-[#05070B]/60 text-white/55 hover:border-white/[0.045] hover:bg-black/[0.32] hover:text-white/82'
      )}
    >
      {isActive ? <span className="h-1.5 w-1.5 rounded-full bg-[#120E09]/70" /> : null}

      <span className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.14em]">
        {label}
      </span>

      {typeof count === 'number' && count > 0 ? (
        <span
          className={cn(
            'border-l pl-1.5 text-[9px] font-medium',
            isActive ? 'border-[#120E09]/16 text-[#120E09]/62' : 'border-white/[0.04] text-white/40'
          )}
        >
          {count}
        </span>
      ) : null}
    </button>
  );
}

export function MenuCategoryRail({
  categories,
  activeCategorySlug,
  countsByCategory,
  totalCount,
  onSelect,
}: MenuCategoryRailProps) {
  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="relative -mx-1">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-5 bg-[linear-gradient(90deg,rgba(5,7,11,0.96)_0%,rgba(5,7,11,0)_100%)]" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-5 bg-[linear-gradient(270deg,rgba(5,7,11,0.96)_0%,rgba(5,7,11,0)_100%)]" />

      <div className="hide-scrollbar flex gap-2 overflow-x-auto px-1 py-0.5">
        <RailChip
          label="Todo"
          count={totalCount}
          isActive={!activeCategorySlug}
          onClick={() => onSelect(null)}
        />

        {categories.map((category) => (
          <RailChip
            key={category.id}
            label={category.name}
            count={countsByCategory[category.slug]}
            isActive={activeCategorySlug === category.slug}
            onClick={() => onSelect(category.slug)}
          />
        ))}
      </div>
    </div>
  );
}
