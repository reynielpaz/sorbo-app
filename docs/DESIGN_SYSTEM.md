# DESIGN SYSTEM — Sorbo Café • Bistró

> Guía visual completa para mantener consistencia en toda la app.

---

## 1. Estética General

**Concepto:** Dark Luxury Warm
**Inspiración:** El interior real de Sorbo (concreto oscuro + madera + neón azul + lámparas ámbar) + estética de restaurantes premium como Blue Bottle, Nespresso, Joe & The Juice.

**Principios:**
- Fondo oscuro siempre — nunca blanco como base
- Dorado como acento — CTAs, precios, elementos importantes
- Glassmorphism sutil — cards con transparencia y blur
- Fotos grandes — los productos son las estrellas
- Tipografía elegante — serif para títulos, sans para body
- Animaciones fluidas — todo se mueve con propósito
- Mobile-first — diseñado para 375px, adaptable hacia arriba

---

## 2. Colores

### CSS Variables (definidas en globals.css)

```css
:root {
  /* Primarios */
  --sorbo-black: #0A0908;
  --sorbo-dark: #1A1612;
  --sorbo-dark-warm: #2A2420;
  
  /* Acentos */
  --sorbo-gold: #D4A853;
  --sorbo-cream: #F5E6C8;
  --sorbo-amber: #E8943A;
  
  /* Funcionales */
  --sorbo-neon: #00B4FF;
  --sorbo-green: #4CAF50;
  --sorbo-red: #E53935;
  
  /* Texto */
  --sorbo-text-primary: #F5E6C8;
  --sorbo-text-secondary: rgba(245, 230, 200, 0.7);
  --sorbo-text-muted: rgba(245, 230, 200, 0.4);
  
  /* Glassmorphism */
  --sorbo-glass: rgba(26, 22, 18, 0.65);
  --sorbo-glass-light: rgba(245, 230, 200, 0.08);
  --sorbo-glass-border: rgba(212, 168, 83, 0.15);
  
  /* Gradientes */
  --sorbo-gradient-hero: linear-gradient(135deg, #0A0908 0%, #1A1612 50%, #2A1A0A 100%);
  --sorbo-gradient-gold: linear-gradient(135deg, #D4A853 0%, #E8943A 100%);
  --sorbo-gradient-glass: linear-gradient(135deg, rgba(212,168,83,0.1) 0%, rgba(0,0,0,0) 100%);
  
  /* Sombras */
  --sorbo-shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.3);
  --sorbo-shadow-md: 0 4px 16px rgba(0, 0, 0, 0.4);
  --sorbo-shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.5);
  --sorbo-shadow-gold: 0 4px 16px rgba(212, 168, 83, 0.2);
}
```

### Tailwind Custom Colors (tailwind.config.ts)

```typescript
{
  theme: {
    extend: {
      colors: {
        sorbo: {
          black: '#0A0908',
          dark: '#1A1612',
          warm: '#2A2420',
          gold: '#D4A853',
          cream: '#F5E6C8',
          amber: '#E8943A',
          neon: '#00B4FF',
          green: '#4CAF50',
          red: '#E53935',
        }
      }
    }
  }
}
```

### Uso de Colores

| Elemento | Color | Variable |
|----------|-------|----------|
| Fondo de la app | Negro cálido | `bg-sorbo-black` |
| Cards, superficies | Oscuro | `bg-sorbo-dark` |
| Texto principal | Crema | `text-sorbo-cream` |
| Texto secundario | Crema 70% | `text-sorbo-cream/70` |
| Botones CTA | Dorado gradient | `bg-gradient-to-r from-sorbo-gold to-sorbo-amber` |
| Precios | Dorado | `text-sorbo-gold` |
| Badges "Nuevo" | Ámbar | `bg-sorbo-amber` |
| Badges "Popular" | Dorado | `bg-sorbo-gold/20 text-sorbo-gold` |
| Badge "Agotado" | Rojo | `bg-sorbo-red/20 text-sorbo-red` |
| Hover effects | Neón azul | `hover:border-sorbo-neon` |
| Éxito/Confirmación | Verde | `text-sorbo-green` |
| Bordes sutiles | Dorado 15% | `border-sorbo-gold/15` |

