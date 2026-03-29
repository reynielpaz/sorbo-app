import { Link } from 'react-router-dom';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductCardSkeleton } from '@/components/ui';
import { useFeaturedProducts } from '../hooks/useFeaturedProducts';
import { ROUTES } from '@/utils/constants';

export function FeaturedProducts() {
  const { products, loading, error } = useFeaturedProducts();

  return (
    <section className="mx-3 mt-4 rounded-[24px] border border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.02)] p-4 shadow-[0_8px_32px_rgba(0,0,0,0.2)] backdrop-blur-xl">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="font-playfair text-[14px] font-semibold text-white/90">Lo más pedido</h2>
        <Link to={ROUTES.MENU} className="text-[11px] font-medium text-[#A78BFA]">
          Ver todo →
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-2.5">
          {Array.from({ length: 2 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      ) : error ? (
        <p className="text-sm text-sorbo-red">{error}</p>
      ) : products.length === 0 ? (
        <p className="text-sm text-white/50">No hay productos destacados disponibles.</p>
      ) : (
        <div className="grid grid-cols-2 gap-2.5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
