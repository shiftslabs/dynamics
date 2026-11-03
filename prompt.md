# SHIFTSLABS BUSINESS OS — MASTER EXECUTION PROMPT FOR JULES

## 0. YOUR MISSION

You are Jules, acting as the principal software architect, senior full-stack engineer, database architect, security engineer, product designer, QA engineer, DevOps engineer, and technical writer for **Shiftslabs Business OS**.

Your task is to **build the complete production-ready Shiftslabs monorepo from the existing private repository**, not merely produce a plan, scaffold, mockup, prototype, or MVP.

The repository is private and must remain private. The owner intends to keep the infrastructure and development under Shiftslabs’ control. Build the system so Shiftslabs can operate, maintain, deploy, and evolve it without being forced to depend on a proprietary application platform or managed backend that owns the core business logic.

**Do not stop after writing a plan. Inspect the repository, implement the system, run checks, fix failures, and provide a truthful implementation report.**

Do not ask the owner to manually create every file or directory. Create the complete directory structure, source files, configuration files, database models, migrations, tests, documentation, scripts, UI, API routes, workers, and deployment configuration required by the implementation.

If a required credential is absent, implement the integration fully, add the exact variable to `shiftslabs.env.example`, document how to obtain it, and continue implementing everything that does not require the live credential. Do not fabricate credentials, URLs, payment confirmations, data, or integration success.

---

# 1. PRODUCT OWNER, FOUNDER STORY, AND PRODUCT PURPOSE

The founder and owner is **Godknows Tochi Okereke**, founder of Shiftslabs.

Include this founder story in the appropriate public-facing company/about documentation and founder section, while keeping it professional and concise:

> Shiftslabs began with a vision to make powerful business technology accessible to businesses of different sizes, industries, and levels of technical experience. Its founder, Godknows Tochi Okereke, is building Shiftslabs around the belief that businesses should not need to assemble dozens of disconnected tools to operate, grow, understand their performance, and serve their customers.
>
> Shiftslabs is being built as a family of connected business applications: specialized tools for different kinds of businesses, supported by a shared business platform and a central hub. The long-term vision is to turn that vision into a real, dependable product that businesses can use every day.

Do not invent biographical details, awards, company history, customer numbers, revenue, or claims that the founder did not provide.

## Product vision

Shiftslabs is a shared Business OS ecosystem consisting of:

1. **Dynamicslabs** — the central business hub and multi-business workspace.
2. **Craftkoru** — personal services business software.
3. **Anvilgrid** — trades, maintenance, and repair business software.
4. **Savorpantry** — food, hospitality, and food-retail business software.
5. **Ledgerverdict** — professional-services business software.
6. **Bazaarmart** — retail and commerce business software.

The five vertical applications must be usable and sellable independently. Dynamicslabs is the hub that brings them together.

## Explicitly out of scope

Do **not** add these projects as applications or dependencies in this monorepo:

- Cloud9
- Cloud8 / DiscoverMe
- Dynamicsstudio
- Aiground / LazyAgent

They are separate Shiftslabs projects.

---

# 2. EXECUTION PRIORITY: BUILD THE SPOKES BEFORE THE HUB

The owner explicitly requires the vertical applications to be implemented and made sellable **before Dynamicslabs**.

Implement in this order:

1. Shared foundation required by every app.
2. Craftkoru.
3. Anvilgrid.
4. Savorpantry.
5. Ledgerverdict.
6. Bazaarmart.
7. Dynamicslabs hub.
8. Cross-app integration, end-to-end testing, deployment verification, and final documentation.

This is an implementation order, not permission to build incomplete or disconnected applications. Shared foundation work must be designed so all six apps ultimately use the same identity, business records, billing, metering, permissions, notifications, and domain services.

Do not build the hub first and leave the vertical applications as empty shells.

---

# 3. NON-NEGOTIABLE IMPLEMENTATION RULES

## 3.1 Production implementation only

- No mock data in production.
- No fake dashboards, fake charts, fake transactions, fake customer records, fake notifications, fake payment status, or hardcoded sample business data.
- No buttons that look functional but do nothing.
- No dead links, placeholder routes, “coming soon” pages, fake integrations, or unimplemented actions presented as completed features.
- Empty states must be real, useful, and explain how the user can create or import actual data.
- Seed only explicitly documented development/test data, and never seed it into production automatically.
- Every implemented UI action must call real application logic and handle success, loading, empty, and error states.

## 3.2 No infrastructure exposure in customer-facing UI

Never display unnecessary implementation details in customer-facing UI, onboarding, errors, toasts, or marketing pages.

**Do not write customer-facing copy such as:**

- “Your data is secured in Neon.”
- “Powered by Render infrastructure.”
- “Your files are stored in Cloudflare R2.”
- “Our CDN is protecting your data.”
- “A Prisma database error occurred.”
- “The WebSocket server failed.”
- “The worker process crashed.”

Do not expose internal service names, hostnames, stack traces, SQL, provider error payloads, environment variable names, credentials, or infrastructure topology.

Use simple product language:

- “Your information is saved securely.”
- “We couldn’t complete that action. Please try again.”
- “Your upload could not be completed.”
- “We’re having trouble syncing right now. Your existing information is still available.”
- “This payment could not be confirmed. Check your payment status or contact support.”

Detailed diagnostics belong in protected server logs and admin observability—not in the customer UI.

## 3.3 No unnecessary code comments

The owner specifically does not want infrastructure explanations or obvious, noisy comments throughout the codebase.

- Do not add comments such as “Signup data is stored in Neon.”
- Do not add comments that merely narrate the next line of code.
- Do not expose architecture, provider details, internal secrets, or deployment details in UI copy.
- Use comments only when they explain a genuinely non-obvious algorithm, security invariant, unusual business rule, or important maintenance constraint.
- Keep meaningful architecture and operations documentation in `/docs`, not scattered as noisy comments.
- Never put secrets in source files, logs, test fixtures, screenshots, client bundles, or documentation.

## 3.4 The owner wants manageable code

The owner is learning software development and expects to maintain and modify the product.

- Use clear names and predictable patterns.
- Avoid unnecessary abstraction and clever code.
- Keep business logic out of UI components.
- Keep provider-specific code behind adapters.
- Make shared behavior genuinely shared rather than duplicated across six apps.
- Document how to run, test, modify, and deploy the system.
- Explain major architectural decisions in plain language in `/docs/architecture`.
- Generate reusable code patterns and a profession generator where practical.
- Do not make the codebase depend on Jules to remain understandable.

---

# 4. EXISTING REPOSITORY INSPECTION

Before making changes:

1. Inspect the current repository, branches, package files, directory structure, existing code, and environment examples.
2. Identify existing work that is useful and preserve it where appropriate.
3. Identify broken, duplicated, unsafe, or obsolete code.
4. Check whether the repository already has a preferred framework, package manager, linting setup, or deployment configuration.
5. Do not blindly overwrite working files.
6. Do not assume that an empty repository means a specific framework has already been configured.
7. Record the actual repository findings in the final implementation report.

If the repository is empty or unsuitable, establish the architecture below.

---

# 5. REQUIRED TECHNOLOGY AND ARCHITECTURE

Use a **TypeScript modular monolith in a pnpm/Turborepo monorepo**, with independently deployable frontends and background workers.

Preferred stack:

- TypeScript
- Next.js for the six web applications, unless the repository has a compelling compatible reason to use another framework
- React
- pnpm workspaces
- Turborepo
- Neon PostgreSQL
- Prisma ORM
- S3-compatible object storage, configured through environment variables
- Paystack for payments
- Resend for transactional email
- Server-side AI provider adapter
- WebSockets for real-time events
- Web Push for browser notifications
- Render for application and worker deployment
- Vitest or an equivalent TypeScript unit/integration test runner
- Playwright for end-to-end browser tests
- Zod or an equivalent runtime validation library

Use compatible stable versions and commit the package lockfile. Do not select experimental versions without a documented reason.

## 5.1 Shared services, separate frontends

All six applications must use the same:

- Identity and authentication
- User accounts
- Business and membership records
- Permissions
- Customer and contact domain
- Billing and subscription entitlements
- Usage metering
- Storage accounting
- Notifications
- Audit logging
- AI intelligence service
- Support system
- Profession registry
- Shared business domain services

Each app may have its own visual identity, navigation, terminology, workflows, and profession-specific modules, but it must not create a separate copy of shared business records.

## 5.2 Deployment model

Deploy each app independently from the same private monorepo:

- `dynamicslabs`
- `craftkoru`
- `anvilgrid`
- `savorpantry`
- `ledgerverdict`
- `bazaarmart`

Also deploy the required workers independently.

Create:

- A single controlled database migration/release job.
- Separate app services.
- Separate worker services.
- Health checks.
- Readiness checks.
- Structured logs.
- A safe migration procedure.
- Rollback guidance.
- A deployment guide for every service.

Do not have all six app services independently race to run database migrations on startup.

## 5.3 Avoid unnecessary infrastructure lock-in

Use adapters for:

- Payments
- Email
- Object storage
- AI providers
- Real-time transport
- Background jobs
- Observability

Business logic must not be tightly coupled to a single provider’s SDK.

