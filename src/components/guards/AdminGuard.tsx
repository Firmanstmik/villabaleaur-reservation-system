import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { user, userType, loading } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate(`/${language}/`, { replace: true });
      return;
    }

    if (userType !== 'admin') {
      if (userType === 'agent') {
        navigate(`/${language}/dashboard`, { replace: true });
      } else {
        navigate(`/${language}/`, { replace: true });
      }
    }
  }, [user, userType, loading, navigate, language]);

  if (loading || userType !== 'admin') {
    return <div className="min-h-screen bg-background" />;
  }

  return <>{children}</>;
}
