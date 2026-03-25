/**
 * Formatea un precio numérico como string en USD.
 * Ejemplo: 12.5 → "$12.50"
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Calcula el precio con descuento aplicado.
 * @param price - Precio original
 * @param discountPercent - Porcentaje de descuento (0-100)
 */
export function applyDiscount(price: number, discountPercent: number): number {
  if (discountPercent <= 0 || discountPercent > 100) return price;
  return price * (1 - discountPercent / 100);
}
