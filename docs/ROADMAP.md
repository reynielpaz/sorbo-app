# ROADMAP — Sorbo Café • Bistró Web App

> Estado actual: **Pre-Fase 0** (Planificación completa, esperando datos del cliente)

---

## Fase 0 — Setup & Fundamentos ⏳

**Estado:** Pendiente
**Dependencias:** Ninguna
**Resultado:** Proyecto funcional con dev server, estructura de carpetas, y design system

### Tareas
- [ ] Inicializar proyecto con Vite + React 19 + TypeScript
- [ ] Configurar Tailwind CSS 4
- [ ] Instalar dependencias core (GSAP, Framer Motion, Zustand, Lenis, tsParticles)
- [ ] Crear estructura de carpetas completa
- [ ] Configurar path aliases (@/) en Vite y TypeScript
- [ ] Configurar ESLint + Prettier
- [ ] Setup GitHub repo privado + ramas main/develop
- [ ] Configurar PWA manifest + Service Worker básico
- [ ] Definir CSS variables (design tokens) en globals.css
- [ ] Importar tipografías (Playfair Display + DM Sans)
- [ ] Crear componentes UI primitivos (Button, Card, Input, Badge, Skeleton)
- [ ] Crear layout base (AppShell, BottomNav placeholder)
- [ ] Setup Supabase proyecto + esquema inicial de tablas
- [ ] Crear archivos .env.example y .gitignore
- [ ] Copiar documentación (docs/) al proyecto

---

## Fase 1 — Splash + Onboarding

**Estado:** Pendiente
**Dependencias:** Fase 0
**Resultado:** Intro cinematográfico + slides de bienvenida

### Tareas
- [ ] Splash screen animado estilo "DELEITATE"
  - Fondo negro #0A0908
  - Tipografía "SORBO" gigante dividida (Playfair Display)
  - Imagen de hamburguesa cortada por la mitad (50% derecho)
  - Partículas doradas flotando (tsParticles #D4A853)
  - Transición GSAP al siguiente screen
  - Botón "Toca para entrar" (trigger de audio opcional)
- [ ] Onboarding (2-3 slides)
  - Slide 1: Foto del interior + "Bienvenido a Sorbo"
  - Slide 2: Foto de platos + "Menú Premium"
  - Slide 3: CTA "Comenzar" → Auth o Home
  - Swipe navigation + dots indicator
  - Skip button
  - Framer Motion transitions entre slides
- [ ] Guardar flag en localStorage: onboarding completado (no repetir)

---

## Fase 2 — Auth + Home

**Estado:** Pendiente
**Dependencias:** Fase 1 + Supabase configurado
**Resultado:** Login funcional + pantalla principal con contenido

### Tareas
- [ ] Auth Screen
  - Login con email + password
  - Register con email
  - Google Sign-In (Supabase OAuth)
  - "Continuar como invitado" (skip auth, limita funciones)
  - Diseño premium: fondo con foto del local blurred + overlay oscuro
  - Validación de formulario con mensajes en español
- [ ] Home Screen
  - Header: Saludo personalizado "Buenas tardes, [Nombre]" + avatar
  - Badge "Abierto" / "Cerrado" basado en horario
  - Hero Banner rotativo (promos, nuevos items) — auto-scroll
  - Categorías horizontales scrolleables con iconos
  - Sección "Lo más pedido" (productos destacados)
  - Sección "Nuevos" (productos recientes)
  - Bottom Navigation funcional (Home, Menú, Carrito, Perfil)

---

## Fase 3 — Menú + Detalle de Producto

**Estado:** Pendiente
**Dependencias:** Fase 2 + Data de productos en Supabase
**Resultado:** Catálogo navegable con detalle de cada producto

### Tareas
- [ ] Menu Screen
  - Tabs o filtros por categoría (horizontal scroll)
  - Grid de productos (2 columnas en mobile)
  - ProductCard: foto, nombre, precio, badge (nuevo/popular/descuento)
  - Skeleton loaders mientras carga
  - Animaciones staggered en entrada (Framer Motion)
  - Búsqueda de productos (search bar)
- [ ] Product Detail Screen
  - Foto full-width arriba (con gesto de zoom)
  - Nombre, descripción, precio grande
  - Opciones de personalización (BottomSheet)
    - Tamaño, extras, quitar ingredientes
  - Selector de cantidad (+/-)
  - Botón sticky "Agregar al carrito" con animación
  - Productos relacionados abajo

---

## Fase 4 — Carrito + Checkout + WhatsApp

**Estado:** Pendiente
**Dependencias:** Fase 3
**Resultado:** Flujo completo de compra hasta WhatsApp

### Tareas
- [ ] Cart Screen / Bottom Sheet
  - Lista de items con foto mini, nombre, cantidad, precio
  - Editar cantidad (+/-) por item
  - Swipe to delete
  - Subtotal en tiempo real
  - Badge en BottomNav con cantidad de items
  - CTA "Ir al checkout"
- [ ] Checkout Screen
  - Resumen del pedido (readonly)
  - Selector: "Para llevar" / "Comer aquí"
  - Campo de notas especiales
  - Selector de método de pago (botones con iconos)
  - Card desplegable con datos bancarios + botón "Copiar"
  - Total final
  - Botón "Enviar pedido por WhatsApp"
  - Genera mensaje pre-armado → abre WhatsApp
  - Guarda orden en Supabase con estado "pending"
  - Animación de confirmación (confetti o check animado)

---

## Fase 5 — Orders + Profile + Polish

**Estado:** Pendiente
**Dependencias:** Fase 4
**Resultado:** Historial de pedidos, perfil, y app pulida

### Tareas
- [ ] Order History
  - Lista de pedidos pasados con fecha, total, estado
  - Detalle de orden (productos, estado)
  - Botón "Repetir pedido" (agrega mismo carrito)
- [ ] Profile Screen
  - Datos personales (nombre, email, teléfono)
  - Editar perfil
  - Historial de pedidos (link)
  - Cerrar sesión
  - Links a redes sociales de Sorbo
  - Enlace a políticas de privacidad
- [ ] PWA Polish
  - Splash screen nativo (manifest)
  - Iconos optimizados (192x192, 512x512)
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

**Estado:** Futuro
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

## Fase 8 — Reservación 3D + Features Premium

**Estado:** Futuro
**Dependencias:** Fase 7

### Tareas
- [ ] Vista top-down del local (Spline 3D o Canvas 2D)
- [ ] Mesas interactivas con estado (disponible/ocupada)
- [ ] Flujo de reservación
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

*Última actualización: Marzo 2026*