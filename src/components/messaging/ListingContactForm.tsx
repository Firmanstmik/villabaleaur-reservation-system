import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, Eye, HelpCircle, Info, Send, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthPanel } from '@/contexts/AuthPanelContext';
import { useMessaging } from '@/hooks/useMessaging';
import { useLanguage } from '@/contexts/LanguageContext';

type MessageType = 'viewing' | 'question' | 'info';
type FormState = 'idle' | 'form_open' | 'sending' | 'sent';

interface ListingContactFormProps {
  listingId: string;
  sellerId: string;
  listingTitle: string;
}

export default function ListingContactForm({
  listingId,
  sellerId,
  listingTitle,
}: ListingContactFormProps) {
  const { user } = useAuth();
  const { openAuthPanel } = useAuthPanel();
  const { sendFirstMessage } = useMessaging();
  const { t } = useLanguage();

  const [formState, setFormState] = useState<FormState>('idle');
  const [messageType, setMessageType] = useState<MessageType | null>(null);
  const [message, setMessage] = useState('');
  const [viewingDate, setViewingDate] = useState<Date | undefined>();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const pendingIntentRef = useRef<MessageType | null>(null);

  // If seller is viewing own listing, hide messaging entirely
  if (user?.id === sellerId) {
    return null;
  }

  // Watch for auth state change to auto-open form after login
  useEffect(() => {
    if (user && pendingIntentRef.current) {
      const intent = pendingIntentRef.current;
      pendingIntentRef.current = null;
      handleCTAClick(intent);
    }
  }, [user]);

  const getPrefilledMessage = (type: MessageType): string => {
    switch (type) {
      case 'viewing':
        return `Hi, I'd like to schedule a viewing for ${listingTitle}.`;
      case 'info':
        return `Hi, I'm interested in ${listingTitle}. Could you share more details about this property?`;
      case 'question':
        return '';
    }
  };

  const handleCTAClick = (type: MessageType) => {
    if (!user) {
      pendingIntentRef.current = type;
      openAuthPanel('signup');
      return;
    }

    setMessageType(type);
    setMessage(getPrefilledMessage(type));
    setViewingDate(undefined);
    setFormState('form_open');

    setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
  };

  const handleDateSelect = (date: Date | undefined) => {
    setViewingDate(date);
    if (date) {
      const formatted = date.toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      setMessage(`Hi, I'd like to schedule a viewing for ${listingTitle} on ${formatted}.`);
    }
  };

  const handleSend = async () => {
    const trimmed = message.trim();
    if (!trimmed) return;

    setFormState('sending');
    const conversationId = await sendFirstMessage(listingId, trimmed);

    if (conversationId) {
      setFormState('sent');
    } else {
      setFormState('form_open');
    }
  };

  const handleSendAnother = () => {
    setFormState('idle');
    setMessageType(null);
    setMessage('');
    setViewingDate(undefined);
  };

  return (
    <div className="space-y-3">
      <AnimatePresence mode="wait">
        {/* Idle: CTA buttons */}
        {formState === 'idle' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-2"
          >
            <Button
              onClick={() => handleCTAClick('viewing')}
              className="w-full bg-[#0e2e50] hover:bg-[#0e2e50]/90 text-white rounded-xl h-12 gap-2 font-semibold"
            >
              <Eye size={18} />
              {t('messaging.requestViewing')}
            </Button>
            <Button
              onClick={() => handleCTAClick('question')}
              variant="outline"
              className="w-full rounded-xl h-12 gap-2 font-semibold border-[#0e2e50]/20 text-[#0e2e50] hover:bg-[#0e2e50]/5"
            >
              <HelpCircle size={18} />
              {t('messaging.askQuestion')}
            </Button>
            <Button
              onClick={() => handleCTAClick('info')}
              variant="outline"
              className="w-full rounded-xl h-12 gap-2 font-semibold border-[#0e2e50]/20 text-[#0e2e50] hover:bg-[#0e2e50]/5"
            >
              <Info size={18} />
              {t('messaging.getMoreInfo')}
            </Button>
          </motion.div>
        )}

        {/* Form open / Sending */}
        {(formState === 'form_open' || formState === 'sending') && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t('messaging.typeMessage')}
              rows={4}
              disabled={formState === 'sending'}
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0e2e50] resize-none disabled:opacity-50"
            />

            {/* Date picker for viewing requests */}
            {messageType === 'viewing' && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full rounded-xl h-11 gap-2 text-sm border-dashed border-[#0e2e50]/20 text-muted-foreground hover:text-[#0e2e50] hover:bg-[#0e2e50]/5 justify-start"
                  >
                    <CalendarIcon size={16} />
                    {viewingDate
                      ? viewingDate.toLocaleDateString(undefined, { weekday: 'short', month: 'long', day: 'numeric' })
                      : t('messaging.selectDate')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={viewingDate}
                    onSelect={handleDateSelect}
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            )}

            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={handleSendAnother}
                disabled={formState === 'sending'}
                className="rounded-xl text-muted-foreground"
              >
                {t('common.cancel')}
              </Button>
              <Button
                onClick={handleSend}
                disabled={!message.trim() || formState === 'sending'}
                className="flex-1 bg-[#0e2e50] hover:bg-[#0e2e50]/90 text-white rounded-xl h-11 gap-2 font-semibold"
              >
                {formState === 'sending' ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Send size={18} />
                )}
                {t('messaging.sendMessage')}
              </Button>
            </div>
          </motion.div>
        )}

        {/* Sent confirmation */}
        {formState === 'sent' && (
          <motion.div
            key="sent"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-4 space-y-3"
          >
            <CheckCircle2 className="h-10 w-10 text-green-600 mx-auto" />
            <div>
              <p className="font-semibold text-foreground">{t('messaging.messageSent')}</p>
              <p className="text-sm text-muted-foreground mt-1">{t('messaging.agentWillRespond')}</p>
            </div>
            <button
              onClick={handleSendAnother}
              className="text-sm text-[#0e2e50] font-medium hover:underline"
            >
              {t('messaging.sendAnother')}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
