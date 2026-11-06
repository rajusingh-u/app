import {
  AppModuleDefinition,
  GlobalSearchResultItem,
  GlobalSearchScope,
  LoginFormValues,
  LoginValidationResult,
  ModuleCategory,
  ModuleId,
} from '../types/navigation';

export const ERP_MODULES: readonly AppModuleDefinition[] = [
  {
    id: 'dashboard',
    code: 'MOD-01',
    title: 'Dashboard',
    shortTitle: 'Home',
    category: 'Overview',
    description:
      'Essential inventory statistics, godown status, and recent stock movement activity.',
    primaryActionLabel: 'Configure View',
    expectedColumns: [
      'Module Name',
      'Operational Scope',
      'Integration Status',
      'Action',
    ],
    capabilities: [
      'Essential aggregate metrics across registered godowns',
      'Recent stock inward, outward, and transfer activity feed',
      'Direct access to items, godowns, manufacturing, and reports',
    ],
    searchKeywords: ['overview', 'home', 'summary', 'kpi', 'activity'],
  },
  {
    id: 'items',
    code: 'MOD-02',
    title: 'Items Management',
    shortTitle: 'Items',
    category: 'Inventory & Godowns',
    description:
      'Master catalog of inventory items, SKUs, measurement units, categories, and reorder thresholds.',
    primaryActionLabel: 'New Item',
    expectedColumns: [
      'Item Code / SKU',
      'Item Name',
      'Category',
      'Unit (UOM)',
      'Reorder Level',
      'Status',
    ],
    capabilities: [
      'SKU and item master registry with standardized units of measure',
      'Category classification and minimum stock alert thresholds',
      'Item-level audit history and lifecycle status',
    ],
    searchKeywords: ['sku', 'catalog', 'product', 'raw material', 'uom', 'reorder', 'barcode'],
  },
  {
    id: 'godowns',
    code: 'MOD-03',
    title: 'Godown Management',
    shortTitle: 'Godowns',
    category: 'Inventory & Godowns',
    description:
      'Directory of physical warehouses and storage godowns, location supervisors, and capacities.',
    primaryActionLabel: 'Add Godown',
    expectedColumns: [
      'Godown Code',
      'Godown Name',
      'City / Location',
      'Supervisor',
      'Capacity',
      'Status',
    ],
    capabilities: [
      'Multi-location warehouse and godown master profiles',
      'In-charge contact assignment and physical address records',
      'Godown-wise stock holding visibility and capacity status',
    ],
    searchKeywords: ['warehouse', 'storage', 'location', 'hub', 'supervisor', 'capacity'],
  },
  {
    id: 'stock',
    code: 'MOD-04',
    title: 'Stock Management',
    shortTitle: 'Stock',
    category: 'Inventory & Godowns',
    description:
      'Live stock ledger tracking inward receipts, outward dispatches, adjustments, and current balances.',
    primaryActionLabel: 'Record Stock',
    expectedColumns: [
      'Entry Date',
      'Reference No.',
      'Item Name',
      'Godown',
      'Movement Type',
      'Quantity',
    ],
    capabilities: [
      'Inward and outward stock movement recording with reference vouchers',
      'Godown-level and item-level available quantity verification',
      'Damage, shrinkage, and physical audit stock adjustments',
    ],
    searchKeywords: ['inward', 'outward', 'dispatch', 'receipt', 'balance', 'quantity', 'ledger'],
  },
  {
    id: 'stock-transfer',
    code: 'MOD-05',
    title: 'Stock Transfer',
    shortTitle: 'Transfers',
    category: 'Inventory & Godowns',
    description:
      'Inter-godown stock transfer challans, transit tracking, and destination receipt confirmation.',
    primaryActionLabel: 'New Transfer',
    expectedColumns: [
      'Transfer Date',
      'Challan No.',
      'Source Godown',
      'Destination Godown',
      'Items Count',
      'Transit Status',
    ],
    capabilities: [
      'Source-to-destination godown stock transfer initiation',
      'In-transit quantity tracking and receipt verification workflow',
      'Automated stock deduction and credit upon transfer completion',
    ],
    searchKeywords: ['challan', 'transit', 'inter-godown', 'move', 'source', 'destination'],
  },
  {
    id: 'opening-stock',
    code: 'MOD-06',
    title: 'Opening Stock',
    shortTitle: 'Opening Stock',
    category: 'Inventory & Godowns',
    description:
      'Financial period opening balances per item and godown for accurate ledger reconciliation.',
    primaryActionLabel: 'Set Opening Balance',
    expectedColumns: [
      'Accounting Period',
      'Godown Name',
      'Item SKU & Name',
      'Opening Quantity',
      'Unit Valuation',
      'Verified By',
    ],
    capabilities: [
      'Period-start stock baseline initialization by godown and item',
      'Bulk opening stock verification and lock controls',
      'Historical period comparison and reconciliation baseline',
    ],
    searchKeywords: ['baseline', 'fiscal', 'initial balance', 'reconciliation', 'valuation'],
  },
  {
    id: 'contractors',
    code: 'MOD-07',
    title: 'Contractors',
    shortTitle: 'Contractors',
    category: 'Production & Operations',
    description:
      'External job-work contractors, material issuance tracking, rate cards, and return reconciliations.',
    primaryActionLabel: 'Add Contractor',
    expectedColumns: [
      'Contractor Code',
      'Contractor Name',
      'Specialization',
      'Issued Material',
      'Pending Return',
      'Status',
    ],
    capabilities: [
      'Contractor directory and job-work specialization profiles',
      'Raw material issuance challans and finished output tracking',
      'Contractor-wise wastage and turnaround reconciliation',
    ],
    searchKeywords: ['job work', 'vendor', 'subcontractor', 'labor', 'issued material'],
  },
  {
    id: 'manufacturing',
    code: 'MOD-08',
    title: 'Manufacturing',
    shortTitle: 'Manufacturing',
    category: 'Production & Operations',
    description:
      'Production batches, bill of materials (BOM), raw material consumption, and finished goods yield.',
    primaryActionLabel: 'New Production Batch',
    expectedColumns: [
      'Batch No.',
      'Production Date',
      'Finished Item',
      'Godown / Unit',
      'Planned Qty',
      'Batch Status',
    ],
    capabilities: [
      'Bill of Materials (BOM) and production batch scheduling',
      'Automated raw material deduction and finished stock credit',
      'Yield variance and batch quality status tracking',
    ],
    searchKeywords: ['bom', 'production', 'batch', 'assembly', 'finished goods', 'yield'],
  },
  {
    id: 'monthly-reports',
    code: 'MOD-09',
    title: 'Monthly Reports',
    shortTitle: 'Reports',
    category: 'Finance & Reports',
    description:
      'Consolidated monthly stock statements, consumption summaries, godown valuation, and exportable ledgers.',
    primaryActionLabel: 'Generate Report',
    expectedColumns: [
      'Report Month',
      'Godown Scope',
      'Opening Bal.',
      'Total Inward',
      'Total Outward',
      'Closing Bal.',
    ],
    capabilities: [
      'Month-end closing stock statements across single or all godowns',
      'Item movement velocity, inward vs. outward variance analysis',
      'Print-ready and CSV/PDF export preparation for accounting teams',
    ],
    searchKeywords: ['statement', 'closing stock', 'summary', 'export', 'csv', 'audit'],
  },
  {
    id: 'godown-rent',
    code: 'MOD-10',
    title: 'Godown Rent and Deposit',
    shortTitle: 'Rent & Deposit',
    category: 'Finance & Reports',
    description:
      'Lease agreements, security deposits, monthly rent schedules, landlord records, and payment tracking.',
    primaryActionLabel: 'Add Lease Record',
    expectedColumns: [
      'Godown Name',
      'Landlord / Entity',
      'Lease Tenure',
      'Security Deposit',
      'Monthly Rent',
      'Payment Status',
    ],
    capabilities: [
      'Godown lease tenure, renewal dates, and escalation clauses',
      'Security deposit ledger and refundable balance tracking',
      'Monthly rent disbursement schedule and payment status tracking',
    ],
    searchKeywords: ['lease', 'landlord', 'deposit', 'rent', 'agreement', 'renewal'],
  },
  {
    id: 'users',
    code: 'MOD-11',
    title: 'User Management',
    shortTitle: 'Users',
    category: 'Administration',
    description:
      'Role-based access control for administrators, godown managers, inventory clerks, and auditors.',
    primaryActionLabel: 'Invite User',
    expectedColumns: [
      'Full Name',
      'Email Address',
      'Role',
      'Assigned Godown',
      'Account Status',
      'Last Active',
    ],
    capabilities: [
      'Role assignment and godown-scoped operational permissions',
      'Supabase Auth user profile linkage and access governance',
      'Account activation, suspension, and security audit visibility',
    ],
    searchKeywords: ['role', 'permissions', 'admin', 'clerk', 'staff', 'team'],
  },
  {
    id: 'notifications',
    code: 'MOD-12',
    title: 'Notifications',
    shortTitle: 'Alerts',
    category: 'Administration',
    description:
      'System alerts for low stock thresholds, pending stock transfers, lease renewals, and rent schedules.',
    primaryActionLabel: 'Alert Preferences',
    expectedColumns: [
      'Timestamp',
      'Alert Category',
      'Subject',
      'Affected Godown / Item',
      'Priority',
      'State',
    ],
    capabilities: [
      'Automated low-stock and reorder point breach notifications',
      'Pending inter-godown transfer receipt alerts',
      'Upcoming godown lease expiry and monthly rent reminders',
    ],
    searchKeywords: ['alerts', 'low stock', 'reminder', 'warning', 'expiry'],
  },
  {
    id: 'settings',
    code: 'MOD-13',
    title: 'Settings',
    shortTitle: 'Settings',
    category: 'Administration',
    description:
      'Organization profile, measurement units, accounting period configuration, and Supabase integration parameters.',
    primaryActionLabel: 'Review Settings',
    expectedColumns: [
      'Parameter Key',
      'Scope',
      'Configured Value',
      'Environment',
    ],
    capabilities: [
      'Organization identity, fiscal year, and numbering prefixes',
      'Standardized units of measure and inventory valuation rules',
      'Supabase connection verification and PWA install readiness',
    ],
    searchKeywords: ['configuration', 'supabase', 'pwa', 'units', 'environment'],
  },
] as const;

