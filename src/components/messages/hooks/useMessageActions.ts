
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useMessageActions = (
  refetchSent: () => void,
  refetchReceived: () => void,
  activeTab: string
) => {
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

  return {
    handleReply,
    handleDelete
  };
};
