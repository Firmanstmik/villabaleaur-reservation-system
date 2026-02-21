import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useScrollLock } from '@/hooks/useScrollLock';
import { SegmentedSwitch } from './SegmentedSwitch';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { AlertCircle, Eye, EyeOff, Mail, Lock, CheckCircle2, X, Home, Building2 } from 'lucide-react';
import { toast } from 'sonner';

type AuthStep = 'credentials' | 'magic-link-sent' | 'reset-request' | 'reset-sent';
type AuthMode = 'login' | 'signup';

interface AuthPanelProps {
  isOpen: boolean;
  onClose: () => void;
  variant: 'hero' | 'global';
  initialMode?: 'login' | 'signup';
}

const animationConfig = {
  duration: 0.45,
  ease: [0.4, 0.0, 0.2, 1] as [number, number, number, number],
};

/**
 * Premium unified authentication panel
 * Supports hero-integrated and global variants
 */
export const AuthPanel = React.memo(
  ({ isOpen, onClose, variant, initialMode = 'login' }: AuthPanelProps) => {
    // State management
    const [authMode, setAuthMode] = useState<AuthMode>(initialMode);
    const [authStep, setAuthStep] = useState<AuthStep>('credentials');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [userType, setUserType] = useState<'buyer' | 'agent'>('buyer');
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [resendCountdown, setResendCountdown] = useState(0);

    // Refs and context
    const emailInputRef = useRef<HTMLInputElement>(null);
    const passwordInputRef = useRef<HTMLInputElement>(null);
    const { signIn, signUp, sendMagicLink, resetPassword } = useAuth();
    const { language } = useLanguage();
    const navigate = useNavigate();

    // Hooks
    useScrollLock(isOpen);

    // Focus management
    useEffect(() => {
      if (isOpen) {
        setTimeout(() => {
          if (authStep === 'credentials' && emailInputRef.current) {
            emailInputRef.current.focus();
          }
        }, 500);
      }
    }, [isOpen, authStep]);

    // Resend countdown timer
    useEffect(() => {
      if (resendCountdown > 0) {
        const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
        return () => clearTimeout(timer);
      }
    }, [resendCountdown]);

    // Reset on mode change
    const handleModeChange = (mode: AuthMode) => {
      setAuthMode(mode);
      setAuthStep('credentials');
      setEmail('');
      setPassword('');
      setFullName('');
      setError(null);
      setShowPassword(false);
    };

    // Email validation
    const validateEmail = (email: string): boolean => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    // Combined credentials validation and submission
    const handleCredentialsSubmit = async () => {
      if (!email.trim()) {
        setError('Please enter your email');
        return;
      }

      if (!validateEmail(email)) {
        setError('Please enter a valid email address');
        return;
      }

      if (authMode === 'login') {
        if (!password.trim()) {
          setError('Please enter your password');
          return;
        }

        if (password.length < 6) {
          setError('Invalid password');
          return;
        }

        setLoading(true);
        setError(null);

        try {
          await signIn(email, password);
          toast.success('Welcome back!');

          // Close panel after delay for animation
          setTimeout(() => {
            onClose();
          }, 800);
        } catch (err: any) {
          const errorMessage = err?.message || 'Failed to sign in. Please try again.';
          setError(errorMessage);
          toast.error(errorMessage);
        } finally {
          setLoading(false);
        }
      } else {
        // Signup mode
        if (!fullName.trim()) {
          setError('Please enter your full name');
          return;
        }

        if (!password.trim()) {
          setError('Please enter a password');
          return;
        }

        if (password.length < 8) {
          setError('Password must be at least 8 characters');
          return;
        }

        if (!agreedToTerms) {
          setError('Please accept the terms and conditions');
          return;
        }

        setLoading(true);
        setError(null);

        try {
          await signUp(email, password, {
            full_name: fullName,
            user_type: userType,
          });

          // Show magic link sent step
          setAuthStep('magic-link-sent');
          toast.success('Account created! Check your email to verify.');
        } catch (err: any) {
          const errorMessage = err?.message || 'Failed to create account. Please try again.';
          setError(errorMessage);
          toast.error(errorMessage);
        } finally {
          setLoading(false);
        }
      }
    };

    // Login handler
    const handleSignIn = async () => {
      if (!password.trim()) {
        setError('Please enter your password');
        return;
      }

      if (password.length < 6) {
        setError('Invalid password');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        await signIn(email, password);
        toast.success('Welcome back!');

        // Close panel after delay for animation
        setTimeout(() => {
          onClose();
        }, 800);

        // Navigate based on user type (will be handled by auth redirect)
      } catch (err: any) {
        const errorMessage = err?.message || 'Failed to sign in. Please try again.';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    // Signup handler
    const handleSignUp = async () => {
      if (!fullName.trim()) {
        setError('Please enter your full name');
        return;
      }

      if (!password.trim()) {
        setError('Please enter a password');
        return;
      }

      if (password.length < 8) {
        setError('Password must be at least 8 characters');
        return;
      }

      if (!agreedToTerms) {
        setError('Please accept the terms and conditions');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        await signUp(email, password, {
          full_name: fullName,
          user_type: userType,
        });

        // Show magic link sent step
        setAuthStep('magic-link-sent');
        toast.success('Account created! Check your email to verify.');
      } catch (err: any) {
        const errorMessage = err?.message || 'Failed to create account. Please try again.';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    // Magic link handler
    const handleSendMagicLink = async () => {
      if (!email.trim()) {
        setError('Please enter your email');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        await sendMagicLink(email);
        setAuthStep('magic-link-sent');
        setResendCountdown(60);
        toast.success('Check your email for the magic link!');
      } catch (err: any) {
        const errorMessage = err?.message || 'Failed to send magic link. Please try again.';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    // Resend magic link handler
    const handleResendMagicLink = async () => {
      if (resendCountdown > 0) return;

      setLoading(true);
      try {
        await sendMagicLink(email);
        setResendCountdown(60);
        toast.success('Magic link sent again!');
      } catch (err: any) {
        toast.error('Failed to resend magic link');
      } finally {
        setLoading(false);
      }
    };

    // Reset password handler
    const handleResetPassword = async () => {
      if (!email.trim()) {
        setError('Please enter your email');
        return;
      }

      if (!validateEmail(email)) {
        setError('Please enter a valid email address');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        await resetPassword(email, language);
        setAuthStep('reset-sent');
      } catch (err: any) {
        const errorMessage = err?.message || 'Failed to send reset link. Please try again.';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    // Return to login from reset flow
    const handleBackToLogin = () => {
      setAuthStep('credentials');
      setAuthMode('login');
      setEmail('');
      setError(null);
    };

    // Panel position and sizing based on variant
    const panelPositioning = {
      hero: 'absolute inset-y-0 right-0',
      global: 'fixed inset-y-0 right-0',
    };

    const panelHeight = {
      hero: 'h-full',
      global: 'h-screen',
    };

    const panelWidth = 'w-full sm:w-full md:w-1/2 lg:w-[45%] xl:w-[40%]';

    const zIndexes = {
      overlay: variant === 'hero' ? 'z-25' : 'z-40',
      panel: variant === 'hero' ? 'z-30' : 'z-50',
    };

    return (
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`${variant === 'hero' ? 'absolute' : 'fixed'} inset-0 ${zIndexes.overlay}`}
              style={
                variant === 'hero'
                  ? {
                      background: 'linear-gradient(to right, rgba(0, 0, 0, 0.10) 0%, rgba(0, 0, 0, 0.05) 50%, rgba(0, 0, 0, 0) 100%)',
                      backdropFilter: 'blur(2px)',
                    }
                  : {
                      backgroundColor: 'rgba(0, 0, 0, 0.15)',
                      backdropFilter: 'blur(4px)',
                    }
              }
              onClick={onClose}
              aria-label="Close panel"
            />

            {/* Panel */}
            <motion.div
              className={`${panelPositioning[variant]} ${panelHeight[variant]} ${panelWidth} ${zIndexes.panel} backdrop-blur-lg overflow-y-auto overflow-x-hidden`}
              style={{
                borderTopRightRadius: variant === 'hero' ? '0px' : undefined,
                borderBottomRightRadius: variant === 'hero' ? '0px' : undefined,
                background: `
                  linear-gradient(135deg, rgba(250, 249, 246, 0.95) 0%, rgba(253, 252, 251, 0.95) 100%),
                  url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.02'/%3E%3C/svg%3E")
                `,
              }}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={animationConfig}
            >
              {/* Content wrapper */}
              <div className="px-8 py-16 sm:px-10 sm:py-20 lg:px-14 lg:py-24 h-full flex flex-col relative">
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-6 left-6 text-muted-foreground hover:text-foreground transition-colors p-1"
                  aria-label="Close panel"
                >
                  <X size={24} />
                </button>

                {/* Header section */}
                <div className="mb-10 sm:mb-12 lg:mb-14">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                  >
                    <h2 className="text-3xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2">
                      Client Portal
                    </h2>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      {authStep === 'reset-request' || authStep === 'reset-sent'
                        ? 'Reset your password securely.'
                        : 'Access your saved properties and personalized listings.'}
                    </p>
                  </motion.div>
                </div>

                {/* Segmented switch */}
                {authStep === 'credentials' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="mb-10 lg:mb-12"
                  >
                    <SegmentedSwitch
                      options={[
                        { value: 'login', label: 'Login' },
                        { value: 'signup', label: 'Sign Up' },
                      ]}
                      value={authMode}
                      onChange={handleModeChange}
                      className="w-full"
                    />
                  </motion.div>
                )}

                {/* Error display */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-4 rounded-xl bg-red-50 border border-red-200 mb-6"
                    >
                      <p className="text-sm text-red-600 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        {error}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Form content */}
                <motion.div
                  key={authStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex-1 flex flex-col"
                >
                  {/* CREDENTIALS STEP - Login or Signup */}
                  {authStep === 'credentials' && (
                    <div className="space-y-6">
                      {/* Email field - shown for both login and signup */}
                      <div>
                        <Label htmlFor="email" className="text-sm font-medium mb-2 block">
                          Email address
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                          <Input
                            ref={emailInputRef}
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              setError(null);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleCredentialsSubmit();
                            }}
                            disabled={loading}
                            className="h-14 pl-12 pr-5 text-base rounded-xl border-border/50 focus:border-ukon-navy/50 focus:ring-2 focus:ring-ukon-navy/10 transition-all duration-200"
                          />
                        </div>
                      </div>

                      {/* LOGIN FIELDS */}
                      {authMode === 'login' && (
                        <>
                          {/* Password field for login */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <Label htmlFor="password" className="text-sm font-medium">
                                Password
                              </Label>
                              <button
                                type="button"
                                onClick={() => { setAuthStep('reset-request'); setError(null); }}
                                className="text-xs text-muted-foreground hover:text-ukon-red transition-colors"
                              >
                                Forgot password?
                              </button>
                            </div>
                            <div className="relative">
                              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                              <Input
                                ref={passwordInputRef}
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => {
                                  setPassword(e.target.value);
                                  setError(null);
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleCredentialsSubmit();
                                }}
                                disabled={loading}
                                className="h-14 pl-12 pr-12 text-base rounded-xl border-border/50 focus:border-ukon-navy/50 focus:ring-2 focus:ring-ukon-navy/10 transition-all duration-200"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                              >
                                {showPassword ? (
                                  <EyeOff className="w-5 h-5" />
                                ) : (
                                  <Eye className="w-5 h-5" />
                                )}
                              </button>
                            </div>
                          </div>

                          {/* Sign In button */}
                          <Button
                            onClick={handleCredentialsSubmit}
                            disabled={loading}
                            className="w-full h-14 text-base font-semibold rounded-xl bg-ukon-navy text-white hover:bg-ukon-navy/90 hover:shadow-lg hover:shadow-ukon-navy/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {loading ? 'Signing in...' : 'Sign In'}
                          </Button>

                          {/* Magic link option */}
                          <button
                            type="button"
                            onClick={handleSendMagicLink}
                            disabled={loading}
                            className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                          >
                            Use magic link instead
                          </button>
                        </>
                      )}

                      {/* SIGNUP FIELDS */}
                      {authMode === 'signup' && (
                        <>
                          {/* Full name field for signup */}
                          <div>
                            <Label htmlFor="fullName" className="text-sm font-medium mb-2 block">
                              Full name
                            </Label>
                            <Input
                              id="fullName"
                              type="text"
                              placeholder="Your full name"
                              value={fullName}
                              onChange={(e) => {
                                setFullName(e.target.value);
                                setError(null);
                              }}
                              disabled={loading}
                              className="h-14 px-5 text-base rounded-xl border-border/50 focus:border-ukon-navy/50 focus:ring-2 focus:ring-ukon-navy/10 transition-all duration-200"
                            />
                          </div>

                          {/* Password field for signup */}
                          <div>
                            <Label htmlFor="signup-password" className="text-sm font-medium mb-2 block">
                              Password (min. 8 characters)
                            </Label>
                            <div className="relative">
                              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                              <Input
                                id="signup-password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Create a strong password"
                                value={password}
                                onChange={(e) => {
                                  setPassword(e.target.value);
                                  setError(null);
                                }}
                                disabled={loading}
                                className="h-14 pl-12 pr-12 text-base rounded-xl border-border/50 focus:border-ukon-navy/50 focus:ring-2 focus:ring-ukon-navy/10 transition-all duration-200"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                              >
                                {showPassword ? (
                                  <EyeOff className="w-5 h-5" />
                                ) : (
                                  <Eye className="w-5 h-5" />
                                )}
                              </button>
                            </div>
                          </div>

                          {/* User type selection - Premium card-based selector */}
                          <div>
                            <Label className="text-sm font-medium mb-4 block">I am a...</Label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {/* Buyer/Renter Card */}
                              <motion.button
                                type="button"
                                onClick={() => {
                                  setUserType('buyer');
                                  setError(null);
                                }}
                                disabled={loading}
                                className={`
                                  relative px-4 py-3 rounded-2xl border-2 text-left
                                  transition-all duration-300 cursor-pointer
                                  disabled:opacity-50 disabled:cursor-not-allowed
                                  ${userType === 'buyer'
                                    ? 'border-ukon-navy bg-gradient-to-br from-ukon-navy/5 to-transparent shadow-lg shadow-ukon-navy/20'
                                    : 'border-border/30 bg-white hover:border-ukon-navy/40 hover:shadow-md'
                                  }
                                `}
                                whileHover={!loading ? { scale: 1.02 } : {}}
                                whileTap={!loading ? { scale: 0.98 } : {}}
                              >
                                {/* Checkmark indicator */}
                                <AnimatePresence>
                                  {userType === 'buyer' && (
                                    <motion.div
                                      initial={{ scale: 0, opacity: 0 }}
                                      animate={{ scale: 1, opacity: 1 }}
                                      exit={{ scale: 0, opacity: 0 }}
                                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                      className="absolute top-2.5 right-2.5"
                                    >
                                      <CheckCircle2 className="w-5 h-5 text-ukon-navy" />
                                    </motion.div>
                                  )}
                                </AnimatePresence>

                                {/* Icon container */}
                                <div className={`
                                  w-12 h-12 rounded-xl flex items-center justify-center mb-2
                                  transition-all duration-300
                                  ${userType === 'buyer'
                                    ? 'bg-gradient-to-br from-ukon-navy to-ukon-navy/80'
                                    : 'bg-secondary'
                                  }
                                `}>
                                  <Home className={`w-5.5 h-5.5 transition-colors duration-300 ${
                                    userType === 'buyer' ? 'text-white' : 'text-muted-foreground'
                                  }`} style={{ width: '1.375rem', height: '1.375rem' }} />
                                </div>

                                {/* Text content */}
                                <h3 className={`text-base font-semibold mb-0.5 transition-colors duration-300 ${
                                  userType === 'buyer' ? 'text-ukon-navy' : 'text-foreground'
                                }`}>
                                  Buyer / Renter
                                </h3>
                                <p className="text-xs text-muted-foreground leading-tight">
                                  I'm looking for my dream home or rental
                                </p>
                              </motion.button>

                              {/* Seller Card */}
                              <motion.button
                                type="button"
                                onClick={() => {
                                  setUserType('agent');
                                  setError(null);
                                }}
                                disabled={loading}
                                className={`
                                  relative px-4 py-3 rounded-2xl border-2 text-left
                                  transition-all duration-300 cursor-pointer
                                  disabled:opacity-50 disabled:cursor-not-allowed
                                  ${userType === 'agent'
                                    ? 'border-ukon-navy bg-gradient-to-br from-ukon-navy/5 to-transparent shadow-lg shadow-ukon-navy/20'
                                    : 'border-border/30 bg-white hover:border-ukon-navy/40 hover:shadow-md'
                                  }
                                `}
                                whileHover={!loading ? { scale: 1.02 } : {}}
                                whileTap={!loading ? { scale: 0.98 } : {}}
                              >
                                {/* Checkmark indicator */}
                                <AnimatePresence>
                                  {userType === 'agent' && (
                                    <motion.div
                                      initial={{ scale: 0, opacity: 0 }}
                                      animate={{ scale: 1, opacity: 1 }}
                                      exit={{ scale: 0, opacity: 0 }}
                                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                      className="absolute top-2.5 right-2.5"
                                    >
                                      <CheckCircle2 className="w-5 h-5 text-ukon-navy" />
                                    </motion.div>
                                  )}
                                </AnimatePresence>

                                {/* Icon container */}
                                <div className={`
                                  w-12 h-12 rounded-xl flex items-center justify-center mb-2
                                  transition-all duration-300
                                  ${userType === 'agent'
                                    ? 'bg-gradient-to-br from-ukon-navy to-ukon-navy/80'
                                    : 'bg-secondary'
                                  }
                                `}>
                                  <Building2 className={`w-5.5 h-5.5 transition-colors duration-300 ${
                                    userType === 'agent' ? 'text-white' : 'text-muted-foreground'
                                  }`} style={{ width: '1.375rem', height: '1.375rem' }} />
                                </div>

                                {/* Text content */}
                                <h3 className={`text-base font-semibold mb-0.5 transition-colors duration-300 ${
                                  userType === 'agent' ? 'text-ukon-navy' : 'text-foreground'
                                }`}>
                                  Seller
                                </h3>
                                <p className="text-xs text-muted-foreground leading-tight">
                                  I represent properties and sellers
                                </p>
                              </motion.button>
                            </div>
                          </div>

                          {/* Terms checkbox */}
                          <label className="flex items-start cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={agreedToTerms}
                              onChange={(e) => {
                                setAgreedToTerms(e.target.checked);
                                setError(null);
                              }}
                              disabled={loading}
                              className="w-5 h-5 rounded border-border checked:bg-ukon-navy mt-0.5 flex-shrink-0"
                            />
                            <span className="ml-3 text-xs sm:text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                              I agree to the terms and conditions
                            </span>
                          </label>

                          {/* Create Account button */}
                          <Button
                            onClick={handleCredentialsSubmit}
                            disabled={loading}
                            className="w-full h-14 text-base font-semibold rounded-xl bg-ukon-navy text-white hover:bg-ukon-navy/90 hover:shadow-lg hover:shadow-ukon-navy/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {loading ? 'Creating Account...' : 'Create Account'}
                          </Button>
                        </>
                      )}
                    </div>
                  )}

                  {/* MAGIC LINK SENT STEP */}
                  {authStep === 'magic-link-sent' && (
                    <div className="flex flex-col items-center justify-center py-12">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                        className="mb-6"
                      >
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                          <CheckCircle2 className="w-8 h-8 text-green-600" />
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-center"
                      >
                        <h3 className="text-2xl font-bold text-foreground mb-2">Check your email</h3>
                        <p className="text-sm text-muted-foreground mb-6">
                          We've sent a confirmation link to <strong>{email}</strong>
                        </p>

                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
                          <p className="text-xs sm:text-sm text-blue-900">
                            Look for an email with the subject "Your login link"
                          </p>
                        </div>

                        <Button
                          onClick={onClose}
                          className="w-full h-12 text-base font-semibold rounded-xl bg-ukon-navy text-white hover:bg-ukon-navy/90 mb-4"
                        >
                          Got It
                        </Button>

                        <button
                          type="button"
                          onClick={handleResendMagicLink}
                          disabled={resendCountdown > 0 || loading}
                          className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {resendCountdown > 0
                            ? `Resend in ${resendCountdown}s`
                            : 'Resend link'}
                        </button>
                      </motion.div>
                    </div>
                  )}
                  {/* RESET REQUEST STEP */}
                  {authStep === 'reset-request' && (
                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="reset-email" className="text-sm font-medium mb-2 block">
                          Email address
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                          <Input
                            id="reset-email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              setError(null);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleResetPassword();
                            }}
                            disabled={loading}
                            className="h-14 pl-12 pr-5 text-base rounded-xl border-border/50 focus:border-ukon-navy/50 focus:ring-2 focus:ring-ukon-navy/10 transition-all duration-200"
                          />
                        </div>
                      </div>

                      <Button
                        onClick={handleResetPassword}
                        disabled={loading}
                        className="w-full h-14 text-base font-semibold rounded-xl bg-ukon-navy text-white hover:bg-ukon-navy/90 hover:shadow-lg hover:shadow-ukon-navy/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Sending...' : 'Send reset link'}
                      </Button>

                      <button
                        type="button"
                        onClick={handleBackToLogin}
                        className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                      >
                        Back to login
                      </button>
                    </div>
                  )}

                  {/* RESET SENT STEP */}
                  {authStep === 'reset-sent' && (
                    <div className="flex flex-col items-center justify-center py-12">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-center"
                      >
                        <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
                          If an account exists for this email, a reset link has been sent.
                        </p>

                        <Button
                          onClick={handleBackToLogin}
                          className="w-full h-14 text-base font-semibold rounded-xl bg-ukon-navy text-white hover:bg-ukon-navy/90 hover:shadow-lg hover:shadow-ukon-navy/20 transition-all duration-300"
                        >
                          Return to login
                        </Button>
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }
);

AuthPanel.displayName = 'AuthPanel';
