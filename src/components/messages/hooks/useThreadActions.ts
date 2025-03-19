
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
      
      // Refetch data to update UI
      refetch();
    } catch (error) {
      console.error('Error sending reply:', error);
      toast.error("Failed to send reply");
    } finally {
      setIsReplying(false);
    }
  };
  
  const handleDelete = async (messageId: string) => {
    if (isDeleting) return; // Prevent multiple clicks
    
    try {
      setIsDeleting(true);
      console.log(`Deleting message with ID: ${messageId}`);
      
      // Delete the message and its replies
      await deleteMessage(messageId);
      
      toast.success("Message deleted successfully");
      
      // Force a refetch after deletion
      // Add a small delay to ensure database operations complete
      setTimeout(() => {
        refetch();
      }, 300);
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error("Failed to delete message");
      // Important: Reset the deleting state on error
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
