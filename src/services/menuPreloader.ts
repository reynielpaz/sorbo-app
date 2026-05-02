import { CACHE_KEYS, getCached, setCache } from '@/services/cache';
import { getAvailableProducts, getCategories } from '@/services/products';
import type { Category, Product } from '@/types';
import { preloadImages } from '@/utils/preloadImages';

let preloadPromise: Promise<void> | null = null;
let hasPreloadedMenuData = false;

export function preloadMenuData(): Promise<void> {
  if (hasPreloadedMenuData) return Promise.resolve();
  if (preloadPromise) return preloadPromise;

  preloadPromise = (async () => {
    try {
      const cachedCategories = getCached<Category[]>(CACHE_KEYS.CATEGORIES);
      const cachedProducts = getCached<Product[]>(CACHE_KEYS.MENU_PRODUCTS);

      const [categories, products] = await Promise.all([
        cachedCategories?.length ? Promise.resolve(cachedCategories) : getCategories(),
        cachedProducts?.length ? Promise.resolve(cachedProducts) : getAvailableProducts(),
      ]);

      setCache(CACHE_KEYS.CATEGORIES, categories);
      setCache(CACHE_KEYS.MENU_PRODUCTS, products);

      const imageUrls = products
        .slice(0, 10)
        .map((product) => product.imageUrl)
        .filter((url): url is string => Boolean(url));

      preloadImages(imageUrls);

      hasPreloadedMenuData = true;
    } catch {
      // best-effort: no romper Home
    } finally {
      preloadPromise = null;
    }
  })();

  return preloadPromise;
}