Do not introduce a large collection of external services merely because they are popular. Use the simplest reliable implementation that meets the product requirements.

The owner wants Shiftslabs to control its own application code and core business logic. Do not require a proprietary hosted backend platform to operate the system.

---

# 6. MOBILE-FIRST UI AND DESIGN SYSTEM

**Mobile-first design is mandatory, not optional.** The owner expects these applications to be used on mobile devices and eventually wrapped as APKs.

Design and test for:

- 320px mobile width
- 360px
- 390px
- 430px
- Tablet widths
- Desktop widths up to 1600px and beyond

## 6.1 Design principles

Create a polished, professional, modern, international SaaS interface.

- White/light interface as the default.
- Blue as the primary brand color, with restrained gradients and glow effects.
- Clear typography and spacing.
- Strong hierarchy.
- Responsive cards and lists.
- Touch-friendly controls.
- No tiny buttons or cramped navigation.
- No horizontal overflow.
- No desktop table squeezed onto a phone.
- Convert tables into responsive cards or mobile-friendly row layouts when necessary.
- Use accessible dialogs, menus, dropdowns, forms, and focus states.
- Respect reduced-motion preferences.
- Target WCAG 2.2 AA accessibility.
- Use consistent loading skeletons, empty states, success states, and error states.
- Do not use fake charts or fake numbers.

## 6.2 Mobile navigation

On mobile:

- Use a compact top bar.
- Use a bottom navigation bar for the most important destinations.
- Put secondary navigation in an accessible drawer or menu.
- Keep create/add actions easy to reach.
- Ensure forms work with mobile keyboards.
- Prevent dialogs from extending beyond the viewport.
- Ensure date pickers, select menus, and popovers work on touch devices.
- Preserve unsaved form data when safe.
- Use confirmation for destructive actions.

## 6.3 Design system package

Create a shared UI package with:

- Buttons
- Inputs
- Selects
- Checkboxes
- Switches
- Date and time pickers
- Search fields
- Dialogs
- Drawers
- Toasts
- Alerts
- Cards
- Tables
- Mobile list views
- Tabs
- Breadcrumbs
- Pagination
- Filters
- Command/search menu
- Skeletons
- Empty states
- Error states
- Status badges
- Avatar
- File uploader
- Rich text editor where required
- Charts that render only real data
- Responsive page shell
- Sidebar
- Top navigation
- Mobile bottom navigation
- Notification center
- Usage meters

Every shared component must be accessible, responsive, typed, and documented.

---

# 7. MONOREPO DIRECTORY STRUCTURE

Create a complete structure equivalent to the following. Add further directories and files where implementation requires them. Do not omit necessary files merely because they are not listed here.

```text
shiftslabs/
├── apps/
│   ├── dynamicslabs/
│   │   ├── app/
│   │   │   ├── (public)/
│   │   │   ├── (auth)/
│   │   │   ├── (workspace)/
│   │   │   ├── admin/
│   │   │   ├── api/
│   │   │   ├── layout.tsx
│   │   │   ├── loading.tsx
│   │   │   ├── error.tsx
│   │   │   ├── not-found.tsx
│   │   │   └── globals.css
│   │   ├── components/
│   │   ├── features/
│   │   ├── lib/
│   │   ├── public/
│   │   ├── tests/
│   │   ├── next.config.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── craftkoru/
│   ├── anvilgrid/
│   ├── savorpantry/
│   ├── ledgerverdict/
│   └── bazaarmart/
├── packages/
│   ├── database/
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   ├── migrations/
│   │   │   └── seed/
│   │   ├── src/
│   │   │   ├── client.ts
│   │   │   ├── transactions.ts
│   │   │   ├── tenant-scope.ts
│   │   │   └── index.ts
│   │   └── package.json
│   ├── auth/
│   ├── permissions/
│   ├── validation/
│   ├── config/
│   ├── ui/
│   ├── business-core/
│   ├── profession-registry/
│   ├── customers/
│   ├── scheduling/
│   ├── work-orders/
│   ├── catalogue/
│   ├── inventory/
│   ├── purchasing/
│   ├── commerce/
│   ├── finance/
│   ├── documents/
│   ├── billing/
│   ├── metering/
│   ├── storage/
│   ├── notifications/
│   ├── realtime/
│   ├── intelligence/
│   ├── reporting/
│   ├── support/
│   ├── advertising/
│   ├── audit/
│   ├── observability/
│   └── testing/
├── workers/
│   ├── scheduler/
│   ├── notifications/
│   ├── intelligence/
│   ├── billing/
│   ├── storage/
│   ├── advertising/
│   └── reporting/
├── tooling/
│   ├── scripts/
│   ├── generators/
│   ├── deployment/
│   └── validation/
├── docs/
│   ├── architecture/
│   ├── database/
│   ├── api/
│   ├── security/
│   ├── deployment/
│   ├── billing/
│   ├── professions/
│   ├── notifications/
│   ├── intelligence/
│   ├── advertising/
│   ├── user-guides/
│   └── founder/
├── .github/
│   └── workflows/
├── shiftslabs.env.example
├── .gitignore
├── .npmrc
├── package.json
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
├── turbo.json
├── tsconfig.base.json
├── eslint.config.mjs
├── prettier.config.mjs
├── README.md
└── SECURITY.md
```

Each app must have a complete and consistent internal structure. Do not create empty directories as a substitute for implementation.

---

# 8. IDENTITY, AUTHENTICATION, AND ACCOUNT MANAGEMENT

Implement secure shared identity.

## 8.1 Required user journeys

- Register
- Verify email
- Sign in
- Sign out
- Forgot password
- Reset password
- Session expiration
- Session revocation
- Account profile
- Change email with verification
- Change password
- Manage active sessions
- Enable/disable supported MFA
- Account export
- Account deletion request
- Accept business invitation
- Reject business invitation
- Recover account through secure process

## 8.2 Security requirements

- Use a modern password hashing algorithm such as Argon2id through a well-maintained library.
- Never store plaintext passwords.
- Use secure, HTTP-only, same-site cookies for sessions.
- Use CSRF protections where applicable.
- Rotate session identifiers appropriately.
- Rate-limit authentication and recovery endpoints.
- Use single-use, expiring verification and reset tokens.
- Store only token hashes when feasible.
- Avoid revealing whether an email address exists during password recovery.
- Validate all inputs server-side.
- Use secure headers and a restrictive Content Security Policy.
- Never expose secrets in client-side JavaScript.
- Implement account deletion and data export with clear confirmation and audit trail.

## 8.3 Tenant isolation

Every business-owned record must be scoped to an authorized business and, where relevant, an owner/workspace.

- Never trust a `businessId` supplied by the client without verifying membership and permission.
- Every query and mutation must enforce tenant scope.
- Include tests proving that users from Business A cannot access Business B’s records by changing IDs.
- Use centralized tenant-scoped data access helpers.
- Add database constraints and indexes to support safe tenant-scoped queries.
- Consider PostgreSQL Row-Level Security where it improves defense in depth, but do not rely on it as a substitute for application authorization.
- Cross-business sharing must be explicit and consent-based.

---

# 9. BUSINESS WORKSPACE AND MEMBERSHIP MODEL

One user may own or participate in multiple businesses.

Required roles:

- Owner
- Admin
- Manager
- Supervisor
- Staff
- Cashier
- Technician
- Accountant
- Viewer

Permissions must be capability-based and checked on the server.

Support:

- Create business
- Edit business profile
- Set business logo and brand details
- Set timezone
- Set locale
- Set currency
- Set address and contact details
- Set tax configuration
- Invite members
- Assign roles
- Change roles
- Remove members
- Transfer ownership securely
- Suspend/reactivate a business where permitted
- Switch active business
- Switch active app
- View business activity
- Manage branch/location access

A member invited to a business must not be required to purchase a separate subscription merely to work in that business. Billing follows the business owner/workspace entitlement.

---

# 10. PROFESSION REGISTRY — CONFIGURATION-DRIVEN, NOT HARDCODED

Profession support must be registry-driven.

Do not scatter checks such as:

```ts
if (profession === "tailor") ...
else if (profession === "barber") ...
```

throughout the codebase.

Create versioned profession definitions containing:

- Profession ID
- Display name
- Vertical app
- Description
- Icon identifier
- Terminology overrides
- Enabled capabilities
- Default navigation
- Workflow templates
- Form definitions
- Report definitions
- Relevant permissions
- Required settings
- Optional settings
- Default statuses
- Supported catalogue types
- Supported scheduling rules
- Supported inventory behavior
- Supported costing behavior
- Supported document templates
- Registry version
- Migration/compatibility metadata where needed

Profession-specific configuration must be validated with a schema.

## 10.1 Initial 20-profession catalogue

Implement the registry with at least these initial professions. If a profession is better assigned to another vertical, preserve the profession but document the mapping.

### Craftkoru
1. Tailor / Fashion Designer
2. Barber
3. Hair Stylist / Hairdresser
4. Beauty Artist / Makeup Artist

### Anvilgrid
5. Plumber
6. Electrician
7. Mechanic / Auto Repair
8. Phone / Electronics Repair

