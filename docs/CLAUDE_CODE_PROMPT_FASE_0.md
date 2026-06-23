# ARCHIVO HISTÓRICO — Prompt de Fase 0

> **No ejecutar este documento como instrucciones actuales.** La Fase 0 ya fue completada
> y la estructura, paleta, carga de fuentes y configuración PWA evolucionaron desde este
> prompt original. Para trabajo vigente usa `SYSTEM_INSTRUCTIONS.md`, `TECH_SPEC.md`,
> `DESIGN_SYSTEM.md` y el código del repositorio como fuente de verdad.

> El texto siguiente se conserva únicamente como registro histórico del setup inicial.

---

## Contexto del proyecto

Estoy creando una Web App PWA premium para **Sorbo Café • Bistró**, un restaurante/cafetería en Venezuela. La app se instala como app nativa desde el browser.

**IMPORTANTE:** Lee TODOS los archivos en la carpeta `docs/` antes de hacer cualquier cosa. Ahí está toda la documentación del proyecto: SYSTEM_INSTRUCTIONS.md, TECH_SPEC.md, DESIGN_SYSTEM.md, ROADMAP.md, MENU_DATA.md, y CODEX_INSTRUCTIONS.md.

## Tu tarea: Fase 0 — Setup completo del proyecto

Necesito que hagas el setup inicial del proyecto paso a paso. YA tengo la carpeta `sorbo-app` creada y los archivos de `docs/` dentro. Necesitas hacer esto EN ORDEN:

### Paso 1: Inicializar Vite + React 19 + TypeScript
- Inicializa un proyecto Vite con template `react-ts` **dentro de la carpeta actual** (no crees subcarpeta)
- Si ya existe un package.json, trabaja sobre él
- Asegúrate de que sea React 19 y TypeScript strict

### Paso 2: Instalar dependencias
Instala estas dependencias EXACTAS (core):
```bash
npm install react-router-dom@7 zustand @supabase/supabase-js framer-motion gsap lenis @tsparticles/react @tsparticles/slim clsx tailwind-merge lucide-react
```

Dev dependencies:
```bash
npm install -D @tailwindcss/vite vite-plugin-pwa @types/react @types/react-dom
```

### Paso 3: Configurar Tailwind CSS 4
- Instala `tailwindcss` y `@tailwindcss/vite`
- Configura el plugin en `vite.config.ts`
- En `src/styles/globals.css`, usa `@import "tailwindcss"` (Tailwind v4 syntax)
- Agrega los custom colors de Sorbo como CSS variables Y como `@theme` en Tailwind v4

### Paso 4: Configurar Vite
Crea/actualiza `vite.config.ts` con:
- Plugin react
- Plugin tailwindcss
- Plugin PWA (VitePWA) con manifest de Sorbo (name: "Sorbo Café • Bistró", theme_color: "#0A0908", background_color: "#0A0908", display: "standalone", orientation: "portrait")
- Path alias: `@/` apuntando a `./src`

### Paso 5: Configurar TypeScript
Actualiza `tsconfig.json` con:
- `strict: true`
- Path alias `@/*` → `src/*`
- Target ES2022, module ESNext, moduleResolution bundler

Crea `tsconfig.app.json` si Vite lo requiere.

### Paso 6: Configurar ESLint + Prettier
- ESLint con config para React + TypeScript
- Prettier con: semi: true, singleQuote: true, tabWidth: 2, trailingComma: "es5", printWidth: 100
- Agrega scripts en package.json: `lint`, `format`

### Paso 7: Crear estructura de carpetas
Crea TODAS estas carpetas (vacías con .gitkeep si es necesario):

```
src/
├── app/
├── assets/
│   ├── animations/
│   └── 3d/
├── components/
│   ├── ui/
│   ├── layout/
│   ├── product/
│   ├── cart/
│   └── animations/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── services/
│   ├── home/
│   │   ├── components/
│   │   └── hooks/
│   ├── menu/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── services/
│   ├── cart/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── store/
│   ├── checkout/
│   │   ├── components/
│   │   └── hooks/
│   ├── orders/
│   │   ├── components/
│   │   └── hooks/
│   ├── profile/
│   │   ├── components/
│   │   └── hooks/
│   ├── onboarding/
│   │   ├── components/
│   │   └── hooks/
│   └── admin/
│       ├── components/
│       ├── hooks/
│       └── services/
├── hooks/
├── lib/
├── services/
├── store/
├── styles/
├── types/
├── utils/
└── pages/
```

También crea:
```
public/
├── icons/
├── images/
│   ├── hero/
│   ├── products/
│   └── brand/
└── fonts/

supabase/
└── migrations/
```

### Paso 8: Crear archivos base del Design System