export const OM_MAGIC_MODULES = ERP_MODULES;

export const MODULE_CATEGORIES: readonly ModuleCategory[] = [
  'Overview',
  'Inventory & Godowns',
  'Production & Operations',
  'Finance & Reports',
  'Administration',
] as const;

export function getModuleById(id: string): AppModuleDefinition {
  const found = ERP_MODULES.find((mod) => mod.id === id);
  return found ?? ERP_MODULES[0];
}

export function getModulesByCategory(): Record<ModuleCategory, AppModuleDefinition[]> {
  return {
    Overview: ERP_MODULES.filter((m) => m.category === 'Overview'),
    'Inventory & Godowns': ERP_MODULES.filter(
      (m) => m.category === 'Inventory & Godowns'
    ),
    'Production & Operations': ERP_MODULES.filter(
      (m) => m.category === 'Production & Operations'
    ),
    'Finance & Reports': ERP_MODULES.filter(
      (m) => m.category === 'Finance & Reports'
    ),
    Administration: ERP_MODULES.filter((m) => m.category === 'Administration'),
  };
}

export function filterModules(query: string): AppModuleDefinition[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return [...ERP_MODULES];
  }
  return ERP_MODULES.filter(
    (mod) =>
      mod.title.toLowerCase().includes(normalized) ||
      mod.shortTitle.toLowerCase().includes(normalized) ||
      mod.code.toLowerCase().includes(normalized) ||
      mod.category.toLowerCase().includes(normalized) ||
      mod.description.toLowerCase().includes(normalized) ||
      mod.searchKeywords.some((kw) => kw.toLowerCase().includes(normalized))
  );
}

