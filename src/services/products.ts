import { supabase } from '@/lib/supabase';
import type { BusinessHours } from '@/features/home/types';
import type { Category, Product, ProductCustomization, ProductTag } from '@/types';
import { normalizeBusinessHours } from '@/utils/businessHours';

interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  icon_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

interface ProductRow {
  id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  price: number | string;
  image_url: string | null;
  is_available: boolean;
  is_featured: boolean;
  tags: string[] | null;
  discount_percent: number | null;
  sort_order: number;
  ingredients: string[] | null;
  customizations: ProductCustomization[] | null;
  created_at: string;
  updated_at: string;
}

interface AppConfigRow<TValue> {
  value: TValue;
}

const VALID_PRODUCT_TAGS: ProductTag[] = ['nuevo', 'popular', 'promo'];
const PRODUCT_SELECT =
  'id, category_id, name, description, price, image_url, is_available, is_featured, tags, discount_percent, sort_order, ingredients, customizations, created_at, updated_at';

function mapCategoryRow(row: CategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    iconUrl: row.icon_url ?? undefined,
    sortOrder: row.sort_order,
    isActive: row.is_active,
    createdAt: row.created_at,
  };
}

function mapProductTags(tags: string[] | null): ProductTag[] {
  if (!Array.isArray(tags)) return [];
  return tags.filter((tag): tag is ProductTag => VALID_PRODUCT_TAGS.includes(tag as ProductTag));
}

function mapProductRow(row: ProductRow, category?: Category): Product {
  return {
    id: row.id,
    categoryId: row.category_id ?? '',
    category,
    name: row.name,
    description: row.description ?? undefined,
    price: Number(row.price),
    imageUrl: row.image_url ?? undefined,
    isAvailable: row.is_available,
    isFeatured: row.is_featured,
    tags: mapProductTags(row.tags),
    discountPercent: row.discount_percent ?? 0,
    sortOrder: row.sort_order,
    ingredients: row.ingredients ?? undefined,
    customizations: row.customizations ?? [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function sortProducts(products: Product[], options?: { groupByCategory?: boolean }) {
  const shouldGroupByCategory = options?.groupByCategory ?? false;

  return [...products].sort((left, right) => {
    if (shouldGroupByCategory) {
      const categorySortDifference =
        (left.category?.sortOrder ?? Number.MAX_SAFE_INTEGER) -
        (right.category?.sortOrder ?? Number.MAX_SAFE_INTEGER);

      if (categorySortDifference !== 0) {
        return categorySortDifference;
      }
    }

    const productSortDifference = left.sortOrder - right.sortOrder;

    if (productSortDifference !== 0) {
      return productSortDifference;
    }

    return left.name.localeCompare(right.name, 'es', { sensitivity: 'base' });
  });
}

function normalizeRecommendationText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function getProductCategorySlug(product: Product): string {
  return normalizeRecommendationText(product.category?.slug ?? '');
}

function getProductCategoryName(product: Product): string {
  return normalizeRecommendationText(product.category?.name ?? '');
}

function includesAnyKeyword(value: string, keywords: string[]) {
  return keywords.some((keyword) => value.includes(keyword));
}

function isDrinkProduct(product: Product): boolean {
  const categorySlug = getProductCategorySlug(product);
  const categoryName = getProductCategoryName(product);
  const productName = normalizeRecommendationText(product.name);
  const drinkCategoryKeywords = [
    'bebidas',
    'bebida',
    'cocteles',
    'coctel',
    'cafe',
  ];
  const drinkNameKeywords = [
    'agua',
    'refresco',
    'gatorade',
    'cafe',
    'jugo',
    'te',
    'cocacola',
    'coca cola',
    'coca-cola',
    'pepsi',
  ];

  return (
    includesAnyKeyword(categorySlug, drinkCategoryKeywords) ||
    includesAnyKeyword(categoryName, drinkCategoryKeywords) ||
    includesAnyKeyword(productName, drinkNameKeywords)
  );
}

function isSideOrComplementProduct(product: Product): boolean {
  const categorySlug = getProductCategorySlug(product);
  const categoryName = getProductCategoryName(product);
  const productName = normalizeRecommendationText(product.name);
  const sideCategoryKeywords = ['menu-kids', 'menu kids', 'kids', 'especiales'];
  const sideNameKeywords = ['tequenos', 'nuggets', 'papas', 'postre', 'ensalada'];

  return (
    includesAnyKeyword(categorySlug, sideCategoryKeywords) ||
    includesAnyKeyword(categoryName, sideCategoryKeywords) ||
    includesAnyKeyword(productName, sideNameKeywords)
  );
}

function isMainFoodProduct(product: Product): boolean {
  const categorySlug = getProductCategorySlug(product);
  const categoryName = getProductCategoryName(product);
  const productName = normalizeRecommendationText(product.name);
  const mainFoodCategoryKeywords = [
    'hamburguesas',
    'perros calientes',
    'perros-calientes',
    'patacones',
    'ensaladas',
    'especiales',
    'menu-kids',
    'menu kids',
  ];
  const mainFoodNameKeywords = [
    'burger',
    'hamburguesa',
    'sorbo',
    'perro',
    'hotdog',
    'hot dog',
    'tradicional',
    'especial',
    'patacon',
    'ensalada',
    'cobb',
    'cesar',
  ];

  return (
    includesAnyKeyword(categorySlug, mainFoodCategoryKeywords) ||
    includesAnyKeyword(categoryName, mainFoodCategoryKeywords) ||
    includesAnyKeyword(productName, mainFoodNameKeywords)
  );
}

function getAddOnRecommendationScore(product: Product): number {
  if (isDrinkProduct(product)) return 0;
  if (isSideOrComplementProduct(product)) return 1;
  if (isMainFoodProduct(product)) return 2;
  if (
    product.isFeatured ||
    product.tags.includes('popular') ||
    product.tags.includes('nuevo')
  ) {
    return 2;
  }

  return 3;
}

function sortRecommendedAddOns(products: Product[]): Product[] {
  return [...products].sort((left, right) => {
    const scoreDifference = getAddOnRecommendationScore(left) - getAddOnRecommendationScore(right);

    if (scoreDifference !== 0) {
      return scoreDifference;
    }

    const sortOrderDifference = left.sortOrder - right.sortOrder;

    if (sortOrderDifference !== 0) {
      return sortOrderDifference;
    }

    return left.name.localeCompare(right.name, 'es', { sensitivity: 'base' });
  });
}

interface GetProductsOptions {
  errorMessage: string;
  onlyAvailable?: boolean;
  onlyFeatured?: boolean;
  groupByCategory?: boolean;
  productId?: string;
}

async function getProducts(options: GetProductsOptions): Promise<Product[]> {
  let query = supabase.from('products').select(PRODUCT_SELECT);

  if (options.productId) {
    query = query.eq('id', options.productId);
  }

  if (options.onlyAvailable) {
    query = query.eq('is_available', true);
  }

  if (options.onlyFeatured) {
    query = query.eq('is_featured', true);
  }

  const { data, error } = await query
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true });

  if (error) {
    throw new Error(options.errorMessage);
  }

  const rows = (data ?? []) as ProductRow[];
  const categoryIds = Array.from(
    new Set(rows.map((row) => row.category_id).filter((value): value is string => Boolean(value)))
  );
  const categoriesById = await getCategoriesByIds(categoryIds);
  const products = rows.map((row) =>
    mapProductRow(row, row.category_id ? categoriesById.get(row.category_id) : undefined)
  );

  return sortProducts(products, { groupByCategory: options.groupByCategory });
}

async function getCategoriesByIds(categoryIds: string[]) {
  if (categoryIds.length === 0) {
    return new Map<string, Category>();
  }

  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug, icon_url, sort_order, is_active, created_at')
    .in('id', categoryIds);

  if (error) {
    throw new Error('No pudimos cargar las categorías de los productos.');
  }

  const rows = (data ?? []) as CategoryRow[];

  return new Map(rows.map((row) => [row.id, mapCategoryRow(row)]));
}

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug, icon_url, sort_order, is_active, created_at')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    throw new Error('No pudimos cargar las categorías.');
  }

  const rows = (data ?? []) as CategoryRow[];
  return rows.map(mapCategoryRow);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return getProducts({
    errorMessage: 'No pudimos cargar los productos destacados.',
    onlyAvailable: true,
    onlyFeatured: true,
  });
}

