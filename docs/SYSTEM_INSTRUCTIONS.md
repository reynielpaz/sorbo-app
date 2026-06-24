# SYSTEM INSTRUCTIONS — Sorbo Café • Bistró Web App

> **CONTEXTO PARA AGENTES AI (Claude Code / Codex)**
> Lee este archivo COMPLETO antes de tocar cualquier línea de código.
> Si no entiendes algo, PREGUNTA antes de actuar.

---

## 1. ¿QUÉ ES ESTE PROYECTO?

**Sorbo Café • Bistró** es un restaurante/cafetería real ubicado en Venezuela.
Esta es su **Web App PWA** (Progressive Web App) — una aplicación web que se instala
en el celular como una app nativa desde el navegador (sin App Store ni Play Store).

**Objetivo:** Expandir Sorbo al mundo digital con una experiencia premium,
elegante, moderna, provocativa y enganchadora que maximice las ventas.

**El cliente final:** El dueño de Sorbo. Nosotros (OpenSyntheAI) somos los desarrolladores.

**Target de usuarios:** Clientes del restaurante en Venezuela, principalmente desde
celulares Android e iPhone. La app DEBE verse espectacular en móvil primero.

### Estado real del repositorio (Junio 2026)

- La base de **Fase 0/1 está estabilizada**.
- Splash, onboarding, auth, home, menú, detalle de producto, carrito, checkout,
  reservaciones y perfil tienen implementación local.
- Los servicios usan Supabase, pero el esquema/migraciones de producción todavía no
  están versionados en el repositorio.
- Admin, historial de órdenes, tracking, lealtad, 3D y push notifications siguen en roadmap.
- GSAP se usa en el splash. Lenis y tsParticles están instalados, pero aún no se usan.

---

## 2. TECH STACK (NO cambiar sin autorización)

```
FRONTEND
├── React 19              → UI library
├── TypeScript (strict)   → Type safety obligatorio
├── Vite 6                → Bundler y dev server
├── Tailwind CSS 4        → Utility-first CSS
├── Framer Motion         → Animaciones de componentes y transiciones de página
├── GSAP                  → Timeline del splash (activo)
├── GSAP ScrollTrigger    → Roadmap para animaciones scroll-driven
├── Lenis                 → Instalado, uso futuro
├── tsParticles           → Instalado, uso futuro; hoy las partículas son CSS
├── Zustand               → State management global
├── React Router v7       → Navegación SPA
└── vite-plugin-pwa       → PWA (manifest, service worker, install prompt)

BACKEND
├── Supabase Auth         → Autenticación (email + Google + guest)
├── Supabase Database     → PostgreSQL (productos, órdenes, usuarios)
├── Supabase Storage      → Imágenes de productos
├── Supabase RLS          → Row Level Security (admin vs user)
└── Supabase Realtime     → Updates en tiempo real (opcional)

DEPLOY
├── Vercel                → Destino previsto; despliegue productivo no verificado en repo
└── GitHub                → main + ramas de trabajo con PR

EXTRAS
├── n8n                   → Automatización (notificaciones, registro de ventas)
└── Spline (futuro)       → Elementos 3D (reservación de mesas)
```

---

## 3. REGLAS DE CÓDIGO (OBLIGATORIAS)

### Idioma
- **Código (variables, funciones, componentes, tipos):** SIEMPRE en INGLÉS
- **Textos visibles al usuario (UI, labels, mensajes):** SIEMPRE en ESPAÑOL
- **Comentarios de código:** En ESPAÑOL, breves y útiles
- **Nombres de archivos:** En INGLÉS, kebab-case para archivos, PascalCase para componentes

### TypeScript
- `strict: true` en tsconfig — NO desactivar NUNCA
- NO usar `any` — usar tipos explícitos o `unknown` con type guards
- Todas las props de componentes deben tener interface/type definido
- Exportar tipos desde `types/` o desde el `types.ts` de cada feature

### Componentes React
- Functional components por defecto; `ErrorBoundary` es la excepción legítima porque
  React todavía requiere una class boundary para `componentDidCatch`
- Hooks en la parte superior del componente
- Props destructuradas con tipos
- Un componente por archivo (excepto sub-componentes internos pequeños)
- Naming: `ProductCard.tsx`, no `productCard.tsx` ni `product-card.tsx`

