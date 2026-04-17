# v0-delta-car-platform Setup Guide

This document provides comprehensive instructions for setting up and running the v0-delta-car-platform, a Next.js application built with React, TypeScript, Supabase, Tailwind CSS, Radix UI, Zod, React Hook Form, and Next Themes.

## Prerequisites

- **Node.js**: Version 20 or higher (LTS recommended).
- **Package Manager**: npm (v10+), Yarn (v1.22+ or v3+), or pnpm (v8+).
- **Git**: For cloning the repository.
- **Supabase Account**: Required for database and authentication setup (free tier sufficient).
- **Code Editor**: VS Code recommended (see [IDE Setup](#ide-setup) for extensions).

## Quick Start

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd v0-delta-car-platform
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Copy and configure environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Update `.env.local` with your Supabase URL and anon key.

4. Set up Supabase (create a project at [supabase.com](https://supabase.com) and copy the keys into `.env.local`).

5. Run the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

## Detailed Installation

### Clone Repository
```bash
git clone <repository-url>
cd v0-delta-car-platform
```

### Install Dependencies
The project uses npm, Yarn, or pnpm as the build system. Run one of the following:
```bash
npm install
# or
yarn install
# or
pnpm install
```

This installs all dependencies listed in `package.json`, including:
- Next.js 16.2.0
- React 19.2.4
- TypeScript 5.7.3
- Supabase (`@supabase/ssr`, `@supabase/supabase-js`)
- Tailwind CSS 4.2.0
- Radix UI primitives
- Zod 3.24.1
- React Hook Form 7.54.1
- And other UI/formatting libraries (e.g., `lucide-react`, `class-variance-authority`, `sonner`).

### Environment Setup
Copy the example environment file:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```
- Obtain these from your Supabase project dashboard (Settings > API).

**Note**: `.env.local` is gitignored and used by Next.js for local development.

### Database Setup
1. Create a free Supabase project at [supabase.com](https://supabase.com).
2. Copy the **Project URL** and **anon/public key** into `.env.local`.
3. The application uses Supabase for data storage and authentication (via `@supabase/ssr` and `@supabase/supabase-js`). No additional schema setup is required beyond the default project initialization, as the app integrates directly with Supabase tables and auth.

## Running the Application

### Development Mode
Start the development server with hot reloading:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```
- Access at [http://localhost:3000](http://localhost:3000).
- Edit files in `app/` (e.g., `app/page.tsx`) for live updates.

### Production Mode
1. Build the optimized production bundle:
   ```bash
   npm run build
   # or
   yarn build
   # or
   pnpm build
   ```
2. Start the production server:
   ```bash
   npm start
   # or
   yarn start
   # or
   pnpm start
   ```
- Serves at [http://localhost:3000](http://localhost:3000).

### With Docker
Not applicable. No Docker configuration or Dockerfile is present in the codebase.

## Running Tests
Not applicable. No test scripts or testing frameworks (e.g., Jest, Vitest) are configured in `package.json`.

To add tests, install a framework like Jest or Vitest and configure scripts accordingly.

Additional available scripts:
- `npm run lint` (runs ESLint on the codebase).

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `Port 3000 is already in use` | Kill the process on port 3000 (`npx kill-port 3000`) or run `npm run dev -- -p 3001`. |
| `Module not found` or dependency errors | Delete `node_modules` and `package-lock.json` (or yarn.lock/pnpm-lock.yaml), then reinstall: `npm install`. |
| Supabase errors (e.g., invalid URL/key) | Verify `.env.local` values match your Supabase dashboard. Restart the dev server after changes. |
| TypeScript errors | Run `npm run lint` or check `tsconfig.json`. Ensure Node version ≥20. |
| Tailwind styles not applying | Restart the dev server; ensure `tailwind.config.js` and PostCSS are intact. |
| Build fails in production | Run `npm run build` locally first; check for missing env vars or TypeScript issues. |

If issues persist, check browser console, terminal logs, or the [Next.js Documentation](https://nextjs.org/docs).

## IDE Setup
Recommended for VS Code:

| Extension | Purpose |
|-----------|---------|
| [TypeScript Importer](https://marketplace.visualstudio.com/items?itemName=pmneo.tsimporter) | Auto-import TypeScript modules. |
| [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) | Tailwind autocompletion and hover previews. |
| [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) | Lint integration (matches `npm run lint`). |
| [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) | Code formatting. |
| [Next.js Snippets](https://marketplace.visualstudio.com/items?itemName=ms-vscode.nextjs-snippets) | Next.js/ React shortcuts. |
| [Zod Validator](https://marketplace.visualstudio.com/items?itemName=loiane.zod-validator) | Zod schema validation support. |

Enable TypeScript language server via `tsconfig.json` plugins. Use `@/*` path aliases for imports (e.g., `import { Button } from '@/components/ui/button'`).