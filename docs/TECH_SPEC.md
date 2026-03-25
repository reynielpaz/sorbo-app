# TECH SPEC — Sorbo Café • Bistró Web App

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
      manifest: {
        name: 'Sorbo Café • Bistró',
        short_name: 'Sorbo',
        description: 'Pide tu comida favorita desde tu celular',
        theme_color: '#0A0908',
        background_color: '#0A0908',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}']
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

```sql
-- Profiles: usuarios solo ven su propio perfil
alter table profiles enable row level security;
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Products: todos pueden ver, solo admin puede modificar
alter table products enable row level security;
create policy "Anyone can view products" on products for select using (true);
create policy "Admin can manage products" on products for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Orders: usuarios ven sus propias órdenes, admin ve todas
alter table orders enable row level security;
create policy "Users see own orders" on orders for select using (auth.uid() = user_id);
create policy "Users can create orders" on orders for insert with check (auth.uid() = user_id);
create policy "Admin sees all orders" on orders for select using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Categories: todos pueden ver, solo admin modifica
alter table categories enable row level security;
create policy "Anyone can view categories" on categories for select using (true);
create policy "Admin manages categories" on categories for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Promotions: todos pueden ver activas, admin gestiona
alter table promotions enable row level security;
create policy "Anyone sees active promos" on promotions for select using (is_active = true);
create policy "Admin manages promos" on promotions for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- App Config: todos leen, admin escribe
alter table app_config enable row level security;
create policy "Anyone reads config" on app_config for select using (true);
create policy "Admin writes config" on app_config for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
```

---

## 4. Supabase Keep-Alive (Anti-Pausa)

Para evitar que Supabase pause el proyecto free por inactividad,
configurar un GitHub Actions cron que hace ping cada 6 días:

```yaml
# .github/workflows/keep-alive.yml
name: Supabase Keep Alive
on:
  schedule:
    - cron: '0 8 */6 * *'    # Cada 6 días a las 8am UTC
  workflow_dispatch:           # Manual trigger

jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - name: Ping Supabase
        run: |
          curl -s -o /dev/null -w "%{http_code}" \
            "${{ secrets.SUPABASE_URL }}/rest/v1/app_config?select=key&limit=1" \
            -H "apikey: ${{ secrets.SUPABASE_ANON_KEY }}" \
            -H "Authorization: Bearer ${{ secrets.SUPABASE_ANON_KEY }}"
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

### manifest.json
```json
{
  "name": "Sorbo Café • Bistró",
  "short_name": "Sorbo",
  "description": "Pide tu comida favorita desde tu celular",
  "start_url": "/",
  "display": "standalone",
  "orientation": "portrait",
  "theme_color": "#0A0908",
  "background_color": "#0A0908",
  "categories": ["food", "shopping"],
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icons/icon-512-maskable.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ],
  "screenshots": [
    { "src": "/screenshots/home.png", "sizes": "375x812", "type": "image/png", "form_factor": "narrow" }
  ]
}
```

---

*Última actualización: Marzo 2026*