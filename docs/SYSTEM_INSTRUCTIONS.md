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

---

## 2. TECH STACK (NO cambiar sin autorización)

```
FRONTEND
├── React 19              → UI library
├── TypeScript (strict)   → Type safety obligatorio
├── Vite 6                → Bundler y dev server
├── Tailwind CSS 4        → Utility-first CSS
├── Framer Motion         → Animaciones de componentes y transiciones de página
├── GSAP + ScrollTrigger  → Animaciones scroll-driven (splash, onboarding)
├── Lenis                 → Smooth scrolling
├── tsParticles           → Partículas decorativas
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
├── Vercel                → Hosting + CDN + SSL
└── GitHub                → Repo privado, rama main + develop

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
- Functional components SOLAMENTE (no class components)
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
/* PRIMARIOS — Del local real de Sorbo */
--sorbo-black:        #0A0908;     /* Fondo principal */
--sorbo-dark:         #1A1612;     /* Superficies elevadas, cards */
--sorbo-dark-warm:    #2A2420;     /* Bordes, separadores */

/* ACENTOS — Apetito + Lujo */
--sorbo-gold:         #D4A853;     /* CTA principal, precios, destacados */
--sorbo-cream:        #F5E6C8;     /* Texto principal sobre fondo oscuro */
--sorbo-amber:        #E8943A;     /* Notificaciones, badges, urgencia */

/* FUNCIONALES */
--sorbo-neon:         #00B4FF;     /* Hover, estados activos (del neón real) */
--sorbo-green:        #4CAF50;     /* Éxito, confirmaciones */
--sorbo-red:          #E53935;     /* Errores, "agotado" */

/* GLASSMORPHISM */
--sorbo-glass:        rgba(26, 22, 18, 0.65);
--sorbo-glass-light:  rgba(245, 230, 200, 0.08);
--sorbo-glass-border: rgba(212, 168, 83, 0.15);

/* GRADIENTES */
--sorbo-gradient-hero:  linear-gradient(135deg, #0A0908 0%, #1A1612 50%, #2A1A0A 100%);
--sorbo-gradient-gold:  linear-gradient(135deg, #D4A853 0%, #E8943A 100%);
```

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
- **Scroll animations:** GSAP ScrollTrigger (solo en splash/onboarding)
- **Micro-interacciones:** Framer Motion (hover, tap, layout animations)
- **Partículas:** tsParticles con color dorado (#D4A853)
- **Timing:** `ease: [0.25, 0.1, 0.25, 1]` (ease-out suave) como default
- **Duration:** 0.3s para micro, 0.6s para transiciones, 1-2s para reveals

---

## 5. ARQUITECTURA DE LA APP

### Flujo de Pantallas
```
SPLASH (3-4s) → ONBOARDING (2-3 slides, skip) → AUTH → HOME
                                                         ↓
                                               ┌─────────────────────┐
                                               │   BOTTOM NAV        │
                                               │ Home│Menu│Cart│Perfil│
                                               └─────────────────────┘
                                                    ↓        ↓
                                              Product Detail  Checkout → WhatsApp
                                                              ↓
                                                         Order Tracking
```

### Rutas
```
/                   → Splash + redirect
/onboarding         → Slides de bienvenida
/auth               → Login / Register / Guest
/home               → Home screen (default after auth)
/menu               → Catálogo completo
/menu/:categorySlug → Categoría específica
/product/:id        → Detalle de producto
/cart               → Carrito de compras
/checkout           → Proceso de pago → WhatsApp
/orders             → Historial de pedidos
/orders/:id         → Detalle + tracking de orden
/profile            → Perfil del usuario
/admin              → Panel admin (protegido con rol admin)
/admin/products     → CRUD de productos
/admin/orders       → Ver pedidos
/admin/promos       → Gestionar promociones
```

### Roles de Usuario
```
guest    → Puede ver menú, NO puede hacer pedidos
user     → Puede ver menú + hacer pedidos + ver historial
admin    → Todo lo anterior + panel de administración
```
La protección se hace con Supabase RLS + middleware en React Router.

---

## 6. FLUJO DE CHECKOUT (CRÍTICO)

```
1. Usuario arma su carrito (productos + cantidades + personalizaciones)
2. Toca "Ir al Checkout"
3. Ve un Bottom Sheet o pantalla con:
   a. Resumen de productos con fotos mini, nombres, cantidades, precios
   b. Total a pagar (en Bs y opcionalmente USD)
   c. Selector de tipo de pedido: "Para llevar" / "Comer aquí"
   d. Campo de notas especiales (opcional)
   e. Selector de método de pago con botones (Pago Móvil, Binance, Zelle, etc.)
4. Al seleccionar método de pago, se despliega una card elegante con:
   - Los datos bancarios/wallet de Sorbo para ese método
   - Botón "Copiar" para cada dato
5. Botón "Enviar pedido por WhatsApp"
6. Se abre WhatsApp con mensaje pre-armado:
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
7. El pedido se guarda en Supabase con estado "pending"
8. El usuario puede ver el estado en /orders
```

**IMPORTANTE:** NO implementar pasarela de pago real. El pago se hace externo
(en la app del banco del cliente) y la confirmación es vía WhatsApp.

---

## 7. PANEL ADMIN

Ruta: `/admin` — Protegida por Supabase RLS (solo rol `admin`)

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

### Seguridad del Admin
```sql
-- En Supabase, tabla user_roles:
-- Solo el dueño de Sorbo tiene role = 'admin'
-- RLS policy: admin routes solo accesibles si user.role = 'admin'
-- No hay "botón secreto" — es una ruta protegida con autenticación real
```

---

## 8. ESTRUCTURA DE CARPETAS

```
sorbo-app/
├── public/
│   ├── manifest.json
│   ├── icons/
│   ├── images/
│   │   ├── hero/
│   │   ├── products/
│   │   └── brand/
│   └── fonts/
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   ├── Router.tsx
│   │   └── Providers.tsx
│   ├── components/
│   │   ├── ui/               ← Primitivos reutilizables
│   │   ├── layout/           ← AppShell, BottomNav, Header
│   │   ├── product/          ← ProductCard, ProductGrid, etc.
│   │   ├── cart/             ← CartItem, CartSummary, etc.
│   │   └── animations/       ← SplashScreen, ParticleBackground, etc.
│   ├── features/
│   │   ├── auth/
│   │   ├── home/
│   │   ├── menu/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── orders/
│   │   ├── profile/
│   │   ├── onboarding/
│   │   └── admin/            ← Panel de administración
│   ├── hooks/
│   ├── lib/                  ← Config de Supabase, GSAP, analytics
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
│   ├── MENU_DATA.md
│   └── ARCHITECTURE.md
├── supabase/
│   ├── migrations/
│   └── seed.sql
└── [configs: vite, tailwind, ts, eslint, prettier, git]
```

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
git checkout develop     # Siempre trabajar en develop
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

*Última actualización: Marzo 2026*
*Proyecto por: OpenSyntheAI (https://www.opensyntheai.com)*