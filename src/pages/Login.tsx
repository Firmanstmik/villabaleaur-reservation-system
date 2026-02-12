import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * Legacy Login page - redirects to home
 * Authentication is now handled via the modal in the Navbar
 */
const Login = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  useEffect(() => {
    // Redirect to home page
    // The authentication modal is available via the "Sign In" button in the navbar
    navigate(`/${language}/`);
  }, [navigate, language]);

  return null;
};

export default Login;
