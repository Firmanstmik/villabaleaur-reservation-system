import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Loader2 } from 'lucide-react';

/**
 * Auth Callback Page
 * Handles post-email-verification redirects from Supabase
 * Routes users to appropriate dashboard based on their user type
 */
const AuthCallback = () => {
  const { t } = useLanguage();
  const { user, userType, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Wait for auth state to be loaded
    if (loading) return;

    // If no user, redirect to home
    if (!user) {
      navigate('/', { replace: true });
      return;
    }

    // Route based on user type
    if (userType === 'admin') {
      navigate('/dashboard/admin', { replace: true });
    } else if (userType === 'agent') {
      navigate('/dashboard', { replace: true });
    } else if (userType === 'buyer') {
      navigate('/account', { replace: true });
    } else {
      // Fallback if user type is not set
      navigate('/', { replace: true });
    }
  }, [user, userType, loading, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-ukon-navy mx-auto" />
        <p className="text-lg font-medium text-foreground">{t('auth.callback.verifying')}</p>
        <p className="text-sm text-muted-foreground">{t('auth.callback.pleaseWait')}</p>
      </div>
    </div>
  );
};

export default AuthCallback;
