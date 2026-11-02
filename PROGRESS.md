# Shiftslabs Business OS — Implementation Progress

Last updated: 2026-11-02 (deploy in progress)

## Repo
- GitHub: https://github.com/shiftslabs/dynamics (private)
- Owner: shiftslabs
- Default branch: master
- Stack: pnpm workspaces + Turborepo, Next.js 15 (App Router), React 19, Prisma 6, Neon Postgres, S3 storage, Tailwind 3
- Live deploy target: Render service srv-dbjlnc5g1s2s73843ko0 → https://craftkoru.onrender.com
- Build command: `pnpm install --ignore-scripts && pnpm --filter @shiftslabs/database db:generate && pnpm --filter craftkoru build`
- Start command: `pnpm --filter craftkoru start` (port 3001)
- Env file: `shiftslabs.env` at repo root (removed from .gitignore per owner request; contains live Neon + S3 creds)

## Current Blocker
- Render build was failing; latest fix reverted to Next 15 + React 19 with next.config.js. Deploy status unknown — poll service deploys.
- Earlier failure: prerender `/404` with `<Html> should not be imported outside of pages/_document` (Next 15). Added `app/not-found.tsx`, `app/error.tsx`, `app/global-error.tsx`, `pages/_error.tsx` to override defaults.
- Second failure: Next 14 doesn't support `next.config.ts` → converted to `next.config.js`.
- Third failure: React 18 type mismatch with lucide-react 0.468.0 → reverted to React 19.

## Monorepo Layout
- apps/craftkoru — primary sellable app (tailoring/craft business OS)
- apps/anvilgrid — second vertical (early shell)
- packages/* — shared libraries: auth, business-core, catalogue, config, customers, database, finance, inventory, observability, permissions, profession-registry, scheduling, ui, validation, work-orders
- prisma schema: packages/database/prisma/schema.prisma

## Craftkoru — Implemented
### UI Pages (app/craftkoru/*)
- / (landing page)
- dashboard
- customers
- jobs, jobs/new, jobs/[jobId]
- measurements
- fittings
- materials
- appointments
- invoices
- sales
- payments
- expenses
- staff
- commissions
- reports/profitability
- settings (+ booking, notifications, permissions)
- error.tsx, global-error.tsx, not-found.tsx

### API Routes (app/api/*)
- customers (GET/POST), customers/[customerId] (GET/PATCH/DELETE)
- jobs (GET/POST), jobs/[jobId] (GET/PATCH/DELETE)
- appointments (GET/POST)
- invoices (GET/POST)
- services (GET/POST)
- materials (GET/POST)
- expenses (GET/POST)
- payments (GET/POST)

### Design System
- Agent K7 design system applied across all pages (dark theme, blue-600 primary, rounded cards, lucide icons)

## Craftkoru — NOT Implemented / TODO
- Sales API route (app/api/sales) — page exists, no backend
- Customers detail page (app/craftkoru/customers/[id]) — not created
- Stock movements / inventory adjustments API
- Reports API (profitability aggregation)
- Settings persistence (booking/notifications/permissions) — UI only
- DB migrations on startup (user wants plug-and-play, no manual Neon steps)
- Auth/session wiring (packages/auth exists, not wired into app)
- Multi-tenant scoping (packages/database/tenant-scope exists, not applied)
- Landing page SEO/metadata polish
- Email/SMS notifications (packages/notifications exists)
- Tests (none yet)

## Anvilgrid — Implemented
- App shell (layout, globals, nav)
- dashboard, customers, jobs pages
- jobs API route

## Anvilgrid — NOT Implemented
- All other vertical pages and APIs
- Shared auth/tenant wiring

## Shared Packages — Status
- database: Prisma client, schema, tenant-scope helper — defined
- auth: defined, not wired
- permissions: defined, not wired
- notifications: defined, not wired
- ui: component library, consumed
- config: plans defined, consumed
- Others: defined, partially consumed

## Environment / Deploy
- Neon Postgres URL stored in shiftslabs.env (DATABASE_URL)
- S3 creds in shiftslabs.env (S3_*)
- Render env vars must be set manually (DATABASE_URL, etc.) — user wants auto-run migrations on startup
- Node version on Render: 24.x (packageManager pins pnpm 12.16.1)

## Next Steps for Continuing AI
1. Poll latest deploy status; if failed, read logs and fix.
2. If build succeeds, open https://craftkoru.onrender.com and smoke-test all pages.
3. Add remaining Craftkoru APIs: sales, stock movements, reports aggregation.
4. Wire auth + multi-tenant scoping into app routes.
5. Add DB migration on startup (prisma migrate deploy in start script or init).
6. Remove mock/placeholder data; ensure all pages fetch real data.
7. Add tests.
8. Continue Anvilgrid vertical.

## Key Files
- apps/craftkoru/next.config.js (Next 15 config)
- apps/craftkoru/app/layout.tsx
- apps/craftkoru/app/not-found.tsx, error.tsx, global-error.tsx
- apps/craftkoru/pages/_error.tsx
- apps/craftkoru/app/api/* routes
- packages/database/prisma/schema.prisma
- pnpm-workspace.yaml
- shiftslabs.env