---

## 3. Tipografía

### Fuentes

| Rol | Fuente | Weight | Uso |
|-----|--------|--------|-----|
| Display | Playfair Display | 700 | Splash "SORBO", títulos de sección, nombres de categoría |
| Body | DM Sans | 400, 500, 700 | Todo el texto UI, descripciones, botones |
| Mono | DM Mono | 400 | Precios, cantidades, datos numéricos |

### Escala Tipográfica

| Clase Tailwind | Tamaño | Uso |
|----------------|--------|-----|
| `text-4xl` | 36px | Splash "SORBO" |
| `text-2xl` | 24px | Títulos de sección en Home |
| `text-xl` | 20px | Nombre de producto en detalle |
| `text-lg` | 18px | Precio en detalle de producto |
| `text-base` | 16px | Body text, descripciones |
| `text-sm` | 14px | Labels, subtítulos |
| `text-xs` | 12px | Badges, metadata |

### Importación (fonts.css)

```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;700&family=DM+Mono:wght@400&display=swap');
```

---

## 4. Componentes UI

### Button

```
Variantes:
├── primary    → bg-gradient-to-r from-sorbo-gold to-sorbo-amber, text-sorbo-black, font-bold
├── secondary  → bg-sorbo-dark, border border-sorbo-gold/20, text-sorbo-cream
├── ghost      → bg-transparent, text-sorbo-cream, hover:bg-sorbo-glass-light
├── danger     → bg-sorbo-red/20, text-sorbo-red, border border-sorbo-red/20

Tamaños:
├── sm         → h-8 px-3 text-sm rounded-lg
├── md         → h-10 px-4 text-base rounded-xl
├── lg         → h-12 px-6 text-lg rounded-xl
├── full       → h-14 w-full text-lg rounded-2xl (CTA principal)

Estado hover: scale-[1.02] + shadow-gold
Estado active: scale-[0.98]
Estado disabled: opacity-50, cursor-not-allowed
```

### Card

```
Base: bg-sorbo-dark, border border-sorbo-gold/10, rounded-2xl, overflow-hidden
Glass: bg-sorbo-glass, backdrop-blur-md, border border-sorbo-glass-border
Hover: hover:border-sorbo-gold/25, transition-all duration-300

ProductCard:
├── Imagen arriba (aspect-[4/3], object-cover)
├── Padding p-3
├── Nombre (text-base, font-medium, text-sorbo-cream)
├── Descripción (text-sm, text-sorbo-cream/60, line-clamp-2)
├── Precio (text-lg, font-bold, text-sorbo-gold)
├── Badge opcional (absolute top-2 right-2)
```

### Badge

```
Variantes:
├── nuevo     → bg-sorbo-amber/20, text-sorbo-amber, text-xs, px-2 py-0.5, rounded-full
├── popular   → bg-sorbo-gold/20, text-sorbo-gold, con icono 🔥
├── promo     → bg-sorbo-red/20, text-sorbo-red, "-X%"
├── agotado   → bg-sorbo-red/10, text-sorbo-red/70, "Agotado"
```

### BottomSheet

```
Overlay: bg-black/50, backdrop-blur-sm
Sheet: bg-sorbo-dark, rounded-t-3xl, border-t border-sorbo-gold/10
Handle: w-10 h-1 bg-sorbo-cream/20, rounded-full, mx-auto, mt-3
Animación: slide-up con Framer Motion (spring, damping: 25)
```

### Input

