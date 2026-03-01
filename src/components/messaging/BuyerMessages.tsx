import { useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import { useMessaging } from '@/hooks/useMessaging';
import ConversationList from './ConversationList';
import ThreadView from './ThreadView';

interface BuyerMessagesProps {
  userId: string;
}

export default function BuyerMessages({ userId }: BuyerMessagesProps) {
  const {
    conversations,
    loadingConversations,
    fetchConversations,
    messages,
    loadingMessages,
    fetchMessages,
    sendReply,
    activeConversationId,
    setActiveConversationId,
  } = useMessaging();

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const activeConversation = conversations.find((c) => c.id === activeConversationId);

  const handleSelect = (conversationId: string) => {
    setActiveConversationId(conversationId);
    fetchMessages(conversationId);
  };

  const handleBack = () => {
    setActiveConversationId(null);
  };

  const handleSendReply = async (content: string) => {
    if (!activeConversationId) return false;
    return sendReply(activeConversationId, content);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Messages</h2>

      <div className="bg-white rounded-2xl border border-border overflow-hidden min-h-[400px]">
        <div className="flex h-[500px]">
          {/* Conversation list — hidden on mobile when thread is open */}
          <div
            className={`w-full lg:w-1/3 border-r border-border overflow-y-auto ${
              activeConversationId ? 'hidden lg:block' : ''
            }`}
          >
            <ConversationList
              conversations={conversations}
              loading={loadingConversations}
              activeId={activeConversationId}
              onSelect={handleSelect}
              emptyMessage="No conversations yet. Contact an agent about a listing to start."
            />
          </div>

          {/* Thread view */}
          <div
            className={`w-full lg:w-2/3 ${
              activeConversationId ? '' : 'hidden lg:flex'
            }`}
          >
            {activeConversation ? (
              <ThreadView
                messages={messages}
                loading={loadingMessages}
                currentUserId={userId}
                onBack={handleBack}
                onSendReply={handleSendReply}
                listingTitle={activeConversation.listing_title}
                listingImage={activeConversation.listing_image}
                otherPartyName={activeConversation.other_party_name}
              />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                <MessageSquare className="h-12 w-12 mb-4 opacity-30" />
                <p className="text-sm">Select a conversation to view messages</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
