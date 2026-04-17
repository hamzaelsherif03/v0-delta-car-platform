```markdown
# v0-delta-car-platform Docs Index

Welcome to the documentation for **v0-delta-car-platform**, a Next.js web application for a car platform. It features user authentication, listings management, admin dashboard, maintenance requests, services, and profile settings, powered by Supabase backend. Core shared components include `Navbar.tsx`, `Footer.tsx`, `ThemeProvider.tsx`, and Shadcn/UI primitives.

This index provides quick navigation to all docs in the `/docs` folder.

## Documentation Index

- **[GETTING-STARTED.md](./GETTING-STARTED.md)** - Installation, setup, and local development.
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - High-level overview of app structure, routing, and data flow.
- **[COMPONENTS.md](./COMPONENTS.md)** - Shared UI components: `Navbar.tsx`, `Footer.tsx`, `ThemeProvider.tsx`, and Shadcn/UI usage.
- **[AUTHENTICATION.md](./AUTHENTICATION.md)** - Supabase auth integration, sessions, and protected routes.
- **[LISTINGS.md](./LISTINGS.md)** - Car listings management, CRUD operations, and UI flows.
- **[ADMIN-DASHBOARD.md](./ADMIN-DASHBOARD.md)** - Admin features for moderation and analytics.
- **[SERVICES-AND-MAINTENANCE.md](./SERVICES-AND-MAINTENANCE.md)** - Maintenance requests and services handling.
- **[PROFILE-SETTINGS.md](./PROFILE-SETTINGS.md)** - User profile management and settings.
- **[SUPABASE.md](./SUPABASE.md)** - Database schemas, RLS policies, and backend queries.
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Vercel/Next.js deployment and environment setup.
- **[API-REFERENCE.md](./API-REFERENCE.md)** - Server actions, API routes, and Supabase edge functions.

## Quick Links

| Document                  | Description                                                                 | When to Read |
|---------------------------|-----------------------------------------------------------------------------|--------------|
| GETTING-STARTED.md       | Clone, install deps, env setup, and run dev server.                         | First thing |
| ARCHITECTURE.md          | App layers, pages/router, state management.                                 | Onboarding  |
| COMPONENTS.md            | Reusable UI: Navbar, Footer, ThemeProvider, Shadcn/UI.                      | UI changes  |
| AUTHENTICATION.md        | Login/signup, middleware, Supabase auth hooks.                              | Auth issues |
| LISTINGS.md              | Listing pages, forms, Supabase queries.                                     | Listings work |
| ADMIN-DASHBOARD.md       | Admin routes, permissions, dashboard components.                            | Admin tasks |
| SERVICES-AND-MAINTENANCE.md | Request flows, service bookings.                                        | Feature dev |
| PROFILE-SETTINGS.md      | Profile edits, avatar uploads.                                              | User features |
| SUPABASE.md              | Tables, policies, realtime subscriptions.                                   | DB changes  |
| DEPLOYMENT.md            | CI/CD, env vars, production builds.                                         | Deploy time |
| API-REFERENCE.md         | Endpoints, types, error handling.                                           | API integration |

## Reading Order (for New Developers)

1. **GETTING-STARTED.md** - Get the app running locally.
2. **ARCHITECTURE.md** - Understand the big picture.
3. **AUTHENTICATION.md** - Core user flows.
4. **COMPONENTS.md** - UI building blocks.
5. **SUPABASE.md** - Backend essentials.
6. Feature-specific docs (LISTINGS.md, ADMIN-DASHBOARD.md, etc.) as needed.
7. **DEPLOYMENT.md** and **API-REFERENCE.md** for production.

## Contributing to Docs

- Edit `.md` files directly in `/docs`.
- Use Markdown with headings, tables, code blocks (fenced with ```tsx or ```sql).
- Preview changes with a Markdown viewer or VS Code.
- Keep docs concise, code-accurate, and link to source files (e.g., `[Navbar.tsx](../components/Navbar.tsx)`).
- Submit PRs with changes; no separate review needed for docs.

Last updated: [Insert date or use Git].
```