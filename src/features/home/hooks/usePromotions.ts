import { useEffect, useState } from 'react';
import { getActivePromotions } from '@/services/promotions';
import type { PromotionBannerItem } from '@/types';

interface UsePromotionsState {
  promotions: PromotionBannerItem[];
  loading: boolean;
  error: string | null;
}

export function usePromotions(): UsePromotionsState {
  const [promotions, setPromotions] = useState<PromotionBannerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadPromotions() {
      try {
        const data = await getActivePromotions();

        if (cancelled) return;

        setPromotions(data);
        setError(null);
      } catch {
        if (cancelled) return;

        setError('Error al cargar las promociones');
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadPromotions();

    return () => {
      cancelled = true;
    };
  }, []);

  return { promotions, loading, error };
}
