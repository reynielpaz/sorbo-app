import { describe, it, expect } from 'vitest';

/**
 * Smoke test de la red de seguridad (Hito 0).
 * Verifica que la tubería de pruebas funciona de extremo a extremo:
 * que vitest ejecuta aserciones y que el entorno jsdom expone el DOM.
 */
describe('smoke', () => {
  it('ejecuta la tubería de vitest', () => {
    expect(1 + 1).toBe(2);
  });

  it('provee un entorno DOM con jsdom', () => {
    const el = document.createElement('div');
    el.textContent = 'sorbo';
    expect(el.textContent).toBe('sorbo');
  });
});
