/** Nombre completo de la app */
export const APP_NAME = 'Sorbo Café • Bistró';

/** Slogan del restaurante */
export const APP_SLOGAN = 'Sienta, saborea, Sorbo';

/** Iconos visuales para categorías del menú */
export const CATEGORY_ICON_MAP: Record<string, string> = {
  hamburguesas: '🍔',
  'perros-calientes': '🌭',
  patacones: '🫓',
  ensaladas: '🥗',
  'menu-kids': '👶',
  salchipapas: '🍟',
  especiales: '⭐',
  bebidas: '🥤',
  cocteles: '🍹',
  postres: '🍰',
};

export function getCategoryIcon(slug?: string | null): string {
  if (!slug) return '🍽️';
  return CATEGORY_ICON_MAP[slug] ?? '🍽️';
}

/** Número de WhatsApp Business (sin +) */
export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER ?? '584221000292';

/** Rutas de la aplicación */
export const ROUTES = {
  SPLASH: '/',
  ONBOARDING: '/onboarding',
  AUTH: '/auth',
  HOME: '/home',
  MENU: '/menu',
  MENU_CATEGORY: '/menu/:categorySlug',
  PRODUCT: '/product/:id',
  RESERVATIONS: '/reservations',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDERS: '/orders',
  ORDER_DETAIL: '/orders/:id',
  PROFILE: '/profile',
  ADMIN: '/admin',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_PROMOS: '/admin/promos',
} as const;

/** Categorías del menú */
export const MENU_CATEGORIES = [
  { id: 'hamburguesas', name: 'Hamburguesas', slug: 'hamburguesas', icon: CATEGORY_ICON_MAP.hamburguesas },
  {
    id: 'perros-calientes',
    name: 'Perros Calientes',
    slug: 'perros-calientes',
    icon: CATEGORY_ICON_MAP['perros-calientes'],
  },
  { id: 'patacones', name: 'Patacones', slug: 'patacones', icon: CATEGORY_ICON_MAP.patacones },
  { id: 'ensaladas', name: 'Ensaladas', slug: 'ensaladas', icon: CATEGORY_ICON_MAP.ensaladas },
  { id: 'menu-kids', name: 'Menú Kids', slug: 'menu-kids', icon: CATEGORY_ICON_MAP['menu-kids'] },
  { id: 'salchipapas', name: 'Salchipapas', slug: 'salchipapas', icon: CATEGORY_ICON_MAP.salchipapas },
  { id: 'bebidas', name: 'Bebidas', slug: 'bebidas', icon: CATEGORY_ICON_MAP.bebidas },
  { id: 'cocteles', name: 'Cócteles', slug: 'cocteles', icon: CATEGORY_ICON_MAP.cocteles },
  { id: 'postres', name: 'Postres', slug: 'postres', icon: CATEGORY_ICON_MAP.postres },
  { id: 'especiales', name: 'Especiales', slug: 'especiales', icon: CATEGORY_ICON_MAP.especiales },
] as const;

/** Métodos de pago disponibles */
export const PAYMENT_METHODS = [
  { id: 'pago_movil', name: 'Pago Móvil' },
  { id: 'binance', name: 'Binance' },
  { id: 'zelle', name: 'Zelle' },
  { id: 'efectivo', name: 'Efectivo' },
] as const;

/** Métodos de pago disponibles para pedido directo por producto */
export const PRODUCT_ORDER_PAYMENT_METHODS = [
  { id: 'pago_movil', name: 'Pago Móvil' },
  { id: 'binance', name: 'Binance' },
  { id: 'zelle', name: 'Zelle' },
  { id: 'efectivo', name: 'Efectivo' },
  { id: 'punto_venta', name: 'Punto de Venta' },
] as const;

export type ProductOrderPaymentMethodId = (typeof PRODUCT_ORDER_PAYMENT_METHODS)[number]['id'];

/** Redes sociales */
export const SOCIAL_LINKS = {
  INSTAGRAM: 'https://www.instagram.com/sorbo.ve',
  TIKTOK: 'https://www.tiktok.com/@sorbo.ve',
} as const;

/** Créditos */
export const CREDITS = {
  DEVELOPER: 'OpenSyntheAI',
  DEVELOPER_URL: 'https://www.opensyntheai.com',
} as const;
