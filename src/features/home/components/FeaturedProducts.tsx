import { Link } from 'react-router-dom';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductCardSkeleton } from '@/components/ui';
import { useFeaturedProducts } from '../hooks/useFeaturedProducts';
import { ROUTES } from '@/utils/constants';

export function FeaturedProducts() {
  const { products, loading, error } = useFeaturedProducts();

  return (
    <section className="mt-7">
      <div className="mb-4 flex items-center justify-between gap-3 px-5">
        <h2 className="font-playfair text-[14px] font-semibold text-white/90">Lo más pedido</h2>
        <Link to={ROUTES.MENU} className="text-[11px] font-medium text-[#D4A853]">
          Ver todo →
        </Link>
      </div>

      {loading ? (
        <div className="hide-scrollbar flex gap-3 overflow-x-auto px-5">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="w-[230px] shrink-0">
              <ProductCardSkeleton />
            </div>
          ))}
        </div>
      ) : error ? (
        <p className="px-5 text-sm text-sorbo-red">{error}</p>
      ) : products.length === 0 ? (
        <p className="px-5 text-sm text-white/50">No hay productos destacados disponibles.</p>
      ) : (
        <div className="hide-scrollbar flex gap-3 overflow-x-auto px-5">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      )}
    </section>
  );
}
