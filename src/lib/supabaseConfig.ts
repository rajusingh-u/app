/**
 * Supabase client readiness and configuration state (Phase 2).
 * Strictly reads public anon environment variables only.
 * Never stores or exposes service-role keys in the client.
 */

import {
  supabase,
  supabaseEnvEvaluation,
  SUPABASE_PROJECT_URL,
  checkSupabaseConnection,
  SupabaseConnectionCheckResult,
} from './supabaseClient';

export interface SupabaseReadinessState {
  isConfigured: boolean;
  hasValidUrl: boolean;
  hasValidAnonKey: boolean;
  isServiceRoleKeyDetected: boolean;
  projectUrl: string;
  projectUrlLabel: string;
  phaseLabel: string;
  statusBadgeLabel: string;
}

export function getSupabaseReadiness(): SupabaseReadinessState {
  return {
    isConfigured: supabaseEnvEvaluation.isReady,
    hasValidUrl: supabaseEnvEvaluation.hasValidUrl,
    hasValidAnonKey: supabaseEnvEvaluation.hasValidAnonKey,
    isServiceRoleKeyDetected: supabaseEnvEvaluation.isServiceRoleKeyDetected,
    projectUrl: SUPABASE_PROJECT_URL,
    projectUrlLabel: SUPABASE_PROJECT_URL,
    phaseLabel: supabaseEnvEvaluation.isReady
      ? 'Phase 2 · Supabase Auth Active'
      : 'Phase 2 · Supabase Auth Foundation',
    statusBadgeLabel: supabaseEnvEvaluation.statusSummary,
  };
}

export {
  supabase,
  SUPABASE_PROJECT_URL,
  checkSupabaseConnection,
  type SupabaseConnectionCheckResult,
};
