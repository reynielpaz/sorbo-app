import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { getProductById } from '@/services/products';
import type { Product } from '@/types';

const DEFAULT_ERROR_MESSAGE = 'No pudimos cargar este producto.';

interface ProductRouteState {
  productSnapshot?: Product;
}

export function useProductDetails() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const productId = id?.trim() ?? '';
  const snapshotProduct = useMemo(() => {
    const routeState = location.state as ProductRouteState | null;
    const candidate = routeState?.productSnapshot;

    return candidate?.id === productId ? candidate : null;
  }, [location.state, productId]);
  const [product, setProduct] = useState<Product | null>(snapshotProduct);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProduct = useCallback(async () => {
    if (!productId) {
      setProduct(null);
      setError(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setProduct((currentProduct) =>
        currentProduct?.id === productId ? currentProduct : snapshotProduct
      );

      const nextProduct = await getProductById(productId);
      setProduct(nextProduct);
    } catch (loadError) {
      setProduct(null);
      setError(loadError instanceof Error ? loadError.message : DEFAULT_ERROR_MESSAGE);
    } finally {
      setLoading(false);
    }
  }, [productId, snapshotProduct]);

  useEffect(() => {
    void loadProduct();
  }, [loadProduct]);

  return {
    productId: productId || null,
    product,
    snapshotProduct,
    loading,
    error,
    notFound: !loading && !error && !product,
    reload: loadProduct,
  };
}