```
Base: bg-sorbo-dark-warm, border border-sorbo-gold/10, rounded-xl
      text-sorbo-cream, placeholder:text-sorbo-cream/30
      h-12 px-4 text-base
Focus: border-sorbo-gold/40, ring-1 ring-sorbo-gold/20
Error: border-sorbo-red/50
```

### BottomNav

```
Container: fixed bottom-0, bg-sorbo-dark/95, backdrop-blur-lg
           border-t border-sorbo-gold/10, h-16, safe-area-inset-bottom
Items: 4 tabs (Home, Menú, Carrito, Perfil)
Active: text-sorbo-gold, con dot indicator debajo
Inactive: text-sorbo-cream/40
CartBadge: absolute -top-1 -right-1, bg-sorbo-amber, text-sorbo-black
           min-w-5 h-5, text-xs, rounded-full
```

---

## 5. Animaciones

### Timing Functions

```css
--ease-out-smooth: cubic-bezier(0.25, 0.1, 0.25, 1);
--ease-out-back: cubic-bezier(0.34, 1.56, 0.64, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

### Duraciones

| Tipo | Duración | Uso |
|------|----------|-----|
| Micro | 150-200ms | Hover, focus, toggle |
| Standard | 300ms | Transiciones de página, modals |
| Reveal | 600ms | Elementos entrando en viewport |
| Cinematic | 1-2s | Splash screen, onboarding |

### Framer Motion Presets

```typescript
// Fade in desde abajo
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }
};

// Stagger children (para grids de productos)
const staggerContainer = {
  animate: { transition: { staggerChildren: 0.08 } }
};

// Page transition
const pageTransition = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: { duration: 0.3 }
};

// Scale on tap (botones)
const tapScale = {
  whileTap: { scale: 0.98 },
  whileHover: { scale: 1.02 }
};
```

### Partículas Doradas (tsParticles config)

```typescript
const particlesConfig = {
  particles: {
    number: { value: 30 },
    color: { value: '#D4A853' },
    opacity: { value: { min: 0.1, max: 0.4 } },
    size: { value: { min: 1, max: 3 } },
    move: {
      enable: true,
      speed: 0.5,
      direction: 'top' as const,
      random: true,
    },
  },
  detectRetina: true,
};
```

---

## 6. Layout & Spacing

### Breakpoints (mobile-first)

```
sm: 375px   → Móvil pequeño (base design)
md: 390px   → iPhone 14/15
lg: 430px   → iPhone Pro Max
xl: 768px   → Tablet
2xl: 1024px → Desktop
```

### Safe Areas

```css
/* Para iOS notch y bottom bar */
padding-top: env(safe-area-inset-top);
padding-bottom: env(safe-area-inset-bottom);
```

### Grid de Productos

```
Mobile (< 768px):  2 columnas, gap-3
Tablet (768px+):   3 columnas, gap-4
Desktop (1024px+): 4 columnas, gap-6
```

### Z-Index Scale

```
z-0:   Base content
z-10:  Floating elements (badges, tooltips)
z-20:  Sticky header
z-30:  Bottom nav
z-40:  Bottom sheet overlay
z-50:  Bottom sheet content
z-60:  Modal overlay
z-70:  Modal content
z-80:  Toast notifications
z-90:  Splash screen
z-100: System overlays (PWA install prompt)
```

---

## 7. Iconografía

Usar **Lucide React** como librería de iconos.

```bash
npm install lucide-react
```

Iconos frecuentes:
- Home → `<Home />`
- Menu → `<UtensilsCrossed />`
- Cart → `<ShoppingBag />`
- Profile → `<User />`
- Search → `<Search />`
- Back → `<ChevronLeft />`
- Close → `<X />`
- Add → `<Plus />`
- Remove → `<Minus />`
- Trash → `<Trash2 />`
- Star → `<Star />`
- Clock → `<Clock />`
- MapPin → `<MapPin />`
- Phone → `<Phone />`

---

*Última actualización: Marzo 2026*