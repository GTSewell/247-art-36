
import { useState } from 'react';
import { toast } from "sonner";
import { createMessageReply, updateMessageStatus, deleteMessage } from '../api/messageApi';

export function useThreadActions(userId: string | undefined, refetch: () => void) {
  const [isReplying, setIsReplying] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleReply = async (messageId: string, replyText: string) => {
    if (!userId || !replyText.trim()) {
      toast.error("Reply cannot be empty");
      return;
    }
    
    try {
      setIsReplying(true);
      
      // Create the reply
      await createMessageReply(messageId, replyText, userId, "0"); // We don't need artistId here as it's fetched in the API
      
      // Update the status of the original message
      await updateMessageStatus(messageId);
      
      toast.success("Reply sent successfully");
      refetch();
    } catch (error) {
      console.error('Error sending reply:', error);
      toast.error("Failed to send reply");
    } finally {
      setIsReplying(false);
    }
  };
  
  const handleDelete = async (messageId: string) => {
    try {
      setIsDeleting(true);
      await deleteMessage(messageId);
      
      toast.success("Message deleted successfully");
      refetch();
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error("Failed to delete message");
    } finally {
      setIsDeleting(false);
    }
  };
  
  return {
    handleReply,
    handleDelete,
    isReplying,
    isDeleting
  };
}
