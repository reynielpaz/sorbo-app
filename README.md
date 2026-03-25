<p align="center">
  <img src="public/images/brand/logo-sorbo.png" alt="Sorbo Café • Bistró" width="200"/>
</p>

<h1 align="center">Sorbo Café • Bistró — Web App</h1>

<p align="center">
  <strong>Premium Progressive Web App for Sorbo Café • Bistró</strong><br/>
  Elegante · Moderna · Provocativa · Instalable
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" alt="React 19"/>
  <img src="https://img.shields.io/badge/TypeScript-strict-3178C6?style=flat-square&logo=typescript" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite" alt="Vite 6"/>
  <img src="https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss" alt="Tailwind 4"/>
  <img src="https://img.shields.io/badge/Supabase-Backend-3FCF8E?style=flat-square&logo=supabase" alt="Supabase"/>
  <img src="https://img.shields.io/badge/PWA-Installable-5A0FC8?style=flat-square" alt="PWA"/>
</p>

---

## About

Sorbo App is a **premium Progressive Web App** built for Sorbo Café • Bistró, a restaurant and coffee shop in Venezuela. The app delivers a cinematic, engagement-first digital experience optimized for mobile devices — installable directly from the browser without any app store.

### Key Features

- **Cinematic Splash Intro** — GSAP-powered animations with golden particles
- **Dark Luxury Design** — Black + gold palette inspired by the real venue
- **Full Product Catalog** — Visual menu with categories, customization, and search
- **Smart Cart + WhatsApp Checkout** — Seamless order flow redirecting to WhatsApp
- **Admin Panel** — Protected dashboard for the owner to manage products and promotions
- **Recommendation Engine** — Smart product suggestions based on user behavior
- **PWA** — Installable on Android and iOS, works offline for core features
- **Mobile-First** — Designed for 375px+ viewports, responsive up to desktop

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **UI** | React 19 + TypeScript | Component framework |
| **Bundler** | Vite 6 | Dev server + production builds |
| **Styling** | Tailwind CSS 4 | Utility-first CSS |
| **Animation** | GSAP + Framer Motion | Scroll animations + transitions |
| **Smooth Scroll** | Lenis | Buttery smooth scrolling |
| **Particles** | tsParticles | Decorative golden particles |
| **State** | Zustand | Global state management |
| **Routing** | React Router v7 | SPA navigation |
| **Backend** | Supabase | Auth + DB + Storage + Realtime |
| **PWA** | vite-plugin-pwa | Service worker + manifest |
| **Deploy** | Vercel | Hosting + CDN |

---

## Getting Started

### Prerequisites

- **Node.js** >= 20.x
- **npm** >= 10.x
- **Git**
- **VS Code** (recommended)

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/sorbo-app.git
cd sorbo-app

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Fill in your Supabase credentials in .env.local

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Environment Variables

Create a `.env.local` file in the root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_WHATSAPP_NUMBER=584221000292
VITE_APP_NAME=Sorbo Café • Bistró
VITE_APP_URL=https://your-domain.com
```

---

## Project Structure

```
sorbo-app/
├── public/                     # Static assets
│   ├── manifest.json           # PWA manifest
│   ├── icons/                  # App icons (192, 512)
│   ├── images/                 # Hero, products, brand
│   └── fonts/                  # Custom typefaces
├── src/
│   ├── app/                    # App shell (App, Router, Providers)
│   ├── components/
│   │   ├── ui/                 # Reusable primitives
│   │   ├── layout/             # App shell, navigation
│   │   ├── product/            # Product-specific components
│   │   ├── cart/               # Cart components
│   │   └── animations/         # Splash, particles, reveals
│   ├── features/               # Feature modules
│   │   ├── auth/               # Authentication
│   │   ├── home/               # Home screen
│   │   ├── menu/               # Product catalog
│   │   ├── cart/               # Shopping cart
│   │   ├── checkout/           # Payment + WhatsApp flow
│   │   ├── orders/             # Order history + tracking
│   │   ├── profile/            # User profile
│   │   ├── onboarding/         # Welcome slides
│   │   └── admin/              # Admin panel (protected)
│   ├── hooks/                  # Global custom hooks
│   ├── lib/                    # Library configs (Supabase, GSAP)
│   ├── services/               # API / data layer
│   ├── store/                  # Zustand stores
│   ├── styles/                 # Global CSS + animations
│   ├── types/                  # TypeScript type definitions
│   ├── utils/                  # Pure utility functions
│   ├── pages/                  # Route pages
│   └── main.tsx                # Entry point
├── docs/                       # AI agent context + documentation
├── supabase/                   # Database migrations + seeds
└── [config files]
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (localhost:5173) |
| `npm run build` | Production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |

---

## Git Workflow

```
main          → Production (deploy trigger)
develop       → Active development
feature/*     → Individual features
hotfix/*      → Urgent fixes
```

### Commit Convention

```
feat(scope): add new feature
fix(scope): fix a bug
style(scope): styling changes
refactor(scope): code refactor
docs(scope): documentation
chore(scope): maintenance
```

---

## Deployment

The app is deployed on **Vercel** with automatic deployments:
- Push to `main` → Production deploy
- Push to `develop` → Preview deploy

---

## Design System

| Token | Value | Usage |
|-------|-------|-------|
| `--sorbo-black` | `#0A0908` | Primary background |
| `--sorbo-dark` | `#1A1612` | Card surfaces |
| `--sorbo-gold` | `#D4A853` | CTAs, prices, highlights |
| `--sorbo-cream` | `#F5E6C8` | Body text |
| `--sorbo-amber` | `#E8943A` | Badges, urgency |
| `--sorbo-neon` | `#00B4FF` | Hover states |

**Typography:** Playfair Display (display) + DM Sans (body)

---

## Roadmap

- [x] Phase 0 — Project setup + design system
- [ ] Phase 1 — Splash + Onboarding
- [ ] Phase 2 — Auth + Home
- [ ] Phase 3 — Menu + Product Detail
- [ ] Phase 4 — Cart + Checkout + WhatsApp
- [ ] Phase 5 — Orders + Profile + Polish
- [ ] Phase 6 — Admin Panel
- [ ] Phase 7 — Recommendations + Loyalty
- [ ] Phase 8 — 3D Reservations (Spline)

---

## License

This project is proprietary software developed for Sorbo Café • Bistró.
All rights reserved. Unauthorized copying, distribution, or modification is prohibited.

---

<p align="center">
  <sub>Developed with ♥ by <a href="https://www.opensyntheai.com">OpenSyntheAI</a></sub>
</p>