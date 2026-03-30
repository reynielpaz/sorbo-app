import { supabase } from '@/lib/supabase';
import type { Promotion, PromotionBannerItem } from '@/types';
import { formatPrice } from '@/utils/formatPrice';

interface PromotionRow {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  discount_type: string | null;
  discount_value: number | string | null;
  product_ids: string[] | null;
  is_active: boolean;
  starts_at: string | null;
  ends_at: string | null;
}

interface ProductPriceRow {
  id: string;
  name: string;
  price: number | string;
  image_url: string | null;
}

interface PriceLabels {
  priceLabel?: string;
  originalPriceLabel?: string;
}

const HERO_FALLBACK_IMAGE = '/images/hero/hero-burger-splash.png';

function normalizeNumber(value: number | string | null | undefined) {
  if (value === null || value === undefined) return null;

  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : null;
}

function isNonEmptyString(value: string | null | undefined): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function mapDiscountType(value: string | null): Promotion['discountType'] {
  if (value === 'percent' || value === 'fixed' || value === 'combo') {
    return value;
  }

  return null;
}

function mapPromotionRow(row: PromotionRow): Promotion {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    imageUrl: row.image_url,
    discountType: mapDiscountType(row.discount_type),
    discountValue: normalizeNumber(row.discount_value),
    productIds: row.product_ids ?? [],
    isActive: row.is_active,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
  };
}

function parseDate(value: string | null) {
  if (!value) return null;

  const parsedDate = new Date(value);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
}

function isPromotionCurrent(promotion: Promotion, now: Date) {
  const startsAt = parseDate(promotion.startsAt);
  const endsAt = parseDate(promotion.endsAt);

  if (startsAt && startsAt > now) return false;
  if (endsAt && endsAt < now) return false;

  return true;
}

function buildBadgeLabel(promotion: Promotion): string {
  if (promotion.discountType === 'percent' && promotion.discountValue !== null) {
    return `-${promotion.discountValue}%`;
  }

  if (promotion.discountType === 'fixed' && promotion.discountValue !== null) {
    return `Ahorra ${formatPrice(promotion.discountValue)}`;
  }

  if (promotion.discountType === 'combo') {
    return 'Combo especial';
  }

  return 'Promo especial';
}

function buildPriceLabels(promotion: Promotion, basePrice?: number): PriceLabels {
  if (basePrice === undefined) {
    return {};
  }

  if (promotion.discountType === 'percent' && promotion.discountValue !== null) {
    const discountedPrice = basePrice * (1 - promotion.discountValue / 100);

    return {
      priceLabel: formatPrice(discountedPrice),
      originalPriceLabel: formatPrice(basePrice),
    };
  }

  if (promotion.discountType === 'fixed' && promotion.discountValue !== null) {
    const discountedPrice = Math.max(0, basePrice - promotion.discountValue);

    return {
      priceLabel: formatPrice(discountedPrice),
      originalPriceLabel: formatPrice(basePrice),
    };
  }

  if (promotion.discountType === 'combo') {
    return {
      priceLabel: `Desde ${formatPrice(basePrice)}`,
    };
  }

  return {
    priceLabel: formatPrice(basePrice),
  };
}

function resolveImageUrl(...candidates: Array<string | null | undefined>) {
  return candidates.find(isNonEmptyString) ?? HERO_FALLBACK_IMAGE;
}

async function getProductsByIds(productIds: string[]) {
  if (productIds.length === 0) {
    return new Map<string, ProductPriceRow>();
  }

  const { data, error } = await supabase
    .from('products')
    .select('id, name, price, image_url')
    .in('id', productIds);

  if (error) {
    throw new Error('No pudimos cargar los productos relacionados de las promociones.');
  }

  const rows = (data ?? []) as ProductPriceRow[];

  return new Map(rows.map((row) => [row.id, row]));
}

export async function getActivePromotions(): Promise<PromotionBannerItem[]> {
  const { data, error } = await supabase
    .from('promotions')
    .select(
      'id, title, description, image_url, discount_type, discount_value, product_ids, is_active, starts_at, ends_at'
    )
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error('No pudimos cargar las promociones activas.');
  }

  const rows = (data ?? []) as PromotionRow[];
  const now = new Date();
  const promotions = rows.map(mapPromotionRow).filter((promotion) => isPromotionCurrent(promotion, now));
  const firstProductIds = Array.from(
    new Set(promotions.map((promotion) => promotion.productIds[0]).filter((value): value is string => Boolean(value)))
  );
  const productsById = await getProductsByIds(firstProductIds);

  return promotions.map((promotion) => {
    const firstProductId = promotion.productIds[0];
    const relatedProduct = firstProductId ? productsById.get(firstProductId) : undefined;
    const basePrice = normalizeNumber(relatedProduct?.price) ?? undefined;
    const priceLabels = buildPriceLabels(promotion, basePrice);

    return {
      id: promotion.id,
      title: promotion.title,
      description: promotion.description ?? '',
      imageUrl: resolveImageUrl(promotion.imageUrl, relatedProduct?.image_url),
      badgeLabel: buildBadgeLabel(promotion),
      priceLabel: priceLabels.priceLabel,
      originalPriceLabel: priceLabels.originalPriceLabel,
    };
  });
}