/**
 * Global search across Items, Godowns, Stock records/fields, and ERP Modules.
 * Does not return fake/mock data rows; surfaces direct module & field targets
 * so users can jump straight to items, godowns, or stock records.
 */
export function searchGlobalCatalog(
  query: string,
  scope: GlobalSearchScope = 'all'
): GlobalSearchResultItem[] {
  const normalized = query.trim().toLowerCase();

  const searchableIndex: GlobalSearchResultItem[] = [
    // Items scope
    {
      id: 'search-items-sku',
      title: 'Items Catalog — SKU & Barcode Lookup',
      subtitle: 'Find items by Item Code, SKU, Category, or Reorder Level',
      scope: 'items',
      moduleId: 'items',
      matchedField: 'Item Code / SKU · Reorder Level',
    },
    {
      id: 'search-items-uom',
      title: 'Items Management — Units & Categories',
      subtitle: 'Filter raw materials, finished goods, and packaging units',
      scope: 'items',
      moduleId: 'items',
      matchedField: 'Category · Unit (UOM)',
    },
    // Godowns scope
    {
      id: 'search-godowns-locations',
      title: 'Godown Directory — Warehouses & Storage Hubs',
      subtitle: 'Search physical godowns by Godown Code, City, or Supervisor',
      scope: 'godowns',
      moduleId: 'godowns',
      matchedField: 'Godown Code · City / Location',
    },
    {
      id: 'search-godowns-rent',
      title: 'Godown Rent & Security Deposits',
      subtitle: 'Lookup landlord records, lease tenures, and monthly rent schedules',
      scope: 'godowns',
      moduleId: 'godown-rent',
      matchedField: 'Landlord / Entity · Monthly Rent',
    },
    // Stock scope
    {
      id: 'search-stock-ledger',
      title: 'Stock Ledger — Inward, Outward & Adjustments',
      subtitle: 'Find live stock movements by Reference No., Item, or Godown',
      scope: 'stock',
      moduleId: 'stock',
      matchedField: 'Reference No. · Movement Type',
    },
    {
      id: 'search-stock-transfer',
      title: 'Stock Transfers — Inter-Godown Challans',
      subtitle: 'Track source-to-destination transfer challans and transit status',
      scope: 'stock',
      moduleId: 'stock-transfer',
      matchedField: 'Challan No. · Transit Status',
    },
    {
      id: 'search-opening-stock',
      title: 'Opening Stock — Period Reconciliations',
      subtitle: 'Search opening balances and unit valuations by accounting period',
      scope: 'stock',
      moduleId: 'opening-stock',
      matchedField: 'Accounting Period · Opening Quantity',
    },
    // Modules scope (all 13 modules)
    ...ERP_MODULES.map((mod) => ({
      id: `search-module-${mod.id}`,
      title: mod.title,
      subtitle: mod.description,
      scope: 'modules' as const,
      moduleId: mod.id,
      matchedField: `${mod.code} · ${mod.category}`,
    })),
  ];

  const scopedList =
    scope === 'all'
      ? searchableIndex
      : searchableIndex.filter((item) => item.scope === scope);

  if (!normalized) {
    return scopedList.slice(0, 8);
  }

  return scopedList.filter(
    (item) =>
      item.title.toLowerCase().includes(normalized) ||
      item.subtitle.toLowerCase().includes(normalized) ||
      item.matchedField.toLowerCase().includes(normalized) ||
      item.scope.toLowerCase().includes(normalized)
  );
}

