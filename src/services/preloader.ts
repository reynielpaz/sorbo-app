import { CACHE_KEYS, setCache } from '@/services/cache';
import { getFeaturedProducts, getCategories } from '@/services/products';
import { getActivePromotions } from '@/services/promotions';
import { preloadImages } from '@/utils/preloadImages';

let preloadPromise: Promise<void> | null = null;
let hasPreloadedHomeData = false;

export async function preloadHomeData(): Promise<void> {
  if (hasPreloadedHomeData) {
    return;
  }

  if (preloadPromise) {
    return preloadPromise;
  }

  preloadPromise = (async () => {
    try {
      const [promotions, products, categories] = await Promise.all([
        getActivePromotions().catch(() => []),
        getFeaturedProducts().catch(() => []),
        getCategories().catch(() => []),
      ]);

      setCache(CACHE_KEYS.PROMOTIONS, promotions);
      setCache(CACHE_KEYS.FEATURED_PRODUCTS, products);
      setCache(CACHE_KEYS.CATEGORIES, categories);

      const imageUrls = Array.from(
        new Set(
          [
            ...promotions.map((promo) => promo.imageUrl),
            ...products.map((product) => product.imageUrl),
            ...categories.map((category) => category.iconUrl),
          ].filter((url): url is string => Boolean(url))
        )
      );

      preloadImages(imageUrls);
      hasPreloadedHomeData = true;
    } catch {
      // Silenciar errores — la precarga es best-effort
    } finally {
      preloadPromise = null;
    }
  })();

  return preloadPromise;
}