### Savorpantry
9. Restaurant / Eatery
10. Bakery
11. Catering Business
12. Grocery / Supermarket

### Ledgerverdict
13. Law Firm
14. Accounting / Bookkeeping Practice
15. Real Estate Agency
16. Consulting / Professional Services

### Bazaarmart
17. Fashion Boutique
18. Electronics Retail
19. Furniture Retail
20. General Retail / Variety Store

Pharmacy must be supported as a profession/configuration with appropriate inventory and regulatory cautions. Do not treat pharmacy as ordinary grocery inventory without documenting the distinction.

The architecture must allow additional professions to be added by creating a registry definition and, only when necessary, a shared domain capability or safe migration.

---

# 11. SHARED BUSINESS DOMAIN CAPABILITIES

Build reusable domain packages before duplicating features in vertical apps.

## 11.1 Customers and contacts

- Customer records
- Contact details
- Customer notes
- Customer tags
- Customer history
- Customer communication preferences
- Customer status
- Customer search
- Customer import/export
- Duplicate detection
- Customer activity timeline
- Customer-specific invoices, bookings, orders, and jobs

Customer records are business-scoped by default. Do not expose a customer’s information across unrelated businesses without explicit consent and a deliberate shared-customer design.

## 11.2 Scheduling

- Calendar views
- Availability
- Appointments
- Reservations
- Staff assignment
- Resource assignment
- Recurrence where supported
- Reminders
- Cancellation
- Rescheduling
- No-show status
- Timezone-safe date handling
- Conflict prevention
- Business hours
- Holidays and closure periods

## 11.3 Catalogue and services

- Products
- Services
- Categories
- Variants
- Descriptions
- Images
- Pricing
- Cost price
- Selling price
- Tax configuration
- Active/inactive status
- Search
- Import/export
- Price history where relevant

## 11.4 Inventory

- Stock items
- Stock levels
- Stock movements
- Stock adjustments
- Stocktakes
- Low-stock thresholds
- Suppliers
- Purchase orders
- Receiving
- Returns to supplier
- Inventory valuation
- Branch/warehouse locations
- Transfer between locations
- Expiry/batch tracking where required
- Audit trail

All stock changes must be recorded through an inventory ledger. Do not silently overwrite stock quantities without recording the movement and reason.

## 11.5 Finance and operational money records

- Sales
- Invoices
- Payments
- Expenses
- Refunds
- Supplier payments
- Cash movements
- Tax configuration
- Financial periods
- Profitability reports
- Exportable reports
- Audit trail

Use integer minor units or a precise decimal strategy for money. Never use floating-point arithmetic for financial calculations.

Clearly distinguish operational finance from a complete statutory double-entry accounting ledger. Do not claim full accounting compliance unless the complete accounting subsystem has actually been implemented and validated.

## 11.6 Documents

- Invoice generation
- Receipts
- Estimates/quotes
- Purchase orders
- Work orders
- Service reports
- Customer documents
- Templates
- PDF export
- Secure document storage
- Document version/status
- Access control

## 11.7 Reporting

Reports must use real database data and support appropriate filters, date ranges, business scope, branch scope, and exports.

---

# 12. CRAFTKORU — PERSONAL SERVICES APPLICATION

Craftkoru is for tailors, barbers, stylists, beauty artists, fashion designers, and similar personal-service businesses.

Build a complete app with a tailored workflow and a professional mobile UI.

## 12.1 Required pages

- `/craftkoru`
- `/craftkoru/dashboard`
- `/craftkoru/customers`
- `/craftkoru/customers/[customerId]`
- `/craftkoru/services`
- `/craftkoru/services/new`
- `/craftkoru/services/[serviceId]`
- `/craftkoru/appointments`
- `/craftkoru/calendar`
- `/craftkoru/bookings`
- `/craftkoru/jobs`
- `/craftkoru/jobs/new`
- `/craftkoru/jobs/[jobId]`
- `/craftkoru/measurements`
- `/craftkoru/fittings`
- `/craftkoru/materials`
- `/craftkoru/materials/recipes`
- `/craftkoru/inventory`
- `/craftkoru/suppliers`
- `/craftkoru/purchases`
- `/craftkoru/sales`
- `/craftkoru/payments`
- `/craftkoru/invoices`
- `/craftkoru/expenses`
- `/craftkoru/staff`
- `/craftkoru/commissions`
- `/craftkoru/reports`
- `/craftkoru/reports/profitability`
- `/craftkoru/settings`
- `/craftkoru/settings/booking`
- `/craftkoru/settings/notifications`
- `/craftkoru/settings/permissions`

## 12.2 Required capabilities

1. Service catalogue
2. Service duration and price
3. Custom service definitions
4. Appointment scheduling
5. Customer booking history
6. Walk-in customer support
7. Staff calendar
8. Staff assignment
9. Appointment reminders
10. Booking confirmation
11. Rescheduling
12. Cancellation
13. No-show tracking
14. Job/work order creation
15. Job status tracking
16. Job priority
17. Job due date
18. Customer measurements
19. Measurement templates by garment/service type
20. Measurement history
21. Fitting scheduling
22. Fitting notes
23. Alteration tracking
24. Materials catalogue
25. Material quantities
26. Material recipes/BOM
27. Material purchase tracking
28. Material stock deduction
29. Labour/workmanship cost
30. Staff commission rules
31. Commission calculation
32. Expense recording
33. Job-level cost sheet
34. Estimated cost
35. Actual cost
36. Revenue per job
37. Gross profit per job
38. Profitability by service
39. Profitability by staff member
40. Customer invoices
41. Partial payments
42. Outstanding balances
43. Receipts
44. Supplier records
45. Purchase records
46. Inventory alerts
47. Customer notes and preferences
48. Customer-owned reference images with consent
49. Reports and exports
50. Audit history

## 12.3 Critical job-costing logic

A service/job must support:

- Service price
- Materials required
- Material unit cost
- Quantity consumed
- Labour/workmanship cost
- Additional job expenses
- Discount
- Tax
- Amount paid
- Amount outstanding
- Total actual cost
- Gross profit
- Margin percentage

The user must be able to create a service manually and define its material, labour, and other costs.

Example: a tailor defines “Custom dress,” adds fabric and accessory requirements, sets workmanship cost, records actual material purchases, tracks the job, and sees revenue, cost, and profit.

Do not assume all service businesses consume inventory. Profession configuration determines whether inventory is enabled.

---

# 13. ANVILGRID — TRADES, MAINTENANCE, AND REPAIR

Anvilgrid is for plumbers, electricians, mechanics, phone repairers, technicians, maintenance businesses, and related trades.

## 13.1 Required pages

- `/anvilgrid`
- `/anvilgrid/dashboard`
- `/anvilgrid/customers`
- `/anvilgrid/assets`
- `/anvilgrid/assets/[assetId]`
- `/anvilgrid/diagnostics`
- `/anvilgrid/estimates`
- `/anvilgrid/estimates/new`
- `/anvilgrid/jobs`
- `/anvilgrid/jobs/new`
- `/anvilgrid/jobs/[jobId]`
- `/anvilgrid/dispatch`
- `/anvilgrid/calendar`
- `/anvilgrid/technicians`
- `/anvilgrid/parts`
- `/anvilgrid/inventory`
- `/anvilgrid/suppliers`
- `/anvilgrid/purchases`
- `/anvilgrid/warranties`
- `/anvilgrid/invoices`
- `/anvilgrid/payments`
- `/anvilgrid/expenses`
- `/anvilgrid/reports`
- `/anvilgrid/reports/profitability`
- `/anvilgrid/settings`

## 13.2 Required capabilities

1. Customer and site records
2. Customer asset/equipment records
3. Asset make/model/serial number
4. Asset service history
5. Repair intake
6. Problem description
7. Diagnostic checklist
8. Diagnosis notes
9. Customer approval
10. Estimates/quotes
11. Estimate revisions
12. Labour line items
13. Parts line items
14. Materials line items
15. Travel/service fees
16. Job creation from approved estimate
17. Work-order status
18. Technician assignment
19. Dispatch board
20. Calendar scheduling
21. Site visit records
22. Job checklists
23. Before/after images
24. Parts reservation
25. Parts consumption
26. Inventory deduction
27. Purchase requests
28. Supplier records
29. Purchase orders
30. Warranty tracking
31. Warranty expiry reminders
32. Customer approval history
33. Job time tracking
34. Labour cost
35. Parts cost
36. Job-level expenses
37. Job profitability
38. Invoicing
39. Partial payments
40. Outstanding balances
41. Service reports
42. Maintenance plans where enabled
43. Customer notifications
44. Reports and exports
45. Audit history

## 13.3 Critical repair-job logic

A repair job must distinguish:

- Customer-reported problem
- Technician diagnosis
- Estimate
- Customer approval/decline
- Labour
- Parts/materials
- Actual parts cost
- Labour cost
- Additional expenses
- Warranty
- Job status
- Invoice
- Payment
- Profitability

Do not automatically perform a repair, charge a customer, or mark an estimate as accepted without an explicit authorized action.

---

# 14. SAVORPANTRY — FOOD, HOSPITALITY, AND FOOD RETAIL

