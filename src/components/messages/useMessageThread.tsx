
import { useState, useEffect } from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Message, RawMessage } from './types';

export const useMessageThread = (messageId: string | undefined, userId: string | undefined) => {
  const [message, setMessage] = useState<Message>();
  const [replies, setReplies] = useState<Message[]>([]);

  const { data: threadData, isLoading } = useQuery({
    queryKey: ['messageThread', messageId],
    queryFn: async () => {
      if (!messageId) return null;

      // Fetch the original message
      const { data: messageData, error: messageError } = await supabase
        .from('messages_247')
        .select('*')
        .eq('id', messageId)
        .single();

      if (messageError) throw messageError;

      // Fetch artist info if needed
      let artistData = null;
      if (messageData.artist_id) {
        const { data: artist } = await supabase
          .from('artists')
          .select('name, image')
          .eq('id', messageData.artist_id)
          .single();
          
        artistData = artist;
      }

      // Format the main message
      const formattedMessage: Message = {
        ...messageData,
        status: messageData.status as Message['status'],
        artist: artistData || undefined,
        sender: { email: `User ${messageData.sender_id.substring(0, 8)}` }
      };

      // Fetch related replies
      const { data: repliesData, error: repliesError } = await supabase
        .from('messages_247')
        .select('*')
        .eq('parent_message_id', messageId)
        .order('created_at', { ascending: true });

      if (repliesError) throw repliesError;

      // Format replies
      const formattedReplies = await Promise.all(
        (repliesData as RawMessage[]).map(async (reply) => {
          if (reply.artist_id) {
            const { data: replyArtist } = await supabase
              .from('artists')
              .select('name, image')
              .eq('id', reply.artist_id)
              .single();

            return {
              ...reply,
              status: reply.status as Message['status'],
              artist: replyArtist || undefined,
              sender: { email: `User ${reply.sender_id.substring(0, 8)}` }
            };
          }
          
          return {
            ...reply,
            status: reply.status as Message['status'],
            sender: { email: `User ${reply.sender_id.substring(0, 8)}` }
          };
        })
      );

      return {
        message: formattedMessage,
        replies: formattedReplies
      };
    },
    enabled: !!messageId && !!userId
  });

  useEffect(() => {
    if (threadData) {
      setMessage(threadData.message);
      setReplies(threadData.replies);
    }
  }, [threadData]);

  const handleReply = async (messageId: string, replyText: string) => {
    if (!replyText.trim() || !userId) {
      toast.error("Reply cannot be empty");
      return;
    }
    
    try {
      // First get the artist ID for the current user
      const { data: artistData, error: artistError } = await supabase
        .from('artists')
        .select('id')
        .eq('user_id', userId)
        .single();
        
      if (artistError) {
        throw artistError;
      }

      // Insert the reply
      const { error: replyError } = await supabase
        .from('messages_247')
        .insert({
          message: replyText,
          parent_message_id: messageId,
          sender_id: userId,
          artist_id: artistData.id,
          status: 'replied'
        });
        
      if (replyError) throw replyError;

      // Update original message status
      const { error: updateError } = await supabase
        .from('messages_247')
        .update({ 
          status: 'replied',
          replied_at: new Date().toISOString()
        })
        .eq('id', messageId);
        
      if (updateError) throw updateError;
      
      toast.success("Reply sent successfully");
      
      // Refetch the thread
      window.location.reload();
    } catch (error) {
      console.error('Error replying to message:', error);
      toast.error("Failed to send reply");
    }
  };
  
  const handleDelete = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('messages_247')
        .delete()
        .eq('id', messageId);
        
      if (error) throw error;
      
      toast.success("Message deleted successfully");
      window.location.reload();
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error("Failed to delete message");
    }
  };

  return {
    message,
    replies,
    isLoading,
    handleReply,
    handleDelete
  };
};
