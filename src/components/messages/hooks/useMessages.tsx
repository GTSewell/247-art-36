
import { useState, useCallback } from 'react';
import { MessageFilter } from '../types';
import { usePagination } from './usePagination';
import { useSentMessages } from './useSentMessages';
import { useReceivedMessages } from './useReceivedMessages';
import { useThreadActions } from './useThreadActions';

export const useMessages = (userId: string | undefined) => {
  const [activeTab, setActiveTab] = useState<string>("sent");
  const [messageFilter, setMessageFilter] = useState<MessageFilter>("all");
  
  // Get pagination functionality
  const {
    sentPagination,
    setSentPagination,
    receivedPagination,
    setReceivedPagination,
    sentRange,
    receivedRange,
    handlePageChange
  } = usePagination();

  // Define refetch functions
  const forceRefetch = useCallback(() => {
    // Force a refetch by temporarily changing the query keys
    const dummyTimeStamp = Date.now();
    refetchSent({ queryKey: ['sentMessages', userId, sentRange, messageFilter, dummyTimeStamp] });
    refetchReceived({ queryKey: ['receivedMessages', userId, receivedRange, messageFilter, dummyTimeStamp] });
  }, [userId, sentRange, receivedRange, messageFilter]);

  // Fetch sent messages
  const { 
    data: sentMessages, 
    isLoading: sentLoading, 
    refetch: refetchSent 
  } = useSentMessages(userId, sentRange, messageFilter, setSentPagination);

  // Fetch received messages
  const { 
    data: receivedMessages, 
    isLoading: receivedLoading, 
    refetch: refetchReceived 
  } = useReceivedMessages(userId, receivedRange, messageFilter, setReceivedPagination);

  // Use thread actions with appropriate refetch function
  const { handleReply, handleDelete } = useThreadActions(
    userId,
    forceRefetch
  );
  
  return {
    activeTab,
    setActiveTab,
    messageFilter,
    setMessageFilter,
    sentMessages,
    sentLoading,
    receivedMessages,
    receivedLoading,
    sentPagination,
    receivedPagination,
    handleReply,
    handleDelete,
    handlePageChange,
    refetchSent,
    refetchReceived
  };
};