### Estilos
- Tailwind CSS como base — NO CSS modules, NO styled-components
- CSS custom properties (variables) para el design system en `styles/globals.css`
- Clases utilitarias de Tailwind para layout y spacing
- Animaciones complejas en `styles/animations.css` o con Framer Motion
- NUNCA estilos inline excepto para valores dinámicos calculados

### Estado
- **Estado local de componente:** `useState` / `useReducer`
- **Estado global de la app:** Zustand stores en `store/`
- **Estado del servidor (data fetching):** Custom hooks en `hooks/` o `features/*/hooks/`
- NO prop drilling de más de 2 niveles — si pasa de 2, usa Zustand o Context

### Imports
```typescript
// 1. React y librerías externas
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// 2. Componentes internos
import { Button } from '@/components/ui';
import { ProductCard } from '@/components/product/ProductCard';

// 3. Hooks, stores, utils
import { useCart } from '@/hooks/useCart';
import { cartStore } from '@/store/cartStore';
import { formatPrice } from '@/utils/formatPrice';

// 4. Tipos
import type { Product } from '@/types';

// 5. Estilos (si aplica)
import '@/styles/animations.css';
```

### Estructura de archivos
```
PROHIBIDO:
❌ Poner lógica de negocio en componentes UI
❌ Archivos de más de 200 líneas (dividir en sub-componentes)
❌ Imports circulares
❌ Código duplicado (extraer a utils o hooks)
❌ console.log en producción (usar solo en dev)
❌ Hardcodear URLs, colores, o textos mágicos (usar constants.ts y CSS vars)

OBLIGATORIO:
✅ Cada feature tiene su carpeta en features/ con components/, hooks/, types.ts
✅ Componentes reutilizables van en components/ui/ con re-export en index.ts
✅ Toda interacción con Supabase va en services/ o features/*/services/
✅ Cada página va en pages/ y es un thin wrapper que compone features
```

---

## 4. DESIGN SYSTEM

### Paleta de Colores

```css
@theme {
  --color-sorbo-black: #0b0f1a;
  --color-sorbo-dark: #0e1225;
  --color-sorbo-warm: #131830;
  --color-sorbo-gold: #d4a853;
  --color-sorbo-gold-light: #e8c068;
  --color-sorbo-gold-dark: #b8923a;
  --color-sorbo-amber: #e8943a;
  --color-sorbo-cream: #ffffff;
  --color-sorbo-green: #00dc82;
  --color-sorbo-red: #ef4444;
}
```

Los efectos glass, gradientes y sombras complejas permanecen en `:root`. No duplicar
la paleta base fuera de `@theme`.

### Tipografía
- **Display/Títulos:** Playfair Display (serif, elegante, para headings grandes)
- **Body/UI:** DM Sans (sans-serif, legible, moderno, para body text y UI)
- **Precios/Números:** DM Mono o Tabular figures de DM Sans

### Spacing Scale (Tailwind)
- Usa la escala default de Tailwind: 1=4px, 2=8px, 3=12px, 4=16px, 6=24px, 8=32px
- Padding de cards: `p-4` mínimo en mobile
- Gap entre items de grid: `gap-3` o `gap-4`
- Bordes redondeados: `rounded-xl` (12px) para cards, `rounded-2xl` (16px) para modals

### Animaciones
- **Transiciones de página:** Framer Motion AnimatePresence con fade + slide
- **Splash:** GSAP timeline
- **Scroll animations:** GSAP ScrollTrigger (roadmap; no está conectado hoy)
- **Micro-interacciones:** Framer Motion (hover, tap, layout animations)
- **Partículas actuales:** CSS; tsParticles queda reservado para una fase futura
- **Timing:** `ease: [0.25, 0.1, 0.25, 1]` (ease-out suave) como default
- **Duration:** 0.3s para micro, 0.6s para transiciones, 1-2s para reveals

---

## 5. ARQUITECTURA DE LA APP

### Flujo de Pantallas Actual
```
SPLASH (3-4s) → ONBOARDING (2-3 slides, skip) → AUTH → HOME
                                                         ↓
                                               ┌─────────────────────┐
                                               │   BOTTOM NAV        │
                                               │Home│Menú│Reserva│Perfil│
                                               └─────────────────────┘
                                                    ↓        ↓
                                              Product Detail  Reserva → WhatsApp
                                                     ↓
                                              Cart → Checkout → WhatsApp
```

