import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface PasswordStepProps {
  email: string;
  loading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
  onSuccess: () => void;
  onBack: () => void;
  onMagicLink: () => void;
  onClose: () => void;
}

const formatErrorMessage = (error: any): string => {
  const message = error?.message || '';
  if (message.includes('Invalid login credentials')) {
    return 'Email or password is incorrect. Please try again.';
  }
  if (message.includes('Email not confirmed')) {
    return 'Please verify your email address before signing in.';
  }
  return message || 'An unexpected error occurred. Please try again.';
};

export default function PasswordStep({
  email,
  loading: externalLoading,
  error,
  setError,
  onSuccess,
  onBack,
  onMagicLink,
  onClose,
}: PasswordStepProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, userType } = useAuth();
  const navigate = useNavigate();

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError('Please enter your password');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await signIn(email, password);
      toast.success('Welcome back!');

      // Close modal and navigate based on user type
      onSuccess();

      // Route based on user type (happens after auth state updates)
      if (userType === 'agent') {
        setTimeout(() => navigate('/dashboard'), 300);
      } else {
        setTimeout(() => navigate('/'), 300);
      }
    } catch (err: any) {
      setError(formatErrorMessage(err));
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && password && !loading) {
      handlePasswordLogin(e as any);
    }
  };

  const isLoading = loading || externalLoading;

  return (
    <div className="p-8 sm:p-10">
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={onBack}
        disabled={isLoading}
        className="flex items-center gap-2 text-sm text-muted-foreground mb-6 hover:text-foreground transition-colors disabled:opacity-50"
      >
        <ArrowLeft size={16} />
        Back
      </motion.button>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Enter your password</h2>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base truncate">{email}</p>
      </motion.div>

      {/* Error Alert */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <Alert variant="destructive" className="rounded-xl border-ukon-red/20 bg-ukon-red/5">
            <AlertCircle className="h-4 w-4 text-ukon-red" />
            <AlertDescription className="text-ukon-red">{error}</AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Form */}
      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        onSubmit={handlePasswordLogin}
        className="space-y-4 mb-6"
      >
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <button
              type="button"
              onClick={() => {
                // TODO: Implement forgot password flow
                setError('Password reset coming soon');
              }}
              disabled={isLoading}
              className="text-xs text-ukon-navy hover:underline transition-colors disabled:opacity-50"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              className="pl-12 pr-12 h-12 rounded-xl text-base transition-all focus:ring-2 focus:ring-ukon-navy"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(null);
              }}
              onKeyPress={handleKeyPress}
              autoFocus
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={!password || isLoading}
          className="w-full h-12 rounded-xl bg-ukon-navy hover:bg-ukon-navy/90 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </Button>
      </motion.form>

      {/* Magic Link Alternative */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center"
      >
        <button
          onClick={onMagicLink}
          disabled={isLoading}
          className="text-sm text-ukon-navy hover:underline transition-colors disabled:opacity-50"
        >
          Use magic link instead
        </button>
      </motion.div>
    </div>
  );
}
