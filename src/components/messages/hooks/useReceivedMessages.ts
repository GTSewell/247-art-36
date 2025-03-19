
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MessageFilter, Message, RawMessage } from '../types';
import { fetchReceivedMessageCount } from "../api/messageCountApi";
import { formatMessages } from "../utils/messageFormatter";

export const useReceivedMessages = (
  userId: string | undefined,
  receivedRange: { from: number, to: number },
  messageFilter: MessageFilter,
  setReceivedPagination: (
    updater: (prev: { currentPage: number; pageSize: number; totalCount: number; }) => 
    { currentPage: number; pageSize: number; totalCount: number; }
  ) => void
) => {
  return useQuery({
    queryKey: ['receivedMessages', userId, receivedRange, messageFilter],
    queryFn: async () => {
      if (!userId) return [];
      
      try {
        // Fetch message count for pagination
        const count = await fetchReceivedMessageCount(userId, messageFilter);
        setReceivedPagination(prev => ({ ...prev, totalCount: count }));
        
        console.log(`Querying for messages with artist_id: ${userId}, range: ${receivedRange.from}-${receivedRange.to}`);
        
        // Build the query with filters and pagination
        let query = supabase
          .from('messages_247')
          .select('*')
          .eq('artist_id', userId)
          .is('parent_message_id', null) // Only fetch main messages, not replies
          .order('created_at', { ascending: false })
          .range(receivedRange.from, receivedRange.to);
          
        // Apply filters if not showing all
        if (messageFilter !== 'all') {
          query = query.eq('status', messageFilter);
        }
        
        const { data: receivedMessagesData, error } = await query;
          
        if (error) {
          console.error('Error fetching received messages:', error);
          throw error;
        }
        
        console.log("Received messages data:", receivedMessagesData);
        
        // Format messages with sender and artist info
        const formattedMessages = await formatMessages(receivedMessagesData as RawMessage[]);
        return formattedMessages;
      } catch (error) {
        console.error("Error in useReceivedMessages:", error);
        return [];
      }
    },
    enabled: !!userId,
  });
};
