/**
 * Reusable Supabase Client & Connection Diagnostics (Phase 2).
 * Uses VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY exclusively.
 * Never exposes or permits service_role keys or database passwords.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  DEFAULT_SUPABASE_PROJECT_URL,
  evaluateSupabaseEnvConfig,
} from '../utils/foundation';

const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const rawSupabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as
  | string
  | undefined;

export const supabaseEnvEvaluation = evaluateSupabaseEnvConfig(
  rawSupabaseUrl,
  rawSupabaseAnonKey
);

export const SUPABASE_PROJECT_URL = supabaseEnvEvaluation.url;

/**
 * Singleton Supabase client instance.
 * Initialized only when both a valid project URL and a valid public anon/publishable key are present.
 */
export const supabase: SupabaseClient | null = supabaseEnvEvaluation.isReady
  ? createClient(supabaseEnvEvaluation.url, (rawSupabaseAnonKey ?? '').trim(), {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'inventory-erp-supabase-auth',
      },
    })
  : null;

export interface SupabaseConnectionCheckResult {
  reachable: boolean;
  authenticatedClientReady: boolean;
  projectUrl: string;
  httpStatus: number | null;
  latencyMs: number;
  checkedAt: string;
  message: string;
}

/**
 * Verifies live network connectivity and Supabase Auth endpoint status
 * against the configured Supabase project URL.
 */
export async function checkSupabaseConnection(): Promise<SupabaseConnectionCheckResult> {
  const start = performance.now();
  const checkedAt = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  if (supabaseEnvEvaluation.isServiceRoleKeyDetected) {
    return {
      reachable: false,
      authenticatedClientReady: false,
      projectUrl: SUPABASE_PROJECT_URL,
      httpStatus: null,
      latencyMs: 0,
      checkedAt,
      message:
        'Blocked: A service_role key was detected. Replace it with your public anon / publishable key.',
    };
  }

  try {
    const headers: Record<string, string> = {};
    if (supabaseEnvEvaluation.hasValidAnonKey && rawSupabaseAnonKey) {
      headers['apikey'] = rawSupabaseAnonKey.trim();
    }

    const response = await fetch(`${SUPABASE_PROJECT_URL}/auth/v1/health`, {
      method: 'GET',
      headers,
    });

    const latencyMs = Math.max(1, Math.round(performance.now() - start));

    if (response.ok) {
      return {
        reachable: true,
        authenticatedClientReady: supabaseEnvEvaluation.isReady,
        projectUrl: SUPABASE_PROJECT_URL,
        httpStatus: response.status,
        latencyMs,
        checkedAt,
        message: supabaseEnvEvaluation.isReady
          ? 'Supabase Auth endpoint online and client initialized.'
          : 'Supabase Auth endpoint reachable; awaiting VITE_SUPABASE_ANON_KEY.',
      };
    }

    // Status 401 on /auth/v1/health means the project URL is online and reachable,
    // and is requesting a valid apikey header.
    if (response.status === 401) {
      return {
        reachable: true,
        authenticatedClientReady: supabaseEnvEvaluation.isReady,
        projectUrl: SUPABASE_PROJECT_URL,
        httpStatus: response.status,
        latencyMs,
        checkedAt,
        message: supabaseEnvEvaluation.hasValidAnonKey
          ? 'Project URL reachable, but VITE_SUPABASE_ANON_KEY was rejected (HTTP 401).'
          : 'Project endpoint https://hldrsilboegmmqjhznji.supabase.co is online. Set VITE_SUPABASE_ANON_KEY to enable sign-in.',
      };
    }

    return {
      reachable: true,
      authenticatedClientReady: supabaseEnvEvaluation.isReady,
      projectUrl: SUPABASE_PROJECT_URL,
      httpStatus: response.status,
      latencyMs,
      checkedAt,
      message: `Supabase endpoint responded with HTTP ${response.status}.`,
    };
  } catch {
    const latencyMs = Math.max(1, Math.round(performance.now() - start));
    return {
      reachable: false,
      authenticatedClientReady: supabaseEnvEvaluation.isReady,
      projectUrl: SUPABASE_PROJECT_URL || DEFAULT_SUPABASE_PROJECT_URL,
      httpStatus: null,
      latencyMs,
      checkedAt,
      message:
        'Network check could not reach Supabase project endpoint. Verify internet access or CORS configuration.',
    };
  }
}
