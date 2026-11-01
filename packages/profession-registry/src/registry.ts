import { ProfessionDefinition, ProfessionDefinitionSchema } from "./types";

export const PROFESSIONS_CATALOGUE: Record<string, ProfessionDefinition> = {
  // Craftkoru
  tailor: ProfessionDefinitionSchema.parse({
    id: "tailor",
    name: "Tailor / Fashion Designer",
    verticalApp: "craftkoru",
    description: "Custom apparel design, garment fittings, alterations, and fabric inventory.",
    icon: "scissors",
    terminology: {
      customerLabel: "Client",
      customersLabel: "Clients",
      itemLabel: "Garment / Style",
      itemsLabel: "Styles",
      orderOrJobLabel: "Custom Job",
      ordersOrJobsLabel: "Bespoke Jobs",
      appointmentLabel: "Fitting / Consultation",
      workerLabel: "Tailor / Artisan",
      costingLabel: "BOM & Workmanship"
    },
    capabilities: ["measurements", "fittings", "materials", "job_costing", "commissions"],
    navigation: [
      { label: "Dashboard", href: "/craftkoru/dashboard", icon: "home" },
      { label: "Jobs", href: "/craftkoru/jobs", icon: "briefcase" },
      { label: "Clients", href: "/craftkoru/customers", icon: "users" },
      { label: "Fittings", href: "/craftkoru/fittings", icon: "calendar" },
      { label: "Materials", href: "/craftkoru/materials", icon: "layers" },
      { label: "Invoices", href: "/craftkoru/invoices", icon: "file-text" }
    ],
    supportsScheduling: true,
    supportsInventory: true,
    supportsMeasurements: true,
    supportsDiagnostics: false,
    supportsPos: false,
    supportsKitchen: false,
    supportsRetainers: false,
    supportsBarcodes: false,
    defaultStatuses: ["intake", "measured", "cutting", "fitting_scheduled", "adjustments", "ready_for_pickup", "delivered"],
    documentTemplates: ["bespoke_invoice", "measurement_sheet", "job_cost_sheet"]
  }),

  barber: ProfessionDefinitionSchema.parse({
    id: "barber",
    name: "Barber",
    verticalApp: "craftkoru",
    description: "Haircuts, grooming, walk-ins, appointments, styling products sales.",
    icon: "user-check",
    terminology: {
      customerLabel: "Client",
      customersLabel: "Clients",
      itemLabel: "Grooming Service",
      itemsLabel: "Services",
      orderOrJobLabel: "Appointment",
      ordersOrJobsLabel: "Appointments",
      appointmentLabel: "Chair Session",
      workerLabel: "Barber",
      costingLabel: "Chair Time & Product Cost"
    },
    capabilities: ["walk_ins", "appointments", "commissions", "products_pos"],
    navigation: [
      { label: "Dashboard", href: "/craftkoru/dashboard", icon: "home" },
      { label: "Chair / Bookings", href: "/craftkoru/appointments", icon: "calendar" },
      { label: "Clients", href: "/craftkoru/customers", icon: "users" },
      { label: "Services", href: "/craftkoru/services", icon: "tag" },
      { label: "Commissions", href: "/craftkoru/commissions", icon: "dollar-sign" },
      { label: "Sales & Invoices", href: "/craftkoru/invoices", icon: "receipt" }
    ],
    supportsScheduling: true,
    supportsInventory: true,
    supportsMeasurements: false,
    supportsDiagnostics: false,
    supportsPos: true,
    supportsKitchen: false,
    supportsRetainers: false,
    supportsBarcodes: false,
    defaultStatuses: ["scheduled", "in_chair", "completed", "cancelled", "no_show"],
    documentTemplates: ["service_receipt", "commission_statement"]
  }),

  hair_stylist: ProfessionDefinitionSchema.parse({
    id: "hair_stylist",
    name: "Hair Stylist / Hairdresser",
    verticalApp: "craftkoru",
    description: "Hair styling, treatments, hair extensions, appointments, and care supplies.",
    icon: "sparkles",
    terminology: {
      customerLabel: "Client",
      customersLabel: "Clients",
      itemLabel: "Hair Treatment",
      itemsLabel: "Hair Services",
      orderOrJobLabel: "Salon Session",
      ordersOrJobsLabel: "Sessions",
      appointmentLabel: "Appointment",
      workerLabel: "Stylist",
      costingLabel: "Material & Labor Cost"
    },
    capabilities: ["appointments", "walk_ins", "material_recipes", "commissions"],
    navigation: [
      { label: "Dashboard", href: "/craftkoru/dashboard", icon: "home" },
      { label: "Appointments", href: "/craftkoru/appointments", icon: "calendar" },
      { label: "Clients", href: "/craftkoru/customers", icon: "users" },
      { label: "Treatments", href: "/craftkoru/services", icon: "tag" },
      { label: "Salon Supplies", href: "/craftkoru/inventory", icon: "package" },
      { label: "Invoices", href: "/craftkoru/invoices", icon: "receipt" }
    ],
    supportsScheduling: true,
    supportsInventory: true,
    supportsMeasurements: false,
    supportsDiagnostics: false,
    supportsPos: true,
    supportsKitchen: false,
    supportsRetainers: false,
    supportsBarcodes: false,
    defaultStatuses: ["scheduled", "in_progress", "completed", "cancelled", "no_show"],
    documentTemplates: ["salon_receipt", "service_history"]
  }),

  beauty_artist: ProfessionDefinitionSchema.parse({
    id: "beauty_artist",
    name: "Beauty Artist / Makeup Artist",
    verticalApp: "craftkoru",
    description: "Bridal makeup, beauty treatments, skincare, on-location appointments, portfolio.",
    icon: "smile",
    terminology: {
      customerLabel: "Client",
      customersLabel: "Clients",
      itemLabel: "Beauty Package",
      itemsLabel: "Packages",
      orderOrJobLabel: "Booking",
      ordersOrJobsLabel: "Bookings",
      appointmentLabel: "Session",
      workerLabel: "Artist",
      costingLabel: "Kit Cost & Travel"
    },
    capabilities: ["appointments", "kit_tracking", "travel_fees", "commissions"],
    navigation: [
      { label: "Dashboard", href: "/craftkoru/dashboard", icon: "home" },
      { label: "Bookings", href: "/craftkoru/appointments", icon: "calendar" },
      { label: "Clients", href: "/craftkoru/customers", icon: "users" },
      { label: "Packages", href: "/craftkoru/services", icon: "gift" },
      { label: "Materials Kit", href: "/craftkoru/materials", icon: "box" },
      { label: "Invoices", href: "/craftkoru/invoices", icon: "receipt" }
    ],
    supportsScheduling: true,
    supportsInventory: true,
    supportsMeasurements: false,
    supportsDiagnostics: false,
    supportsPos: false,
    supportsKitchen: false,
    supportsRetainers: false,
    supportsBarcodes: false,
    defaultStatuses: ["booked", "deposit_paid", "in_session", "completed", "cancelled"],
    documentTemplates: ["beauty_receipt", "contract_booking"]
  }),

  // Anvilgrid
  plumber: ProfessionDefinitionSchema.parse({
    id: "plumber",
    name: "Plumber",
    verticalApp: "anvilgrid",
    description: "Plumbing repairs, pipe installations, emergency calls, dispatch, parts.",
    icon: "tool",
    terminology: {
      customerLabel: "Customer",
      customersLabel: "Customers",
      itemLabel: "Plumbing Part",
      itemsLabel: "Parts & Materials",
      orderOrJobLabel: "Work Order",
      ordersOrJobsLabel: "Work Orders",
      appointmentLabel: "Site Visit / Dispatch",
      workerLabel: "Plumber",
      costingLabel: "Parts & Labor Estimate"
    },
    capabilities: ["diagnostics", "estimates", "dispatch", "parts_inventory", "warranties"],
    navigation: [
      { label: "Dashboard", href: "/anvilgrid/dashboard", icon: "home" },
      { label: "Work Orders", href: "/anvilgrid/jobs", icon: "tool" },
      { label: "Dispatch Board", href: "/anvilgrid/dispatch", icon: "map-pin" },
      { label: "Estimates", href: "/anvilgrid/estimates", icon: "file-text" },
      { label: "Customers & Sites", href: "/anvilgrid/customers", icon: "users" },
      { label: "Parts & Inventory", href: "/anvilgrid/parts", icon: "package" },
      { label: "Invoices", href: "/anvilgrid/invoices", icon: "receipt" }
    ],
    supportsScheduling: true,
    supportsInventory: true,
    supportsMeasurements: false,
    supportsDiagnostics: true,
    supportsPos: false,
    supportsKitchen: false,
    supportsRetainers: false,
    supportsBarcodes: false,
    defaultStatuses: ["call_received", "dispatched", "diagnosed", "estimate_approved", "in_progress", "completed", "invoiced"],
    documentTemplates: ["repair_estimate", "service_report", "plumbing_invoice"]
  }),

  electrician: ProfessionDefinitionSchema.parse({
    id: "electrician",
    name: "Electrician",
    verticalApp: "anvilgrid",
    description: "Electrical repairs, wiring, panels, safety checks, dispatch and equipment.",
    icon: "zap",
    terminology: {
      customerLabel: "Customer",
      customersLabel: "Customers",
      itemLabel: "Electrical Component",
      itemsLabel: "Components",
      orderOrJobLabel: "Service Order",
      ordersOrJobsLabel: "Service Orders",
      appointmentLabel: "Inspection / Visit",
      workerLabel: "Electrician",
      costingLabel: "Wiring & Component Cost"
    },
    capabilities: ["diagnostics", "estimates", "dispatch", "parts_inventory", "warranties"],
    navigation: [
      { label: "Dashboard", href: "/anvilgrid/dashboard", icon: "home" },
      { label: "Jobs", href: "/anvilgrid/jobs", icon: "zap" },
      { label: "Dispatch", href: "/anvilgrid/dispatch", icon: "calendar" },
      { label: "Estimates", href: "/anvilgrid/estimates", icon: "file-text" },
      { label: "Sites & Assets", href: "/anvilgrid/assets", icon: "shield" },
      { label: "Invoices", href: "/anvilgrid/invoices", icon: "receipt" }
    ],
    supportsScheduling: true,
    supportsInventory: true,
    supportsMeasurements: false,
    supportsDiagnostics: true,
    supportsPos: false,
    supportsKitchen: false,
    supportsRetainers: false,
    supportsBarcodes: false,
    defaultStatuses: ["intake", "dispatched", "inspected", "quoted", "in_progress", "certified", "completed"],
    documentTemplates: ["electrical_compliance", "estimate_quote", "repair_invoice"]
  }),

  mechanic: ProfessionDefinitionSchema.parse({
    id: "mechanic",
    name: "Mechanic / Auto Repair",
    verticalApp: "anvilgrid",
    description: "Vehicle diagnostics, scheduled maintenance, parts replacement, bays.",
    icon: "truck",
    terminology: {
      customerLabel: "Vehicle Owner",
      customersLabel: "Vehicle Owners",
      itemLabel: "Auto Part",
      itemsLabel: "Auto Parts",
      orderOrJobLabel: "Repair Order",
      ordersOrJobsLabel: "Repair Orders",
      appointmentLabel: "Bay Booking",
      workerLabel: "Mechanic / Technician",
      costingLabel: "Parts & Labor Hours"
    },
    capabilities: ["vehicle_assets", "diagnostics", "estimates", "parts_consumption", "warranties"],
    navigation: [
      { label: "Dashboard", href: "/anvilgrid/dashboard", icon: "home" },
      { label: "Repair Orders", href: "/anvilgrid/jobs", icon: "wrench" },
      { label: "Vehicles / Assets", href: "/anvilgrid/assets", icon: "truck" },
      { label: "Estimates", href: "/anvilgrid/estimates", icon: "file-text" },
      { label: "Parts Inventory", href: "/anvilgrid/parts", icon: "box" },
      { label: "Invoices", href: "/anvilgrid/invoices", icon: "receipt" }
    ],
    supportsScheduling: true,
    supportsInventory: true,
    supportsMeasurements: false,
    supportsDiagnostics: true,
    supportsPos: false,
    supportsKitchen: false,
    supportsRetainers: false,
    supportsBarcodes: false,
    defaultStatuses: ["check_in", "diagnosing", "estimate_pending", "approved", "parts_ordered", "repairing", "quality_checked", "ready_for_pickup", "completed"],
    documentTemplates: ["vehicle_inspection", "repair_estimate", "mechanic_invoice"]
  }),

  electronics_repair: ProfessionDefinitionSchema.parse({
    id: "electronics_repair",
    name: "Phone / Electronics Repair",
    verticalApp: "anvilgrid",
    description: "Device intake, screen replacements, motherboard diagnostics, warranty tracking.",
    icon: "smartphone",
    terminology: {
      customerLabel: "Device Owner",
      customersLabel: "Customers",
      itemLabel: "Replacement Part",
      itemsLabel: "Parts",
      orderOrJobLabel: "Repair Ticket",
      ordersOrJobsLabel: "Repair Tickets",
      appointmentLabel: "Intake Slot",
      workerLabel: "Repair Technician",
      costingLabel: "Component & Labor Cost"
    },
    capabilities: ["device_intake", "passcode_secure_notes", "diagnostics", "parts", "warranties"],
    navigation: [
      { label: "Dashboard", href: "/anvilgrid/dashboard", icon: "home" },
      { label: "Repair Tickets", href: "/anvilgrid/jobs", icon: "smartphone" },
      { label: "Device Assets", href: "/anvilgrid/assets", icon: "cpu" },
      { label: "Estimates", href: "/anvilgrid/estimates", icon: "file-text" },
      { label: "Screens & Parts", href: "/anvilgrid/parts", icon: "package" },
      { label: "Invoices", href: "/anvilgrid/invoices", icon: "receipt" }
    ],
    supportsScheduling: true,
    supportsInventory: true,
    supportsMeasurements: false,
    supportsDiagnostics: true,
    supportsPos: true,
    supportsKitchen: false,
    supportsRetainers: false,
    supportsBarcodes: true,
    defaultStatuses: ["intake", "bench_testing", "quote_ready", "quote_approved", "parts_waiting", "repaired", "testing_passed", "collected"],
    documentTemplates: ["intake_claim_ticket", "repair_invoice", "warranty_card"]
  }),

  // Savorpantry
  restaurant: ProfessionDefinitionSchema.parse({
    id: "restaurant",
    name: "Restaurant / Eatery",
    verticalApp: "savorpantry",
    description: "Dine-in tables, kitchen tickets, menu modifiers, ingredient recipes, takeout.",
    icon: "coffee",
    terminology: {
      customerLabel: "Guest",
      customersLabel: "Guests",
      itemLabel: "Dish / Beverage",
      itemsLabel: "Menu Items",
      orderOrJobLabel: "Table Order",
      ordersOrJobsLabel: "Orders",
      appointmentLabel: "Table Reservation",
      workerLabel: "Server / Chef",
      costingLabel: "Food Cost & Recipe Margin"
    },
    capabilities: ["pos", "kitchen_tickets", "table_management", "recipes", "cash_drawer"],
    navigation: [
      { label: "Dashboard", href: "/savorpantry/dashboard", icon: "home" },
      { label: "Point of Sale", href: "/savorpantry/pos", icon: "shopping-bag" },
      { label: "Kitchen Queue", href: "/savorpantry/kitchen", icon: "clipboard" },
      { label: "Tables", href: "/savorpantry/tables", icon: "grid" },
      { label: "Menu", href: "/savorpantry/menu", icon: "book-open" },
      { label: "Ingredients", href: "/savorpantry/ingredients", icon: "box" },
      { label: "Cash Drawer", href: "/savorpantry/cash-management", icon: "dollar-sign" }
    ],
    supportsScheduling: true,
    supportsInventory: true,
    supportsMeasurements: false,
    supportsDiagnostics: false,
    supportsPos: true,
    supportsKitchen: true,
    supportsRetainers: false,
    supportsBarcodes: false,
    defaultStatuses: ["placed", "sent_to_kitchen", "cooking", "ready_to_serve", "served", "paid", "voided"],
    documentTemplates: ["receipt_slip", "kitchen_ticket", "daily_reconciliation"]
  }),

  bakery: ProfessionDefinitionSchema.parse({
    id: "bakery",
    name: "Bakery",
    verticalApp: "savorpantry",
    description: "Fresh baked goods, custom cake orders, flour/sugar batch recipes, daily POS.",
    icon: "disc",
    terminology: {
      customerLabel: "Customer",
      customersLabel: "Customers",
      itemLabel: "Baked Good",
      itemsLabel: "Pastries & Breads",
      orderOrJobLabel: "Order / Cake Order",
      ordersOrJobsLabel: "Bake Orders",
      appointmentLabel: "Tasting / Consultation",
      workerLabel: "Baker",
      costingLabel: "Batch Recipe Costing"
    },
    capabilities: ["batch_tracking", "recipes", "custom_orders", "pos", "waste_tracking"],
    navigation: [
      { label: "Dashboard", href: "/savorpantry/dashboard", icon: "home" },
      { label: "POS Register", href: "/savorpantry/pos", icon: "shopping-bag" },
      { label: "Bake Batches", href: "/savorpantry/batches", icon: "layers" },
      { label: "Recipes", href: "/savorpantry/recipes", icon: "book" },
      { label: "Ingredients", href: "/savorpantry/ingredients", icon: "package" },
      { label: "Waste Log", href: "/savorpantry/waste", icon: "trash-2" }
    ],
    supportsScheduling: true,
    supportsInventory: true,
    supportsMeasurements: false,
    supportsDiagnostics: false,
    supportsPos: true,
    supportsKitchen: true,
    supportsRetainers: false,
    supportsBarcodes: false,
    defaultStatuses: ["received", "mixed", "baking", "cooling", "decorated", "ready", "picked_up"],
    documentTemplates: ["bakery_receipt", "cake_order_form", "batch_yield_sheet"]
  }),

  catering: ProfessionDefinitionSchema.parse({
    id: "catering",
    name: "Catering Business",
    verticalApp: "savorpantry",
    description: "Event catering, large headcount menus, equipment rental, delivery logistics.",
    icon: "briefcase",
    terminology: {
      customerLabel: "Event Host",
      customersLabel: "Clients",
      itemLabel: "Catering Package",
      itemsLabel: "Menu Packages",
      orderOrJobLabel: "Catering Event",
      ordersOrJobsLabel: "Events",
      appointmentLabel: "Event Tasting",
      workerLabel: "Caterer / Coordinator",
      costingLabel: "Per-Head Costing & Logistics"
    },
    capabilities: ["event_proposals", "recipes", "purchasing", "delivery_scheduling"],
    navigation: [
      { label: "Dashboard", href: "/savorpantry/dashboard", icon: "home" },
      { label: "Events & Orders", href: "/savorpantry/orders", icon: "calendar" },
      { label: "Catering Packages", href: "/savorpantry/menu", icon: "gift" },
      { label: "Ingredients & Food", href: "/savorpantry/ingredients", icon: "box" },
      { label: "Suppliers", href: "/savorpantry/suppliers", icon: "truck" },
      { label: "Invoices", href: "/savorpantry/expenses", icon: "receipt" }
    ],
    supportsScheduling: true,
    supportsInventory: true,
    supportsMeasurements: false,
    supportsDiagnostics: false,
    supportsPos: false,
    supportsKitchen: true,
    supportsRetainers: false,
    supportsBarcodes: false,
    defaultStatuses: ["inquiry", "quote_sent", "contract_signed", "prepping", "loaded_for_delivery", "event_active", "reconciled"],
    documentTemplates: ["catering_proposal", "prep_list", "delivery_manifest"]
  }),

  grocery: ProfessionDefinitionSchema.parse({
    id: "grocery",
    name: "Grocery / Supermarket",
    verticalApp: "savorpantry",
    description: "Fast barcode scanning, high volume inventory, supplier deliveries, expiry monitoring.",
    icon: "shopping-cart",
    terminology: {
      customerLabel: "Shopper",
      customersLabel: "Shoppers",
      itemLabel: "Grocery Product",
      itemsLabel: "Grocery Items",
      orderOrJobLabel: "Checkout Sale",
      ordersOrJobsLabel: "Sales",
      appointmentLabel: "Delivery Slot",
      workerLabel: "Cashier / Stock Clerk",
      costingLabel: "Landed Unit Cost"
    },
    capabilities: ["fast_pos", "barcodes", "batch_expiry", "supplier_pos", "cash_drawer"],
    navigation: [
      { label: "Dashboard", href: "/savorpantry/dashboard", icon: "home" },
      { label: "Grocery POS", href: "/savorpantry/pos", icon: "shopping-cart" },
      { label: "Stock Inventory", href: "/savorpantry/inventory", icon: "package" },
      { label: "Batches & Expiry", href: "/savorpantry/batches", icon: "clock" },
      { label: "Suppliers & POs", href: "/savorpantry/purchases", icon: "truck" },
      { label: "Cash Drawer", href: "/savorpantry/cash-management", icon: "dollar-sign" }
    ],
    supportsScheduling: false,
    supportsInventory: true,
    supportsMeasurements: false,
    supportsDiagnostics: false,
    supportsPos: true,
    supportsKitchen: false,
    supportsRetainers: false,
    supportsBarcodes: true,
    defaultStatuses: ["active", "low_stock", "expired", "reordered"],
    documentTemplates: ["grocery_receipt", "stocktake_audit", "po_sheet"]
  }),

  // Ledgerverdict
  law_firm: ProfessionDefinitionSchema.parse({
    id: "law_firm",
    name: "Law Firm",
    verticalApp: "ledgerverdict",
    description: "Matter management, billable hours, client trust retainers, confidential briefs.",
    icon: "shield",
    terminology: {
      customerLabel: "Client",
      customersLabel: "Clients",
      itemLabel: "Legal Service / Fee",
      itemsLabel: "Fee Schedule",
      orderOrJobLabel: "Matter / Case",
      ordersOrJobsLabel: "Matters",
      appointmentLabel: "Client Consultation / Hearing",
      workerLabel: "Attorney / Associate",
      costingLabel: "Hourly Billing & Disbursements"
    },
    capabilities: ["matters", "confidential_docs", "retainers", "time_tracking", "billable_rates"],
    navigation: [
      { label: "Dashboard", href: "/ledgerverdict/dashboard", icon: "home" },
      { label: "Matters / Cases", href: "/ledgerverdict/cases", icon: "briefcase" },
      { label: "Clients", href: "/ledgerverdict/clients", icon: "users" },
      { label: "Time Tracking", href: "/ledgerverdict/time", icon: "clock" },
      { label: "Retainers", href: "/ledgerverdict/retainers", icon: "shield" },
      { label: "Documents", href: "/ledgerverdict/documents", icon: "folder" },
      { label: "Invoices", href: "/ledgerverdict/invoices", icon: "receipt" }
    ],
    supportsScheduling: true,
    supportsInventory: false,
    supportsMeasurements: false,
    supportsDiagnostics: false,
    supportsPos: false,
    supportsKitchen: false,
    supportsRetainers: true,
    supportsBarcodes: false,
    defaultStatuses: ["intake", "conflict_check", "retained", "discovery", "in_litigation", "settled", "closed"],
    documentTemplates: ["engagement_letter", "retainer_statement", "legal_invoice"]
  }),

  accounting_firm: ProfessionDefinitionSchema.parse({
    id: "accounting_firm",
    name: "Accounting / Bookkeeping Practice",
    verticalApp: "ledgerverdict",
    description: "Client engagements, recurring monthly retainers, tax filings, audit workpapers.",
    icon: "calculator",
    terminology: {
      customerLabel: "Client Entity",
      customersLabel: "Clients",
      itemLabel: "Accounting Service",
      itemsLabel: "Services",
      orderOrJobLabel: "Engagement / Filing",
      ordersOrJobsLabel: "Engagements",
      appointmentLabel: "Financial Review",
      workerLabel: "Accountant / Auditor",
      costingLabel: "Staff Utilization & Realization"
    },
    capabilities: ["engagements", "retainers", "recurring_fees", "client_documents", "time_tracking"],
    navigation: [
      { label: "Dashboard", href: "/ledgerverdict/dashboard", icon: "home" },
      { label: "Engagements", href: "/ledgerverdict/engagements", icon: "check-circle" },
      { label: "Clients", href: "/ledgerverdict/clients", icon: "users" },
      { label: "Retainers & Fees", href: "/ledgerverdict/retainers", icon: "dollar-sign" },
      { label: "Workpapers", href: "/ledgerverdict/documents", icon: "file-text" },
      { label: "Time Entries", href: "/ledgerverdict/time", icon: "clock" },
      { label: "Invoices", href: "/ledgerverdict/invoices", icon: "receipt" }
    ],
    supportsScheduling: true,
    supportsInventory: false,
    supportsMeasurements: false,
    supportsDiagnostics: false,
    supportsPos: false,
    supportsKitchen: false,
    supportsRetainers: true,
    supportsBarcodes: false,
    defaultStatuses: ["onboarding", "documents_pending", "reconciling", "partner_review", "filed", "closed"],
    documentTemplates: ["engagement_contract", "tax_filing_summary", "professional_invoice"]
  }),

  real_estate_agency: ProfessionDefinitionSchema.parse({
    id: "real_estate_agency",
    name: "Real Estate Agency",
    verticalApp: "ledgerverdict",
    description: "Property listings, buyer/seller pipelines, lease agreements, agent commissions.",
    icon: "home",
    terminology: {
      customerLabel: "Client / Buyer / Landlord",
      customersLabel: "Clients",
      itemLabel: "Property Listing",
      itemsLabel: "Listings",
      orderOrJobLabel: "Transaction / Deal",
      ordersOrJobsLabel: "Deals",
      appointmentLabel: "Property Showing / Inspection",
      workerLabel: "Realtor / Agent",
      costingLabel: "Commission Split & Marketing"
    },
    capabilities: ["property_listings", "pipeline", "contracts", "commissions", "showings"],
    navigation: [
      { label: "Dashboard", href: "/ledgerverdict/dashboard", icon: "home" },
      { label: "Deals & Pipeline", href: "/ledgerverdict/pipeline", icon: "activity" },
      { label: "Clients & Leads", href: "/ledgerverdict/clients", icon: "users" },
      { label: "Contracts", href: "/ledgerverdict/contracts", icon: "file-text" },
      { label: "Showings Calendar", href: "/ledgerverdict/calendar", icon: "calendar" },
      { label: "Invoices & Fees", href: "/ledgerverdict/invoices", icon: "receipt" }
    ],
    supportsScheduling: true,
    supportsInventory: false,
    supportsMeasurements: false,
    supportsDiagnostics: false,
    supportsPos: false,
    supportsKitchen: false,
    supportsRetainers: false,
    supportsBarcodes: false,
    defaultStatuses: ["lead", "viewing", "offer_made", "in_escrow", "signed", "commission_disbursed"],
    documentTemplates: ["agency_agreement", "offer_letter", "closing_statement"]
  }),

  consulting: ProfessionDefinitionSchema.parse({
    id: "consulting",
    name: "Consulting / Professional Services",
    verticalApp: "ledgerverdict",
    description: "Strategic advisory, fixed-fee deliverables, milestone contracts, proposals.",
    icon: "trending-up",
    terminology: {
      customerLabel: "Client Account",
      customersLabel: "Accounts",
      itemLabel: "Advisory Offering",
      itemsLabel: "Offerings",
      orderOrJobLabel: "Project Engagement",
      ordersOrJobsLabel: "Projects",
      appointmentLabel: "Discovery / Strategy Call",
      workerLabel: "Consultant / Lead",
      costingLabel: "Project Burn & Margin"
    },
    capabilities: ["proposals", "milestones", "time_tracking", "deliverables", "retainers"],
    navigation: [
      { label: "Dashboard", href: "/ledgerverdict/dashboard", icon: "home" },
      { label: "Projects", href: "/ledgerverdict/projects", icon: "layers" },
      { label: "Proposals", href: "/ledgerverdict/proposals", icon: "file" },
      { label: "Accounts", href: "/ledgerverdict/clients", icon: "users" },
      { label: "Time & Burn", href: "/ledgerverdict/time", icon: "clock" },
      { label: "Invoices", href: "/ledgerverdict/invoices", icon: "receipt" }
    ],
    supportsScheduling: true,
    supportsInventory: false,
    supportsMeasurements: false,
    supportsDiagnostics: false,
    supportsPos: false,
    supportsKitchen: false,
    supportsRetainers: true,
    supportsBarcodes: false,
    defaultStatuses: ["proposal_sent", "active_sow", "in_discovery", "milestone_1", "milestone_2", "completed", "billed"],
    documentTemplates: ["statement_of_work", "proposal_document", "consulting_invoice"]
  }),

  // Bazaarmart
  fashion_boutique: ProfessionDefinitionSchema.parse({
    id: "fashion_boutique",
    name: "Fashion Boutique",
    verticalApp: "bazaarmart",
    description: "Apparel retail, color/size matrix variants, barcode scanning, exchanges, POS.",
    icon: "shopping-bag",
    terminology: {
      customerLabel: "Shopper",
      customersLabel: "Shoppers",
      itemLabel: "Garment Product",
      itemsLabel: "Products",
      orderOrJobLabel: "Retail Sale",
      ordersOrJobsLabel: "Sales",
      appointmentLabel: "Personal Shopping Slot",
      workerLabel: "Sales Associate",
      costingLabel: "Wholesale Margin & Markup"
    },
    capabilities: ["matrix_variants", "barcodes", "pos", "returns_exchanges", "promotions"],
    navigation: [
      { label: "Dashboard", href: "/bazaarmart/dashboard", icon: "home" },
      { label: "Point of Sale", href: "/bazaarmart/pos", icon: "shopping-bag" },
      { label: "Products & Variants", href: "/bazaarmart/products", icon: "grid" },
      { label: "Barcodes", href: "/bazaarmart/barcodes", icon: "maximize" },
      { label: "Inventory & Stocktakes", href: "/bazaarmart/inventory", icon: "package" },
      { label: "Sales & Receipts", href: "/bazaarmart/sales", icon: "receipt" },
      { label: "Cash Management", href: "/bazaarmart/cash-management", icon: "dollar-sign" }
    ],
    supportsScheduling: false,
    supportsInventory: true,
    supportsMeasurements: false,
    supportsDiagnostics: false,
    supportsPos: true,
    supportsKitchen: false,
    supportsRetainers: false,
    supportsBarcodes: true,
    defaultStatuses: ["in_stock", "low_stock", "discontinued", "on_sale"],
    documentTemplates: ["pos_receipt", "gift_receipt", "return_slip"]
  }),

  electronics_retail: ProfessionDefinitionSchema.parse({
    id: "electronics_retail",
    name: "Electronics Retail",
    verticalApp: "bazaarmart",
    description: "Consumer electronics, serialized inventory, warranties, accessories, multi-branch POS.",
    icon: "tv",
    terminology: {
      customerLabel: "Customer",
      customersLabel: "Customers",
      itemLabel: "Device / Gadget",
      itemsLabel: "Products",
      orderOrJobLabel: "Sale Transaction",
      ordersOrJobsLabel: "Sales",
      workerLabel: "Sales Rep",
      costingLabel: "Unit Cost & Serial Tracking"
    },
    capabilities: ["serial_numbers", "warranties", "barcodes", "multi_branch", "pos"],
    navigation: [
      { label: "Dashboard", href: "/bazaarmart/dashboard", icon: "home" },
      { label: "Retail POS", href: "/bazaarmart/pos", icon: "shopping-bag" },
      { label: "Catalog & Serials", href: "/bazaarmart/products", icon: "cpu" },
      { label: "Branch Stock", href: "/bazaarmart/branches", icon: "map-pin" },
      { label: "Stock Transfers", href: "/bazaarmart/transfers", icon: "repeat" },
      { label: "Purchases", href: "/bazaarmart/purchases", icon: "truck" }
    ],
    supportsScheduling: false,
    supportsInventory: true,
    supportsMeasurements: false,
    supportsDiagnostics: false,
    supportsPos: true,
    supportsKitchen: false,
    supportsRetainers: false,
    supportsBarcodes: true,
    defaultStatuses: ["available", "reserved", "sold", "returned_to_vendor"],
    documentTemplates: ["serial_warranty_receipt", "transfer_challan", "po_order"]
  }),

  furniture_retail: ProfessionDefinitionSchema.parse({
    id: "furniture_retail",
    name: "Furniture Retail",
    verticalApp: "bazaarmart",
    description: "Showroom furniture, warehouse stock, delivery dispatch, custom finishes.",
    icon: "archive",
    terminology: {
      customerLabel: "Customer",
      customersLabel: "Customers",
      itemLabel: "Furniture Piece",
      itemsLabel: "Catalog Items",
      orderOrJobLabel: "Sales Order",
      ordersOrJobsLabel: "Sales Orders",
      appointmentLabel: "Delivery Appointment",
      workerLabel: "Sales Consultant / Driver",
      costingLabel: "Landed Freight & Markup"
    },
    capabilities: ["warehouse_locations", "deliveries", "pos", "stock_transfers"],
    navigation: [
      { label: "Dashboard", href: "/bazaarmart/dashboard", icon: "home" },
      { label: "POS & Orders", href: "/bazaarmart/orders", icon: "shopping-bag" },
      { label: "Furniture Catalog", href: "/bazaarmart/products", icon: "archive" },
      { label: "Warehouses", href: "/bazaarmart/warehouses", icon: "home" },
      { label: "Stock Transfers", href: "/bazaarmart/transfers", icon: "truck" },
      { label: "Receipts & Sales", href: "/bazaarmart/sales", icon: "receipt" }
    ],
    supportsScheduling: true,
    supportsInventory: true,
    supportsMeasurements: false,
    supportsDiagnostics: false,
    supportsPos: true,
    supportsKitchen: false,
    supportsRetainers: false,
    supportsBarcodes: true,
    defaultStatuses: ["floor_display", "in_warehouse", "scheduled_delivery", "delivered"],
    documentTemplates: ["furniture_order_slip", "delivery_note", "warehouse_dispatch"]
  }),

  general_retail: ProfessionDefinitionSchema.parse({
    id: "general_retail",
    name: "General Retail / Variety Store",
    verticalApp: "bazaarmart",
    description: "Everyday merchandise, fast checkout, stock takes, supplier receiving.",
    icon: "shopping-bag",
    terminology: {
      customerLabel: "Customer",
      customersLabel: "Customers",
      itemLabel: "Product",
      itemsLabel: "Products",
      orderOrJobLabel: "Sale",
      ordersOrJobsLabel: "Sales",
      workerLabel: "Cashier",
      costingLabel: "Unit Cost & Margin"
    },
    capabilities: ["pos", "barcodes", "stocktakes", "cash_drawer", "returns"],
    navigation: [
      { label: "Dashboard", href: "/bazaarmart/dashboard", icon: "home" },
      { label: "Quick POS", href: "/bazaarmart/pos", icon: "shopping-bag" },
      { label: "Products", href: "/bazaarmart/products", icon: "box" },
      { label: "Stocktake", href: "/bazaarmart/stocktakes", icon: "clipboard" },
      { label: "Purchases", href: "/bazaarmart/purchases", icon: "truck" },
      { label: "Cash Drawer", href: "/bazaarmart/cash-management", icon: "dollar-sign" }
    ],
    supportsScheduling: false,
    supportsInventory: true,
    supportsMeasurements: false,
    supportsDiagnostics: false,
    supportsPos: true,
    supportsKitchen: false,
    supportsRetainers: false,
    supportsBarcodes: true,
    defaultStatuses: ["in_stock", "low_stock", "out_of_stock"],
    documentTemplates: ["retail_receipt", "refund_voucher"]
  }),

  pharmacy_retail: ProfessionDefinitionSchema.parse({
    id: "pharmacy_retail",
    name: "Pharmacy / Drug Store",
    verticalApp: "bazaarmart",
    description: "Prescription medication, strict batch tracking, expiry dates, supplier regulatory records.",
    icon: "heart",
    terminology: {
      customerLabel: "Patient / Customer",
      customersLabel: "Patients",
      itemLabel: "Medication / Product",
      itemsLabel: "Pharmaceuticals",
      orderOrJobLabel: "Prescription Sale",
      ordersOrJobsLabel: "Dispenses",
      workerLabel: "Pharmacist / Dispenser",
      costingLabel: "Regulated Pricing & Batch Tracking"
    },
    capabilities: ["batch_expiry_strict", "barcodes", "pos", "controlled_substance_logs", "suppliers"],
    navigation: [
      { label: "Dashboard", href: "/bazaarmart/dashboard", icon: "home" },
      { label: "Dispense POS", href: "/bazaarmart/pos", icon: "activity" },
      { label: "Medication Catalog", href: "/bazaarmart/products", icon: "package" },
      { label: "Batch & Expiry", href: "/bazaarmart/inventory", icon: "clock" },
      { label: "Suppliers", href: "/bazaarmart/suppliers", icon: "truck" },
      { label: "Sales & Receipts", href: "/bazaarmart/sales", icon: "receipt" }
    ],
    supportsScheduling: false,
    supportsInventory: true,
    supportsMeasurements: false,
    supportsDiagnostics: false,
    supportsPos: true,
    supportsKitchen: false,
    supportsRetainers: false,
    supportsBarcodes: true,
    defaultStatuses: ["dispensed", "quarantine", "expired", "recalled"],
    documentTemplates: ["dispense_receipt", "batch_log_report", "prescription_record"]
  })
};

export function getProfession(id: string): ProfessionDefinition {
  const prof = PROFESSIONS_CATALOGUE[id];
  if (!prof) {
    return PROFESSIONS_CATALOGUE.tailor;
  }
  return prof;
}

export function listProfessionsByApp(app: string): ProfessionDefinition[] {
  return Object.values(PROFESSIONS_CATALOGUE).filter((p) => p.verticalApp === app);
}

export function listAllProfessions(): ProfessionDefinition[] {
  return Object.values(PROFESSIONS_CATALOGUE);
}
