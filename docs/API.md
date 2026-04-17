# API Documentation

## Overview

The **v0-delta-car-platform** is a Next.js 16 web application bootstrapped with [v0](https://v0.app), utilizing the App Router, Tailwind CSS, shadcn/ui components, and Supabase for authentication and database operations. 

**API Design Philosophy**: There are **no custom REST, GraphQL, or JSON API endpoints** exposed by this application (no `app/api/` directory exists). The application is a full-stack web app where:
- Frontend pages interact directly with Supabase via the client-side Supabase JavaScript SDK (`@supabase/supabase-js` and `@supabase/ssr`).
- Row Level Security (RLS) on Supabase handles authorization.
- Server-side rendering (SSR) support for auth is provided via `middleware.ts` and `lib/supabase.ts`.
- All user-facing "endpoints" are HTML/JSX pages served via Next.js routes.

Data models (e.g., listings, users, maintenance) are managed in a Supabase PostgreSQL database, initialized via `scripts/init-db.sql`. Custom scripts in `/scripts` assist with DB validation and admin setup.

For programmatic access to data, integrate the Supabase client directly (see [Authentication](#authentication)). Supabase exposes its own auto-generated REST API and Realtime subscriptions based on your project's tables.

**Conventions**:
- Client-side data fetching/mutations use Supabase queries.
- Protected routes (e.g., `/dashboard`, `/admin/*`, `/listings/create`) require authentication.
- Environment variables: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (see `.env.example`).

## Authentication

Authentication is fully managed by **Supabase Auth** (email/password, with potential for OAuth via routes like `/auth/callback`).

- **Client Initialization**: Handled in `lib/supabase.ts` (creates Supabase clients for browser/server using `@supabase/ssr`).
- **Auth Flows**:
  | Flow | Route/Page | Description |
  |------|------------|-------------|
  | Login | `GET /auth/login` (`app/auth/login/page.tsx`) | Renders login form; submits to Supabase `signInWithPassword`. |
  | Signup | `GET /auth/signup` (`app/auth/signup/page.tsx`) | Renders signup form; submits to Supabase `signUp`. |
  | Forgot Password | `GET /auth/forgot-password` (`app/auth/forgot-password/page.tsx`) | Password reset request form; uses Supabase `resetPasswordForEmail`. |
  | Update Password | `GET /auth/update-password` (`app/auth/update-password/page.tsx`) | Post-reset password update; uses Supabase `updateUser`. |
  | Callback | `GET /auth/callback` (`app/auth/callback/page.tsx`) | Handles OAuth/redirect callbacks from Supabase. |

- **Protected Routes**: Enforced client-side via Supabase session checks (e.g., `supabase.auth.getSession()`). `middleware.ts` likely redirects unauthenticated users.
- **Session Management**: Uses Supabase SSR for server components; hooks like `use-toast.ts` may handle auth toasts.
- **Logout**: Inferred via dashboard/settings pages (uses `supabase.auth.signOut()`).

Example client-side auth (inferred from deps and structure):
```typescript
import { createClient } from '@/lib/supabase';

const supabase = createClient();
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password',
});
```

## Base URL

- **Web App**: `http://localhost:3000` (dev) or your Vercel deployment URL.
- **Supabase REST API**: `${NEXT_PUBLIC_SUPABASE_URL}/rest/v1/` (auto-generated per table; requires `NEXT_PUBLIC_SUPABASE_ANON_KEY` or JWT).
- No custom base path for APIs.

## Endpoints

No custom endpoints exist. Use **Supabase REST API** for data operations (e.g., `GET /listings`, `POST /listings`). Tables inferred from routes/scripts: `listings`, `maintenance`, `users`, `services`.

**Web Routes** (HTML pages; all `GET` methods):
| Path | Description | Auth Required? | Notes |
|------|-------------|----------------|-------|
| `/` | Home page (`app/(home)/page.tsx`) | No | Landing page. |
| `/about` | About page (`app/about/page.tsx`) | No | Static info. |
| `/admin` | Admin dashboard (`app/admin/page.tsx`) | Yes | Layout: `app/admin/layout.tsx`. |
| `/admin/listings` | Admin listings management | Yes | Sub-route under `/admin`. |
| `/admin/maintenance` | Admin maintenance | Yes | Sub-route under `/admin`. |
| `/admin/users` | Admin users management | Yes | Sub-route under `/admin`. |
| `/dashboard` | User dashboard (`app/dashboard/page.tsx`) | Yes | Personalized view. |
| `/how-it-works` | How it works page (`app/how-it-works/page.tsx`) | No | Educational content. |
| `/listings` | Car/services listings overview (`app/listings/page.tsx`) | No | Public listings. |
| `/listings/create` | Create new listing | Yes | Form submission to Supabase. |
| `/listings/[id]` | Single listing details (`app/listings/[id]/page.tsx`) | No | Dynamic route. |
| `/maintenance` | Maintenance page (`app/maintenance/page.tsx`) | ? | Public or user-facing. |
| `/maintenance/request` | Maintenance request form | Yes | Sub-route. |
| `/services` | Services page (`app/services/page.tsx`) | No | Services listing. |
| `/settings/profile` | User profile settings | Yes | Under `/settings`. |
| `/auth/*` | See [Authentication](#authentication) | No | Auth pages. |

- **Request Parameters/Body**: Form data via React Hook Form + Zod validation (e.g., in listing creation).
- **Response Format**: HTML/JSX pages with JSON data fetched client-side.
- **Example Request/Response**: N/A (browser navigation).
- **Error Codes**: Client-side toasts via `sonner`/`use-toast.ts`; Supabase errors (e.g., 401 Unauthorized).

**Global Elements**:
- Loading: `app/loading.tsx`.
- Layouts: `app/layout.tsx`, `app/admin/layout.tsx`.
- Styling: `app/globals.css`.

## Rate Limiting

N/A for custom APIs. Supabase enforces rate limits (see Supabase dashboard). Next.js handles DDoS via Vercel.

## Webhooks

N/A. Supabase supports database webhooks (configure in Supabase dashboard for events like insert/update on `listings`).

## Development Interfaces (Scripts/CLI)

Use npm/pnpm for app lifecycle; custom scripts for DB management.

### NPM Scripts (`package.json`)
| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server (`next dev`). |
| `npm run build` | Build for production (`next build`). |
| `npm run start` | Start production server (`next start`). |
| `npm run lint` | Lint code (`eslint .`). |

### Custom Scripts (`/scripts`)
| Script | Description | Usage |
|--------|-------------|-------|
| `init-db.sql` | Initializes Supabase schema (tables, RLS, etc.). | Run in Supabase SQL editor. |
| `upgrade-admin.sql` | Upgrades admin privileges. | Run in Supabase SQL editor. |
| `check-db.js` | Validates DB schema. | `node scripts/check-db.js` |
| `check-db-hardcoded.js` | Checks hardcoded DB values. | `node scripts/check-db-hardcoded.js` |
| `debug-admin.js` | Debugs admin setup. | `node scripts/debug-admin.js` |

### Environment Setup
Copy `.env.example` to `.env.local` and populate Supabase credentials.

For full Supabase integration details, inspect `lib/supabase.ts` and `lib/utils.ts`. Deploy via Vercel (auto-linked via v0).