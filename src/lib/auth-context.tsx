import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { createClient, Session, User, SupabaseClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-url-polyfill/auto';

// Get credentials
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

// Check if configured
const isConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Create client only if configured
let supabaseClient: SupabaseClient | null = null;

if (isConfigured) {
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: false, // HIPAA: Don't persist sessions - require login each time
      detectSessionInUrl: false,
    },
  });
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isConfigured: boolean;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Skip if Supabase is not configured
    if (!isConfigured || !supabaseClient) {
      console.log('[Auth] Supabase not configured, skipping auth initialization');
      setIsLoading(false);
      return;
    }

    // HIPAA Compliance: Always sign out on app start to require fresh login
    const initAuth = async () => {
      try {
        // Sign out any existing session for HIPAA compliance
        await supabaseClient.auth.signOut();
        console.log('[Auth] Cleared any existing session (HIPAA compliance)');
        setSession(null);
        setUser(null);
      } catch (error) {
        console.error('[Auth] Error clearing session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    if (!isConfigured || !supabaseClient) {
      return { error: new Error('Supabase is not configured. Please add your credentials in the ENV tab.') };
    }
    try {
      const { error } = await supabaseClient.auth.signUp({
        email,
        password,
      });
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!isConfigured || !supabaseClient) {
      return { error: new Error('Supabase is not configured. Please add your credentials in the ENV tab.') };
    }
    try {
      const { error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    if (!isConfigured || !supabaseClient) return;
    await supabaseClient.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, isConfigured, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
