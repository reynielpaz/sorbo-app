# TECH SPEC — Sorbo Café • Bistró Web App

> Estado: especificación de arquitectura objetivo. Las secciones de base de datos y RLS
> son propuestas para futuras migraciones; `supabase/migrations/` todavía no contiene el
> esquema productivo.

---

## 1. Dependencias y Versiones

### Core
```json
{
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "typescript": "^5.7.0",
  "vite": "^6.0.0"
}
```

### UI & Styling
```json
{
  "tailwindcss": "^4.0.0",
  "@tailwindcss/vite": "^4.0.0"
}
```

### Animation
```json
{
  "gsap": "^3.12.0",
  "framer-motion": "^12.0.0",
  "lenis": "^1.1.0",
  "@tsparticles/react": "^3.0.0",
  "@tsparticles/slim": "^3.0.0"
}
```

### State & Routing
```json
{
  "zustand": "^5.0.0",
  "react-router-dom": "^7.0.0"
}
```

### Backend
```json
{
  "@supabase/supabase-js": "^2.45.0"
}
```

### PWA
```json
{
  "vite-plugin-pwa": "^0.21.0"
}
```

### Dev Tools
```json
{
  "eslint": "^9.0.0",
  "prettier": "^3.4.0",
  "@types/react": "^19.0.0",
  "@types/react-dom": "^19.0.0"
}
```

### Utilidades
```json
{
  "clsx": "^2.1.0",
  "tailwind-merge": "^2.6.0"
}
```

---

## 2. Configuraciones

### Vite (vite.config.ts)
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeManifestIcons: false,
      manifest: {
        name: 'Sorbo Café • Bistró',
        short_name: 'Sorbo',
        description: 'Pide tu comida favorita desde tu celular',
        lang: 'es',
        theme_color: '#000000',
        background_color: '#000000',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          { src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/icon-512x512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-stylesheets',
              cacheableResponse: { statuses: [0, 200] },
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              cacheableResponse: { statuses: [0, 200] },
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 }
            }
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
```

### TypeScript (tsconfig.json)
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"]
}
```

### ESLint (eslint.config.js)
- Extend: eslint/recommended + typescript-eslint/recommended
- Rules: no-any, no-unused-vars, prefer-const

### Prettier (.prettierrc)
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

---

## 3. Base de Datos (Supabase PostgreSQL)

### Tablas Principales

#### `profiles`
```sql
create table profiles (
  id uuid references auth.users primary key,
  full_name text,
  phone text,
  avatar_url text,
  role text default 'user' check (role in ('user', 'admin', 'guest')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

#### `categories`
```sql
create table categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text unique not null,
  icon_url text,
  sort_order int default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);
