import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById } from '@/services/products';
import type { Product } from '@/types';

const DEFAULT_ERROR_MESSAGE = 'No pudimos cargar este producto.';

export function useProductDetails() {
  const { id } = useParams<{ id: string }>();
  const productId = id?.trim() ?? '';
  const [product, setProduct] = useState<Product | null>(null);
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

      const nextProduct = await getProductById(productId);
      setProduct(nextProduct);
    } catch (loadError) {
      setProduct(null);
      setError(loadError instanceof Error ? loadError.message : DEFAULT_ERROR_MESSAGE);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    void loadProduct();
  }, [loadProduct]);

  return {
    productId: productId || null,
    product,
    loading,
    error,
    notFound: !loading && !error && !product,
    reload: loadProduct,
  };
}
