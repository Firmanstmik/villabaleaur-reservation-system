import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDayLabel } from './MessageTimestamp';
import type { Message } from '@/hooks/useMessaging';

interface ThreadViewProps {
  messages: Message[];
  loading: boolean;
  currentUserId: string;
  onBack?: () => void;
  onSendReply: (content: string) => Promise<boolean>;
  listingTitle: string;
  listingImage: string | null;
  otherPartyName: string;
}

export default function ThreadView({
  messages,
  loading,
  currentUserId,
  onBack,
  onSendReply,
  listingTitle,
  listingImage,
  otherPartyName,
}: ThreadViewProps) {
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    const trimmed = reply.trim();
    if (!trimmed || sending) return;
    setSending(true);
    const success = await onSendReply(trimmed);
    if (success) setReply('');
    setSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Group messages by day
  const groupedMessages: { label: string; messages: Message[] }[] = [];
  let currentLabel = '';
  for (const msg of messages) {
    const label = formatDayLabel(msg.created_at);
    if (label !== currentLabel) {
      currentLabel = label;
      groupedMessages.push({ label, messages: [msg] });
    } else {
      groupedMessages[groupedMessages.length - 1].messages.push(msg);
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border shrink-0">
        {onBack && (
          <button onClick={onBack} className="lg:hidden text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={20} />
          </button>
        )}
        <div className="w-10 h-10 rounded-xl bg-secondary overflow-hidden shrink-0">
          {listingImage ? (
            <img src={listingImage} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0e2e50]/20 to-[#0e2e50]/10">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-sm text-foreground truncate">{listingTitle}</p>
          <p className="text-xs text-muted-foreground truncate">{otherPartyName}</p>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-3 border-[#0e2e50] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-muted-foreground text-sm">
            No messages yet. Start the conversation!
          </div>
        ) : (
          groupedMessages.map((group) => (
            <div key={group.label}>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground font-medium">{group.label}</span>
                <div className="flex-1 h-px bg-border" />
              </div>
              <div className="space-y-2">
                {group.messages.map((msg) => {
                  const isOwn = msg.sender_id === currentUserId;
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                          isOwn
                            ? 'bg-[#0e2e50] text-white'
                            : 'bg-secondary text-foreground'
                        }`}
                      >
                        {!isOwn && (
                          <p className="text-xs font-medium mb-1 opacity-70">{msg.sender_name}</p>
                        )}
                        <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                        <p className={`text-[10px] mt-1 ${isOwn ? 'text-white/50' : 'text-muted-foreground'}`}>
                          {new Date(msg.created_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Reply input */}
      <div className="p-4 border-t border-border shrink-0">
        <div className="flex items-end gap-2">
          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your reply..."
            rows={1}
            className="flex-1 resize-none rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0e2e50] min-h-[44px] max-h-[120px]"
            style={{ height: 'auto', overflow: 'hidden' }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = Math.min(target.scrollHeight, 120) + 'px';
            }}
          />
          <Button
            onClick={handleSend}
            disabled={!reply.trim() || sending}
            className="bg-[#0e2e50] hover:bg-[#0e2e50]/90 text-white rounded-xl h-[44px] w-[44px] p-0 shrink-0"
          >
            <Send size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
}
