```markdown
# Architecture

## Overview

**v0-delta-car-platform** is a full-stack web application built with Next.js App Router, designed as a car platform for managing vehicle listings, maintenance requests, services, and user accounts. It features public pages for browsing listings and services, authenticated user dashboards, profile settings, and an admin panel for managing listings, maintenance, and users. The platform supports user authentication (login, signup, password management), theming (light/dark mode), and responsive UI. Business purpose: To provide a scalable, user-friendly interface for car rental/sales/services, enabling users to discover vehicles, request maintenance, and administrators to oversee operations.

The project was bootstrapped with [v0](https://v0.app) and integrates Supabase for authentication and database operations.

## Tech Stack

| Category          | Technology                  | Version          | Purpose |
|-------------------|-----------------------------|------------------|---------|
| Framework         | Next.js                     | 16.2.0           | Core framework with App Router for server-side rendering, routing, and API routes. |
| UI Library        | React                       | 19.2.4           | Building interactive UIs. |
| Language          | TypeScript                  | 5.7.3            | Type-safe JavaScript development. |
| Styling           | Tailwind CSS                | 4.2.0            | Utility-first CSS framework. |
| Styling Utils     | class-variance-authority    | 0.7.1            | Class variant generation for Tailwind. |
| Styling Utils     | clsx                        | 2.1.1            | Conditional class merging. |
| Styling Utils     | tailwind-merge              | 3.3.1            | Tailwind class merging. |
| UI Primitives     | Radix UI (various primitives)| Various (e.g., @radix-ui/react-dialog: 1.1.15) | Headless UI components for accessibility. |
| UI Components     | Shadcn/UI                   | N/A (custom impl)| Reusable UI components built on Radix/Tailwind. |
| Forms             | React Hook Form             | 7.54.1           | Form handling and validation. |
| Forms             | Zod                         | 3.24.1           | Schema validation integrated with React Hook Form. |
| Forms             | @hookform/resolvers         | 3.9.1            | Zod resolver for React Hook Form. |
| Database/Auth     | Supabase (@supabase/ssr, @supabase/supabase-js) | 0.10.2, 2.103.0 | Server-side auth, real-time DB, and storage. |
| Theming           | next-themes                 | 0.4.6            | Dark/light mode support. |
| Analytics         | @vercel/analytics           | 1.6.1            | Performance and usage analytics. |
| Charts            | recharts                    | 2.15.0           | Data visualization. |
| Date Handling     | date-fns                    | 4.1.0            | Date utilities. |
| Carousel          | embla-carousel-react        | 8.6.0            | Responsive carousels. |
| Icons             | lucide-react                | 0.564.0          | SVG icon library. |
| Notifications     | sonner                      | 1.7.4            | Toast notifications. |
| OTP Input         | input-otp                   | 1.4.2            | OTP input fields. |
| Resizing          | react-resizable-panels      | 2.1.7            | Resizable UI panels. |
| Command Palette   | cmdk                        | 1.1.1            | Keyboard-driven search/combo box. |
| Drawer            | vaul                        | 1.1.2            | Drawer modals. |
| Build Tools       | PostCSS                     | 8.5              | CSS processing. |
| Build Tools       | Autoprefixer                | 10.4.20          | CSS vendor prefixing. |
| Dev Tools         | ESLint                      | N/A              | Code linting. |

## Project Structure

The project follows Next.js App Router conventions with a modular organization:

```
├── app/                          # App Router: Pages, layouts, and routes
│   ├── (home)/                   # Route group for home page
│   │   └── page.tsx              # Landing page
│   ├── about/                    # Static about page
│   │   └── page.tsx
│   ├── admin/                    # Admin dashboard (protected)
│   │   ├── layout.tsx            # Admin layout
│   │   ├── listings/             # Admin car listings management
│   │   ├── maintenance/          # Admin maintenance oversight
│   │   ├── page.tsx              # Admin dashboard overview
│   │   └── users/                # Admin user management
│   ├── auth/                     # Authentication routes
│   │   ├── callback/             # Supabase auth callback
│   │   ├── forgot-password/
│   │   ├── login/
│   │   ├── signup/
│   │   └── update-password/
│   ├── dashboard/                # User dashboard
│   │   └── page.tsx
│   ├── globals.css               # Global styles
│   ├── how-it-works/             # Static informational page
│   │   └── page.tsx
│   ├── icon.png                  # Favicon
│   ├── layout.tsx                # Root layout (wraps Navbar, ThemeProvider, etc.)
│   ├── listings/                 # Public/user car listings
│   │   ├── [id]/                 # Dynamic listing detail
│   │   ├── create/               # Create new listing
│   │   └── page.tsx              # Listings index
│   ├── loading.tsx               # Global loading UI
│   ├── maintenance/              # Maintenance pages
│   │   ├── page.tsx
│   │   └── request/              # Submit maintenance request
│   ├── services/                 # Services page
│   │   └── page.tsx
│   └── settings/                 # User settings
│       └── profile/              # Profile management
├── components/                   # Reusable React components
│   ├── Footer.tsx
│   ├── Navbar.tsx
│   ├── theme-provider.tsx        # Next Themes wrapper
│   └── ui/                       # Shadcn/UI components (accordion, button, etc.)
├── hooks/                        # Custom React hooks
│   ├── use-mobile.ts
│   └── use-toast.ts
├── lib/                          # Utilities and integrations
│   ├── supabase.ts               # Supabase client initialization
│   └── utils.ts                  # General utilities (e.g., cn() for classNames)
├── public/                       # Static assets
│   ├── images/                   # Service images (C-suit, Customer Service, etc.)
│   ├── logo.png
│   └── placeholders/             # Placeholder images/SVGs
├── scripts/                      # DB scripts
│   ├── init-db.sql
│   ├── upgrade-admin.sql
│   └── check-db*.js              # DB schema checks
├── styles/                       # Additional styles
│   └── globals.css
└── Config files: package.json, tsconfig.json, next.config.mjs, middleware.ts, components.json
```

- **app/**: Defines routes via file-based routing. Parallel routes and groups (e.g., `(home)`) organize non-nested paths.
- **components/**: Shared UI elements; `ui/` contains ~50 Shadcn primitives.
- **hooks/**: Mobile detection and toast hooks.
- **lib/**: Core integrations like Supabase.
- **public/**: Assets for images, icons, logos.
- **scripts/**: Database initialization and validation scripts.

## Architecture Diagram

```
+-------------------+     +-------------------+     +-------------------+
|     Browser       |     |   Next.js App     |     |    Supabase       |
|                   |     |                   |     |   (Auth + DB)     |
|  +-------------+  |<--->|  +-------------+  |<--->|  +-------------+  |
|  | Navbar      |  |     |  | middleware.ts|  |     |  | supabase.ts |  |
|  | Footer      |  |     |  | Auth Guard   |  |     |  | Queries     |  |
|  +-------------+  |     |  +-------------+  |     |  +-------------+  |
|                   |     |  | layout.tsx   |     |                   |
|  +-------------+  |     |  | ThemeProvider|     |                   |
|  | Pages/Routes|  |     |  +-------------+  |     |                   |
|  | - dashboard |  |     |                   |     |                   |
|  | - listings  |  |     |  +-------------+  |     |                   |
|  | - admin/*   |  |     |  | Components   |     |                   |
|  | - auth/*    |  |     |  | - ui/*       |     |                   |
|  +-------------+  |     |  | - Hooks      |     |                   |
|                   |     |  +-------------+  |     |                   |
+-------------------+     +-------------------+     +-------------------+
         |                         ^
         |                         |
         v                         |
    +----------+              lib/utils.ts
    | Assets   |                   |
    | (public) |<------------------+
    +----------+
```

- **Flow**: User requests → Middleware (auth) → Layouts → Pages → Components/Hooks → Supabase (via lib) → DB response.

## Key Components

| Component/Module       | Location              | Description |
|------------------------|-----------------------|-------------|
| Navbar.tsx            | components/           | Top navigation bar with links to home, listings, services, dashboard, etc. Responsive with mobile menu. |
| Footer.tsx            | components/           | Bottom footer with links and branding. |
| ThemeProvider.tsx     | components/           | Wraps app for next-themes; handles light/dark mode persistence. |
| Shadcn/UI Components  | components/ui/        | 50+ primitives (e.g., button.tsx, dialog.tsx, table.tsx, form.tsx) for consistent, accessible UI. |
| layout.tsx (root)     | app/                  | Root layout integrating Navbar, Footer, ThemeProvider, and metadata. |
| layout.tsx (admin)    | app/admin/            | Admin-specific layout with sidebar/navigation. |
| supabase.ts           | lib/                  | Initializes Supabase clients for server (createServerClient) and browser use with SSR support. |
| use-toast.ts          | hooks/                | Custom hook for sonner toast notifications. |
| use-mobile.ts         | hooks/components/ui/  | Hook for detecting mobile viewport (used in responsive components). |
| loading.tsx           | app/                  | Global suspense/loading boundary UI. |

## Data Flow

1. **Request Entry**: Browser → `middleware.ts` (auth checks via Supabase; redirects unauth users).
2. **Layout Rendering**: Root `layout.tsx` → ThemeProvider → Navbar/Footer → Page content.
3. **Page Load**: Route-specific `page.tsx` (e.g., `app/listings/page.tsx`) fetches data server-side using Supabase from `lib/supabase.ts`.
4. **Client Interactions**: Forms (React Hook Form + Zod) → Mutations via Supabase client → Optimistic UI updates (e.g., toasts via `use-toast`).
5. **Auth Flow**: `app/auth/*` routes handle Supabase auth (login/signup) → Callback → Session storage → Protected routes (dashboard/admin).
6. **Real-time**: Supabase subscriptions possible via client (not explicitly shown but supported).
7. **Assets**: Static files from `public/` served directly.

Server Components fetch data; Client Components ("use client") handle interactivity.

## Configuration

- **Environment Variables** (`.env.local` based on `.env.example`):
  ```
  NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
  ```
  Required for Supabase integration.

- **Key Config Files**:
  | File                | Purpose |
  |---------------------|---------|
  | tsconfig.json       | TypeScript config: Strict mode, paths (`@/*`), Next.js plugins. |
  | next.config.mjs     | Next.js config (e.g., images, experimental features). |
  | tailwind.config.ts  | Tailwind setup (content paths, theme extensions). |
  | components.json     | Shadcn/UI config for component generation. |
  | postcss.config.mjs  | PostCSS with Tailwind/Autoprefixer. |
  | middleware.ts       | Route protection (e.g., admin/user auth redirects). |

## Dependencies

| Dependency Category | Key Packages | Rationale |
|---------------------|--------------|-----------|
| **UI/Primitives**   | Radix UI, lucide-react, Shadcn/UI | Accessible, unstyled primitives + icons for custom theming with Tailwind. |
| **Forms/Validation**| React Hook Form, Zod, @hookform/resolvers | Performant forms with type-safe schema validation. |
| **Auth/Database**   | Supabase SSR/JS | Full-stack Postgres, auth (OAuth/email), real-time without backend code. |
| **Styling/Theming** | Tailwind CSS, next-themes, cva/clsx/tailwind-merge | Rapid styling, mode switching, variant/class utilities. |
| **Notifications/UX**| sonner, input-otp, recharts | Toasts, OTP (e.g., 2FA), charts for dashboards. |
| **Utils/Layout**    | embla-carousel-react, react-resizable-panels, vaul | Carousels (listings), resizable panels (admin), drawers (mobile). |
| **Analytics**       | @vercel/analytics | Vercel deployment insights. |

All dependencies are managed via `package.json`; use `pnpm install` (lockfile present).
```

## Deployment Notes

- Deploy to Vercel: Auto-deploys on `main` merge (v0 integration).
- DB Setup: Run `scripts/init-db.sql` and `scripts/upgrade-admin.sql` on Supabase.
- Local Dev: `pnpm dev`; requires Supabase env vars.