**src/styles/globals.css** — Con las CSS variables de Sorbo (colores, sombras, gradientes) + import de Tailwind v4 + @theme con custom colors:
```css
@import "tailwindcss";

@theme {
  --color-sorbo-black: #0A0908;
  --color-sorbo-dark: #1A1612;
  --color-sorbo-warm: #2A2420;
  --color-sorbo-gold: #D4A853;
  --color-sorbo-cream: #F5E6C8;
  --color-sorbo-amber: #E8943A;
  --color-sorbo-neon: #00B4FF;
  --color-sorbo-green: #4CAF50;
  --color-sorbo-red: #E53935;
}
```
Luego agrega las CSS custom properties adicionales (glass, gradients, shadows, text variants) dentro de `:root {}`.

**src/styles/fonts.css** — Import de Google Fonts (Playfair Display 700 + DM Sans 400,500,700 + DM Mono 400)

**src/styles/animations.css** — Keyframes básicos: fadeIn, fadeInUp, slideUp, slideDown, scaleIn, shimmer (para skeletons)

### Paso 9: Crear utilidades base

**src/utils/cn.ts** — Función `cn()` que combina clsx + tailwind-merge para class merging
**src/utils/formatPrice.ts** — Función para formatear precios en USD ($X.XX)
**src/utils/constants.ts** — Constantes del app (WHATSAPP_NUMBER, APP_NAME, rutas, categorías)

### Paso 10: Crear tipos base

**src/types/product.ts** — Interface Product, Category, ProductCustomization
**src/types/order.ts** — Interface Order, OrderItem, OrderStatus, PaymentMethod
**src/types/user.ts** — Interface User, UserRole
**src/types/index.ts** — Re-export de todos los tipos

### Paso 11: Crear lib base

**src/lib/supabase.ts** — Cliente de Supabase (usando env vars VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY). Si las env vars no existen, que no crashee — poner un warning en console.

### Paso 12: Crear componentes UI primitivos

Crea estos componentes en `src/components/ui/` con Tailwind + Framer Motion:

**Button.tsx** — Con variantes: primary (gradient dorado), secondary, ghost, danger. Tamaños: sm, md, lg, full. Props: children, variant, size, disabled, onClick, className, asChild, loading.

**Card.tsx** — Con variantes: default (bg-sorbo-dark), glass (glassmorphism). Props: children, variant, className, onClick.

**Badge.tsx** — Variantes: nuevo (ámbar), popular (dorado), promo (rojo), agotado (rojo muted). Props: variant, children, className.

**Input.tsx** — Input estilizado dark con label flotante. Props: label, error, tipo, placeholder, etc.

**Skeleton.tsx** — Skeleton loader con animación shimmer para estados de carga.

**src/components/ui/index.ts** — Re-export de todos los componentes UI.

### Paso 13: Crear layout base

**src/components/layout/BottomNav.tsx** — Barra de navegación inferior con 4 tabs (Home, Menú, Carrito, Perfil) usando Lucide icons. Tab activo en dorado con dot indicator. Fixed bottom con backdrop blur y safe area padding.

**src/components/layout/Header.tsx** — Header simple con logo + título de la página.

**src/components/layout/AppShell.tsx** — Wrapper que incluye Header + contenido + BottomNav. Maneja el padding para el bottom nav.

### Paso 14: Crear routing base

**src/app/Router.tsx** — React Router v7 con rutas placeholder:
- / → SplashPage
- /home → HomePage
- /menu → MenuPage
- /cart → CartPage
- /profile → ProfilePage
(todas como placeholder con solo el nombre de la página centrado)

**src/app/Providers.tsx** — Wrapper con BrowserRouter y futuros providers

**src/app/App.tsx** — Componente raíz que renderiza Providers > Router

### Paso 15: Crear páginas placeholder

Crea páginas básicas en `src/pages/` que solo muestren el nombre de la página en el centro con el estilo Sorbo (fondo negro, texto crema). Páginas: SplashPage, HomePage, MenuPage, CartPage, ProfilePage.

### Paso 16: Actualizar main.tsx y index.html

**src/main.tsx** — Import de styles (globals.css, fonts.css, animations.css) + render de App

**index.html** — Meta tags correctos (viewport con viewport-fit=cover, theme-color #0A0908, título "Sorbo Café • Bistró", apple-mobile-web-app-capable)

### Paso 17: Copiar archivos de config a la raíz

Asegúrate de que `.gitignore`, `.env.example` estén en la raíz del proyecto (NO dentro de docs/).

### Paso 18: Verificar que compila

Ejecuta `npm run dev` y verifica que:
- No hay errores de TypeScript
- No hay errores de ESLint
- El dev server arranca en localhost:5173
- Se ve la página placeholder con fondo negro y texto crema

---

## REGLAS MIENTRAS TRABAJAS

1. **NO uses `any` en TypeScript** — usa tipos explícitos
2. **NO crees archivos fuera de la estructura definida**
3. **Código en INGLÉS, textos UI en ESPAÑOL**
4. **Usa Tailwind CSS, NO CSS modules ni styled-components**
5. **Un componente por archivo, máximo 200 líneas**
6. **Imports con alias `@/`** — nunca imports relativos largos como `../../../`
7. Si algo falla, DIME qué pasó antes de intentar arreglarlo solo
