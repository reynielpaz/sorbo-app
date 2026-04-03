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
        'inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition-[border-color,background,color,box-shadow] duration-200',
        isActive
          ? 'border-white/[0.09] bg-[linear-gradient(180deg,rgba(255,255,255,0.08)_0%,rgba(18,20,28,0.86)_100%)] text-white shadow-[0_10px_18px_rgba(0,0,0,0.14),inset_0_1px_0_rgba(255,255,255,0.06)]'
          : 'border-white/[0.05] bg-[linear-gradient(180deg,rgba(255,255,255,0.03)_0%,rgba(12,15,22,0.72)_100%)] text-white/58 hover:border-white/[0.08] hover:text-white/86 hover:shadow-[0_8px_18px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.04)]'
      )}
    >
      {isActive ? <span className="h-1.5 w-1.5 rounded-full bg-[#F0E4C8]/82" /> : null}

      <span className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.16em]">
        {label}
      </span>

      {typeof count === 'number' && count > 0 ? (
        <span
          className={cn(
            'rounded-full px-1.5 py-0.5 text-[9px] font-medium',
            isActive ? 'bg-white/[0.06] text-[#F0E4C8]' : 'bg-white/[0.04] text-white/40'
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
    <div className="rounded-[22px] border border-white/[0.045] bg-[linear-gradient(180deg,rgba(255,255,255,0.03)_0%,rgba(255,255,255,0.012)_100%)] p-1.5 shadow-[0_10px_18px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.03)]">
      <div className="hide-scrollbar flex gap-2 overflow-x-auto pb-0.5">
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
