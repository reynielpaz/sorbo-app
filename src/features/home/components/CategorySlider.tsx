import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui';
import { useCategories } from '../hooks/useCategories';
import { getCategoryIcon, ROUTES } from '@/utils/constants';

export function CategorySlider() {
  const navigate = useNavigate();
  const { categories, loading, error } = useCategories();

  return (
    <section className="mx-3 mt-4 rounded-[24px] border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] p-4 shadow-[0_8px_32px_rgba(0,0,0,0.2)] backdrop-blur-xl">
      <p className="mb-3.5 font-playfair text-[14px] font-semibold text-white/90">Categorías</p>

      {loading ? (
        <div className="hide-scrollbar flex gap-2.5 overflow-x-auto">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex w-[62px] shrink-0 flex-col items-center text-center">
              <Skeleton className="h-[54px] w-[54px] rounded-[16px]" rounded={false} />
              <Skeleton className="mt-1.5 h-2.5 w-12" />
            </div>
          ))}
        </div>
      ) : error ? (
        <p className="text-sm text-sorbo-red">{error}</p>
      ) : (
        <div className="hide-scrollbar flex gap-2.5 overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => navigate(`${ROUTES.MENU}?category=${category.slug}`)}
              className="flex w-[62px] shrink-0 flex-col items-center text-center"
            >
              <div className="flex h-[54px] w-[54px] items-center justify-center rounded-[16px] border border-white/10 bg-[rgba(255,255,255,0.07)] text-[24px]">
                {getCategoryIcon(category.slug)}
              </div>
              <span className="mt-1.5 line-clamp-2 text-[10px] text-white/50">{category.name}</span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
