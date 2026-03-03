import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import { formatRelativeTime } from './MessageTimestamp';
import type { Conversation } from '@/hooks/useMessaging';

interface ConversationListProps {
  conversations: Conversation[];
  loading: boolean;
  activeId: string | null;
  onSelect: (conversationId: string) => void;
  emptyMessage?: string;
}

export default memo(function ConversationList({
  conversations,
  loading,
  activeId,
  onSelect,
  emptyMessage = 'No messages yet',
}: ConversationListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-3 border-[#0e2e50] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center px-4">
        <MessageSquare className="h-12 w-12 text-muted-foreground/40 mb-4" />
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border">
      <AnimatePresence>
        {conversations.map((convo, index) => {
          const hasUnread = (convo.unread_count || 0) > 0;

          return (
            <motion.button
              key={convo.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              onClick={() => onSelect(convo.id)}
              className={`w-full flex items-start gap-3 p-4 text-left transition-colors hover:bg-secondary/50 ${
                activeId === convo.id ? 'bg-[#0e2e50]/5' : ''
              }`}
            >
              {/* Listing thumbnail */}
              <div className="w-12 h-12 rounded-xl bg-secondary overflow-hidden shrink-0">
                {convo.listing_image ? (
                  <img
                    src={convo.listing_image}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0e2e50]/20 to-[#0e2e50]/10">
                    <MessageSquare className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className={`text-sm truncate ${hasUnread ? 'font-bold text-foreground' : 'font-semibold text-foreground'}`}>
                    {convo.listing_title || 'Untitled Listing'}
                  </p>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {formatRelativeTime(convo.last_message_at)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                  {convo.other_party_name}
                </p>
                <div className="flex items-center justify-between gap-2 mt-1">
                  {convo.last_message_preview && (
                    <p className={`text-sm truncate ${hasUnread ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
                      {convo.last_message_preview}
                    </p>
                  )}
                  {hasUnread && (
                    <span className="bg-[#0e2e50] text-white text-[10px] font-bold min-w-[20px] h-5 rounded-full flex items-center justify-center px-1.5 shrink-0">
                      {convo.unread_count}
                    </span>
                  )}
                </div>
              </div>
            </motion.button>
          );
        })}
      </AnimatePresence>
    </div>
  );
});
