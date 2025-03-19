
import { useState, useEffect } from 'react';
import { useQuery } from "@tanstack/react-query";
import { Message } from '../types';
import { fetchMessageById, fetchMessageReplies } from '../api/messageApi';
import { formatMessage, formatMessages } from '../utils/messageFormatter';

export function useMessageData(messageId: string | undefined, userId: string | undefined) {
  const [message, setMessage] = useState<Message>();
  const [replies, setReplies] = useState<Message[]>([]);

  const { data: threadData, isLoading, refetch } = useQuery({
    queryKey: ['messageThread', messageId],
    queryFn: async () => {
      if (!messageId) return null;

      try {
        // Fetch the original message
        const messageData = await fetchMessageById(messageId);
        if (!messageData) {
          console.error("Message not found:", messageId);
          return null;
        }
        
        const formattedMessage = await formatMessage(messageData, userId);

        // Fetch related replies
        const repliesData = await fetchMessageReplies(messageId);
        const formattedReplies = await formatMessages(repliesData, userId);

        return {
          message: formattedMessage,
          replies: formattedReplies
        };
      } catch (error) {
        console.error("Error fetching message thread:", error);
        throw error;
      }
    },
    enabled: !!messageId && !!userId
  });

  useEffect(() => {
    if (threadData) {
      setMessage(threadData.message);
      setReplies(threadData.replies);
    }
  }, [threadData]);

  return {
    message,
    replies,
    isLoading,
    refetch
  };
}
