# CODEX INSTRUCTIONS — Sorbo Café • Bistró Web App

> **PARA CODEX / AGENTES AUXILIARES**
> Versión simplificada del contexto del proyecto.
> Para contexto completo, lee SYSTEM_INSTRUCTIONS.md

---

## RESUMEN DEL PROYECTO

Web App PWA para un restaurante/cafetería en Venezuela llamado **Sorbo Café • Bistró**.
Se instala como app nativa desde el navegador. Diseño Dark Luxury (negro + dorado).

**Stack:** React 19 + TypeScript + Vite 6 + Tailwind CSS 4 + Supabase + Zustand

---

## REGLAS CRÍTICAS

1. **TypeScript strict** — NO usar `any`, siempre tipos explícitos
2. **Código en inglés** — Variables, funciones, componentes en inglés
3. **UI en español** — Todo texto visible al usuario en español
4. **Un componente por archivo** — Máximo 200 líneas
5. **Tailwind CSS** — NO CSS modules, NO styled-components
6. **Imports con alias** — Usar `@/` como alias de `src/`
7. **NO tocar archivos fuera de tu tarea** — Si algo no es parte de tu task, no lo modifiques

---

## PALETA DE COLORES

```
Negro:   #0A0908 (fondo)     Dorado:  #D4A853 (CTA, precios)
Dark:    #1A1612 (cards)      Crema:   #F5E6C8 (texto)
Warm:    #2A2420 (bordes)     Amber:   #E8943A (badges)
Neon:    #00B4FF (hover)      Verde:   #4CAF50 (éxito)
                               Rojo:    #E53935 (error)
```

---

## ESTRUCTURA DE CARPETAS

```
src/
├── components/ui/        → Botones, cards, inputs (reutilizables)
├── components/layout/    → BottomNav, Header, AppShell
├── components/product/   → ProductCard, ProductGrid
├── components/cart/      → CartItem, CartSummary
├── components/animations/→ SplashScreen, Particles
├── features/             → auth/, home/, menu/, cart/, checkout/, orders/, profile/, admin/
│   └── [feature]/
│       ├── components/
│       ├── hooks/
│       ├── services/
│       └── types.ts
├── hooks/                → Hooks globales
├── lib/                  → Config (supabase.ts, gsap.ts)
├── services/             → API calls
├── store/                → Zustand stores
├── styles/               → globals.css, animations.css, fonts.css
├── types/                → Tipos globales
├── utils/                → Helpers puros
└── pages/                → Páginas/rutas
```

---

## CONVENCIÓN DE COMMITS

```
feat(scope): descripción    → Nueva feature
fix(scope): descripción     → Bug fix
style(scope): descripción   → Cambios de estilo
refactor(scope): descripción → Refactor sin cambio funcional
```

---

## ANTES DE CADA TAREA

1. Lee SYSTEM_INSTRUCTIONS.md si necesitas más contexto
2. Verifica que tu cambio no rompa imports existentes
3. Usa los tipos definidos en `types/`
4. Sigue la paleta de colores — NO inventes colores nuevos
5. Testea en viewport móvil (375px) — mobile-first obligatorio

---

*Proyecto por: OpenSyntheAI (https://www.opensyntheai.com)*