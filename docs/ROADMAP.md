# ROADMAP — Sorbo Café • Bistró Web App

> Estado actual: **Fase 0/1 estabilizada**. Las Fases 2–4 tienen implementación local
> y están en integración con Supabase/datos reales. Admin, historial de órdenes, lealtad,
> 3D y notificaciones permanecen en roadmap.

---

## Fase 0 — Setup & Fundamentos ✅

**Estado:** Completada; falta versionar el esquema real de Supabase y añadir iconos PWA finales.
**Dependencias:** Ninguna
**Resultado:** Proyecto funcional con dev server, estructura de carpetas, y design system

### Tareas
- [x] Inicializar proyecto con Vite + React 19 + TypeScript
- [x] Configurar Tailwind CSS 4
- [x] Instalar dependencias core (GSAP, Framer Motion, Zustand, Lenis, tsParticles)
- [x] Crear estructura de carpetas base
- [x] Configurar path aliases (`@/`) en Vite y TypeScript
- [x] Configurar ESLint + Prettier
- [x] Configurar repositorio, CI y flujo mediante ramas de trabajo
- [x] Configurar manifest generado + Service Worker
- [x] Consolidar design tokens en `@theme`
- [x] Optimizar tipografías (Playfair Display + DM Sans) y caché offline
- [x] Crear componentes UI primitivos (Button, Card, Input, Badge, Skeleton)
- [x] Crear layout base (AppShell, BottomNav, Header)
- [ ] Versionar esquema, policies y datos iniciales de Supabase como migraciones
- [x] Crear archivos `.env.example` y `.gitignore`
- [x] Mantener documentación en `docs/`

---

## Fase 1 — Splash + Onboarding

**Estado:** Implementada y estabilizada
**Dependencias:** Fase 0
**Resultado:** Intro cinematográfico + slides de bienvenida

### Tareas
- [x] Splash screen animado
  - Fondo negro
  - Tipografía "SORBO" gigante dividida (Playfair Display)
  - Imagen hero de café en el 50% derecho
  - Partículas doradas flotando con CSS ligero
  - Timeline y transición de salida con GSAP
  - Salida automática o al tocar la pantalla
- [x] Onboarding (3 slides)
  - Slide 1: Foto del interior + "Bienvenido a Sorbo"
  - Slide 2: Foto de platos + "Menú Premium"
  - Slide 3: CTA "Comenzar" → Auth o Home
  - Swipe navigation + dots indicator
  - Skip button
  - Framer Motion transitions entre slides
- [x] Guardar flag en localStorage: onboarding completado (no repetir)

---

## Fase 2 — Auth + Home

**Estado:** Implementada localmente; validación productiva de Supabase pendiente
**Dependencias:** Fase 1 + Supabase configurado
**Resultado:** Login funcional + pantalla principal con contenido

### Tareas
- [x] Auth Screen
  - Login con email + password
  - Register con email
  - Google Sign-In (Supabase OAuth)
  - "Continuar como invitado" (skip auth, limita funciones)
  - Diseño premium: fondo con foto del local blurred + overlay oscuro
  - Validación de formulario con mensajes en español
- [x] Home Screen
  - Header: Saludo personalizado "Buenas tardes, [Nombre]" + avatar
  - Badge "Abierto" / "Cerrado" basado en horario
  - Hero Banner rotativo (promos, nuevos items) — auto-scroll
  - Categorías horizontales scrolleables con iconos
  - Sección "Lo más pedido" (productos destacados)
  - Sección "Nuevos" (productos recientes)
  - Bottom Navigation funcional (Home, Menú, Reservas, Perfil)

---

## Fase 3 — Menú + Detalle de Producto

**Estado:** Implementada localmente; catálogo real depende de Supabase
**Dependencias:** Fase 2 + Data de productos en Supabase
**Resultado:** Catálogo navegable con detalle de cada producto

### Tareas
- [x] Menu Screen
  - Tabs o filtros por categoría (horizontal scroll)
  - Lista visual de productos optimizada para mobile
  - ProductCard: foto, nombre, precio, badge (nuevo/popular/descuento)
  - Skeleton loaders mientras carga
  - Animaciones staggered en entrada (Framer Motion)
  - Búsqueda de productos (search bar)
- [x] Product Detail Screen
  - Foto full-width arriba
  - Nombre, descripción, precio grande
  - Opciones de personalización (BottomSheet)
    - Tamaño, extras, quitar ingredientes
  - Selector de cantidad (+/-)
  - Botón sticky "Agregar al carrito" con animación
  - Recomendaciones de adicionales