export function getModuleBreadcrumb(moduleId: ModuleId): string {
  const mod = getModuleById(moduleId);
  return `Inventory / ${mod.title}`;
}

export function validateLoginInput(values: LoginFormValues): LoginValidationResult {
  const trimmedEmail = values.email.trim();
  const password = values.password;

  let emailError: string | undefined;
  let passwordError: string | undefined;

  if (!trimmedEmail) {
    emailError = 'Email address is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    emailError = 'Enter a valid corporate email address.';
  }

  if (!password || password.trim().length === 0) {
    passwordError = 'Password is required.';
  } else if (password.length < 6) {
    passwordError = 'Password must be at least 6 characters.';
  }

  return {
    valid: !emailError && !passwordError,
    emailError,
    passwordError,
  };
}

export function validatePasswordResetEmail(email: string): {
  valid: boolean;
  error?: string;
} {
  const trimmed = email.trim();
  if (!trimmed) {
    return { valid: false, error: 'Enter your registered email address.' };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return { valid: false, error: 'Enter a valid email address.' };
  }
  return { valid: true };
}

export const DEFAULT_SUPABASE_PROJECT_URL =
  'https://hldrsilboegmmqjhznji.supabase.co';

export interface SupabaseEnvEvaluation {
  url: string;
  hasValidUrl: boolean;
  hasValidAnonKey: boolean;
  isServiceRoleKeyDetected: boolean;
  isReady: boolean;
  statusSummary: string;
}