### Rutas implementadas
```
/                   → Splash + redirect
/onboarding         → Slides de bienvenida
/auth               → Login / Register / Guest
/home               → Home screen (default after auth)
/menu               → Catálogo completo
/product/:id        → Detalle de producto
/reservations       → Solicitud de reserva por WhatsApp
/cart               → Carrito de compras
/checkout           → Proceso de pago → WhatsApp
/profile            → Perfil del usuario
```

### Rutas reservadas para roadmap
```
/orders             → Historial de pedidos
/orders/:id         → Detalle + tracking de orden
/admin              → Panel admin (protegido con rol admin)
/admin/products     → CRUD de productos
/admin/orders       → Ver pedidos
/admin/promos       → Gestionar promociones
```

### Roles de Usuario
```
guest    → Puede navegar, usar carrito y completar el handoff a WhatsApp
user     → Puede autenticarse, hacer pedidos y ver su perfil
admin    → Rol previsto para el panel de administración futuro
```

La implementación actual permite al invitado navegar, usar el carrito y completar el
handoff a WhatsApp. Todavía no incluye guards para orders/admin. La protección final debe
combinar guards de React Router con Supabase RLS.

---

## 6. FLUJO DE CHECKOUT (CRÍTICO)

```
1. Usuario arma su carrito (productos + cantidades + personalizaciones)
2. Toca "Ir al Checkout"
3. Ve un Bottom Sheet o pantalla con:
   a. Resumen de productos con fotos mini, nombres, cantidades, precios
   b. Total a pagar (actualmente mostrado en USD; el helper soporta VES)
   c. Selector de tipo de pedido: "Para llevar" / "Comer aquí"
   d. Campo de notas especiales (opcional)
   e. Selector de método de pago con botones (Pago Móvil, Binance, Zelle, etc.)
4. Selecciona un método de pago disponible.
5. Completa nombre y teléfono.
6. Toca "Enviar pedido por WhatsApp".
7. La app intenta registrar el pedido en Supabase y abre WhatsApp con un mensaje pre-armado:
   "🍔 *Nuevo pedido Sorbo*
   
   👤 Nombre: [nombre del usuario]
   📋 Pedido:
   - 2x Sorbo Burger — $X.XX
   - 1x Orange Sorbo — $X.XX
   
   💰 Total: $XX.XX
   💳 Método: Pago Móvil
   📝 Notas: Sin cebolla
   🏷️ Tipo: Para llevar
   
   ✅ Enviado desde Sorbo App"
8. La pantalla muestra un ticket temporal y permite reabrir WhatsApp.
```

**IMPORTANTE:** NO implementar pasarela de pago real. El pago se hace externo
(en la app del banco del cliente) y la confirmación es vía WhatsApp.

---

## 7. PANEL ADMIN (ROADMAP)

Ruta prevista: `/admin` — todavía no registrada en el router actual.

### Funcionalidades del Admin
```
├── Dashboard        → Resumen de ventas del día/semana, pedidos pendientes
├── Productos        → CRUD completo (crear, editar, eliminar, reordenar)
│   ├── Subir foto
│   ├── Nombre, descripción, precio
│   ├── Categoría
│   ├── Disponibilidad (toggle activo/agotado)
│   ├── Etiquetas (🔥 Popular, 🆕 Nuevo, 📉 -20%)
│   └── Opciones de personalización
├── Categorías       → Crear/editar categorías del menú
├── Promociones      → Banners del hero, descuentos, combos
├── Pedidos          → Lista de pedidos con estado
└── Configuración    → Datos de pago, horario, redes sociales
```

### Seguridad prevista del Admin
```sql
-- El rol administrativo vive en public.profiles.role.
-- Las policies deben usar public.is_admin() SECURITY DEFINER
-- o un claim de app_metadata gestionado desde servidor.
-- No hay "botón secreto" — es una ruta protegida con autenticación real
```

---

## 8. ESTRUCTURA DE CARPETAS

