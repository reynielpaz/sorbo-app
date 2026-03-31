import { useEffect, useState } from 'react';
import { CACHE_KEYS, getCached } from '@/services/cache';
import { getFeaturedProducts } from '@/services/products';
import type { Product } from '@/types';

interface UseFeaturedProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

export function useFeaturedProducts(): UseFeaturedProductsState {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadFeaturedProducts() {
      try {
        const cached = getCached<Product[]>(CACHE_KEYS.FEATURED_PRODUCTS);
        if (cached && cached.length > 0) {
          if (active) {
            setProducts(cached);
            setError(null);
            setLoading(false);
          }
          return;
        }

        const data = await getFeaturedProducts();

        if (!active) return;

        setProducts(data);
        setError(null);
      } catch (loadError) {
        if (!active) return;

        const message =
          loadError instanceof Error
            ? loadError.message
            : 'No pudimos cargar los productos destacados.';

        setError(message);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadFeaturedProducts();

    return () => {
      active = false;
    };
  }, []);

  return { products, loading, error };
}
