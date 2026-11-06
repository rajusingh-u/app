export type ModuleId =
  | 'dashboard'
  | 'items'
  | 'godowns'
  | 'stock'
  | 'stock-transfer'
  | 'opening-stock'
  | 'contractors'
  | 'manufacturing'
  | 'monthly-reports'
  | 'godown-rent'
  | 'users'
  | 'notifications'
  | 'settings';

export type ModuleCategory =
  | 'Overview'
  | 'Inventory & Godowns'
  | 'Production & Operations'
  | 'Finance & Reports'
  | 'Administration';

export type AppViewMode = 'workspace' | 'login';

export type GlobalSearchScope = 'all' | 'items' | 'godowns' | 'stock' | 'modules';

export interface AppModuleDefinition {
  id: ModuleId;
  code: string;
  title: string;
  shortTitle: string;
  category: ModuleCategory;
  description: string;
  primaryActionLabel: string;
  expectedColumns: string[];
  capabilities: string[];
  searchKeywords: string[];
}

export interface GlobalSearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  scope: 'items' | 'godowns' | 'stock' | 'modules';
  moduleId: ModuleId;
  matchedField: string;
}

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface LoginValidationResult {
  valid: boolean;
  emailError?: string;
  passwordError?: string;
}
