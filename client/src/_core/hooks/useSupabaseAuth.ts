import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export type AuthUser = {
  id: number;
  authId: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  portalAccessGranted: boolean;
  registrationStep: number;
  avatarUrl?: string | null;
};

export function useSupabaseAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check current session and fetch user profile
    const checkSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          // Fetch full user profile from database
          const { data: userProfile, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('auth_id', session.user.id)
            .single();

          if (profileError) {
            // Silently ignore profile fetch errors - user will be redirected if truly unauthenticated
          } else if (userProfile) {
            setUser({
              id: userProfile.id,
              authId: userProfile.auth_id,
              email: userProfile.email,
              name: userProfile.name,
              role: userProfile.role,
              portalAccessGranted: userProfile.portal_access_granted,
              registrationStep: userProfile.registration_step,
              avatarUrl: userProfile.avatar_url,
            });
          }
        }
      } catch (err) {
        // Ignore AbortError from component unmounting
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        console.error("Error checking session:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // Fetch full user profile from database
        const { data: userProfile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('auth_id', session.user.id)
          .single();

        if (profileError) {
          // Silently ignore profile fetch errors - user will be redirected if truly unauthenticated
        } else if (userProfile) {
          setUser({
            id: userProfile.id,
            authId: userProfile.auth_id,
            email: userProfile.email,
            name: userProfile.name,
            role: userProfile.role,
            portalAccessGranted: userProfile.portal_access_granted,
            registrationStep: userProfile.registration_step,
            avatarUrl: userProfile.avatar_url,
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setError(null);
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (signUpError) throw signUpError;

      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Sign up failed";
      setError(message);
      throw err;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Sign in failed";
      setError(message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      const { error: logoutError } = await supabase.auth.signOut();
      if (logoutError) throw logoutError;
      setUser(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Logout failed";
      setError(message);
      throw err;
    }
  };

  const getAccessToken = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session?.access_token || null;
  };

  return {
    user,
    loading,
    error,
    signUp,
    signIn,
    logout,
    getAccessToken,
    isAuthenticated: !!user,
  };
}