```
sorbo-app/
├── public/
│   ├── favicon.ico
│   ├── icons/
│   ├── images/
│   │   ├── auth/
│   │   ├── brand/
│   │   ├── hero/
│   │   ├── menu/
│   │   ├── payments/
│   │   └── reservations/
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   ├── Router.tsx
│   │   └── Providers.tsx
│   ├── components/
│   │   ├── ui/               ← Primitivos reutilizables
│   │   ├── layout/           ← AppShell, BottomNav, Header
│   │   ├── motion/           ← Transiciones compartidas
│   │   └── product/          ← ProductCard
│   ├── features/
│   │   ├── home/
│   │   ├── menu/
│   │   ├── cart/
│   │   ├── product/
│   │   └── reservations/
│   ├── hooks/
│   ├── lib/                  ← Cliente de Supabase
│   ├── services/             ← API calls a Supabase
│   ├── store/                ← Zustand stores
│   ├── styles/
│   │   ├── globals.css
│   │   ├── animations.css
│   │   └── fonts.css
│   ├── types/
│   ├── utils/
│   ├── pages/
│   └── main.tsx
├── docs/                     ← ESTÁS AQUÍ — Documentación para agentes
│   ├── SYSTEM_INSTRUCTIONS.md
│   ├── CODEX_INSTRUCTIONS.md
│   ├── TECH_SPEC.md
│   ├── DESIGN_SYSTEM.md
│   ├── ROADMAP.md
│   └── MENU_DATA.md
├── supabase/
│   └── migrations/           ← Placeholder; no hay migraciones versionadas todavía
└── [configs: vite, ts, eslint, vitest, git]
```

El manifest PWA se genera desde `vite.config.ts` mediante `vite-plugin-pwa`; no existe
un archivo de manifest mantenido manualmente.

**REGLA:** Si no sabes dónde va un archivo, PREGUNTA. No inventes carpetas nuevas.

---

## 9. INFORMACIÓN DEL NEGOCIO

### Redes Sociales
- **Instagram:** https://www.instagram.com/sorbo.ve
- **TikTok:** https://www.tiktok.com/@sorbo.ve
- **WhatsApp Business:** +58 422-1000292

### Categorías del Menú
1. Hamburguesas (Pan de Papa)
2. Perros Calientes
3. Patacones
4. Ensaladas
5. Menú Kids
6. Salchipapas
7. Bebidas
8. Cócteles
9. Postres
10. Especiales (Full Equipo, Medio Full)

### Branding
- **Nombre completo:** Sorbo Café • Bistró
- **Slogan:** "Sienta, saborea, Sorbo"
- **Logo:** Taza de café humeante bajo cloche de servicio + tipografía serif
- **Estética:** Dark Luxury — negro cálido, dorado, crema, glassmorphism

### Créditos
- **Desarrollado por:** OpenSyntheAI (https://www.opensyntheai.com)
- Se debe incluir un footer discreto: "Desarrollado con ♥ por OpenSyntheAI"

---

## 10. COMANDOS ÚTILES

```bash
# Desarrollo
npm run dev              # Servidor de desarrollo en localhost:5173

# Build
npm run build            # Build de producción
npm run preview          # Preview del build local

# Linting
npm run lint             # ESLint check
npm run format           # Prettier format

# Git
git switch codex/menu-premium-experience  # Rama de trabajo actual (Junio 2026)
git pull                 # Antes de empezar
git add .
git commit -m "feat(feature): descripción corta"
git push
```

### Convención de Commits
```
feat(splash): add GSAP particle animation
fix(cart): correct total calculation with discounts
style(menu): adjust card spacing on mobile
refactor(auth): extract validation to custom hook
docs(readme): update installation steps
chore(deps): update framer-motion to v12
```

---

## ⚠️ LO QUE NUNCA DEBES HACER

```
❌ Instalar dependencias sin que estén en este documento
❌ Cambiar la paleta de colores sin autorización
❌ Crear archivos fuera de la estructura definida
❌ Usar `any` en TypeScript
❌ Hacer commits directos a main
❌ Borrar o modificar este archivo
❌ Hardcodear datos que deberían venir de Supabase
❌ Crear CSS modules o styled-components
❌ Usar localStorage para datos sensibles
❌ Implementar pasarela de pago real (el pago es externo via banco)
```

---

*Última actualización: Junio 2026*
*Proyecto por: OpenSyntheAI (https://www.opensyntheai.com)*
