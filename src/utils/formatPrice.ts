export type Currency = 'USD' | 'VES';

interface CurrencyConfig {
  /** Prefijo que se antepone al número ya formateado (símbolo de la moneda). */
  prefix: string;
  /** Locale usado para los separadores de miles y decimales. */
  locale: string;
}

const CURRENCY_CONFIG: Record<Currency, CurrencyConfig> = {
  USD: { prefix: '$', locale: 'en-US' },
  VES: { prefix: 'Bs. ', locale: 'es-VE' },
};

/**
 * Formatea un precio numérico según la moneda indicada.
 * - USD (por defecto): `12.5` → "$12.50", `1234.5` → "$1,234.50"
 * - VES: `12.5` → "Bs. 12,50", `1234.5` → "Bs. 1.234,50"
 *
 * El signo negativo se coloca antes del símbolo (p. ej. "-$12.50").
 */
export function formatPrice(amount: number, currency: Currency = 'USD'): string {
  const { prefix, locale } = CURRENCY_CONFIG[currency];
  const sign = amount < 0 ? '-' : '';
  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount));

  return `${sign}${prefix}${formatted}`;
}

/**
 * Calcula el precio con descuento aplicado, redondeado a 2 decimales
 * (céntimos) para evitar errores de coma flotante en operaciones comerciales.
 * @param price - Precio original
 * @param discountPercent - Porcentaje de descuento (0-100)
 */
export function applyDiscount(price: number, discountPercent: number): number {
  if (discountPercent <= 0 || discountPercent > 100) {
    return price;
  }

  const discounted = price * (1 - discountPercent / 100);
  return Math.round(discounted * 100) / 100;
}
