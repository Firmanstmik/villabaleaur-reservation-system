import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

interface MagicLinkStepProps {
  email: string;
  loading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
  onResend: () => void;
  onClose: () => void;
}

export default function MagicLinkStep({
  email,
  loading,
  error,
  setError,
  onResend,
  onClose,
}: MagicLinkStepProps) {
  const { t } = useLanguage();
  const [resendTimer, setResendTimer] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const { sendMagicLink } = useAuth();

  useEffect(() => {
    // Start 60 second countdown on mount
    setResendTimer(60);
  }, []);

  useEffect(() => {
    if (resendTimer <= 0) return;

    const timer = setTimeout(() => {
      setResendTimer(resendTimer - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handleResend = async () => {
    setIsResending(true);
    setError(null);

    try {
      await sendMagicLink(email);
      toast.success(t('common.success'));
      setResendTimer(60);
    } catch (err: any) {
      setError(t('common.tryAgain'));
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="p-8 sm:p-10 text-center flex flex-col min-h-screen sm:min-h-auto sm:py-10">
      {/* Success Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
      >
        <Check className="w-10 h-10 text-green-600" />
      </motion.div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex-1"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">{t('auth.magicLink.checkEmail')}</h2>
        <p className="text-muted-foreground text-sm sm:text-base">
          {t('auth.magicLink.sentLoginLink')}
          <br />
          <span className="font-semibold text-foreground">{email}</span>
        </p>

        {/* Email Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-secondary/50 rounded-xl p-4 mt-6 text-left"
        >
          <p className="text-xs text-muted-foreground mb-2">{t('auth.magicLink.lookForEmail')}</p>
          <p className="text-sm font-semibold text-foreground">"{t('auth.magicLink.signInSubject')}"</p>
        </motion.div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 text-left bg-blue-50/50 rounded-xl p-4 border border-blue-100"
        >
          <p className="text-xs text-blue-900 font-semibold mb-2">{t('auth.magicLink.quickTips')}</p>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• {t('auth.magicLink.checkSpamFolder')}</li>
            <li>• {t('auth.magicLink.linkExpires')}</li>
            <li>• {t('auth.magicLink.resendEmail')}</li>
          </ul>
        </motion.div>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-3 mt-8"
      >
        <Button
          onClick={onClose}
          variant="outline"
          className="w-full h-12 rounded-xl border-ukon-navy text-ukon-navy hover:bg-ukon-navy hover:text-white transition-all"
        >
          {t('auth.magicLink.gotIt')}
        </Button>

        <div className="text-center">
          <button
            onClick={handleResend}
            disabled={resendTimer > 0 || isResending || loading}
            className="text-sm text-ukon-navy hover:underline transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isResending ? (
              t('auth.magicLink.sending')
            ) : resendTimer > 0 ? (
              <>
                {t('auth.magicLink.resendCountdown').replace('{timer}', String(resendTimer))}
              </>
            ) : (
              t('auth.magicLink.resendButtonText')
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
