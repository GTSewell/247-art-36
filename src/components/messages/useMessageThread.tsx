
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Message, RawMessage } from './types';
import { formatMessage, formatMessages } from './utils/messageFormatter';

export const useMessageThread = (messageId: string | undefined, userId: string | undefined) => {
  // Fetch the main message and its replies
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['messageThread', messageId],
    queryFn: async () => {
      if (!messageId || !userId) {
        return { message: undefined, replies: [] };
      }
      
      try {
        // Fetch the main message
        const { data: messageData, error: messageError } = await supabase
          .from('messages_247')
          .select('*')
          .eq('id', messageId)
          .single();
          
        if (messageError) throw messageError;
        
        // Fetch replies to this message
        const { data: repliesData, error: repliesError } = await supabase
          .from('messages_247')
          .select('*')
          .eq('parent_message_id', messageId)
          .order('created_at', { ascending: true });
          
        if (repliesError) throw repliesError;
        
        // Format the message and replies with additional data
        const formattedMessage = await formatMessage(messageData as RawMessage);
        const formattedReplies = await formatMessages(repliesData as RawMessage[]);
        
        return {
          message: formattedMessage,
          replies: formattedReplies
        };
      } catch (error) {
        console.error('Error fetching message thread:', error);
        throw error;
      }
    },
    enabled: !!messageId && !!userId,
  });
  
  // Handle replying to a message
  const handleReply = async (messageId: string, replyText: string) => {
    if (!userId || !replyText.trim()) {
      toast.error("Reply cannot be empty");
      return;
    }
    
    try {
      // Get the original message to ensure we're using the right artist_id format
      const { data: originalMessage, error: fetchError } = await supabase
        .from('messages_247')
        .select('*')
        .eq('id', messageId)
        .single();
        
      if (fetchError) throw fetchError;
      
      // Create the reply
      const { error: replyError } = await supabase
        .from('messages_247')
        .insert({
          message: replyText,
          sender_id: userId,
          artist_id: originalMessage.artist_id,
          status: 'replied',
          parent_message_id: messageId,
        });
        
      if (replyError) throw replyError;
      
      // Update the status of the original message
      const { error: updateError } = await supabase
        .from('messages_247')
        .update({ 
          status: 'replied', 
          replied_at: new Date().toISOString() 
        })
        .eq('id', messageId);
        
      if (updateError) throw updateError;
      
      toast.success("Reply sent successfully");
      refetch();
    } catch (error) {
      console.error('Error sending reply:', error);
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
      refetch();
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error("Failed to delete message");
    }
  };
  
  return {
    message: data?.message,
    replies: data?.replies || [],
    isLoading,
    handleReply,
    handleDelete
  };
};
