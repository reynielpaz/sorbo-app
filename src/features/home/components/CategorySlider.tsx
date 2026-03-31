import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui';
import { useCategories } from '../hooks/useCategories';
import { getCategoryIcon, ROUTES } from '@/utils/constants';

export function CategorySlider() {
  const navigate = useNavigate();
  const { categories, loading, error } = useCategories();
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  function handleCategoryClick(slug: string) {
    setActiveSlug(slug);
    navigate(`${ROUTES.MENU}?category=${slug}`);
  }

  return (
    <section className="mt-6 px-5">
      <p className="mb-3 font-playfair text-[14px] font-semibold text-white/90">Categorías</p>

      {loading ? (
        <div className="hide-scrollbar flex gap-2.5 overflow-x-auto">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-[40px] w-[110px] rounded-full" rounded={false} />
          ))}
        </div>
      ) : error ? (
        <p className="text-sm text-sorbo-red">{error}</p>
      ) : (
        <div className="hide-scrollbar flex gap-2.5 overflow-x-auto">
          {categories.map((category) => {
            const isActive = activeSlug === category.slug;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => handleCategoryClick(category.slug)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-[12px] font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-[#E8943A] text-white'
                    : 'border border-white/[0.08] bg-white/[0.04] text-white/70'
                }`}
              >
                <span className="text-[16px] leading-none">{getCategoryIcon(category.slug)}</span>
                {category.name}
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}