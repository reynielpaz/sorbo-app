type PromotionDiscountType = 'percent' | 'fixed' | 'combo';

/** Promoción activa configurada en Supabase */
export interface Promotion {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  discountType: PromotionDiscountType | null;
  discountValue: number | null;
  productIds: string[];
  isActive: boolean;
  startsAt: string | null;
  endsAt: string | null;
}

/** View-model consumido por el hero de promociones */
export interface PromotionBannerItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  badgeLabel: string;
  priceLabel?: string;
  originalPriceLabel?: string;
  accent?: string;
}
