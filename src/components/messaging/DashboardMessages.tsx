import { useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import { useMessaging } from '@/hooks/useMessaging';
import ConversationList from './ConversationList';
import ThreadView from './ThreadView';

interface DashboardMessagesProps {
  userId: string;
}

export default function DashboardMessages({ userId }: DashboardMessagesProps) {
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-[#0e2e50]">Messages</h2>
          <p className="text-muted-foreground mt-1">
            {conversations.length > 0
              ? `${conversations.length} conversation${conversations.length !== 1 ? 's' : ''}`
              : 'Conversations with buyers will appear here'}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-border shadow-sm overflow-hidden min-h-[500px]">
        <div className="flex h-[600px]">
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
              emptyMessage="No conversations yet. Buyer inquiries will appear here."
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
