import { useState, useCallback, useEffect, useMemo } from 'react';
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
  unread_count: number;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  sender_name: string;
}

/**
 * Lightweight hook for sidebar/tab unread badge.
 * Only queries unread counts from conversations table — no JOINs, no heavy RPC.
 * Keeps a single realtime subscription to stay in sync.
 */
export function useUnreadCount() {
  const { user } = useAuth();
  const [count, setCount] = useState(0);

  const refresh = useCallback(async () => {
    if (!user) { setCount(0); return; }
    try {
      // Lightweight: only select unread columns, no JOINs
      const { data: asBuyer } = await supabase
        .from('conversations')
        .select('buyer_unread_count')
        .eq('buyer_id', user.id);

      const { data: asSeller } = await supabase
        .from('conversations')
        .select('seller_unread_count')
        .eq('seller_id', user.id);

      const total =
        (asBuyer || []).reduce((s, c) => s + (c.buyer_unread_count || 0), 0) +
        (asSeller || []).reduce((s, c) => s + (c.seller_unread_count || 0), 0);

      setCount(total);
    } catch {
      // silent — badge is non-critical
    }
  }, [user]);

  useEffect(() => {
    if (!user?.id) return;
    refresh();

    const channel = supabase
      .channel(`unread-badge-${user.id}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'conversations' },
        (payload) => {
          const updated = payload.new as Record<string, any>;
          if (updated.buyer_id !== user.id && updated.seller_id !== user.id) return;
          refresh();
        },
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user?.id, refresh]);

  return count;
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

  const markAsRead = useCallback(async (conversationId: string) => {
    if (!user) return;
    try {
      const { error } = await supabase.rpc('mark_conversation_as_read', {
        p_conversation_id: conversationId,
      });
      if (error) throw error;

      // Update local state
      setConversations((prev) =>
        prev.map((c) =>
          c.id === conversationId ? { ...c, unread_count: 0 } : c,
        ),
      );
    } catch (err) {
      console.error('Error marking conversation as read:', err);
    }
  }, [user]);

  // --- Realtime: new messages in active conversation ---
  useEffect(() => {
    if (!activeConversationId) return;

    const channel = supabase
      .channel(`messages-${activeConversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${activeConversationId}`,
        },
        (payload) => {
          const newMsg = payload.new as Record<string, any>;
          setMessages((prev) => {
            if (prev.find((m) => m.id === newMsg.id)) return prev;
            return [
              ...prev,
              {
                id: newMsg.id,
                conversation_id: newMsg.conversation_id,
                sender_id: newMsg.sender_id,
                content: newMsg.content,
                created_at: newMsg.created_at,
                sender_name: newMsg.sender_id === user?.id ? 'You' : '',
              },
            ];
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeConversationId, user?.id]);

  // --- Realtime: conversation list updates (unread counts, last_message_at) ---
  // Only subscribe when conversations have been loaded (messages tab is active)
  const hasConversations = conversations.length > 0;
  useEffect(() => {
    if (!user?.id || !hasConversations) return;

    const channel = supabase
      .channel(`conversations-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'conversations',
        },
        (payload) => {
          const updated = payload.new as Record<string, any>;

          // Ignore conversations where user is not a participant
          if (updated.buyer_id !== user.id && updated.seller_id !== user.id) return;

          setConversations((prev) => {
            const idx = prev.findIndex((c) => c.id === updated.id);
            if (idx === -1) return prev;

            const existing = prev[idx];
            const unreadCount = user.id === updated.buyer_id
              ? updated.buyer_unread_count
              : updated.seller_unread_count;

            const merged = {
              ...existing,
              last_message_at: updated.last_message_at,
              last_message_preview: updated.last_message_preview || existing.last_message_preview,
              unread_count: unreadCount,
            };

            const next = [...prev];
            next[idx] = merged;
            return next.sort(
              (a, b) => new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime(),
            );
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, hasConversations]);

  const totalUnreadCount = useMemo(
    () => conversations.reduce((sum, c) => sum + (c.unread_count || 0), 0),
    [conversations],
  );

  return {
    conversations,
    loadingConversations,
    fetchConversations,
    messages,
    loadingMessages,
    fetchMessages,
    sendFirstMessage,
    sendReply,
    markAsRead,
    activeConversationId,
    setActiveConversationId,
    totalUnreadCount,
  };
}