Savorpantry is for restaurants, bakeries, catering, grocery/supermarket businesses, and related food/hospitality operations.

## 14.1 Required pages

- `/savorpantry`
- `/savorpantry/dashboard`
- `/savorpantry/pos`
- `/savorpantry/menu`
- `/savorpantry/menu/categories`
- `/savorpantry/orders`
- `/savorpantry/orders/[orderId]`
- `/savorpantry/kitchen`
- `/savorpantry/tables`
- `/savorpantry/reservations`
- `/savorpantry/recipes`
- `/savorpantry/ingredients`
- `/savorpantry/inventory`
- `/savorpantry/suppliers`
- `/savorpantry/purchases`
- `/savorpantry/waste`
- `/savorpantry/batches`
- `/savorpantry/delivery`
- `/savorpantry/customers`
- `/savorpantry/staff`
- `/savorpantry/cash-management`
- `/savorpantry/expenses`
- `/savorpantry/reports`
- `/savorpantry/settings`

## 14.2 Required capabilities

1. Menu catalogue
2. Menu categories
3. Menu item variants
4. Add-ons and modifiers
5. Ingredient recipes
6. Recipe costing
7. Ingredient inventory
8. Ingredient stock deduction
9. POS
10. Cart
11. Discounts
12. Tax configuration
13. Cash sales
14. Supported digital payment recording
15. Order creation
16. Order status
17. Kitchen ticket
18. Kitchen queue
19. Table management
20. Reservations
21. Walk-in orders
22. Takeaway
23. Delivery orders
24. Delivery assignment
25. Customer records
26. Customer order history
27. Staff roles
28. Cash drawer
29. Cash opening balance
30. Cash movements
31. Cash closing/reconciliation
32. Supplier records
33. Purchase orders
34. Receiving stock
35. Stock adjustments
36. Food batch tracking
37. Expiry tracking where enabled
38. Waste recording
39. Waste reason
40. Sales reports
41. Product/menu profitability
42. Ingredient usage
43. Inventory reports
44. Expense tracking
45. Refunds and voids
46. Receipts
47. Branch support
48. Reports and exports
49. Audit history
50. Configurable workflow terminology

## 14.3 POS transaction integrity

A POS sale must be processed safely:

- Validate the cart on the server.
- Recalculate prices and taxes on the server.
- Check stock where applicable.
- Use an idempotency key.
- Create the sale, sale lines, payment records, and stock movements transactionally where possible.
- Prevent duplicate sales on retries.
- Record refunds and voids as auditable transactions.
- Do not silently delete a completed sale.
- Reconcile external payment status separately from the database transaction.

---

# 15. LEDGERVERDICT — PROFESSIONAL SERVICES

Ledgerverdict is for law firms, accounting/bookkeeping practices, real estate agencies, consultants, and other professional-service firms.

## 15.1 Required pages

- `/ledgerverdict`
- `/ledgerverdict/dashboard`
- `/ledgerverdict/clients`
- `/ledgerverdict/clients/[clientId]`
- `/ledgerverdict/leads`
- `/ledgerverdict/pipeline`
- `/ledgerverdict/engagements`
- `/ledgerverdict/engagements/[engagementId]`
- `/ledgerverdict/cases`
- `/ledgerverdict/projects`
- `/ledgerverdict/tasks`
- `/ledgerverdict/calendar`
- `/ledgerverdict/documents`
- `/ledgerverdict/proposals`
- `/ledgerverdict/contracts`
- `/ledgerverdict/time`
- `/ledgerverdict/fees`
- `/ledgerverdict/retainers`
- `/ledgerverdict/expenses`
- `/ledgerverdict/invoices`
- `/ledgerverdict/payments`
- `/ledgerverdict/reports`
- `/ledgerverdict/settings`

## 15.2 Required capabilities

1. Client records
2. Lead records
3. Lead source
4. Sales pipeline
5. Pipeline stages
6. Client onboarding
7. Engagement creation
8. Engagement scope
9. Engagement status
10. Matter/case management where enabled
11. Project management
12. Task assignment
13. Task deadlines
14. Calendar
15. Document management
16. Document categories
17. Secure client documents
18. Proposals
19. Proposal status
20. Contracts
21. Contract status
22. Contract renewal dates
23. Time entries
24. Billable/non-billable time
25. Hourly fee rules
26. Fixed-fee engagements
27. Retainers
28. Retainer balance tracking
29. Expense recording
30. Client expense allocation
31. Invoicing
32. Partial payments
33. Outstanding balances
34. Client communications log
35. Engagement profitability
36. Staff utilization
37. Client profitability
38. Reports and exports
39. Audit history
40. Role-specific access to confidential records

## 15.3 Confidentiality requirements

- Enforce matter/engagement-level permissions where needed.
- Do not expose confidential client documents across businesses.
- Do not include confidential records in AI context unless the user has permission and the feature is enabled.
- Never let an AI agent delete, send, sign, or materially alter legal/financial documents without human confirmation.
- Include document access history for sensitive records.

---

# 16. BAZAARMART — RETAIL AND COMMERCE

Bazaarmart is for boutiques, electronics stores, furniture stores, and general retail businesses.

## 16.1 Required pages

- `/bazaarmart`
- `/bazaarmart/dashboard`
- `/bazaarmart/pos`
- `/bazaarmart/products`
- `/bazaarmart/products/new`
- `/bazaarmart/products/[productId]`
- `/bazaarmart/categories`
- `/bazaarmart/barcodes`
- `/bazaarmart/sales`
- `/bazaarmart/sales/[saleId]`
- `/bazaarmart/returns`
- `/bazaarmart/exchanges`
- `/bazaarmart/inventory`
- `/bazaarmart/stock-movements`
- `/bazaarmart/stocktakes`
- `/bazaarmart/purchases`
- `/bazaarmart/suppliers`
- `/bazaarmart/customers`
- `/bazaarmart/pricing`
- `/bazaarmart/promotions`
- `/bazaarmart/cash-management`
- `/bazaarmart/branches`
- `/bazaarmart/warehouses`
- `/bazaarmart/transfers`
- `/bazaarmart/orders`
- `/bazaarmart/expenses`
- `/bazaarmart/reports`
- `/bazaarmart/settings`

## 16.2 Required capabilities

1. Product catalogue
2. Product categories
3. Product variants
4. SKU management
5. Barcode generation
6. Barcode scanning support where device/browser permits
7. Product images
8. Cost price
9. Selling price
10. Price history
11. POS
12. Cart
13. Discounts
14. Tax configuration
15. Cash sales
16. Supported digital payment recording
17. Receipts
18. Sales history
19. Returns
20. Exchanges
21. Refunds
22. Void controls
23. Stock ledger
24. Stock adjustments
25. Stocktakes
26. Low-stock alerts
27. Supplier records
28. Purchase orders
29. Receiving stock
30. Supplier returns
31. Branches
32. Warehouses
33. Stock transfers
34. Cash drawer
35. Opening cash
36. Cash movements
37. Closing reconciliation
38. Customer records
39. Customer purchase history
40. Promotions
41. Loyalty features where enabled
42. Inventory valuation
43. Sales profitability
44. Expense tracking
45. Branch performance
46. Reports and exports
47. Audit history
48. Offline-read support where safe
49. Mobile-friendly POS layout
50. Role-based cashier controls

## 16.3 POS requirements

POS must be a real operational workflow, not a visual mockup.

- Fast product search
- Barcode input
- Cart editing
- Quantity changes
- Discounts with permission controls
- Tax calculation
- Customer attachment
- Payment recording
- Receipt generation
- Stock deduction
- Refunds and returns
- Cash drawer reconciliation
- Idempotency
- Audit trail
- Clear payment-pending and payment-confirmed states

Do not claim offline POS transactions are safe unless an offline queue, conflict resolution, idempotency, and reconciliation system is actually implemented and tested. If implementing offline support, document its exact limits.

---

# 17. DYNAMICSLABS — CENTRAL BUSINESS HUB

Build Dynamicslabs **after the five vertical apps are implemented**.

Dynamicslabs is the owner’s central workspace for switching between businesses and apps.

## 17.1 Required pages

### Public
- `/`
- `/products`
- `/pricing`
- `/about`
- `/advertise`
- `/contact`
- `/terms`
- `/privacy`
- `/security`
- `/status`

### Authentication
- `/register`
- `/login`
- `/verify-email`
- `/forgot-password`
- `/reset-password`
- `/accept-invitation`

### Workspace
- `/dashboard`
- `/businesses`
- `/businesses/new`
- `/businesses/[businessId]`
- `/businesses/[businessId]/settings`
- `/workspace`
- `/workspace/switch`
- `/apps`
- `/apps/[appId]`
- `/customers`
- `/tasks`
- `/projects`
- `/calendar`
- `/finance`
- `/invoices`
- `/expenses`
- `/inventory`
- `/suppliers`
- `/team`
- `/reports`
- `/activity`
- `/notifications`
- `/settings`
- `/settings/profile`
- `/settings/security`
- `/settings/preferences`
- `/settings/notifications`
- `/settings/integrations`
- `/billing`
- `/billing/subscription`
- `/billing/payment-methods`
- `/usage`
- `/storage`
- `/ai`
- `/ai/insights`
- `/ai/chat`
- `/suggested-cleanup`
- `/support`
- `/support/new`
- `/support/[ticketId]`
- `/advertiseme`

