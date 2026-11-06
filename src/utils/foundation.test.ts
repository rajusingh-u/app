import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ERP_MODULES,
  getModuleById,
  getModulesByCategory,
  filterModules,
  searchGlobalCatalog,
  getModuleBreadcrumb,
  validateLoginInput,
  validatePasswordResetEmail,
  evaluateSupabaseEnvConfig,
  formatSupabaseAuthError,
  DEFAULT_SUPABASE_PROJECT_URL,
} from './foundation';

test('ERP_MODULES contains all 13 ERP modules including Contractors and Manufacturing', () => {
  assert.equal(ERP_MODULES.length, 13);
  const ids = ERP_MODULES.map((m) => m.id);
  assert.ok(ids.includes('items'));
  assert.ok(ids.includes('godowns'));
  assert.ok(ids.includes('stock'));
  assert.ok(ids.includes('stock-transfer'));
  assert.ok(ids.includes('opening-stock'));
  assert.ok(ids.includes('contractors'));
  assert.ok(ids.includes('manufacturing'));
  assert.ok(ids.includes('monthly-reports'));
  assert.ok(ids.includes('godown-rent'));
  assert.ok(ids.includes('users'));
});

test('getModuleById returns matching module or falls back to dashboard', () => {
  const contractorMod = getModuleById('contractors');
  assert.equal(contractorMod.title, 'Contractors');

  const mfgMod = getModuleById('manufacturing');
  assert.equal(mfgMod.title, 'Manufacturing');

  const fallback = getModuleById('unknown-module');
  assert.equal(fallback.id, 'dashboard');
});

test('getModulesByCategory partitions all 13 modules across 5 categories', () => {
  const grouped = getModulesByCategory();
  assert.equal(grouped.Overview.length, 1);
  assert.equal(grouped['Inventory & Godowns'].length, 5);
  assert.equal(grouped['Production & Operations'].length, 2);
  assert.equal(grouped['Finance & Reports'].length, 2);
  assert.equal(grouped.Administration.length, 3);
});

test('searchGlobalCatalog finds items, godowns, stock, and module records by query and scope', () => {
  const skuMatches = searchGlobalCatalog('sku', 'all');
  assert.ok(skuMatches.length >= 1);
  assert.equal(skuMatches[0].moduleId, 'items');

  const godownScoped = searchGlobalCatalog('', 'godowns');
  assert.ok(godownScoped.every((item) => item.scope === 'godowns'));

  const challanMatches = searchGlobalCatalog('challan', 'stock');
  assert.equal(challanMatches.length, 1);
  assert.equal(challanMatches[0].moduleId, 'stock-transfer');
});

test('filterModules filters by title, code, or keyword case-insensitively', () => {
  const bomResults = filterModules('bom');
  assert.equal(bomResults.length, 1);
  assert.equal(bomResults[0].id, 'manufacturing');
});

test('getModuleBreadcrumb formats breadcrumb cleanly', () => {
  assert.equal(
    getModuleBreadcrumb('stock-transfer'),
    'Inventory / Stock Transfer'
  );
});

test('validateLoginInput enforces required email format and password length', () => {
  const emptyCheck = validateLoginInput({ email: '', password: '' });
  assert.equal(emptyCheck.valid, false);

  const validCheck = validateLoginInput({
    email: 'admin@inventory.app',
    password: 'securePassword123',
  });
  assert.equal(validCheck.valid, true);
});

test('validatePasswordResetEmail checks email format', () => {
  assert.equal(validatePasswordResetEmail('').valid, false);
  assert.equal(validatePasswordResetEmail('ops@inventory.app').valid, true);
});

test('evaluateSupabaseEnvConfig defaults to hldrsilboegmmqjhznji.supabase.co and blocks service_role keys', () => {
  const withoutKey = evaluateSupabaseEnvConfig('', '');
  assert.equal(withoutKey.url, DEFAULT_SUPABASE_PROJECT_URL);
  assert.equal(withoutKey.hasValidUrl, true);
  assert.equal(withoutKey.hasValidAnonKey, false);
  assert.equal(withoutKey.isReady, false);

  const withPublishableKey = evaluateSupabaseEnvConfig(
    'https://hldrsilboegmmqjhznji.supabase.co',
    'sb_publishable_valid_public_key_example_12345'
  );
  assert.equal(withPublishableKey.isReady, true);
  assert.equal(withPublishableKey.isServiceRoleKeyDetected, false);

  const blockedSecretKey = evaluateSupabaseEnvConfig(
    'https://hldrsilboegmmqjhznji.supabase.co',
    'sb_secret_never_use_on_client_1234567890'
  );
  assert.equal(blockedSecretKey.isServiceRoleKeyDetected, true);
  assert.equal(blockedSecretKey.isReady, false);
});

test('formatSupabaseAuthError normalizes common Supabase Auth error strings', () => {
  assert.equal(
    formatSupabaseAuthError('Invalid login credentials'),
    'Invalid email or password. Please verify your operator credentials.'
  );
  assert.equal(
    formatSupabaseAuthError('Email not confirmed'),
    'Your email address has not been confirmed yet. Please check your inbox for the verification link.'
  );
});

