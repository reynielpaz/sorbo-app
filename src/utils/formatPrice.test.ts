import { describe, it, expect } from 'vitest';
import { applyDiscount, formatPrice } from './formatPrice';

describe('formatPrice', () => {
  it('formatea USD por defecto con el símbolo $', () => {
    expect(formatPrice(12.5)).toBe('$12.50');
    expect(formatPrice(5)).toBe('$5.00');
  });

  it('agrupa los miles en USD', () => {
    expect(formatPrice(1234.5, 'USD')).toBe('$1,234.50');
  });

  it('formatea VES con el símbolo Bs. y separadores locales', () => {
    expect(formatPrice(12.5, 'VES')).toBe('Bs. 12,50');
    expect(formatPrice(1234.5, 'VES')).toBe('Bs. 1.234,50');
  });

  it('coloca el signo negativo antes del símbolo en ambas monedas', () => {
    expect(formatPrice(-12.5)).toBe('-$12.50');
    expect(formatPrice(-12.5, 'VES')).toBe('-Bs. 12,50');
  });

  it('formatea el cero correctamente en ambas monedas', () => {
    expect(formatPrice(0)).toBe('$0.00');
    expect(formatPrice(0, 'VES')).toBe('Bs. 0,00');
  });
});

describe('applyDiscount', () => {
  it('devuelve el precio sin cambios con descuento de 0% o inválido', () => {
    expect(applyDiscount(10, 0)).toBe(10);
    expect(applyDiscount(10, -5)).toBe(10);
    expect(applyDiscount(10, 150)).toBe(10);
  });

  it('aplica un descuento válido', () => {
    expect(applyDiscount(10, 50)).toBe(5);
    expect(applyDiscount(10, 100)).toBe(0);
  });

  it('redondea a céntimos los decimales infinitos (6.6666… → 6.67)', () => {
    expect(applyDiscount(20, 66.667)).toBe(6.67);
  });

  it('evita errores de coma flotante acumulados', () => {
    // 19.99 * 0.9 = 17.991 → redondeado a céntimos = 17.99
    expect(applyDiscount(19.99, 10)).toBe(17.99);
  });
});