### Admin
- `/admin`
- `/admin/overview`
- `/admin/users`
- `/admin/businesses`
- `/admin/subscriptions`
- `/admin/payments`
- `/admin/top-ups`
- `/admin/usage`
- `/admin/storage`
- `/admin/reports`
- `/admin/ads`
- `/admin/ads/campaigns`
- `/admin/professions`
- `/admin/capabilities`
- `/admin/notifications`
- `/admin/email`
- `/admin/jobs`
- `/admin/webhooks`
- `/admin/audit`
- `/admin/security`
- `/admin/health`
- `/admin/settings`

## 17.2 Hub capabilities

- Multi-business switcher
- Multi-app launcher
- Business overview
- Consolidated notifications
- Consolidated tasks
- Consolidated calendar
- Cross-app activity feed scoped to businesses the user can access
- Consolidated reports
- Shared billing
- Shared usage
- Shared storage view
- AI intelligence center
- Team/member management
- Business settings
- Profession-aware navigation
- Business creation and onboarding
- App-specific workspace launch
- Support and account management

The hub must not create duplicate copies of records owned by the vertical apps.

---

# 18. BILLING, PLANS, USAGE, AND TOP-UPS

Implement one Shiftslabs subscription per owner/workspace, covering the six Shiftslabs applications and the owner’s eligible businesses.

Do not charge separately for each app.

Team members inherit the owner/workspace entitlement when they work in that business.

The plan must not arbitrarily lock ordinary business features. The only plan quotas are:

1. AI usage
2. Logical database storage
3. Media/object storage

Apply abuse prevention and security rate limits separately from plan entitlements.

## 18.1 Plans

Use the following proposed allocation table as the initial configuration, but make it editable through a versioned plan configuration and admin interface. Do not hardcode these numbers across the codebase.

| Plan | Monthly price | Logical DB allocation | Media allocation | AI messages/day |
|---|---:|---:|---:|---:|
| Free | $0 | 50 MB | 500 MB | 20 |
| Starter | $2.99 | 250 MB | 2 GB | 100 |
| Growth | $4.99 | 1 GB | 10 GB | 300 |
| Pro | $9.99 | 5 GB | 50 GB | 1,000 |

These allocations are provisional commercial configuration. Implement the billing and metering system so they can be changed without schema rewrites.

## 18.2 Billing rules

- Display prices and plan terms clearly.
- Support monthly billing.
- Design the data model so annual plans can be added without redesign.
- Verify Paystack’s current supported currencies and subscription/payment behavior before enabling a particular currency or recurring-payment method.
- Do not assume USD recurring billing is available for every account.
- Support the configured currency per checkout.
- Store currency with every financial record.
- Store prices in integer minor units.
- Handle payment initiation, pending status, successful payment, failed payment, cancellation, renewal, expiry, refunds, and reconciliation.
- Verify payment webhooks cryptographically using the provider’s documented mechanism.
- Use idempotency for webhook processing.
- Never trust the frontend to confirm payment.
- Never grant paid entitlement merely because a user reached a success URL.
- Provide a payment status page and safe retry flow.

## 18.3 Logical database metering

Do not claim that shared PostgreSQL physical disk bytes can be attributed precisely to an individual user.

Implement versioned logical storage accounting:

- Define which fields and record types count.
- Use a deterministic serialization/accounting strategy.
- Account for relevant customer, team, email, business, invoice, transaction, document metadata, and other logical records.
- Exclude password hashes and secrets from user-facing storage breakdowns.
- Track storage usage by owner/workspace and business.
- Maintain usage events and periodic reconciliation.
- Prevent duplicate usage events through idempotency.
- Track actual infrastructure usage separately for internal cost analysis.

## 18.4 Media storage metering

- Meter actual stored object size.
- Reserve quota before upload.
- Use short-lived signed upload URLs.
- Validate MIME type, file size, and file extension server-side.
- Verify actual uploaded size after completion.
- Reconcile abandoned reservations.
- Support safe deletion and storage accounting updates.
- Do not use ephemeral Render disk for persistent customer files.
- Use S3-compatible storage through an adapter.

## 18.5 Quota behavior

When a quota is reached:

- Preserve all existing customer data.
- Never automatically delete user data.
- Explain what quota was reached.
- Show current usage and plan allocation.
- Offer a top-up or upgrade.
- Prevent new resource-consuming operations that would exceed quota.
- Allow safe reads, exports, account access, and existing business operations where possible.
- Make the AI quota reset time visible.
- Use UTC for quota accounting and display the reset in the user’s local timezone.

## 18.6 Top-ups

All plans, including Free, may purchase resource top-ups.

- Top-ups are prepaid or explicitly authorized.
- Never silently charge a customer.
- Create a top-up purchase record.
- Confirm payment through verified webhook processing.
- Add purchased capacity only after confirmed payment.
- Track remaining balance and expiry/consumption rules.
- Show a clear usage ledger.
- Allow admin reconciliation.

---

# 19. SUBSCRIPTION GRACE PERIOD AND AD-SUPPORTED ACCESS

Implement a transparent subscription lifecycle:

1. Active
2. Payment due
3. Grace period
4. Ad-supported overdue access
5. Suspended only when legally/security necessary or explicitly configured
6. Cancelled/expired

The owner’s requested policy is:

- After a subscription payment becomes due, allow a **7-day grace period**.
- After the grace period, the user can continue accessing the app through an ad-supported experience.
- Do not delete their business data.
- Do not block access to payment, security, account recovery, saving, POS, active transaction completion, or other critical business workflows with an advertisement.
- Ads must be clearly identified as advertisements.
- Provide an accessible close/escape route for critical situations.
- Do not interrupt a payment, unsaved form, active checkout, data entry, or transaction.
- Store the subscription state and transition history.
- Notify users before and during the grace period.
- Provide a clear “Resolve billing” action.

Free-plan advertising behavior must be configurable. Implement an entitlement flag such as `adsEligible` rather than hardcoding ads into pages.

---

# 20. ADVERTISEME — DIRECT ADVERTISER CAMPAIGNS

AdvertiseMe is Shiftslabs’ direct advertising product. Do not integrate an ad network such as AdMob.

## 20.1 Advertiser pricing

- $5 for one month
- $10 for two months

Store prices as configuration, not scattered constants.

## 20.2 Advertiser journey

1. Advertiser opens `/advertise` or `/advertiseme`.
2. Reads campaign terms and pricing.
3. Creates a campaign.
4. Provides business name and contact details.
5. Uploads an image or supported video asset, or supplies a supported video URL.
6. Adds headline and concise description.
7. Adds a CTA:
   - Learn more
   - Visit website
   - WhatsApp
   - Contact
   - Other approved destination
8. Chooses the campaign duration.
9. Reviews the campaign.
10. Pays through Paystack.
11. Campaign enters `pending_review`.
12. Admin approves or rejects it.
13. Approved campaign runs for its purchased period.
14. Campaign expires automatically.
15. Campaign media is deleted according to the documented retention policy.
16. Advertiser can view actual impressions and clicks.

## 20.3 Admin ad management

Admin must be able to:

- View submitted campaigns
- Preview campaign creative
- Approve
- Reject with reason
- Request edits
- Pause
- Resume
- End
- View payment status
- View campaign dates
- View impressions
- View clicks
- View click-through rate
- View moderation history
- View advertiser details
- Manage ad placements and eligibility
- Review expired campaigns
- Verify media deletion

## 20.4 Advertising safety

- Never accept arbitrary HTML, JavaScript, or untrusted iframe embeds.
- Use allowlisted video providers or uploaded files.
- Validate destinations and block dangerous URL schemes.
- Use safe link handling.
- Moderate content before publication.
- Clearly label sponsored content.
- Do not claim guaranteed impressions unless the contract actually guarantees them.
- Report actual delivery.
- Define refund/rejection policy in terms and admin workflow.
- Do not place ads over critical business actions.

---

# 21. AI CHAT AND PROACTIVE BUSINESS INTELLIGENCE

Use the configured AI provider through a server-side adapter.

The owner’s API key must never be exposed to the browser.

## 21.1 AI chat

Provide:

- AI chat interface
- Business selector/context
- Conversation history
- Clear context scope
- AI usage counter
- Daily quota indicator
- Safe error handling
- Retry behavior
- User feedback
- Conversation deletion where permitted

AI must only access data the current user is authorized to access.

## 21.2 Proactive intelligence

The owner wants the intelligence scheduler to run every 30 minutes, including while the user is offline.

Implement a scheduler that:

1. Runs every 30 minutes.
2. Selects eligible businesses and users.
3. Applies deterministic rules first.
4. Detects useful events such as:
   - Sales changes
   - Unpaid invoices
   - Upcoming appointments
   - Missed appointments
   - Low stock
   - Unusual expenses
   - Work delays
   - Overdue jobs
   - Upcoming renewals
   - Relevant operational anomalies
