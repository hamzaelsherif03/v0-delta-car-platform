```markdown
# v0-delta-car-platform Context

## Project Summary
A Next.js web app for a car platform (likely rentals/sales), featuring user auth, dashboards, listings, admin panels, maintenance requests, and services. Integrated with Supabase for auth/DB. Supports dark/light themes, responsive design, and admin CRUD operations.

## Tech Stack
- **Framework**: Next.js 16.2.0 (App Router, React 19.2.4)
- **Styling**: Tailwind CSS 4.2.0, shadcn/ui (Radix UI primitives + class-variance-authority/clsx/tailwind-merge)
- **Forms/Validation**: React Hook Form 7 + Zod + @hookform/resolvers
- **Database/Auth**: Supabase (ssr/js clients)
- **UI Libs**: Lucide icons, Sonner toasts, Recharts, Embla Carousel, React Day Picker
- **Utils**: date-fns, vaul (drawers), react-resizable-panels
- **Build Tools**: TypeScript 5.7.3, PostCSS, ESLint

## Key Files (Read First)
- `app/layout.tsx`: Root layout, theme provider, Navbar/Footer.
- `lib/supabase.ts`: Supabase clients (server/auth/browser).
- `middleware.ts`: Auth redirects (e.g., protect admin/dashboard).
- `app/globals.css`: Global styles/Tailwind.
- `components/Navbar.tsx` / `Footer.tsx`: Shared navigation.
- `components/theme-provider.tsx`: Next Themes integration.
- `app/admin/layout.tsx`: Admin-specific layout.
- `.env.example`: Supabase config (copy to `.env.local`).
- `components.json`: shadcn/ui config for adding components.

## Architecture
- **Routing**: App Router (`app/` dir). Parallel routes/groups: `(home)`, auth subdirs, dynamic `[id]`.
- **Components**:
  - `components/`: App-wide (Navbar, Footer, theme-provider).
  - `components/ui/`: 50+ shadcn primitives (Button, Card, Table, Dialog, etc.).
- **Pages**: Home, About, Dashboard, Listings (list/create/[id]), Services, Maintenance, Admin (users/listings/maintenance), Auth flows.
- **Data Flow**: Server Components fetch via Supabase server client. Client Components use browser client/hooks. Forms: `useForm(zodSchema)`.
- **Auth**: Supabase SSR. Middleware protects routes. Admin checks role.
- **Theming**: `next-themes` with dark/light/system toggle.

## Patterns & Conventions
- **Naming**: Kebab-case dirs/files, PascalCase components. `@/*` alias (tsconfig paths).
- **Components**: `<Button variant="outline">` (cva variants). `cn()` for clsx/Tailwind.
- **Forms**: `useForm({ resolver: zodResolver(schema) })`, `<Form.Field>`.
- **Hooks**: `use-toast.ts`, `use-mobile.ts` in `hooks/`.
- **Server Actions**: `async function` with `"use server"`.
- **Types**: Full TS, Zod for runtime/infer types.
- **Mobile**: Responsive Tailwind + `use-mobile` hook/Sidebar/Drawer.

## Common Tasks
- **New Page/Route**: Add `app/new-route/page.tsx`. Use `<Navbar />`, Supabase queries.
- **New shadcn Component**: `npx shadcn@latest add button` (uses `components.json`).
- **Supabase Query**:
  ```tsx
  // Server
  import { createServerClient } from '@/lib/supabase';
  const supabase = createServerClient(cookies());
  const { data } = await supabase.from('listings').select('*');
  ```
- **Protected Route**: Use middleware.ts patterns or `useEffect` checks.
- **Form**:
  ```tsx
  const form = useForm({ resolver: zodResolver(schema) });
  function onSubmit(data) { createServerAction(data); }
  ```
- **Bug Fix**: `npm run lint`, check console/Supabase logs, dev server auto-reloads.
- **Deploy**: Push to main (deploys to Vercel).

## Testing
- No E2E/unit tests configured (no Jest/Vitest). Add via `npm i -D vitest @testing-library/react`.
- Lint: `npm run lint`.
- Manual: `npm run dev`, browser + Supabase dashboard.

## Important Notes
- **Env**: Set `NEXT_PUBLIC_SUPABASE_URL/ANON_KEY` in `.env.local`. Restart dev server.
- **Tailwind 4**: Uses `@tailwindcss/postcss7-8` compat; no JIT issues.
- **Supabase**: Row Level Security (RLS) assumed; check `scripts/init-db.sql`.
- **Gotchas**: React 19 strict mode; no `use client` unless interactive. Admin routes need role checks. Placeholders in `public/` for images.
- **Scripts**: `scripts/` for DB init/debug (e.g., `node scripts/init-db.sql` via Supabase CLI).
```

*(298 lines)*