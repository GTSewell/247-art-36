
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MessageFilter, Message, RawMessage } from '../types';
import { fetchSentMessageCount } from "../api/messageCountApi";
import { formatMessages } from "../utils/messageFormatter";

export const useSentMessages = (
  userId: string | undefined,
  sentRange: { from: number, to: number },
  messageFilter: MessageFilter,
  setSentPagination: (
    updater: (prev: { currentPage: number; pageSize: number; totalCount: number; }) => 
    { currentPage: number; pageSize: number; totalCount: number; }
  ) => void
) => {
  return useQuery({
    queryKey: ['sentMessages', userId, sentRange, messageFilter],
    queryFn: async () => {
      if (!userId) return [];
      
      // First fetch message count for pagination
      const count = await fetchSentMessageCount(userId, messageFilter);
      setSentPagination(prev => ({ ...prev, totalCount: count }));
      
      // Build the query with filters and pagination
      let query = supabase
        .from('messages_247')
        .select('*')
        .eq('sender_id', userId)
        .is('parent_message_id', null) // Only fetch main messages, not replies
        .order('created_at', { ascending: false })
        .range(sentRange.from, sentRange.to);
        
      // Apply filters if not showing all
      if (messageFilter !== 'all') {
        query = query.eq('status', messageFilter);
      }
      
      const { data: sentMessagesData, error: messagesError } = await query;
        
      if (messagesError) {
        console.error('Error fetching sent messages:', messagesError);
        throw messagesError;
      }
      
      // Format the messages with sender and recipient info, passing current user ID
      const formattedMessages = await formatMessages(sentMessagesData as RawMessage[], userId);
      return formattedMessages;
    },
    enabled: !!userId,
  });
};
