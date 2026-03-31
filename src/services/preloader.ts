import { CACHE_KEYS, setCache } from '@/services/cache';
import { getFeaturedProducts, getCategories } from '@/services/products';
import { getActivePromotions } from '@/services/promotions';
import { preloadImages } from '@/utils/preloadImages';

export async function preloadHomeData(): Promise<void> {
  try {
    const [promotions, products, categories] = await Promise.all([
      getActivePromotions().catch(() => []),
      getFeaturedProducts().catch(() => []),
      getCategories().catch(() => []),
    ]);

    setCache(CACHE_KEYS.PROMOTIONS, promotions);
    setCache(CACHE_KEYS.FEATURED_PRODUCTS, products);
    setCache(CACHE_KEYS.CATEGORIES, categories);

    const imageUrls: string[] = [];

    promotions.forEach((promo) => {
      if (promo.imageUrl) {
        imageUrls.push(promo.imageUrl);
      }
    });

    products.forEach((product) => {
      if (product.imageUrl) {
        imageUrls.push(product.imageUrl);
      }
    });

    categories.forEach((category) => {
      if (category.iconUrl) {
        imageUrls.push(category.iconUrl);
      }
    });

    preloadImages(imageUrls);
  } catch {
    // Silenciar errores — la precarga es best-effort
  }
}