---

## Fase 4 — Carrito + Checkout + WhatsApp

**Estado:** Implementada localmente; falta validación end-to-end con backend productivo
**Dependencias:** Fase 3
**Resultado:** Flujo completo de compra hasta WhatsApp

### Tareas
- [x] Cart Screen
  - Lista de items con foto mini, nombre, cantidad, precio
  - Editar cantidad (+/-) por item
  - Eliminar producto mediante control accesible
  - Subtotal en tiempo real
  - CTA "Ir al checkout"
- [x] Checkout Screen
  - Resumen del pedido (readonly)
  - Selector: "Para llevar" / "Comer aquí"
  - Campo de notas especiales
  - Selector de método de pago (botones con iconos)
  - Total final
  - Botón "Enviar pedido por WhatsApp"
  - Genera mensaje pre-armado → abre WhatsApp
  - Guarda orden en Supabase con estado "pending"
  - Estado de confirmación con ticket temporal

---

## Fase 5 — Orders + Profile + Polish

**Estado:** Parcial
**Dependencias:** Fase 4
**Resultado:** Historial de pedidos, perfil, y app pulida

### Tareas
- [ ] Order History
  - Lista de pedidos pasados con fecha, total, estado
  - Detalle de orden (productos, estado)
  - Botón "Repetir pedido" (agrega mismo carrito)
- [x] Profile Screen básica
  - Datos personales (nombre, email, teléfono)
  - Cerrar sesión
  - Accesos rápidos a carrito, reservas y menú
- [ ] PWA Polish (parcial)
  - Manifest y service worker generados
  - Caché runtime para Google Fonts
  - Iconos optimizados (192x192, 512x512) — pendientes
  - Install prompt personalizado
  - Offline page básica
- [ ] Performance
  - Lighthouse audit (target: 90+ en todas las categorías)
  - Image optimization (WebP, lazy loading)
  - Code splitting por ruta
  - Testing en dispositivos reales (Android + iOS)

---

## Fase 6 — Panel Admin

**Estado:** Pendiente
**Dependencias:** Fase 5
**Resultado:** Dashboard de administración para el dueño

### Tareas
- [ ] Admin Auth (ruta /admin protegida con rol)
- [ ] Dashboard (ventas del día, pedidos pendientes)
- [ ] CRUD de Productos (crear, editar, eliminar, reordenar)
- [ ] Gestión de Categorías
- [ ] Gestión de Promociones (banners, descuentos, etiquetas)
- [ ] Vista de Pedidos
- [ ] Configuración (datos de pago, horario, redes)
- [ ] Upload de imágenes a Supabase Storage

---

## Fase 7 — Algoritmo de Recomendaciones + Extras

**Estado:** Futuro; existe recomendación básica de adicionales, no motor personalizado
**Dependencias:** Fase 6 + data de usuario acumulada

### Tareas
- [ ] Sistema de recomendaciones
  - "Basado en tu último pedido"
  - "Los más populares de hoy"
  - "Combo sugerido" (producto + bebida + postre)
  - Promos por hora (descuento happy hour)
  - Re-engagement: "Hace X días no pides tu favorito"
- [ ] Favoritos (guardar productos)
- [ ] QR Code premium para mesas
- [ ] Políticas de privacidad y términos de uso
- [ ] Footer con crédito OpenSyntheAI

---

## Fase 8 — Reservación + Features Premium

**Estado:** Parcial. El formulario de reserva y envío por WhatsApp están implementados;
la experiencia 3D permanece futura.
**Dependencias:** Fase 7

### Tareas
- [ ] Vista top-down del local (Spline 3D o Canvas 2D)
- [ ] Mesas interactivas con estado (disponible/ocupada)
- [x] Flujo de reservación por WhatsApp
- [ ] Programa de lealtad (stamps digitales)
- [ ] Notificaciones push (Firebase)
- [ ] Sección "Nuestra Historia"
- [ ] Audio en splash (Suno AI jingle)

---

## Datos Pendientes del Cliente

| Dato | Estado |
|------|--------|
| Precios del menú | ⏳ Pendiente |
| Dirección exacta del local | ⏳ Pendiente |
| Horario de atención | ⏳ Pendiente |
| Métodos de pago aceptados | ⏳ Pendiente |
| Fotos profesionales de productos | ✅ Disponibles |
| Dominio web | ⏳ Por comprar |
| Redes sociales | ✅ Disponibles |

---

*Última actualización: Junio 2026*