```

#### `products`
```sql
create table products (
  id uuid default gen_random_uuid() primary key,
  category_id uuid references categories(id),
  name text not null,
  description text,
  price decimal(10,2) not null,
  image_url text,
  is_available boolean default true,
  is_featured boolean default false,
  tags text[] default '{}',           -- ['nuevo', 'popular', 'promo']
  discount_percent int default 0,     -- 0 = sin descuento
  sort_order int default 0,
  ingredients text[],
  customizations jsonb default '[]',  -- Opciones de personalización
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

#### `orders`
```sql
create table orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id),
  items jsonb not null,               -- Array de {product_id, name, quantity, price, customizations}
  total decimal(10,2) not null,
  payment_method text,                -- 'pago_movil', 'binance', 'zelle', 'efectivo'
  order_type text default 'takeout',  -- 'takeout' | 'dine_in'
  notes text,
  status text default 'pending',      -- 'pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

#### `promotions`
```sql
create table promotions (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  image_url text,
  discount_type text,                 -- 'percent', 'fixed', 'combo'
  discount_value decimal(10,2),
  product_ids uuid[],                 -- Productos que aplica
  is_active boolean default true,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz default now()
);
```

#### `app_config`
```sql
create table app_config (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz default now()
);

-- Datos iniciales
insert into app_config (key, value) values
  ('business_hours', '{"mon":[{"open":"08:30","close":"12:30"},{"open":"18:30","close":"23:00"}],"tue":[],"wed":[{"open":"08:30","close":"12:30"},{"open":"18:30","close":"23:00"}],"thu":[{"open":"08:30","close":"12:30"},{"open":"18:30","close":"23:00"}],"fri":[{"open":"08:30","close":"12:30"},{"open":"18:30","close":"23:30"}],"sat":[{"open":"18:30","close":"23:30"}],"sun":[{"open":"18:30","close":"23:00"}]}'),
  ('payment_methods', '[{"id":"pago_movil","name":"Pago Móvil","data":{"banco":"","cedula":"","telefono":""}},{"id":"binance","name":"Binance","data":{"pay_id":""}},{"id":"zelle","name":"Zelle","data":{"email":""}},{"id":"efectivo","name":"Efectivo","data":{}}]'),
  ('whatsapp_number', '"584221000292"'),
  ('address', '"Centro Comercial Las Auroras, frente a la Plaza Bolívar, Los Puertos de Altagracia, Zulia, Venezuela"'),
  ('social_links', '{"instagram":"https://www.instagram.com/sorbo.ve","tiktok":"https://www.tiktok.com/@sorbo.ve"}');
```

### Row Level Security (RLS)

Las políticas administrativas no deben consultar directamente `profiles` desde cada
policy. Como `profiles` también tiene RLS, ese patrón puede provocar recursión o resultados
inesperados. La opción recomendada es encapsular la comprobación en una función
`SECURITY DEFINER` con `search_path` vacío y referencias totalmente calificadas:

```sql
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- Profiles: usuarios solo ven su propio perfil
alter table profiles enable row level security;
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Products: todos pueden ver, solo admin puede modificar
alter table products enable row level security;
create policy "Anyone can view products" on products for select using (true);
create policy "Admin can manage products" on products for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Orders: usuarios ven sus propias órdenes, admin ve todas
alter table orders enable row level security;
create policy "Users see own orders" on orders for select using (auth.uid() = user_id);
create policy "Users can create orders" on orders for insert with check (auth.uid() = user_id);
create policy "Admin sees all orders" on orders for select to authenticated
  using (public.is_admin());

-- Categories: todos pueden ver, solo admin modifica
alter table categories enable row level security;
create policy "Anyone can view categories" on categories for select using (true);
create policy "Admin manages categories" on categories for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Promotions: todos pueden ver activas, admin gestiona
alter table promotions enable row level security;
create policy "Anyone sees active promos" on promotions for select using (is_active = true);
create policy "Admin manages promos" on promotions for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- App Config: todos leen, admin escribe
alter table app_config enable row level security;
create policy "Anyone reads config" on app_config for select using (true);
create policy "Admin writes config" on app_config for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());
```

La función debe crearse desde una migración controlada por el propietario del esquema,
no desde una sesión de usuario final.

Alternativa válida: guardar el rol en un claim personalizado de `app_metadata` y comprobar
`(auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'`. Ese claim debe ser escrito solo
desde un entorno servidor confiable; nunca debe depender de `user_metadata`, que el usuario
puede modificar. Los cambios de claims requieren renovar el JWT antes de reflejarse.

---

## 4. Supabase Keep-Alive (Anti-Pausa)

El repositorio ya incluye `.github/workflows/keep-alive.yml`. Ejecuta un ping semanal
al endpoint REST y falla de forma explícita si faltan los secrets requeridos:

```yaml
# .github/workflows/keep-alive.yml
name: Keep Supabase Alive
on:
  schedule:
    - cron: '0 6 * * 1'      # Lunes a las 06:00 UTC
  workflow_dispatch: {}

jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - name: Keep database active
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
        run: |
          if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_ANON_KEY" ]; then
            echo "::error::Faltan los secrets SUPABASE_URL y/o SUPABASE_ANON_KEY."
            exit 1
          fi
          curl --fail --silent --show-error \
            "${SUPABASE_URL%/}/rest/v1/" \
            -H "apikey: ${SUPABASE_ANON_KEY}" \
            -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
            -o /dev/null
```

---

## 5. WhatsApp Integration

### Generación del mensaje de pedido

```typescript
// utils/whatsapp.ts
interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  customizations?: string[];
}

interface WhatsAppOrder {
  customerName: string;
  items: OrderItem[];
  total: number;
  paymentMethod: string;
  orderType: 'takeout' | 'dine_in';
  notes?: string;
}

export function generateWhatsAppUrl(order: WhatsAppOrder): string {
  const phoneNumber = import.meta.env.VITE_WHATSAPP_NUMBER;
  
  const itemsList = order.items
    .map(item => {
      const customs = item.customizations?.length
        ? ` (${item.customizations.join(', ')})`
        : '';
      return `• ${item.quantity}x ${item.name}${customs} — $${item.price.toFixed(2)}`;
    })
    .join('\n');

  const message = `🍔 *Nuevo Pedido — Sorbo Café • Bistró*

👤 *Cliente:* ${order.customerName}

📋 *Pedido:*
${itemsList}

💰 *Total:* $${order.total.toFixed(2)}
💳 *Método:* ${order.paymentMethod}
🏷️ *Tipo:* ${order.orderType === 'takeout' ? 'Para llevar' : 'Comer aquí'}
${order.notes ? `📝 *Notas:* ${order.notes}` : ''}

✅ _Enviado desde Sorbo App_`;

  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encoded}`;
}
```

---

## 6. Algoritmo de Recomendaciones

### Estrategia (sin ML, basado en reglas)

```typescript
// services/recommendations.ts

// 1. "Tu último pedido" — Últimos items del usuario
async function getLastOrderItems(userId: string): Promise<Product[]>

// 2. "Lo más pedido" — Top 5 productos por cantidad de órdenes (últimos 30 días)
async function getMostOrdered(): Promise<Product[]>

// 3. "Combo sugerido" — Si pidió hamburguesa, sugerir bebida + postre
const COMBO_RULES = {
  hamburguesas: ['bebidas', 'postres'],
  patacones: ['bebidas', 'cocteles'],
  perros_calientes: ['bebidas'],
  ensaladas: ['bebidas', 'postres'],
};

// 4. "Happy Hour" — Promos activas según la hora actual
async function getTimeBasedPromos(): Promise<Promotion[]>

// 5. "Re-engagement" — Si el usuario no pide hace X días, push con su favorito
// (Implementar en Fase 7 con n8n + push notifications)
```

---

## 7. PWA Configuration

### Manifest generado por `vite-plugin-pwa`

El manifest no se mantiene como archivo dentro de `public/`; se declara en
`vite.config.ts` y se genera durante `npm run build`.

```json
{
  "name": "Sorbo Café • Bistró",
  "short_name": "Sorbo",
  "description": "Pide tu comida favorita desde tu celular",
  "lang": "es",
  "start_url": "/",
  "display": "standalone",
  "orientation": "portrait",
  "theme_color": "#000000",
  "background_color": "#000000",
  "icons": [
    { "src": "/icons/icon-192x192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512x512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icons/icon-512x512-maskable.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

Los assets de producción viven en `public/icons/`, junto con el Apple Touch icon. El
favicon ICO se mantiene en `public/favicon.ico`.

---

*Última actualización: Junio 2026*
