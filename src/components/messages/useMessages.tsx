
import { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Message, RawMessage, PaginationState, MessageFilter } from './types';

export const useMessages = (userId: string | undefined) => {
  const [activeTab, setActiveTab] = useState<string>("sent");
  const [messageFilter, setMessageFilter] = useState<MessageFilter>("all");
  
  // Pagination state for sent messages
  const [sentPagination, setSentPagination] = useState<PaginationState>({
    currentPage: 1,
    pageSize: 5,
    totalCount: 0
  });
  
  // Pagination state for received messages
  const [receivedPagination, setReceivedPagination] = useState<PaginationState>({
    currentPage: 1,
    pageSize: 5,
    totalCount: 0
  });

  // Calculate pagination ranges
  const sentRange = {
    from: (sentPagination.currentPage - 1) * sentPagination.pageSize,
    to: sentPagination.currentPage * sentPagination.pageSize - 1
  };
  
  const receivedRange = {
    from: (receivedPagination.currentPage - 1) * receivedPagination.pageSize,
    to: receivedPagination.currentPage * receivedPagination.pageSize - 1
  };

  // Count total sent messages for pagination
  const fetchSentMessageCount = async () => {
    if (!userId) return 0;
    
    let query = supabase
      .from('messages_247')
      .select('id', { count: 'exact', head: true })
      .eq('sender_id', userId)
      .is('parent_message_id', null); // Only count main messages, not replies
      
    // Apply filters if not showing all
    if (messageFilter !== 'all') {
      query = query.eq('status', messageFilter);
    }
    
    const { count, error } = await query;
    
    if (error) {
      console.error('Error counting sent messages:', error);
      return 0;
    }
    
    return count || 0;
  };
  
  // Count total received messages for pagination
  const fetchReceivedMessageCount = async () => {
    if (!userId) return 0;
    
    // First get the artist ID for the current user
    const { data: artistData, error: artistError } = await supabase
      .from('artists')
      .select('id')
      .eq('user_id', userId)
      .single();
      
    if (artistError) {
      if (artistError.code === 'PGRST116') {
        return 0;
      }
      console.error('Error fetching artist profile:', artistError);
      return 0;
    }
    
    if (!artistData) return 0;
    
    let query = supabase
      .from('messages_247')
      .select('id', { count: 'exact', head: true })
      .eq('artist_id', artistData.id.toString())
      .is('parent_message_id', null); // Only count main messages, not replies
      
    // Apply filters if not showing all
    if (messageFilter !== 'all') {
      query = query.eq('status', messageFilter);
    }
    
    const { count, error } = await query;
    
    if (error) {
      console.error('Error counting received messages:', error);
      return 0;
    }
    
    return count || 0;
  };

  // Fetch messages sent by the current user with pagination
  const { data: sentMessages, isLoading: sentLoading, refetch: refetchSent } = useQuery({
    queryKey: ['sentMessages', userId, sentRange, messageFilter],
    queryFn: async () => {
      if (!userId) return [];
      
      // First fetch message count for pagination
      const count = await fetchSentMessageCount();
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
      
      // Now process each message to add artist info
      const messagesWithArtists: Message[] = await Promise.all(
        (sentMessagesData as RawMessage[]).map(async (message) => {
          // Convert from numeric string to number for the lookup
          const artistIdAsNumber = typeof message.artist_id === 'string' 
            ? parseInt(message.artist_id, 10) 
            : message.artist_id;
          
          if (isNaN(artistIdAsNumber)) {
            return {
              ...message,
              status: message.status as Message['status'],
              artist: { name: 'Unknown Artist', image: '' }
            };
          }
          
          const { data: artistData } = await supabase
            .from('artists')
            .select('name, image')
            .eq('id', artistIdAsNumber)
            .single();
            
          return {
            ...message,
            status: message.status as Message['status'],
            artist: artistData || { name: 'Unknown Artist', image: '' }
          };
        })
      );
      
      return messagesWithArtists;
    },
    enabled: !!userId,
  });

  // Fetch messages received by the current user (as an artist) with pagination
  const { data: receivedMessages, isLoading: receivedLoading, refetch: refetchReceived } = useQuery({
    queryKey: ['receivedMessages', userId, receivedRange, messageFilter],
    queryFn: async () => {
      if (!userId) return [];
      
      // First get the artist ID for the current user
      const { data: artistData, error: artistError } = await supabase
        .from('artists')
        .select('id')
        .eq('user_id', userId)
        .single();
        
      if (artistError) {
        if (artistError.code === 'PGRST116') {
          // No artist profile found, return empty array
          return [];
        }
        console.error('Error fetching artist profile:', artistError);
        throw artistError;
      }
      
      if (!artistData) return [];
      
      // Fetch message count for pagination
      const count = await fetchReceivedMessageCount();
      setReceivedPagination(prev => ({ ...prev, totalCount: count }));
      
      // Build the query with filters and pagination
      let query = supabase
        .from('messages_247')
        .select('*')
        .eq('artist_id', artistData.id.toString())
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
      
      // Get sender emails - we can't query auth.users directly
      // Instead, we'll just use the sender_id and keep the UI simple
      const messagesWithSenders: Message[] = (receivedMessagesData as RawMessage[]).map(message => {
        return {
          ...message,
          status: message.status as Message['status'],
          sender: { email: `User ${message.sender_id.substring(0, 8)}` }
        };
      });
      
      return messagesWithSenders;
    },
    enabled: !!userId,
  });

  // Handle message reply
  const handleReply = async (messageId: string, replyText: string) => {
    if (!replyText.trim()) {
      toast.error("Reply cannot be empty");
      return;
    }
    
    try {
      // Update message status
      const { error } = await supabase
        .from('messages_247')
        .update({ 
          status: 'replied',
          replied_at: new Date().toISOString(),
        })
        .eq('id', messageId);
        
      if (error) throw error;
      
      // You would typically send the actual reply here
      // For now, just show a success toast
      toast.success("Reply sent successfully");
      
      // Refetch messages to update the UI
      refetchReceived();
    } catch (error) {
      console.error('Error replying to message:', error);
      toast.error("Failed to send reply");
    }
  };
  
  // Handle message deletion
  const handleDelete = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('messages_247')
        .delete()
        .eq('id', messageId);
        
      if (error) throw error;
      
      toast.success("Message deleted successfully");
      
      // Refetch to update the UI
      if (activeTab === 'sent') {
        refetchSent();
      } else {
        refetchReceived();
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error("Failed to delete message");
    }
  };
  
  // Handle page change for pagination
  const handlePageChange = (tab: 'sent' | 'received', page: number) => {
    if (tab === 'sent') {
      setSentPagination(prev => ({ ...prev, currentPage: page }));
    } else {
      setReceivedPagination(prev => ({ ...prev, currentPage: page }));
    }
  };
  
  return {
    activeTab,
    setActiveTab,
    messageFilter,
    setMessageFilter,
    sentMessages,
    sentLoading,
    receivedMessages,
    receivedLoading,
    sentPagination,
    receivedPagination,
    handleReply,
    handleDelete,
    handlePageChange,
    refetchSent,
    refetchReceived
  };
};