5. Builds a compact, scoped summary.
6. Calls AI only when it adds value.
7. Enforces usage quotas and cost budgets.
8. Deduplicates repeated insights.
9. Respects user consent, preferences, quiet hours, and notification settings.
10. Stores insight evidence and generation status.
11. Delivers through the notification system.
12. Logs failures and retries safely.

Do not send the entire business database to the AI every 30 minutes.

## 21.3 AI action permissions

AI may recommend and prepare actions.

AI must not autonomously:

- Delete invoices
- Delete contracts
- Delete customers
- Delete payment records
- Send legally significant documents
- Sign contracts
- Issue refunds
- Charge a customer
- Alter completed financial records
- Perform irreversible actions

Require explicit human confirmation for consequential actions.

---

# 22. SUGGESTED CLEANUP

Create a discreet page at `/suggested-cleanup`.

The AI may identify old or possibly irrelevant items, but it must:

- Explain why an item was suggested.
- Show the item’s type, date, and business.
- Provide a link to inspect it.
- Allow the user to dismiss the suggestion.
- Allow archive where appropriate.
- Require explicit confirmation before deletion.
- Respect retention rules.
- Keep an audit record.
- Provide a recovery window where feasible.

Do not let AI delete records automatically.

---

# 23. REAL-TIME EVENTS, WEBSOCKETS, PUSH, AND BACKGROUND JOBS

The owner requires real-time updates, push notifications, and background processing.

## 23.1 Real-time transport

Implement a real-time adapter with WebSocket support for:

- New notifications
- Booking updates
- Job status changes
- Order updates
- Inventory alerts
- Payment status updates
- Team invitations
- Support updates
- AI insight availability
- Cross-app activity updates

Requirements:

- Authenticated WebSocket connections
- Business-scoped authorization
- Connection heartbeat
- Reconnection handling
- Backoff
- Event versioning
- Duplicate-event tolerance
- Server-side permission checks
- No secrets in event payloads
- Safe fallback to polling where WebSocket transport is unavailable

Do not broadcast a business event to every connected user.

## 23.2 Push notifications

Implement:

- In-app notification center
- Email notifications through Resend
- Web Push with service worker and VAPID configuration
- Push subscription management
- Notification preferences
- Quiet hours
- Delivery status
- Retry policy
- Deduplication
- Notification categories
- Notification history

The future APK wrapper may support native push, but do not claim native push is implemented until the actual wrapper API and configuration are inspected. Build a provider interface so native push can be added without rewriting notification business logic.

## 23.3 Notification categories

- Appointment reminders
- New bookings
- Job assignment
- Job status changes
- Orders
- Kitchen tickets
- Low stock
- Payments
- Invoices
- Subscription and billing
- Usage quota warnings
- AI insights
- Support updates
- Team invitations
- Security alerts
- Advertiser campaign status

## 23.4 Background workers

Create workers for:

- Scheduled tasks
- Notifications
- AI intelligence
- Billing reconciliation
- Usage reconciliation
- Storage reconciliation
- Advert campaign scheduling/expiry
- Report exports
- Email delivery
- Cleanup and retention
- Webhook retries
- Failed job recovery

Every background job must have:

- Stable job ID
- Idempotency
- Retry policy
- Backoff
- Maximum attempts
- Dead-letter/error state
- Observability
- Admin inspection where appropriate

---

# 24. DATABASE DESIGN — COMPLETE, EXPLICIT, AND TENANT-SAFE

Create the actual Prisma schema and migrations. Do not stop at a list of model names.

Use stable IDs, appropriate foreign keys, unique constraints, indexes, timestamps, and tenant scope.

The schema must cover at least the following domain areas.

## 24.1 Identity and security

- User
- UserProfile
- Credential
- Session
- EmailVerificationToken
- PasswordResetToken
- MFAConfiguration
- RecoveryCode
- LoginAttempt
- SecurityEvent
- AccountExport
- AccountDeletionRequest

## 24.2 Business and tenancy

- Business
- BusinessProfile
- BusinessMembership
- BusinessInvitation
- BusinessLocation
- BusinessSettings
- BusinessProfession
- ProfessionDefinition
- ProfessionVersion
- BusinessCapability
- BusinessActivity
- BusinessBrandAsset

## 24.3 CRM and communication

- Customer
- CustomerContact
- CustomerNote
- CustomerTag
- CustomerTagAssignment
- CustomerCommunicationPreference
- CustomerActivity

## 24.4 Scheduling

- BusinessHours
- ClosurePeriod
- AvailabilityRule
- Appointment
- AppointmentParticipant
- AppointmentResource
- AppointmentReminder
- CalendarEvent

## 24.5 Work and services

- Service
- ServiceCategory
- WorkOrder
- WorkOrderLine
- WorkOrderAssignment
- WorkOrderStatusHistory
- WorkChecklist
- WorkChecklistItem
- WorkTimeEntry
- WorkAttachment
- Estimate
- EstimateLine
- EstimateRevision
- EstimateApproval
- JobCostSheet
- JobCostLine
- LabourRate
- MaterialRecipe
- MaterialRecipeLine

## 24.6 Catalogue and inventory

- Product
- ProductCategory
- ProductVariant
- ProductImage
- SKU
- Barcode
- StockItem
- StockLocation
- InventoryBalance
- InventoryMovement
- Stocktake
- StocktakeLine
- StockReservation
- Batch
- ExpiryRecord
- Supplier
- SupplierContact
- PurchaseOrder
- PurchaseOrderLine
- GoodsReceipt
- GoodsReceiptLine
- SupplierReturn

## 24.7 Commerce and POS

- Sale
- SaleLine
- SaleDiscount
- SaleTax
- SalePayment
- SaleRefund
- SaleRefundLine
- SaleVoid
- CashDrawer
- CashDrawerSession
- CashMovement
- CashReconciliation
- CustomerOrder
- CustomerOrderLine
- OrderStatusHistory
- Promotion
- PromotionRule
- LoyaltyAccount where enabled
- Exchange
- ExchangeLine

## 24.8 Finance

- Invoice
- InvoiceLine
- InvoiceStatusHistory
- Payment
- PaymentAllocation
- Refund
- Expense
- ExpenseCategory
- FinancialPeriod
- TaxConfiguration
- FinancialAuditEvent

## 24.9 Documents

- Document
- DocumentVersion
- DocumentTemplate
- DocumentAccessLog
- GeneratedFile
- DocumentRetentionPolicy

## 24.10 Notifications and real-time

- Notification
- NotificationPreference
- NotificationDelivery
- PushSubscription
- RealtimeEvent
- RealtimeSubscriptionState where needed

## 24.11 Billing and metering

- Plan
- PlanVersion
- Subscription
- SubscriptionEvent
- PaymentAttempt
- PaymentWebhookEvent
- TopUpProduct
- TopUpPurchase
- TopUpBalance
- UsageAccount
- UsageEvent
- UsageReservation
- UsageReconciliation
- StorageObject
- StorageReservation
- StorageReconciliation

## 24.12 AI intelligence

- AIConversation
- AIMessage
- AIUsageRecord
- AIInsight
- AIInsightEvidence
- AIInsightPreference
- AICleanupSuggestion
- AICleanupAction
- AIActionApproval
- AIProviderConfiguration metadata without storing plaintext secrets

## 24.13 Support and advertising

- SupportTicket
- SupportMessage
- SupportAttachment
- SupportStatusHistory
- AdCampaign
- AdCreative
- AdPayment
- AdReview
- AdImpression
- AdClick
- AdCampaignEvent

## 24.14 Platform operations

- AuditLog
- AdminAction
- WebhookDelivery
- BackgroundJobRecord
- RateLimitBucket
- FeatureFlag
- SystemSetting
- IncidentRecord
- DataExportJob

## 24.15 Vertical-specific records

### Craftkoru
- CustomerMeasurement
- MeasurementTemplate
- Fitting
- FittingNote
- MaterialRecipe
- JobCostSheet
- CommissionRule
- CommissionEntry

### Anvilgrid
- CustomerAsset
- AssetServiceHistory
- RepairDiagnostic
- RepairEstimate
- RepairPart
- Warranty
- TechnicianVisit
- RepairChecklist

### Savorpantry
- MenuItem
- MenuModifier
- Recipe
- RecipeIngredient
- KitchenTicket
- KitchenTicketLine
- DiningTable
- TableReservation
- WasteRecord
- FoodBatch
- DeliveryJob

### Ledgerverdict
- ClientEngagement
- Matter
- MatterParticipant
- Proposal
- Contract
- TimeEntry
- Retainer
- RetainerTransaction
- ProjectMilestone

### Bazaarmart
- RetailVariant
- Barcode
- Branch
- Warehouse
- CashDrawer
- StockTransfer
- StockTransferLine
- Promotion
- LoyaltyAccount
- Exchange

Avoid duplicating models that already exist in shared packages. The final schema must preserve tenant ownership and relationships consistently.

---

# 25. API CONTRACTS — IMPLEMENT REAL ENDPOINTS

Create documented API contracts with request schemas, response schemas, authorization rules, status codes, idempotency rules, and error codes.

Use a consistent response/error format. Do not expose stack traces or raw provider errors.

