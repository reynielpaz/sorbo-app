/** Nombre completo de la app */
export const APP_NAME = 'Sorbo Café • Bistró';

/** Slogan del restaurante */
export const APP_SLOGAN = 'Sienta, saborea, Sorbo';

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
  { id: 'hamburguesas', name: 'Hamburguesas', slug: 'hamburguesas', icon: '🍔' },
  { id: 'perros-calientes', name: 'Perros Calientes', slug: 'perros-calientes', icon: '🌭' },
  { id: 'patacones', name: 'Patacones', slug: 'patacones', icon: '🫓' },
  { id: 'ensaladas', name: 'Ensaladas', slug: 'ensaladas', icon: '🥗' },
  { id: 'menu-kids', name: 'Menú Kids', slug: 'menu-kids', icon: '🧒' },
  { id: 'salchipapas', name: 'Salchipapas', slug: 'salchipapas', icon: '🍟' },
  { id: 'bebidas', name: 'Bebidas', slug: 'bebidas', icon: '🥤' },
  { id: 'cocteles', name: 'Cócteles', slug: 'cocteles', icon: '🍹' },
  { id: 'postres', name: 'Postres', slug: 'postres', icon: '🍮' },
  { id: 'especiales', name: 'Especiales', slug: 'especiales', icon: '⭐' },
] as const;

/** Métodos de pago disponibles */
export const PAYMENT_METHODS = [
  { id: 'pago_movil', name: 'Pago Móvil' },
  { id: 'binance', name: 'Binance' },
  { id: 'zelle', name: 'Zelle' },
  { id: 'efectivo', name: 'Efectivo' },
] as const;

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
