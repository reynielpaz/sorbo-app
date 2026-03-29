import { supabase } from '@/lib/supabase';
import type { Category, Product, ProductCustomization, ProductTag } from '@/types';

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
  const { data, error } = await supabase
    .from('products')
    .select(
      'id, category_id, name, description, price, image_url, is_available, is_featured, tags, discount_percent, sort_order, ingredients, customizations, created_at, updated_at'
    )
    .eq('is_featured', true)
    .eq('is_available', true)
    .order('sort_order', { ascending: true });

  if (error) {
    throw new Error('No pudimos cargar los productos destacados.');
  }

  const rows = (data ?? []) as ProductRow[];
  const categoryIds = Array.from(
    new Set(rows.map((row) => row.category_id).filter((value): value is string => Boolean(value)))
  );
  const categoriesById = await getCategoriesByIds(categoryIds);

  return rows.map((row) => mapProductRow(row, row.category_id ? categoriesById.get(row.category_id) : undefined));
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
