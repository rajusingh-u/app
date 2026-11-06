import React from 'react';
import { Loader2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { LoginPage } from '../../pages/LoginPage';
import { ModuleId } from '../../types/navigation';
import { getModuleById } from '../../utils/foundation';

interface ProtectedRouteProps {
  activeModule: ModuleId;
  allowLayoutInspection: boolean;
  onEnableLayoutInspection: (targetModule?: ModuleId) => void;
  children: React.ReactNode;
}

/**
 * Guards ERP routes behind Supabase Authentication.
 * - Shows a Light Liquid Glass loading state while restoring persisted session.
 * - Renders LoginPage when unauthenticated unless layout/settings inspection is explicitly opened.
 * - Never creates fake users or mock sessions.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  activeModule,
  allowLayoutInspection,
  onEnableLayoutInspection,
  children,
}) => {
  const { session, isLoading } = useAuth();
  const targetModule = getModuleById(activeModule);

  if (isLoading) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="min-h-screen flex items-center justify-center p-6 text-slate-900"
      >
        <div className="liquid-glass-elevated rounded-3xl p-8 max-w-sm w-full text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl liquid-glass-subtle flex items-center justify-center mx-auto text-sky-600">
            <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
          </div>
          <div className="space-y-1">
            <h1 className="text-base font-semibold text-slate-900">
              Restoring Session
            </h1>
            <p className="text-xs text-slate-500">
              Verifying persisted Supabase authentication token...
            </p>
          </div>
          <div className="pt-2 border-t border-slate-200/60 flex items-center justify-center gap-1.5 text-[11px] text-slate-500 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-600" aria-hidden="true" />
            <span>Supabase Auth · Made by Raju Singh</span>
          </div>
        </div>
      </div>
    );
  }

  if (!session && !allowLayoutInspection) {
    return (
      <LoginPage
        protectedModuleTitle={targetModule.title}
        onOpenWorkspace={() => onEnableLayoutInspection(activeModule)}
        onOpenAdminSettings={() => onEnableLayoutInspection('settings')}
      />
    );
  }

  return <>{children}</>;
};
