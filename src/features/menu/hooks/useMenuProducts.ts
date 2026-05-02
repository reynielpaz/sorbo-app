import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CACHE_KEYS, getCached, setCache } from '@/services/cache';
import { getAvailableProducts, getCategories } from '@/services/products';
import type { Category, Product } from '@/types';
import { preloadImages } from '@/utils/preloadImages';

const PRELOADED_MENU_IMAGE_URLS = new Set<string>();

interface LoadMenuDataOptions {
  ignoreCache?: boolean;
}

interface LoadMenuDataResult {
  categories: Category[];
  products: Product[];
}

async function loadMenuData(options: LoadMenuDataOptions = {}): Promise<LoadMenuDataResult> {
  const shouldIgnoreCache = options.ignoreCache ?? false;
  const cachedCategories = shouldIgnoreCache ? null : getCached<Category[]>(CACHE_KEYS.CATEGORIES);
  const cachedProducts = shouldIgnoreCache ? null : getCached<Product[]>(CACHE_KEYS.MENU_PRODUCTS);

  const [categories, products] = await Promise.all([
    cachedCategories && cachedCategories.length > 0 ? Promise.resolve(cachedCategories) : getCategories(),
    cachedProducts && cachedProducts.length > 0 ? Promise.resolve(cachedProducts) : getAvailableProducts(),
  ]);

  setCache(CACHE_KEYS.CATEGORIES, categories);
  setCache(CACHE_KEYS.MENU_PRODUCTS, products);

  return { categories, products };
}

interface UseMenuProductsState {
  categories: Category[];
  products: Product[];
  filteredProducts: Product[];
  activeCategory: Category | null;
  activeCategorySlug: string | null;
  searchQuery: string;
  loading: boolean;
  error: string | null;
  totalProducts: number;
  resultsCount: number;
  hasActiveFilters: boolean;
  countsByCategory: Record<string, number>;
  setActiveCategory: (slug: string | null) => void;
  setSearchQuery: (value: string) => void;
  clearSearch: () => void;
  clearFilters: () => void;
  reload: () => Promise<void>;
}

function normalizeSearchValue(value?: string | null) {
  if (!value) return '';

  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[-_/]+/g, ' ')
    .toLocaleLowerCase('es')
    .trim();
}

function buildProductSearchHaystack(product: Product) {
  return normalizeSearchValue(
    [
      product.name,
      product.category?.name,
      product.category?.slug,
      product.description,
      product.ingredients?.join(' '),
    ]
      .filter(Boolean)
      .join(' ')
  );
}

export function useMenuProducts(): UseMenuProductsState {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const activeCategorySlug = searchParams.get('category')?.trim() || null;
  const normalizedSearchQuery = normalizeSearchValue(searchQuery);
  const searchTerms = normalizedSearchQuery.split(/\s+/).filter(Boolean);
  const activeCategory = categories.find((category) => category.slug === activeCategorySlug) ?? null;

  useEffect(() => {
    let active = true;

    async function hydrateMenu() {
      try {
        const data = await loadMenuData();

        if (!active) return;

        setCategories(data.categories);
        setProducts(data.products);
        setError(null);
      } catch (loadError) {
        if (!active) return;

        const message = loadError instanceof Error ? loadError.message : 'No pudimos cargar el menú.';

        setError(message);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void hydrateMenu();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!activeCategorySlug || loading || error || categories.length === 0) {
      return;
    }

    if (activeCategory) {
      return;
    }

    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        next.delete('category');
        return next;
      },
      { replace: true }
    );
  }, [activeCategory, activeCategorySlug, categories.length, error, loading, setSearchParams]);

  const countsByCategory = products.reduce<Record<string, number>>((accumulator, product) => {
    const slug = product.category?.slug;

    if (!slug) {
      return accumulator;
    }

    accumulator[slug] = (accumulator[slug] ?? 0) + 1;
    return accumulator;
  }, {});

  const filteredProducts = products.filter((product) => {
    const matchesCategory = !activeCategorySlug || product.category?.slug === activeCategorySlug;
    const searchableText = searchTerms.length > 0 ? buildProductSearchHaystack(product) : '';
    const matchesSearch =
      searchTerms.length === 0 || searchTerms.every((term) => searchableText.includes(term));

    return matchesCategory && matchesSearch;
  });

  useEffect(() => {
    if (loading || error || filteredProducts.length === 0) {
      return;
    }

    const imageUrls = filteredProducts
      .slice(0, 6)
      .map((product) => product.imageUrl)
      .filter((url): url is string => Boolean(url))
      .filter((url) => !PRELOADED_MENU_IMAGE_URLS.has(url));

    if (imageUrls.length === 0) {
      return;
    }

    imageUrls.forEach((url) => PRELOADED_MENU_IMAGE_URLS.add(url));
    preloadImages(imageUrls);
  }, [error, filteredProducts, loading]);

  async function reload() {
    setLoading(true);

    try {
      const data = await loadMenuData({ ignoreCache: true });

      setCategories(data.categories);
      setProducts(data.products);
      setError(null);
    } catch (loadError) {
      const message = loadError instanceof Error ? loadError.message : 'No pudimos cargar el menú.';

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  function setActiveCategory(slug: string | null) {
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);

        if (slug) {
          next.set('category', slug);
        } else {
          next.delete('category');
        }

        return next;
      },
      { replace: true }
    );
  }

  function clearSearch() {
    setSearchQuery('');
  }

  function clearFilters() {
    clearSearch();
    setActiveCategory(null);
  }

  return {
    categories,
    products,
    filteredProducts,
    activeCategory,
    activeCategorySlug,
    searchQuery,
    loading,
    error,
    totalProducts: products.length,
    resultsCount: filteredProducts.length,
    hasActiveFilters: Boolean(activeCategorySlug) || normalizedSearchQuery.length > 0,
    countsByCategory,
    setActiveCategory,
    setSearchQuery,
    clearSearch,
    clearFilters,
    reload,
  };
}
