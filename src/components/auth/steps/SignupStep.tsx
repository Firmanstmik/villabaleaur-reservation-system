import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface SignupStepProps {
  email: string;
  loading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
  onSuccess: () => void;
  onBack: () => void;
  onClose: () => void;
}

const formatErrorMessage = (error: any): string => {
  const message = error?.message || '';
  if (message.includes('User already registered')) {
    return 'This email is already registered. Try signing in instead.';
  }
  if (message.includes('Password should be at least')) {
    return 'Password must be at least 8 characters long.';
  }
  return message || 'An unexpected error occurred. Please try again.';
};

export default function SignupStep({
  email,
  loading: externalLoading,
  error,
  setError,
  onSuccess,
  onBack,
  onClose,
}: SignupStepProps) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<'buyer' | 'agent'>('buyer');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const isFormValid = name && password && password.length >= 8 && userType && agreedToTerms && !loading;

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Please enter your full name');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (!agreedToTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await signUp(email, password, {
        name: name.trim(),
        user_type: userType,
      });

      toast.success('Account created! Check your email to verify.');

      // Close modal and navigate based on user type
      onSuccess();

      // Redirect to appropriate page after signup
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
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Create your account</h2>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">Join UKON Estate today</p>
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
        onSubmit={handleSignup}
        className="space-y-4 mb-6"
      >
        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            Full name
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            className="h-12 rounded-xl text-base transition-all focus:ring-2 focus:ring-ukon-navy"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError(null);
            }}
            autoFocus
            disabled={isLoading}
          />
        </div>

        {/* Email (Disabled) */}
        <div className="space-y-2">
          <Label htmlFor="signup-email" className="text-sm font-medium">
            Email
          </Label>
          <Input
            id="signup-email"
            type="email"
            className="h-12 rounded-xl text-base bg-secondary"
            value={email}
            disabled
          />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="signup-password" className="text-sm font-medium">
            Create password
          </Label>
          <Input
            id="signup-password"
            type="password"
            placeholder="Min. 8 characters"
            className="h-12 rounded-xl text-base transition-all focus:ring-2 focus:ring-ukon-navy"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError(null);
            }}
            disabled={isLoading}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Must be at least 8 characters long
          </p>
        </div>

        {/* User Type Selection (REQUIRED) */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">I am a...</Label>
          <RadioGroup value={userType} onValueChange={(value) => setUserType(value as 'buyer' | 'agent')}>
            {/* Buyer Option */}
            <div className="flex items-start space-x-3 border border-border rounded-xl p-4 cursor-pointer hover:bg-secondary/50 transition-colors">
              <RadioGroupItem value="buyer" id="buyer" className="mt-1" />
              <Label htmlFor="buyer" className="flex-1 cursor-pointer">
                <div className="font-semibold text-base">Buyer/Renter</div>
                <p className="text-xs text-muted-foreground">Looking for properties</p>
              </Label>
            </div>

            {/* Agent Option */}
            <div className="flex items-start space-x-3 border border-border rounded-xl p-4 cursor-pointer hover:bg-secondary/50 transition-colors">
              <RadioGroupItem value="agent" id="agent" className="mt-1" />
              <Label htmlFor="agent" className="flex-1 cursor-pointer">
                <div className="font-semibold text-base">Agent/Seller</div>
                <p className="text-xs text-muted-foreground">Listing properties</p>
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Terms & Conditions */}
        <div className="flex items-start space-x-2 pt-2">
          <Checkbox
            id="terms"
            checked={agreedToTerms}
            onCheckedChange={(checked) => {
              setAgreedToTerms(checked === true);
              if (error) setError(null);
            }}
            disabled={isLoading}
            className="mt-1"
          />
          <Label htmlFor="terms" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
            I agree to UKON Estate's{' '}
            <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-ukon-navy hover:underline">
              Terms of Service
            </a>
            {' '}and{' '}
            <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-ukon-navy hover:underline">
              Privacy Policy
            </a>
          </Label>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={!isFormValid}
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
              Creating Account...
            </>
          ) : (
            'Create Account'
          )}
        </Button>
      </motion.form>

      {/* Security Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center text-xs text-muted-foreground"
      >
        Protected by industry-standard encryption
      </motion.div>
    </div>
  );
}
