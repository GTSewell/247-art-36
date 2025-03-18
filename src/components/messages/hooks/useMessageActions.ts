
import { toast } from "sonner";
import { 
  fetchArtistByUserId, 
  createMessageReply, 
  updateMessageStatus,
  deleteMessage
} from '../api/messageApi';

export function useMessageActions(userId: string | undefined) {
  
  const handleReply = async (messageId: string, replyText: string) => {
    if (!replyText.trim() || !userId) {
      toast.error("Reply cannot be empty");
      return;
    }
    
    try {
      // First get the artist ID for the current user
      const artistData = await fetchArtistByUserId(userId);
      
      // Insert the reply
      await createMessageReply(messageId, replyText, userId, artistData.id);
      
      // Update original message status
      await updateMessageStatus(messageId);
      
      toast.success("Reply sent successfully");
      
      // Refresh the page to show updated data
      window.location.reload();
    } catch (error) {
      console.error('Error replying to message:', error);
      toast.error("Failed to send reply");
    }
  };
  
  const handleDelete = async (messageId: string) => {
    try {
      await deleteMessage(messageId);
      
      toast.success("Message deleted successfully");
      window.location.reload();
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error("Failed to delete message");
    }
  };

  return {
    handleReply,
    handleDelete
  };
}
