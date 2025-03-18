
import { useMessageData } from './hooks/useMessageData';
import { useMessageActions } from './hooks/useMessageActions';

export const useMessageThread = (messageId: string | undefined, userId: string | undefined) => {
  const { message, replies, isLoading } = useMessageData(messageId, userId);
  const { handleReply, handleDelete } = useMessageActions(userId);

  return {
    message,
    replies,
    isLoading,
    handleReply,
    handleDelete
  };
};
