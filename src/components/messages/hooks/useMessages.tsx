
import { useState } from 'react';
import { MessageFilter } from '../types';
import { usePagination } from './usePagination';
import { useSentMessages } from './useSentMessages';
import { useReceivedMessages } from './useReceivedMessages';
import { useMessageActions } from './useMessageActions';

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

  // Get message action handlers
  const { handleReply, handleDelete } = useMessageActions(
    refetchSent,
    refetchReceived,
    activeTab
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
