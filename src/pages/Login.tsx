import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Legacy Login page - redirects to home
 * Authentication is now handled via the modal in the Navbar
 */
const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to home page
    // The authentication modal is available via the "Sign In" button in the navbar
    navigate('/');
  }, [navigate]);

  return null;
};

export default Login;
