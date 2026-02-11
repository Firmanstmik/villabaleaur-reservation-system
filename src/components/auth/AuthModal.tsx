import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import EmailStep from './steps/EmailStep';
import PasswordStep from './steps/PasswordStep';
import SignupStep from './steps/SignupStep';
import MagicLinkStep from './steps/MagicLinkStep';

type AuthStep = 'email' | 'password' | 'signup' | 'magic-link-sent';
type AuthMode = 'login' | 'signup';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [step, setStep] = useState<AuthStep>('email');
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetModal = () => {
    setStep('email');
    setMode('login');
    setEmail('');
    setLoading(false);
    setError(null);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setStep('email');
    setError(null);
  };

  const goBack = () => {
    if (step === 'password' || step === 'signup' || step === 'magic-link-sent') {
      setStep('email');
      setError(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="
        sm:max-w-[480px] sm:rounded-3xl sm:h-auto
        max-w-full w-full h-full rounded-none
        p-0 overflow-y-auto
        border-0 shadow-lg
      ">
        {step === 'email' && (
          <EmailStep
            email={email}
            setEmail={setEmail}
            mode={mode}
            loading={loading}
            error={error}
            setError={setError}
            onContinue={(newEmail) => {
              setEmail(newEmail);
              // Determine if user is signing up or logging in
              // For now, we'll go to password step - we'll check if user exists server-side
              setStep(mode === 'login' ? 'password' : 'signup');
            }}
            toggleMode={toggleMode}
            onClose={handleClose}
          />
        )}

        {step === 'password' && (
          <PasswordStep
            email={email}
            loading={loading}
            error={error}
            setError={setError}
            onSuccess={() => {
              handleClose();
            }}
            onBack={goBack}
            onMagicLink={() => {
              setStep('magic-link-sent');
            }}
            onClose={handleClose}
          />
        )}

        {step === 'signup' && (
          <SignupStep
            email={email}
            loading={loading}
            error={error}
            setError={setError}
            onSuccess={() => {
              handleClose();
            }}
            onBack={goBack}
            onClose={handleClose}
          />
        )}

        {step === 'magic-link-sent' && (
          <MagicLinkStep
            email={email}
            loading={loading}
            error={error}
            setError={setError}
            onResend={() => {
              // Magic link resend logic
            }}
            onClose={handleClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
