const cache = new Map<string, unknown>();

/**
 * Obtiene datos del caché. Retorna null si no hay datos para esa clave.
 */
export function getCached<T>(key: string): T | null {
  if (!cache.has(key)) return null;
  return cache.get(key) as T;
}

/**
 * Guarda datos en el caché.
 */
export function setCache<T>(key: string, data: T): void {
  cache.set(key, data);
}

/**
 * Claves usadas en la app.
 */
export const CACHE_KEYS = {
  PROMOTIONS: 'home:promotions',
  FEATURED_PRODUCTS: 'home:featuredProducts',
  CATEGORIES: 'home:categories',
} as const;