const PLACEHOLDER_KEYS = new Set([
  '',
  'MY_SUPABASE_ANON_KEY',
  'YOUR_SUPABASE_ANON_KEY',
  'YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY',
]);

/**
 * Pure helper that validates VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
 * and strictly blocks accidental service_role keys on the client.
 */
export function evaluateSupabaseEnvConfig(
  rawUrl?: string,
  rawAnonKey?: string
): SupabaseEnvEvaluation {
  const trimmedUrl = (rawUrl ?? '').trim();
  const effectiveUrl =
    trimmedUrl && trimmedUrl !== 'MY_SUPABASE_URL'
      ? trimmedUrl.replace(/\/+$/, '')
      : DEFAULT_SUPABASE_PROJECT_URL;

  const hasValidUrl = /^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(effectiveUrl);

  const trimmedKey = (rawAnonKey ?? '').trim();
  const isPlaceholder = PLACEHOLDER_KEYS.has(trimmedKey);

  // Detect if someone accidentally passed a service_role secret key
  let isServiceRoleKeyDetected = false;
  if (trimmedKey.startsWith('sb_secret_')) {
    isServiceRoleKeyDetected = true;
  } else if (trimmedKey.split('.').length === 3) {
    try {
      const payloadBase64 = trimmedKey.split('.')[1];
      const normalized = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
      const decoded =
        typeof atob === 'function'
          ? atob(normalized)
          : Buffer.from(normalized, 'base64').toString('utf8');
      if (decoded.includes('"role":"service_role"')) {
        isServiceRoleKeyDetected = true;
      }
    } catch {
      // Ignore malformed JWT segment during inspection
    }
  }

  const hasValidAnonKey =
    !isPlaceholder &&
    !isServiceRoleKeyDetected &&
    trimmedKey.length >= 20;

  const isReady = hasValidUrl && hasValidAnonKey;

  let statusSummary = 'Connected · Supabase Auth Ready';
  if (isServiceRoleKeyDetected) {
    statusSummary =
      'Security Block: service_role key detected. Use only the public anon/publishable key.';
  } else if (!hasValidUrl) {
    statusSummary = 'Invalid VITE_SUPABASE_URL format';
  } else if (!hasValidAnonKey) {
    statusSummary = 'Project URL Linked · Awaiting VITE_SUPABASE_ANON_KEY';
  }

  return {
    url: effectiveUrl,
    hasValidUrl,
    hasValidAnonKey,
    isServiceRoleKeyDetected,
    isReady,
    statusSummary,
  };
}

export function formatSupabaseAuthError(rawMessage: string): string {
  const trimmed = (rawMessage ?? '').trim();
  if (!trimmed) {
    return 'Authentication failed. Please check your credentials and try again.';
  }
  const lower = trimmed.toLowerCase();
  if (lower.includes('invalid login credentials')) {
    return 'Invalid email or password. Please verify your operator credentials.';
  }
  if (lower.includes('email not confirmed')) {
    return 'Your email address has not been confirmed yet. Please check your inbox for the verification link.';
  }
  if (lower.includes('too many requests') || lower.includes('rate limit')) {
    return 'Too many authentication attempts. Please wait a moment before trying again.';
  }
  if (lower.includes('failed to fetch') || lower.includes('networkerror')) {
    return 'Unable to reach Supabase Auth server. Check your internet connection or project status.';
  }
  return trimmed;
}

