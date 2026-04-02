import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui';
import { useCategories } from '../hooks/useCategories';
import { ROUTES } from '@/utils/constants';

export function CategorySlider() {
  const navigate = useNavigate();
  const { categories, loading, error } = useCategories();
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  function handleCategoryClick(slug: string) {
    setActiveSlug(slug);
    navigate(`${ROUTES.MENU}?category=${slug}`);
  }

  return (
    <section className="mt-5 px-5">
      <div className="mb-2.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="h-px w-5 bg-[linear-gradient(90deg,rgba(212,168,83,0.2),rgba(212,168,83,0.76))]" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/74">Explorar</p>
        </div>

        <Link
          to={ROUTES.MENU}
          className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#D4A853]/88 transition-colors duration-200 hover:text-[#E8D6AD]"
        >
          Ver menú →
        </Link>
      </div>

      {loading ? (
        <div className="hide-scrollbar flex gap-2 overflow-x-auto">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-[38px] w-[118px] rounded-full" rounded={false} />
          ))}
        </div>
      ) : error ? (
        <p className="text-sm text-sorbo-red">{error}</p>
      ) : (
        <div className="hide-scrollbar flex gap-2 overflow-x-auto pb-0.5">
          {categories.map((category) => {
            const isActive = activeSlug === category.slug;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => handleCategoryClick(category.slug)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-[background,border-color,color,box-shadow] duration-200 ${
                  isActive
                    ? 'border-[rgba(232,214,173,0.24)] bg-[linear-gradient(135deg,rgba(240,209,149,0.34)_0%,rgba(212,168,83,0.24)_55%,rgba(124,84,34,0.14)_100%)] text-white shadow-[0_8px_18px_rgba(0,0,0,0.14),0_0_14px_rgba(212,168,83,0.06),inset_0_1px_0_rgba(255,255,255,0.1)]'
                    : 'border-[rgba(255,255,255,0.09)] bg-[linear-gradient(180deg,rgba(70,56,43,0.52)_0%,rgba(22,18,15,0.94)_100%)] text-white/86 hover:border-[rgba(212,168,83,0.16)] hover:text-white/94'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`h-1 w-1 rounded-full transition-colors duration-200 ${
                    isActive ? 'bg-[#F2D8A2]' : 'bg-[#D4A853]/46'
                  }`}
                />
                <span className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.16em]">
                  {category.name}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
