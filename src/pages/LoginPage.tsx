import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  ArrowRight,
  LayoutDashboard,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Loader2,
  SlidersHorizontal,
  Lock,
} from 'lucide-react';
import { OmMagicLogo } from '../components/branding/OmMagicLogo';
import {
  OM_MAGIC_MODULES,
  validateLoginInput,
  validatePasswordResetEmail,
} from '../utils/foundation';
import { getSupabaseReadiness } from '../lib/supabaseConfig';
import { useAuth } from '../context/AuthContext';

interface LoginPageProps {
  onOpenWorkspace: () => void;
  onOpenAdminSettings?: () => void;
  protectedModuleTitle?: string;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onOpenWorkspace,
  onOpenAdminSettings,
  protectedModuleTitle,
}) => {
  const {
    signInWithPassword,
    requestPasswordReset,
    isSubmitting,
    authError,
    authNotice,
    clearAuthMessages,
  } = useAuth();

  const [mode, setMode] = useState<'signin' | 'recovery'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);

  const [emailError, setEmailError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();

  const supabaseState = getSupabaseReadiness();

  const handleSignInSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    clearAuthMessages();

    const validation = validateLoginInput({ email, password });
    setEmailError(validation.emailError);
    setPasswordError(validation.passwordError);

    if (!validation.valid) {
      return;
    }

    const result = await signInWithPassword(email, password);
    if (result.success) {
      onOpenWorkspace();
    }
  };

  const handleRecoverySubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    clearAuthMessages();

    const check = validatePasswordResetEmail(email);
    setEmailError(check.error);

    if (!check.valid) {
      return;
    }

    await requestPasswordReset(email);
  };

  const switchMode = (nextMode: 'signin' | 'recovery') => {
    setMode(nextMode);
    setEmailError(undefined);
    setPasswordError(undefined);
    clearAuthMessages();
  };

  return (
    <div className="min-h-screen text-slate-900 flex flex-col">
      {/* Top Bar Contract (Light Liquid Glass) */}
      <header className="h-16 px-4 sm:px-6 liquid-glass border-b border-white/80 flex items-center justify-between gap-4 shrink-0">
        <div className="shrink-0">
          <OmMagicLogo variant="light" size="sm" />
        </div>

        <nav
          aria-label="System Architecture Highlights"
          className="hidden md:flex items-center gap-5 text-xs text-slate-500"
        >
          <span className="flex items-center gap-1.5 whitespace-nowrap shrink-0">
            <span
              className={`w-2 h-2 rounded-full ${
                supabaseState.isConfigured ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
              aria-hidden="true"
            />
            <span>{supabaseState.statusBadgeLabel}</span>
          </span>
          <span aria-hidden="true">·</span>
          <span className="whitespace-nowrap shrink-0 font-mono">
            {supabaseState.projectUrl}
          </span>
          <span aria-hidden="true">·</span>
          <span className="whitespace-nowrap shrink-0">
            Made by Raju Singh
          </span>
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          {onOpenAdminSettings && (
            <button
              type="button"
              onClick={onOpenAdminSettings}
              className="px-3 py-2 text-xs font-medium text-slate-700 liquid-glass-subtle hover:bg-white/90 rounded-xl transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Connection Status</span>
            </button>
          )}
          <button
            type="button"
            onClick={onOpenWorkspace}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <LayoutDashboard className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Open Workspace Layout</span>
          </button>
        </div>
      </header>

      {/* Main Split Content (Light Liquid Glass) */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 items-stretch liquid-glass-elevated rounded-3xl overflow-hidden">
          {/* Left Column: Light Frosted Glass Architecture Showcase */}
          <div className="lg:col-span-5 bg-gradient-to-br from-sky-50/80 via-white/60 to-slate-100/70 text-slate-900 p-6 sm:p-8 lg:p-10 flex flex-col justify-between gap-8 border-b lg:border-b-0 lg:border-r border-white/80">
            <div className="space-y-6">
              <OmMagicLogo variant="light" size="lg" showTagline />

              <div className="space-y-3 pt-2">
                <div className="text-xs font-mono text-sky-700">
                  Supabase Auth · Protected ERP Routes
                </div>
                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 leading-tight text-balance">
                  Unified Godown, Stock & Ledger Operations.
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Designed for warehouse supervisors, inventory controllers, and
                  accounting teams to manage multi-godown stock, transfers, and
                  monthly reconciliations.
                </p>
              </div>

              {/* Connected Supabase Project Card */}
              <div className="p-3.5 rounded-2xl liquid-glass-subtle space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Supabase Project Endpoint</span>
                  <span
                    className={`font-semibold ${
                      supabaseState.isConfigured
                        ? 'text-emerald-700'
                        : 'text-amber-700'
                    }`}
                  >
                    {supabaseState.isConfigured
                      ? 'Anon Key Active'
                      : 'Awaiting Anon Key'}
                  </span>
                </div>
                <div className="text-xs font-mono text-slate-800 truncate">
                  {supabaseState.projectUrl}
                </div>
              </div>
            </div>

            {/* Module Directory Summary */}
            <div className="space-y-3 pt-6 border-t border-slate-200/70">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Protected ERP Modules</span>
                <span className="font-mono tabular-nums text-sky-700 font-semibold">
                  {OM_MAGIC_MODULES.length} Modules
                </span>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-slate-700">
                {OM_MAGIC_MODULES.slice(0, 8).map((mod, index) => (
                  <div key={mod.id} className="truncate flex items-center gap-1.5">
                    <span className="font-mono text-[10px] text-sky-600 tabular-nums font-semibold">
                      0{index + 1}.
                    </span>
                    <span className="truncate">{mod.shortTitle}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>Made by Raju Singh</span>
                <span>Phase 2 Auth</span>
              </div>
            </div>
          </div>

          {/* Right Column: Light Glass Login Form */}
          <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-center bg-white/75">
            <div className="max-w-md w-full mx-auto space-y-5">
              {protectedModuleTitle && (
                <div className="px-3.5 py-2.5 rounded-xl liquid-glass-subtle flex items-center justify-between gap-2 text-xs text-slate-700">
                  <div className="flex items-center gap-2 min-w-0">
                    <Lock
                      className="w-3.5 h-3.5 text-sky-600 shrink-0"
                      aria-hidden="true"
                    />
                    <span className="truncate">
                      Protected route: <strong>{protectedModuleTitle}</strong>
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 shrink-0">
                    Auth Required
                  </span>
                </div>
              )}

              {mode === 'signin' ? (
                <>
                  <div className="space-y-1.5">
                    <div className="text-xs font-mono text-slate-500">
                      Operator Authentication · {supabaseState.phaseLabel}
                    </div>
                    <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900">
                      Sign in to Inventory System
                    </h2>
                    <p className="text-xs text-slate-600">
                      Authenticate with your Supabase email and password to
                      access assigned godowns and stock ledgers.
                    </p>
                  </div>

                  {authError && (
                    <div
                      role="alert"
                      aria-live="assertive"
                      className="p-3.5 rounded-2xl bg-red-50/95 border border-red-200 text-red-900 text-xs flex items-start gap-2.5"
                    >
                      <AlertCircle
                        className="w-4 h-4 text-red-600 shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <div className="space-y-1">
                        <div className="font-semibold">
                          Authentication Error
                        </div>
                        <p className="leading-relaxed text-red-800">
                          {authError}
                        </p>
                      </div>
                    </div>
                  )}

                  {authNotice && (
                    <div
                      role="status"
                      className="p-3.5 rounded-2xl liquid-glass-subtle text-slate-800 text-xs flex items-start gap-2.5"
                    >
                      <CheckCircle2
                        className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <p className="leading-relaxed">{authNotice}</p>
                    </div>
                  )}

                  <form
                    onSubmit={handleSignInSubmit}
                    noValidate
                    className="space-y-4"
                  >
                    <div className="space-y-1.5">
                      <label
                        htmlFor="login-email"
                        className="block text-xs font-semibold text-slate-800"
                      >
                        Email Address
                      </label>
                      <input
                        id="login-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        disabled={isSubmitting}
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (emailError) setEmailError(undefined);
                          if (authError) clearAuthMessages();
                        }}
                        placeholder="name@company.com"
                        aria-invalid={Boolean(emailError)}
                        aria-describedby={
                          emailError ? 'login-email-error' : undefined
                        }
                        className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white/85 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white disabled:opacity-60 transition-colors ${
                          emailError
                            ? 'border-red-600 focus:border-red-600'
                            : 'border-slate-200/90 focus:border-sky-500'
                        }`}
                      />
                      {emailError && (
                        <p
                          id="login-email-error"
                          role="alert"
                          className="text-xs text-red-600 flex items-center gap-1.5 pt-0.5"
                        >
                          <AlertCircle
                            className="w-3.5 h-3.5 shrink-0"
                            aria-hidden="true"
                          />
                          <span>{emailError}</span>
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor="login-password"
                          className="block text-xs font-semibold text-slate-800"
                        >
                          Password
                        </label>
                        <button
                          type="button"
                          disabled={isSubmitting}
                          onClick={() => switchMode('recovery')}
                          className="text-xs font-medium text-slate-600 hover:text-slate-900 underline-offset-4 hover:underline cursor-pointer disabled:opacity-50"
                        >
                          Forgot password?
                        </button>
                      </div>

                      <div className="relative">
                        <input
                          id="login-password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          autoComplete="current-password"
                          disabled={isSubmitting}
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            if (passwordError) setPasswordError(undefined);
                            if (authError) clearAuthMessages();
                          }}
                          placeholder="Enter your password"
                          aria-invalid={Boolean(passwordError)}
                          aria-describedby={
                            passwordError ? 'login-password-error' : undefined
                          }
                          className={`w-full pl-3.5 pr-10 py-2.5 text-sm rounded-xl border bg-white/85 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white disabled:opacity-60 transition-colors ${
                            passwordError
                              ? 'border-red-600 focus:border-red-600'
                              : 'border-slate-200/90 focus:border-sky-500'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          aria-label={
                            showPassword ? 'Hide password' : 'Show password'
                          }
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-900 rounded cursor-pointer"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" aria-hidden="true" />
                          ) : (
                            <Eye className="w-4 h-4" aria-hidden="true" />
                          )}
                        </button>
                      </div>

                      {passwordError && (
                        <p
                          id="login-password-error"
                          role="alert"
                          className="text-xs text-red-600 flex items-center gap-1.5 pt-0.5"
                        >
                          <AlertCircle
                            className="w-3.5 h-3.5 shrink-0"
                            aria-hidden="true"
                          />
                          <span>{passwordError}</span>
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={rememberDevice}
                          disabled={isSubmitting}
                          onChange={(e) => setRememberDevice(e.target.checked)}
                          className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-sky-500"
                        />
                        <span>Persist session on this terminal</span>
                      </label>
                    </div>

                    <div className="pt-2 space-y-2.5">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-60 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2
                              className="w-4 h-4 animate-spin"
                              aria-hidden="true"
                            />
                            <span>Signing In with Supabase...</span>
                          </>
                        ) : (
                          <>
                            <span>Sign In to Inventory System</span>
                            <ArrowRight
                              className="w-4 h-4"
                              aria-hidden="true"
                            />
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={onOpenWorkspace}
                        className="w-full py-2.5 px-4 text-xs font-semibold text-slate-800 liquid-glass-subtle hover:bg-white/90 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                      >
                        <LayoutDashboard
                          className="w-4 h-4 text-sky-600"
                          aria-hidden="true"
                        />
                        <span>Preview Main Dashboard Layout</span>
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <>
                  <div className="space-y-1.5">
                    <button
                      type="button"
                      onClick={() => switchMode('signin')}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 mb-2 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Back to Sign In</span>
                    </button>
                    <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900">
                      Reset Operator Password
                    </h2>
                    <p className="text-xs text-slate-600">
                      Enter your registered email address to request a Supabase
                      Auth password recovery link.
                    </p>
                  </div>

                  {authError && (
                    <div
                      role="alert"
                      aria-live="assertive"
                      className="p-3.5 rounded-2xl bg-red-50/95 border border-red-200 text-red-900 text-xs flex items-start gap-2.5"
                    >
                      <AlertCircle
                        className="w-4 h-4 text-red-600 shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <div className="space-y-1">
                        <div className="font-semibold">Recovery Error</div>
                        <p className="leading-relaxed text-red-800">
                          {authError}
                        </p>
                      </div>
                    </div>
                  )}

                  {authNotice && (
                    <div
                      role="status"
                      className="p-3.5 rounded-2xl liquid-glass-subtle text-slate-800 text-xs flex items-start gap-2.5"
                    >
                      <CheckCircle2
                        className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <p className="leading-relaxed">{authNotice}</p>
                    </div>
                  )}

                  <form
                    onSubmit={handleRecoverySubmit}
                    noValidate
                    className="space-y-4"
                  >
                    <div className="space-y-1.5">
                      <label
                        htmlFor="recovery-email"
                        className="block text-xs font-semibold text-slate-800"
                      >
                        Registered Email Address
                      </label>
                      <input
                        id="recovery-email"
                        name="recovery-email"
                        type="email"
                        disabled={isSubmitting}
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (emailError) setEmailError(undefined);
                          if (authError) clearAuthMessages();
                        }}
                        placeholder="name@company.com"
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200/90 bg-white/85 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white disabled:opacity-60 transition-colors"
                      />
                      {emailError && (
                        <p
                          role="alert"
                          className="text-xs text-red-600 flex items-center gap-1.5 pt-0.5"
                        >
                          <AlertCircle
                            className="w-3.5 h-3.5 shrink-0"
                            aria-hidden="true"
                          />
                          <span>{emailError}</span>
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-60 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2
                            className="w-4 h-4 animate-spin"
                            aria-hidden="true"
                          />
                          <span>Dispatching Recovery Email...</span>
                        </>
                      ) : (
                        <span>Request Recovery Link</span>
                      )}
                    </button>
                  </form>
                </>
              )}

              {/* Security & Integration Footer */}
              <div className="pt-4 border-t border-slate-200/70 flex items-start gap-2.5 text-[11px] text-slate-500">
                <ShieldCheck
                  className="w-4 h-4 text-sky-600 shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <span>
                  Protected by Supabase Auth & Row-Level Security (RLS) · Made by
                  Raju Singh
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
