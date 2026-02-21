import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  userType: 'buyer' | 'agent' | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, metadata: { name: string; user_type: 'buyer' | 'agent' }) => Promise<void>;
  signOut: () => Promise<void>;
  sendMagicLink: (email: string) => Promise<void>;
  resetPassword: (email: string, language: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { language } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState<'buyer' | 'agent' | null>(null);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);

        if (session?.user) {
          setUser(session.user);
          const type = session.user.user_metadata?.user_type as 'buyer' | 'agent' | null;
          setUserType(type);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);

      if (session?.user) {
        setUser(session.user);
        const type = session.user.user_metadata?.user_type as 'buyer' | 'agent' | null;
        setUserType(type);
      } else {
        setUser(null);
        setUserType(null);
      }

      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.session?.user) {
        setUser(data.session.user);
        const type = data.session.user.user_metadata?.user_type as 'buyer' | 'agent' | null;
        setUserType(type);
      }
    } catch (error: any) {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error('Unable to connect to authentication service. Please check your internet connection and try again.');
      }
      throw error;
    }
  };

  const signUp = async (
    email: string,
    password: string,
    metadata: { name: string; user_type: 'buyer' | 'agent' }
  ) => {
    try {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/${language}/auth/callback`,
        },
      });

      if (error) {
        throw error;
      }

      // User created but not signed in yet (requires email confirmation)
      if (data.user && !data.session) {
        // Email confirmation required
        toast.success('Check your email to verify your account');
      } else if (data.session?.user) {
        setUser(data.session.user);
        setUserType(metadata.user_type);
      }
    } catch (error: any) {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error('Unable to connect to authentication service. Please check your internet connection and try again.');
      }
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      setUser(null);
      setUserType(null);
    } catch (error: any) {
      throw error;
    }
  };

  const sendMagicLink = async (email: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/${language}/auth/callback`,
        },
      });

      if (error) {
        throw error;
      }
    } catch (error: any) {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error('Unable to connect to authentication service. Please check your internet connection and try again.');
      }
      throw error;
    }
  };

  const resetPassword = async (email: string, language: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/${language}/auth/update-password`,
      });

      if (error) {
        throw error;
      }
    } catch (error: any) {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error('Unable to connect to authentication service. Please check your internet connection and try again.');
      }
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    userType,
    signIn,
    signUp,
    signOut,
    sendMagicLink,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
