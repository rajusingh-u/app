import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';
import {
  supabase,
  SUPABASE_PROJECT_URL,
  supabaseEnvEvaluation,
} from '../lib/supabaseClient';
import { formatSupabaseAuthError } from '../utils/foundation';

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isSubmitting: boolean;
  authError: string | null;
  authNotice: string | null;
  signInWithPassword: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  requestPasswordReset: (
    email: string
  ) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  clearAuthMessages: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(Boolean(supabase));
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authNotice, setAuthNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (!isMounted) return;
        if (error) {
          setAuthError(formatSupabaseAuthError(error.message));
        }
        setSession(data.session ?? null);
        setUser(data.session?.user ?? null);
        setIsLoading(false);
      })
      .catch((err: unknown) => {
        if (!isMounted) return;
        const msg =
          err instanceof Error
            ? err.message
            : 'Unable to restore authentication session.';
        setAuthError(formatSupabaseAuthError(msg));
        setIsLoading(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!isMounted) return;
      setSession(nextSession ?? null);
      setUser(nextSession?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const clearAuthMessages = useCallback(() => {
    setAuthError(null);
    setAuthNotice(null);
  }, []);

  const signInWithPassword = useCallback(
    async (
      email: string,
      password: string
    ): Promise<{ success: boolean; error?: string }> => {
      setAuthError(null);
      setAuthNotice(null);
      setIsSubmitting(true);

      try {
        if (supabaseEnvEvaluation.isServiceRoleKeyDetected) {
          const msg =
            'Security Error: A service_role key was detected in VITE_SUPABASE_ANON_KEY. Use only your public anon or publishable key.';
          setAuthError(msg);
          return { success: false, error: msg };
        }

        if (!supabase) {
          const msg = `Supabase client awaiting VITE_SUPABASE_ANON_KEY for project ${SUPABASE_PROJECT_URL}. Configure your public anon/publishable key in the environment variables to enable live sign-in.`;
          setAuthError(msg);
          return { success: false, error: msg };
        }

        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          const formatted = formatSupabaseAuthError(error.message);
          setAuthError(formatted);
          return { success: false, error: formatted };
        }

        setSession(data.session);
        setUser(data.user);
        setAuthNotice('Signed in to Inventory Management System.');
        return { success: true };
      } catch (err: unknown) {
        const raw =
          err instanceof Error ? err.message : 'Unexpected authentication error.';
        const formatted = formatSupabaseAuthError(raw);
        setAuthError(formatted);
        return { success: false, error: formatted };
      } finally {
        setIsSubmitting(false);
      }
    },
    []
  );

  const requestPasswordReset = useCallback(
    async (email: string): Promise<{ success: boolean; error?: string }> => {
      setAuthError(null);
      setAuthNotice(null);
      setIsSubmitting(true);

      try {
        if (!supabase) {
          const msg = `Supabase client awaiting VITE_SUPABASE_ANON_KEY for project ${SUPABASE_PROJECT_URL}. Configure VITE_SUPABASE_ANON_KEY to dispatch recovery emails.`;
          setAuthError(msg);
          return { success: false, error: msg };
        }

        const redirectTo =
          typeof window !== 'undefined' ? window.location.origin : undefined;

        const { error } = await supabase.auth.resetPasswordForEmail(
          email.trim(),
          redirectTo ? { redirectTo } : undefined
        );

        if (error) {
          const formatted = formatSupabaseAuthError(error.message);
          setAuthError(formatted);
          return { success: false, error: formatted };
        }

        setAuthNotice(
          `Password recovery instructions have been dispatched to ${email.trim()} via Supabase Auth.`
        );
        return { success: true };
      } catch (err: unknown) {
        const raw =
          err instanceof Error
            ? err.message
            : 'Unable to send password recovery email.';
        const formatted = formatSupabaseAuthError(raw);
        setAuthError(formatted);
        return { success: false, error: formatted };
      } finally {
        setIsSubmitting(false);
      }
    },
    []
  );

  const signOut = useCallback(async () => {
    setAuthError(null);
    setAuthNotice(null);
    setIsSubmitting(true);
    try {
      if (supabase) {
        const { error } = await supabase.auth.signOut();
        if (error) {
          setAuthError(formatSupabaseAuthError(error.message));
        }
      }
      setSession(null);
      setUser(null);
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        isLoading,
        isSubmitting,
        authError,
        authNotice,
        signInWithPassword,
        requestPasswordReset,
        signOut,
        clearAuthMessages,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
