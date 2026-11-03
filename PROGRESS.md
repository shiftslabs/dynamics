# Shiftslabs Business OS — Implementation Progress

## Current Blocker (unresolved)
- Render build fails at prerender `/404`: `<Html> should not be imported outside of pages/_document` (chunk 189.js).
- Attempted: app/not-found.tsx (server component, force-dynamic), app/error.tsx, app/global-error.tsx, pages/404.tsx removed, pages/_error.tsx removed.
- Root cause unknown: a transitive dependency imports `Html` from `next/document`. No source file imports next/document.
- Needs local `pnpm install` + `next build` to identify offending dependency, or pin/upgrade the culprit package.

## Repo / Stack
- GitHub: https://github.com/shiftslabs/dynamics (private), branch master
- Stack: pnpm workspaces + Turborepo, Next.js 15.5.28, React 19.3.1, Prisma 6.19.3, Neon Postgres, S3
- Render service: srv-dbjlnc5g1s2s73843ko0 → https://craftkoru.onrender.com
- Build: `pnpm install --ignore-scripts && pnpm --filter @shiftslabs/database db:generate && pnpm --filter craftkoru build`
- Env: shiftslabs.env at repo root (Neon + S3 creds; removed from .gitignore per owner)

## Craftkoru — Implemented
- UI pages: /, dashboard, customers, jobs, jobs/new, jobs/[jobId], measurements, fittings, materials, appointments, invoices, sales, payments, expenses, staff, commissions, reports/profitability, settings (+ booking/notifications/permissions), global-error, error, not-found
- API routes: customers, customers/[id], jobs, jobs/[id], appointments, invoices, services, materials, expenses, payments, sales, stock-movements, reports/profitability
- Design: Agent K7 dark theme
- Packages wired: database, config (plans)

## Craftkoru — TODO
- Auth + multi-tenant scoping (packages/auth, tenant-scope exist, not wired)
- DB migrations on startup (plug-and-play)
- Customers detail page
- Settings persistence
- Tests
- Remove mock/placeholder data

## Anvilgrid — Status
- Shell + dashboard/customers/jobs pages + jobs API only

## Shared Packages
- database, auth, permissions, notifications, ui, config, etc. defined; mostly unwired

## Next Steps
1. Resolve /404 prerender Html import (local build or dependency audit).
2. Once green, smoke-test live URL.
3. Wire auth + tenant scoping, migrations on startup.
4. Complete Anvilgrid vertical.
5. Add tests.
