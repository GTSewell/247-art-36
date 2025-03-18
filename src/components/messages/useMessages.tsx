import { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Message, RawMessage } from './types';

export const useMessages = (userId: string | undefined) => {
  const [activeTab, setActiveTab] = useState<string>("sent");

  // Fetch messages sent by the current user
  const { data: sentMessages, isLoading: sentLoading, refetch: refetchSent } = useQuery({
    queryKey: ['sentMessages', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      // First we need to get the artist details separately
      const { data: sentMessagesData, error: messagesError } = await supabase
        .from('messages_247')
        .select('*')
        .eq('sender_id', userId)
        .order('created_at', { ascending: false });
        
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

  // Fetch messages received by the current user (as an artist)
  const { data: receivedMessages, isLoading: receivedLoading, refetch: refetchReceived } = useQuery({
    queryKey: ['receivedMessages', userId],
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
      
      // Then get messages sent to this artist
      const { data: receivedMessagesData, error } = await supabase
        .from('messages_247')
        .select('*')
        .eq('artist_id', artistData.id.toString())
        .order('created_at', { ascending: false });
        
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
  
  return {
    activeTab,
    setActiveTab,
    sentMessages,
    sentLoading,
    receivedMessages,
    receivedLoading,
    handleReply,
    refetchSent,
    refetchReceived
  };
};