Suggested error structure:

```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "We couldn't find that record.",
    "requestId": "..."
  }
}
```

Use appropriate HTTP status codes:

- `200` successful read/update
- `201` successful creation
- `202` accepted asynchronous work
- `204` successful deletion where appropriate
- `400` invalid request
- `401` unauthenticated
- `403` unauthorized
- `404` not found
- `409` conflict/idempotency conflict
- `422` valid request but invalid business operation
- `429` rate/usage limit
- `500` unexpected internal failure
- `503` temporary service unavailability

## 25.1 Authentication APIs

Implement endpoints for:

- Register
- Login
- Logout
- Current session
- Email verification
- Resend verification
- Forgot password
- Reset password
- Change password
- Session list/revocation
- MFA setup/verification where supported
- Account profile
- Account export
- Account deletion request

## 25.2 Business APIs

Implement:

- Business list/create/read/update/archive
- Business membership list/invite/update/remove
- Invitation accept/reject
- Profession list/selection
- Profession configuration
- Business capabilities
- Business settings
- Business locations
- Business switcher
- Business activity

## 25.3 CRM APIs

Implement:

- Customer list/create/read/update/archive
- Customer notes
- Customer tags
- Customer history
- Customer import/export
- Duplicate detection

## 25.4 Scheduling APIs

Implement:

- Availability
- Appointment list/create/read/update/cancel
- Reschedule
- Appointment participants
- Appointment reminders
- Calendar range query
- Business hours
- Closure periods

## 25.5 Work-order APIs

Implement:

- Services
- Work orders
- Work-order lines
- Assignments
- Status changes
- Checklists
- Time entries
- Estimates
- Estimate revisions
- Estimate approval/decline
- Material and labour costing
- Job profitability
- Work attachments

## 25.6 Catalogue and inventory APIs

Implement:

- Product/service catalogue CRUD
- Categories
- Variants
- Search
- SKU/barcode lookup
- Inventory balance
- Inventory movements
- Stock adjustments
- Stocktakes
- Reservations
- Suppliers
- Purchase orders
- Receiving
- Supplier returns
- Branches/warehouses
- Stock transfers
- Batch/expiry tracking where enabled

## 25.7 POS and commerce APIs

Implement:

- Cart validation
- Sale creation
- Sale retrieval
- Sale history
- Payment initiation/recording
- Payment confirmation
- Receipt generation
- Refund
- Void
- Return
- Exchange
- Cash drawer session
- Cash movement
- Cash reconciliation
- Order creation
- Order status changes
- Kitchen ticket updates
- Delivery assignment

POS endpoints must be idempotent and use server-side price and stock validation.

## 25.8 Finance APIs

Implement:

- Invoice CRUD
- Invoice send/generation
- Invoice status
- Payment recording
- Payment allocation
- Refund
- Expense CRUD
- Expense categories
- Tax configuration
- Financial reports
- Export

## 25.9 Billing and usage APIs

Implement:

- Plan list
- Current entitlement
- Subscription status
- Checkout initiation
- Payment status
- Subscription cancellation
- Renewal status
- Top-up products
- Top-up checkout
- Top-up status
- Usage summary
- Usage history
- Storage summary
- Storage objects
- Quota reservation
- Quota release/reconciliation
- Verified Paystack webhook endpoint

## 25.10 Storage APIs

Implement:

- Upload reservation
- Signed upload URL
- Upload completion
- Object metadata
- Object download URL
- Object deletion
- Storage usage
- Storage reconciliation
- Safe media validation

## 25.11 AI APIs

Implement:

- Chat conversation list/create
- Message submission
- Conversation retrieval
- Conversation deletion where permitted
- AI usage summary
- Insight list/read/dismiss
- Insight preferences
- Cleanup suggestions
- Cleanup suggestion inspection
- Cleanup approval
- Cleanup execution after explicit confirmation

## 25.12 Notification and real-time APIs

Implement:

- Notification list
- Mark read
- Mark all read
- Notification preferences
- Push subscription create/update/delete
- Delivery status
- WebSocket authentication/connection
- Realtime event authorization

## 25.13 Support APIs

Implement:

- Ticket create
- Ticket list
- Ticket read
- Ticket reply
- Attachment upload
- Ticket status
- Ticket history

## 25.14 Advertising APIs

Implement:

- Advertiser campaign create
- Creative upload
- Campaign payment
- Campaign status
- Campaign analytics
- Admin review
- Admin approval
- Admin rejection
- Admin pause/resume/end
- Impression recording
- Click recording
- Expiry processing
- Media deletion

## 25.15 Admin APIs

Implement secure admin APIs for:

- Overview
- Users
- Businesses
- Memberships
- Plans
- Subscriptions
- Payments
- Top-ups
- Usage
- Storage
- Ads
- Profession registry
- Capabilities
- Notifications
- Email delivery
- Background jobs
- Webhooks
- Audit logs
- Security events
- Health checks
- System settings
- Support tickets

Every admin endpoint must verify admin authorization server-side. Hiding the admin navigation is not security.

---

# 26. REAL-TIME EVENT CONTRACT

Define a typed event envelope:

```ts
type RealtimeEventEnvelope = {
  id: string;
  type: string;
  version: number;
  businessId?: string;
  userId?: string;
  createdAt: string;
  payload: unknown;
};
```

Use a validated event registry rather than arbitrary untyped event names.

Examples:

- `notification.created`
- `appointment.created`
- `appointment.updated`
- `work_order.assigned`
- `work_order.status_changed`
- `sale.completed`
- `order.created`
- `order.status_changed`
- `inventory.low_stock`
- `invoice.created`
- `payment.confirmed`
- `subscription.updated`
- `usage.threshold_reached`
- `ai.insight.created`
- `support.ticket.updated`
- `advertisement.campaign_status_changed`

Authorize each event by business membership, role, and event type.

---

# 27. SECURITY, PRIVACY, AND DATA PROTECTION

Implement and document:

- Password hashing
- Session security
- Email verification
- Password reset
- CSRF protection where applicable
- Rate limiting
- Tenant isolation
- Server-side permissions
- Input validation
- Output validation
- SQL injection prevention through safe ORM/query patterns
- XSS protection
- Secure headers
- Content Security Policy
- Upload validation
- Signed URLs
- Webhook verification
- Idempotency
- Audit logging
- Sensitive data redaction
- Account export
- Account deletion
- Backup and restoration
- Data retention
- AI data-scope controls
- Admin access controls
- Secret management

Do not log passwords, tokens, payment secrets, full payment credentials, private documents, or sensitive customer data.

Do not include sensitive records in analytics or AI context without explicit authorization and appropriate controls.

---

# 28. ENVIRONMENT CONFIGURATION

The owner wants the application to load environment variables from **`shiftslabs.env`** because the repository is private and the owner wants a simple local setup.

Implement support for:

- Local development: load `shiftslabs.env` when present.
- Production: read environment variables injected by the deployment environment.
- Example template: `shiftslabs.env.example`.
- Ignore the real `shiftslabs.env` in Git.
- Never commit actual secrets.
- Never expose server-only variables to the browser.
- Validate required environment variables at startup.
- Provide clear developer-facing configuration errors without revealing secret values.
- Do not silently substitute fake credentials.

The owner has requested convenient local configuration, but **private repository status is not a security boundary**. Keep credentials out of source control and production client bundles. If the owner later intentionally commits credentials, warn that this is unsafe and recommend rotating them; do not design the application to require committed secrets.

## 28.1 Required environment variables

Create and document only the variables the implementation actually uses, including applicable variables from:

```env
# Runtime
NODE_ENV=
APP_ENV=
APP_URL=
AUTH_SECRET=

# Database
DATABASE_URL=
DIRECT_DATABASE_URL=

# Paystack
PAYSTACK_SECRET_KEY=
PAYSTACK_PUBLIC_KEY=

# Email
RESEND_API_KEY=
RESEND_FROM_EMAIL=

# S3-compatible storage
S3_ENDPOINT=
S3_REGION=
S3_BUCKET=
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
S3_PUBLIC_BASE_URL=

# AI provider
AI_PROVIDER=
AI_API_KEY=
AI_BASE_URL=
AI_MODEL=

# Web Push
VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
VAPID_SUBJECT=

# Real-time transport
REALTIME_PROVIDER=
REALTIME_URL=

# Observability
ERROR_TRACKING_DSN=
LOG_LEVEL=

# Job scheduling
SCHEDULER_SECRET=
WORKER_CONCURRENCY=
```

Do not assume every variable above is required. Implement a validated configuration schema and document the exact requirements for each app and worker.

Paystack webhook verification must follow Paystack’s documented signature mechanism. Do not invent an unsupported webhook secret scheme.

---

# 29. INTERNATIONALIZATION AND LOCALIZATION

Build international-ready foundations.

- Locale-aware dates
- Timezone-aware scheduling
- Locale-aware number formatting
- Currency-aware money formatting
- Currency stored with financial records
- Business-specific timezone
- Business-specific currency
- Country and region settings
- Phone number normalization
- Address structure
- Tax configuration by jurisdiction
- Translation-ready UI strings

