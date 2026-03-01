import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Conversation {
  id: string;
  listing_id: string;
  buyer_id: string;
  seller_id: string;
  status: string;
  created_at: string;
  last_message_at: string;
  listing_title: string;
  listing_image: string | null;
  listing_address: string;
  other_party_name: string;
  other_party_image: string | null;
  last_message_preview: string | null;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  sender_name: string;
}

export function useMessaging() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  const fetchConversations = useCallback(async () => {
    if (!user) return;
    setLoadingConversations(true);
    try {
      const { data, error } = await supabase.rpc('get_conversations_for_user');
      if (error) throw error;
      setConversations((data as Conversation[]) || []);
    } catch (err) {
      console.error('Error fetching conversations:', err);
      toast.error('Failed to load conversations');
    } finally {
      setLoadingConversations(false);
    }
  }, [user]);

  const fetchMessages = useCallback(async (conversationId: string) => {
    if (!user) return;
    setLoadingMessages(true);
    setActiveConversationId(conversationId);
    try {
      const { data, error } = await supabase.rpc('get_messages_for_conversation', {
        p_conversation_id: conversationId,
      });
      if (error) throw error;
      setMessages((data as Message[]) || []);
    } catch (err) {
      console.error('Error fetching messages:', err);
      toast.error('Failed to load messages');
    } finally {
      setLoadingMessages(false);
    }
  }, [user]);

  const sendFirstMessage = useCallback(async (
    listingId: string,
    content: string,
  ): Promise<string | null> => {
    if (!user) return null;
    try {
      const { data, error } = await supabase.rpc('send_first_message', {
        p_listing_id: listingId,
        p_content: content,
      });
      if (error) throw error;
      return data as string;
    } catch (err: any) {
      console.error('Error sending message:', err);
      const msg = err?.message || 'Failed to send message';
      toast.error(msg);
      return null;
    }
  }, [user]);

  const sendReply = useCallback(async (
    conversationId: string,
    content: string,
  ): Promise<boolean> => {
    if (!user) return false;
    try {
      const trimmed = content.trim();
      if (!trimmed) return false;

      const newMessage: Message = {
        id: crypto.randomUUID(),
        conversation_id: conversationId,
        sender_id: user.id,
        content: trimmed,
        created_at: new Date().toISOString(),
        sender_name: 'You',
      };

      // Optimistic append
      setMessages((prev) => [...prev, newMessage]);

      const { error } = await supabase.from('messages').insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content: trimmed,
      });

      if (error) {
        // Rollback optimistic update
        setMessages((prev) => prev.filter((m) => m.id !== newMessage.id));
        throw error;
      }

      // Update conversation list's last message preview
      setConversations((prev) =>
        prev.map((c) =>
          c.id === conversationId
            ? { ...c, last_message_at: newMessage.created_at, last_message_preview: trimmed.slice(0, 80) }
            : c,
        ).sort((a, b) => new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime()),
      );

      return true;
    } catch (err) {
      console.error('Error sending reply:', err);
      toast.error('Failed to send message');
      return false;
    }
  }, [user]);

  return {
    conversations,
    loadingConversations,
    fetchConversations,
    messages,
    loadingMessages,
    fetchMessages,
    sendFirstMessage,
    sendReply,
    activeConversationId,
    setActiveConversationId,
  };
}
