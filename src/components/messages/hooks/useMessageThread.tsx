
import { useMessageData } from './useMessageData';
import { useThreadActions } from './useThreadActions';

export const useMessageThread = (messageId: string | undefined, userId: string | undefined) => {
  // Fetch the message data
  const { message, replies, isLoading, refetch } = useMessageData(messageId, userId);
  
  // Get message actions
  const { handleReply, handleDelete, isReplying, isDeleting } = useThreadActions(userId, refetch);
  
  return {
    message,
    replies,
    isLoading,
    handleReply,
    handleDelete,
    isReplying,
    isDeleting
  };
};
