
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MessageFilter, Message, RawMessage } from '../types';
import { fetchSentMessageCount } from "../api/messageCountApi";
import { fetchArtistById } from "../api/messageApi";

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
      
      // Process each message to add artist info using our updated fetchArtistById function
      const messagesWithArtists: Message[] = await Promise.all(
        (sentMessagesData as RawMessage[]).map(async (message) => {
          try {
            // Convert artist_id to string for consistent handling
            const artistId = message.artist_id.toString();
            const artistData = await fetchArtistById(artistId);
            
            return {
              ...message,
              status: message.status as Message['status'],
              artist: artistData || { name: 'Unknown Artist', image: '' }
            };
          } catch (error) {
            console.error('Error processing artist data:', error);
            return {
              ...message,
              status: message.status as Message['status'],
              artist: { name: 'Unknown Artist', image: '' }
            };
          }
        })
      );
      
      return messagesWithArtists;
    },
    enabled: !!userId,
  });
};
