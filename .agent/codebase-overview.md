```markdown
# v0-delta-car-platform: Codebase Overview

Car service/rental platform built with Next.js App Router, Supabase auth/DB, shadcn/ui.

## File Index
- **PROJECT_OVERVIEW.md**: High-level project description and goals.
- **README.md**: Setup, run instructions, and quick start.
- **app/layout.tsx**: Root layout with theme provider, Navbar, Footer.
- **app/(home)/page.tsx**: Landing/home page.
- **app/admin/layout.tsx**: Admin dashboard layout.
- **app/listings/page.tsx**: Public listings index.
- **app/listings/[id]/page.tsx**: Single listing view.
- **lib/supabase.ts**: Supabase client creation (auth, DB).
- **lib/utils.ts**: Shared utils (e.g., cn() classnames, DOM utils).
- **middleware.ts**: Route protection (auth checks).
- **components/Navbar.tsx**: Top navigation with auth links.
- **components/theme-provider.tsx**: Theme context (light/dark mode).
- **hooks/use-mobile.ts**: Mobile detection hook.
- **hooks/use-toast.ts**: Toast notification hook.

## Directory Map
- **app/**: Next.js pages/layouts/routes (home, auth, admin, listings, dashboard, etc.).
- **components/**: Reusable UI (Navbar, Footer, shadcn/ui primitives like button.tsx, card.tsx).
- **hooks/**: Custom React hooks (mobile detect, toasts).
- **lib/**: Core utils and Supabase setup.
- **public/**: Static assets (logos, images for services/users).
- **scripts/**: DB tools (init-db.sql, schema checks, admin upgrades).
- **styles/**: Global CSS (globals.css).

## Entry Points
- **middleware.ts**: Request middleware (auth redirects).
- **app/layout.tsx**: Root app layout (wraps all pages).
- **app/(home)/page.tsx**: Default home route.

## Key Functions/Classes
- **createClient()** (lib/supabase.ts): Supabase browser/server clients.
- **cn()** (lib/utils.ts): Tailwind class merger.
- **useMobile()** (hooks/use-mobile.ts): Returns mobile screen state.
- **useToast()** (hooks/use-toast.ts): Toast actions (toast(), dismiss()).
- **ThemeProvider** (components/theme-provider.tsx): Manages dark/light mode.

## Dependencies
- **next**: App Router framework.
- **@supabase/supabase-js**: Auth, realtime DB.
- **@radix-ui/**: shadcn/ui primitives (dialog, popover, etc.).
- **tailwindcss**: Styling (via shadcn).
- **lucide-react**: Icons.
- **clsx**, **tailwind-merge**: Class utilities.
- **pnpm**: Package manager (pnpm-lock.yaml).
```
```