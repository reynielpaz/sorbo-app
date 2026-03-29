import { useEffect, useState } from 'react';
import { getCategories } from '@/services/products';
import type { Category } from '@/types';

interface UseCategoriesState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

export function useCategories(): UseCategoriesState {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadCategories() {
      try {
        const data = await getCategories();

        if (!active) return;

        setCategories(data);
        setError(null);
      } catch (loadError) {
        if (!active) return;

        const message =
          loadError instanceof Error ? loadError.message : 'No pudimos cargar las categorías.';

        setError(message);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadCategories();

    return () => {
      active = false;
    };
  }, []);

  return { categories, loading, error };
}
