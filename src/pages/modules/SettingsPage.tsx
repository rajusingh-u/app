import React, { useEffect, useState } from 'react';
import {
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  LogOut,
  KeyRound,
  Activity,
} from 'lucide-react';
import { getModuleById } from '../../utils/foundation';
import { ModuleId } from '../../types/navigation';
import { EmptyModuleFoundation } from '../../components/ui/EmptyModuleFoundation';
import {
  getSupabaseReadiness,
  checkSupabaseConnection,
  SupabaseConnectionCheckResult,
} from '../../lib/supabaseConfig';
import { useAuth } from '../../context/AuthContext';

interface ModulePageProps {
  onNavigateModule: (moduleId: ModuleId) => void;
  onOpenLoginScreen?: () => void;
}

export const SettingsPage: React.FC<ModulePageProps> = ({
  onNavigateModule,
  onOpenLoginScreen,
}) => {
  const moduleDef = getModuleById('settings');
  const supabaseState = getSupabaseReadiness();
  const { user, session, signOut, isSubmitting } = useAuth();

  const [connectionCheck, setConnectionCheck] =
    useState<SupabaseConnectionCheckResult | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const runHealthCheck = async () => {
    setIsChecking(true);
    try {
      const res = await checkSupabaseConnection();
      setConnectionCheck(res);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    runHealthCheck();
  }, []);

  const isEndpointOnline = connectionCheck?.reachable ?? false;

  return (
    <EmptyModuleFoundation
      module={moduleDef}
      onNavigateModule={onNavigateModule}
      customToolbarFilters={[
        'Supabase Connection',
        'Authentication & RLS',
        'General & Branding',
        'PWA Configuration',
      ]}
    >
      <section
        aria-label="Supabase Connection Status Indicator"
        className="liquid-glass-elevated rounded-2xl p-5 sm:p-6 space-y-5"
      >
        {/* Top Row: Indicator Header + Live Verify Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/70">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <span
                data-testid="supabase-connection-badge"
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-xl text-xs font-semibold border ${
                  supabaseState.isConfigured
                    ? 'bg-emerald-50/90 text-emerald-800 border-emerald-200'
                    : isEndpointOnline
                    ? 'bg-sky-50/90 text-sky-800 border-sky-200'
                    : 'bg-amber-50/90 text-amber-800 border-amber-200'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    supabaseState.isConfigured
                      ? 'bg-emerald-500'
                      : isEndpointOnline
                      ? 'bg-sky-500'
                      : 'bg-amber-500'
                  }`}
                  aria-hidden="true"
                />
                <span>
                  {supabaseState.isConfigured
                    ? 'Supabase Connected · Auth Client Ready'
                    : isEndpointOnline
                    ? 'Project Endpoint Online · Awaiting Anon Key'
                    : supabaseState.statusBadgeLabel}
                </span>
              </span>

              {connectionCheck && (
                <span className="text-[11px] font-mono text-slate-500 tabular-nums">
                  {connectionCheck.reachable
                    ? `Reachable (${connectionCheck.latencyMs}ms)`
                    : 'Offline / Unreachable'}{' '}
                  · Checked {connectionCheck.checkedAt}
                </span>
              )}
            </div>

            <h2 className="text-base font-semibold text-slate-900 pt-1">
              Supabase Connection & Authentication Diagnostics
            </h2>
            <p className="text-xs text-slate-600">
              {connectionCheck
                ? connectionCheck.message
                : 'Verifying connection to Supabase project endpoint...'}
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={runHealthCheck}
              disabled={isChecking}
              aria-label="Verify Supabase connection"
              className="px-3.5 py-2 text-xs font-semibold text-slate-800 liquid-glass-subtle hover:bg-white/90 disabled:opacity-60 rounded-xl transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 text-sky-600 ${
                  isChecking ? 'animate-spin' : ''
                }`}
                aria-hidden="true"
              />
              <span>{isChecking ? 'Checking...' : 'Verify Connection'}</span>
            </button>

            {session ? (
              <button
                type="button"
                onClick={() => signOut()}
                disabled={isSubmitting}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-60 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Sign Out</span>
              </button>
            ) : (
              onOpenLoginScreen && (
                <button
                  type="button"
                  onClick={onOpenLoginScreen}
                  className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <KeyRound className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Open Login Screen</span>
                </button>
              )
            )}
          </div>
        </div>

        {/* 4-Card Diagnostic Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Card 1: Project URL */}
          <div className="liquid-glass p-4 rounded-2xl space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>VITE_SUPABASE_URL</span>
              <CheckCircle2
                className="w-3.5 h-3.5 text-emerald-600 shrink-0"
                aria-hidden="true"
              />
            </div>
            <div className="text-xs font-semibold font-mono text-slate-900 truncate">
              {supabaseState.projectUrl}
            </div>
            <div className="text-[11px] text-slate-500">
              Project ID: hldrsilboegmmqjhznji
            </div>
          </div>

          {/* Card 2: Publishable / Anon Key */}
          <div className="liquid-glass p-4 rounded-2xl space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>VITE_SUPABASE_ANON_KEY</span>
              {supabaseState.hasValidAnonKey ? (
                <CheckCircle2
                  className="w-3.5 h-3.5 text-emerald-600 shrink-0"
                  aria-hidden="true"
                />
              ) : (
                <AlertCircle
                  className="w-3.5 h-3.5 text-amber-600 shrink-0"
                  aria-hidden="true"
                />
              )}
            </div>
            <div className="text-xs font-semibold text-slate-900">
              {supabaseState.hasValidAnonKey
                ? 'Public Key Configured'
                : 'Awaiting Environment Variable'}
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              {supabaseState.isServiceRoleKeyDetected
                ? 'Blocked: service_role key rejected'
                : 'Public anon/publishable key only'}
            </div>
          </div>

          {/* Card 3: Session & Protected Routes */}
          <div className="liquid-glass p-4 rounded-2xl space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Auth Session Status</span>
              <Activity
                className="w-3.5 h-3.5 text-sky-600 shrink-0"
                aria-hidden="true"
              />
            </div>
            <div className="text-xs font-semibold text-slate-900 truncate">
              {user?.email ? user.email : 'Unauthenticated Session'}
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              {session
                ? 'Session persisted · Auto-refresh on'
                : 'Protected routes active'}
            </div>
          </div>

          {/* Card 4: Security & Creator */}
          <div className="liquid-glass p-4 rounded-2xl space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Security & Creator</span>
              <ShieldCheck
                className="w-3.5 h-3.5 text-sky-600 shrink-0"
                aria-hidden="true"
              />
            </div>
            <div className="text-xs font-semibold text-slate-900">
              Made by Raju Singh
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              No service_role keys · Light Glass
            </div>
          </div>
        </div>
      </section>
    </EmptyModuleFoundation>
  );
};
