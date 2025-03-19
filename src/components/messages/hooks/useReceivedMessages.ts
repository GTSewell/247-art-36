import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MessageFilter, Message, RawMessage } from '../types';
import { fetchReceivedMessageCount } from "../api/messageCountApi";
import { fetchArtistByUserId } from "../api/messageApi";

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
        // First get the artist ID for the current user
        const { data: artistData, error: artistError } = await supabase
          .from('artists')
          .select('user_id')
          .eq('user_id', userId)
          .maybeSingle();
          
        if (artistError) {
          console.error('Error fetching artist profile:', artistError);
          return [];
        }
        
        // If no artist profile found with this user_id, try direct query on messages
        if (!artistData) {
          console.log("No artist profile found with user_id:", userId);
          console.log("Querying messages directly with artist_id as user_id");
          
          // Fetch message count for pagination - pass the userId directly as artist_id
          const count = await fetchReceivedMessageCount(userId, messageFilter);
          setReceivedPagination(prev => ({ ...prev, totalCount: count }));
          
          // Build the query with filters and pagination
          let query = supabase
            .from('messages_247')
            .select('*')
            .eq('artist_id', userId) // Use userId directly as the artist_id
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
          
          console.log("Received messages data using userId directly:", receivedMessagesData);
          
          // Format messages with sender info
          const messagesWithSenders: Message[] = (receivedMessagesData as RawMessage[]).map(message => {
            return {
              ...message,
              status: message.status as Message['status'],
              sender: { email: `User ${message.sender_id.substring(0, 8)}` },
              artist: { name: 'You', image: '' }
            };
          });
          
          return messagesWithSenders;
        }
        
        // If we found the artist by user_id, use it directly (it should be a UUID)
        const artistId = userId;
        
        // Fetch message count for pagination
        const count = await fetchReceivedMessageCount(userId, messageFilter);
        setReceivedPagination(prev => ({ ...prev, totalCount: count }));
        
        // Log the query parameters for debugging
        console.log("Querying for messages with artist_id (UUID):", artistId);
        
        // Build the query with filters and pagination
        let query = supabase
          .from('messages_247')
          .select('*')
          .eq('artist_id', artistId)
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
        
        // Get sender emails - we can't query auth.users directly
        // Instead, we'll just use the sender_id and keep the UI simple
        const messagesWithSenders: Message[] = (receivedMessagesData as RawMessage[]).map(message => {
          return {
            ...message,
            status: message.status as Message['status'],
            sender: { email: `User ${message.sender_id.substring(0, 8)}` },
            artist: { name: 'You', image: '' }
          };
        });
        
        return messagesWithSenders;
      } catch (error) {
        console.error("Error in useReceivedMessages:", error);
        return [];
      }
    },
    enabled: !!userId,
  });
};