Nigeria is an important initial market, but do not hardcode Nigeria-only assumptions throughout the system.

---

# 30. OBSERVABILITY, OPERATIONS, AND RELIABILITY

Implement:

- Structured server logs
- Request IDs/correlation IDs
- Error tracking adapter
- Health endpoint
- Readiness endpoint
- Worker health status
- Background job status
- Webhook delivery status
- Payment reconciliation
- Storage reconciliation
- Usage reconciliation
- Admin operational dashboard
- Security event log
- Audit log
- Backup documentation
- Restore documentation
- Incident response guide
- Deployment rollback guide

Do not expose internal logs to ordinary users.

Create a backup and restore strategy with documented recovery objectives. Include a tested restore procedure, not only a statement that backups exist.

---

# 31. PERFORMANCE AND FUTURE SCALE

The long-term ambition is to support a very large user base, potentially millions of users. Do not claim that the initial deployment is already capable of serving 20 million users.

Build a strong foundation:

- Stateless web instances
- Shared modular domain services
- Database connection pooling
- Correct indexes
- Cursor-based pagination for large lists
- Avoid unbounded queries
- Avoid N+1 queries
- Background processing for slow tasks
- Async report generation
- Efficient image handling
- Cache only where correctness is preserved
- Rate limiting
- Database query monitoring
- Load testing
- Capacity documentation
- Provider adapters
- Clear scaling path

Do not prematurely split everything into microservices. Begin with a well-structured modular monolith and separate deployable apps/workers.

Document what would need to change for large-scale growth, including caching, read replicas, partitioning, queue infrastructure, regional strategy, and possible service extraction.

---

# 32. TESTING REQUIREMENTS

Build real tests, not merely test configuration files.

## 32.1 Unit tests

Test:

- Money calculations
- Tax calculations
- Discounts
- Profitability calculations
- Job costing
- Commission calculations
- Inventory movements
- Stock availability
- Usage accounting
- Quota reservations
- Subscription state transitions
- Ad campaign scheduling
- Profession registry validation
- Permissions
- AI quota accounting
- Notification deduplication
- Idempotency

## 32.2 Integration tests

Test:

- Authentication
- Tenant isolation
- Business membership
- Customer CRUD
- Appointment creation
- Work-order workflow
- Inventory movement
- POS sale
- Refund
- Invoice/payment allocation
- Billing webhook
- Usage reservation
- Storage upload lifecycle
- Notification delivery records
- WebSocket event authorization
- AI access scope
- Support ticket lifecycle
- Ad campaign approval/expiry

## 32.3 End-to-end tests

Test actual user journeys:

1. Register and verify an account.
2. Create a business.
3. Select a profession.
4. Configure business details.
5. Create a customer.
6. Create a service/product.
7. Complete a representative vertical workflow.
8. Generate an invoice/receipt.
9. Record a payment.
10. Verify reporting.
11. Invite a team member.
12. Verify role restrictions.
13. Switch business.
14. View usage.
15. Test quota limits.
16. Purchase and verify a top-up in a controlled test environment.
17. Test notifications.
18. Test mobile navigation.
19. Test admin review.
20. Test account export/deletion flows.

## 32.4 Mobile testing

Test at:

- 320px
- 360px
- 390px
- 430px
- Tablet
- Desktop

Verify:

- No horizontal overflow
- Forms usable with mobile keyboards
- Menus and dialogs fit
- Touch targets are adequate
- Navigation works
- POS remains usable
- Tables adapt
- Loading and error states are readable
- No critical actions are hidden behind hover

## 32.5 Payment and security tests

- Invalid webhook signature rejected
- Duplicate webhook is idempotent
- Frontend cannot grant entitlement
- Unauthorized business access rejected
- Unauthorized admin access rejected
- Rate limits work
- Upload MIME spoofing rejected
- Oversized upload rejected
- Invalid destination URL rejected for ads
- No secrets in client bundles
- No stack traces in user-facing errors
- Passwords never stored in plaintext
- Critical transaction paths are not interrupted by ads

---

# 33. REQUIRED DOCUMENTATION

Create and maintain:

- `/README.md`
- `/docs/architecture/overview.md`
- `/docs/architecture/monorepo.md`
- `/docs/architecture/tenancy.md`
- `/docs/architecture/profession-registry.md`
- `/docs/database/schema-guide.md`
- `/docs/database/migrations.md`
- `/docs/api/overview.md`
- `/docs/api/error-codes.md`
- `/docs/security/security-model.md`
- `/docs/security/tenant-isolation.md`
- `/docs/security/secrets.md`
- `/docs/billing/plans.md`
- `/docs/billing/usage-metering.md`
- `/docs/billing/payments.md`
- `/docs/notifications/overview.md`
- `/docs/intelligence/ai-safety.md`
- `/docs/advertising/advertiseme.md`
- `/docs/deployment/local-development.md`
- `/docs/deployment/render.md`
- `/docs/deployment/environment-variables.md`
- `/docs/deployment/migrations.md`
- `/docs/deployment/rollback.md`
- `/docs/deployment/backup-restore.md`
- `/docs/user-guides/`
- `/docs/founder/story.md`

Explain how the owner can:

- Install dependencies
- Configure `shiftslabs.env`
- Run each app
- Run all apps
- Run workers
- Run migrations
- Run tests
- Build for production
- Deploy each service
- Add a profession
- Add a capability
- Add a new vertical app
- Modify UI safely
- Modify a business workflow
- Change plans and quotas
- Investigate errors
- Restore backups

---

# 34. DEPLOYMENT REQUIREMENTS

Prepare the repository for Render deployment.

Create:

- Per-app build configuration
- Per-app start commands
- Worker build/start commands
- Health checks
- Readiness checks
- Environment-variable documentation
- Migration/release job
- Deployment order
- Rollback procedure
- Production build verification
- Secure CORS and cookie configuration
- Domain configuration guidance

Each app must build from the monorepo while including its required shared packages.

Do not use local filesystem storage for persistent business data.

Do not run migrations independently from every app instance.

Do not deploy with mock data.

Do not claim a service is deployed unless the deployment was actually performed and verified.

---

# 35. IMPLEMENTATION METHOD

Proceed autonomously through the complete implementation.

1. Inspect repository.
2. Confirm existing stack and constraints.
3. Establish workspace and shared packages.
4. Implement database schema and migration workflow.
5. Implement identity, tenancy, and permissions.
6. Implement shared domain services.
7. Implement billing and usage infrastructure.
8. Implement storage and notifications.
9. Implement real-time transport and background workers.
10. Implement the five vertical apps in the required order.
11. Implement Dynamicslabs hub.
12. Implement admin, support, and AdvertiseMe.
13. Implement AI chat and proactive intelligence.
14. Implement responsive design system.
15. Implement tests.
16. Run type checking, linting, tests, and production builds.
17. Fix failures rather than hiding them.
18. Review security and tenant isolation.
19. Update documentation.
20. Prepare deployment configuration.
21. Provide final implementation report.

You may internally sequence work to reduce dependencies, but **do not stop after a phase and ask the owner to approve the next phase**. Continue until the complete implementation is finished or a genuinely external blocker prevents further work.

If you encounter a blocker:

- Explain exactly what is blocked.
- Continue all unrelated work.
- Do not fabricate success.
- Do not silently omit the feature.
- Record the blocker in the final report.

---

# 36. FINAL ACCEPTANCE CRITERIA

The project is not complete until:

- All six applications have real pages and functional workflows.
- The five vertical apps are implemented before the hub.
- Shared identity works across all apps.
- Business switching works.
- Profession configuration works.
- All records are tenant-scoped.
- Permissions are enforced server-side.
- Real database operations replace mock data.
- POS and financial operations are transaction-safe and idempotent.
- Service and repair job costing works.
- Inventory movements are auditable.
- Billing and top-ups use verified payment processing.
- Usage and storage quotas are enforced without deleting customer data.
- WebSocket events are authenticated and business-scoped.
- Notifications and background workers operate with retries and observability.
- AI chat respects permissions and quotas.
- Proactive intelligence runs on schedule with cost/privacy controls.
- Suggested cleanup requires user confirmation.
- AdvertiseMe supports payment, review, scheduling, reporting, and expiry.
- Admin functionality is protected server-side.
- Mobile layouts work without horizontal overflow.
- All user-facing errors avoid infrastructure leakage.
- No fake production data or fake completed integrations remain.
- Tests, lint, type checks, and production builds pass.
- Documentation explains local development, modification, testing, and deployment.
- Deployment configuration is complete and truthful.

---

# 37. FINAL REPORT FORMAT

When implementation is complete, provide a concise but precise report containing:

1. Repository findings
2. Architecture implemented
3. Apps completed
4. Shared packages completed
5. Database models and migrations
6. Pages and API areas implemented
7. Real integrations completed
8. Workers and real-time features completed
9. Tests run and their actual results
10. Build/lint/type-check results
11. Environment variables required
12. Deployment readiness
13. Any remaining blockers
14. Any feature not implemented, with an honest reason
15. Exact commands the owner should run next

Do not say “everything is complete” unless the acceptance criteria have been verified.

**Begin by inspecting the repository, then execute the build.**