export async function getAvailableProducts(): Promise<Product[]> {
  return getProducts({
    errorMessage: 'No pudimos cargar el menú.',
    onlyAvailable: true,
    groupByCategory: true,
  });
}

export async function getProductAddOns(productId: string, limit = 10): Promise<Product[]> {
  const products = await getAvailableProducts();
  const recommendationLimit = Math.max(0, limit);
  const candidates = products.filter((product) => product.id !== productId);

  if (recommendationLimit === 0) {
    return [];
  }

  const recommendedProducts = sortRecommendedAddOns(candidates);
  const recommendations: Product[] = [];
  const recommendedProductIds = new Set<string>();

  function addUniqueProducts(nextProducts: Product[], maxItems: number) {
    for (const product of nextProducts) {
      if (recommendations.length >= recommendationLimit || maxItems <= 0) {
        return;
      }

      if (recommendedProductIds.has(product.id)) {
        continue;
      }

      recommendations.push(product);
      recommendedProductIds.add(product.id);
      maxItems -= 1;
    }
  }

  const drinkProducts = recommendedProducts.filter(isDrinkProduct);
  const sideOrComplementProducts = recommendedProducts.filter(
    (product) => !isDrinkProduct(product) && isSideOrComplementProduct(product)
  );
  const mainFoodProducts = recommendedProducts.filter(
    (product) =>
      !isDrinkProduct(product) &&
      !isSideOrComplementProduct(product) &&
      isMainFoodProduct(product)
  );
  const remainingProducts = recommendedProducts.filter(
    (product) =>
      !isDrinkProduct(product) &&
      !isSideOrComplementProduct(product) &&
      !isMainFoodProduct(product)
  );

  addUniqueProducts(drinkProducts, 4);
  addUniqueProducts(sideOrComplementProducts, 2);
  addUniqueProducts(mainFoodProducts, 4);
  addUniqueProducts(remainingProducts, recommendationLimit - recommendations.length);
  addUniqueProducts(
    recommendedProducts,
    recommendationLimit - recommendations.length
  );

  if (recommendations.length === 0) {
    return candidates.slice(0, recommendationLimit);
  }

  return recommendations;
}

export async function getProductById(id: string): Promise<Product | null> {
  const [product] = await getProducts({
    errorMessage: 'No pudimos cargar este producto.',
    productId: id,
  });

  return product ?? null;
}

export async function getAppConfig<TValue = unknown>(key: string): Promise<TValue | null> {
  const { data, error } = await supabase
    .from('app_config')
    .select('value')
    .eq('key', key)
    .maybeSingle();

  if (error) {
    throw new Error(`No pudimos cargar la configuración "${key}".`);
  }

  const row = data as AppConfigRow<TValue> | null;
  return row?.value ?? null;
}

export async function getBusinessHoursConfig(): Promise<BusinessHours> {
  const config = await getAppConfig('business_hours');
  return normalizeBusinessHours(config);
}
