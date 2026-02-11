import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Home } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface EmailStepProps {
  email: string;
  setEmail: (email: string) => void;
  mode: 'login' | 'signup';
  loading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
  onContinue: (email: string) => void;
  toggleMode: () => void;
  onClose: () => void;
}

const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export default function EmailStep({
  email,
  setEmail,
  mode,
  loading,
  error,
  setError,
  onContinue,
  toggleMode,
  onClose,
}: EmailStepProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleContinue = () => {
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    setError(null);
    onContinue(email);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isValidEmail(email) && !loading) {
      handleContinue();
    }
  };

  return (
    <div className="p-8 sm:p-10">
      {/* Header */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center mb-8"
      >
        <div className="w-16 h-16 bg-gradient-to-br from-ukon-navy to-ukon-navy/80 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Home className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Welcome to UKON Estate</h2>
        <p className="text-muted-foreground mt-2 text-sm sm:text-base">
          {mode === 'login'
            ? 'Sign in to save properties and get personalized recommendations'
            : 'Create an account to start your real estate journey'}
        </p>
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

      {/* Email Input */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4 mb-6"
      >
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email address
          </Label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="pl-12 h-12 rounded-xl text-base transition-all focus:ring-2 focus:ring-ukon-navy"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(null);
              }}
              onKeyPress={handleKeyPress}
              autoFocus
              disabled={loading}
            />
          </div>
        </div>

        <Button
          onClick={handleContinue}
          disabled={!isValidEmail(email) || loading}
          className="w-full h-12 rounded-xl bg-ukon-navy hover:bg-ukon-navy/90 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {loading ? (
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
              Checking...
            </>
          ) : (
            'Continue'
          )}
        </Button>
      </motion.div>

      {/* Toggle Mode */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center text-sm"
      >
        <span className="text-muted-foreground">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
        </span>
        <button
          onClick={toggleMode}
          disabled={loading}
          className="text-ukon-navy font-semibold hover:underline transition-colors disabled:opacity-50"
        >
          {mode === 'login' ? 'Sign up' : 'Sign in'}
        </button>
      </motion.div>
    </div>
  );
}
