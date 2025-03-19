
import { useState } from 'react';
import { PaginationState } from '../types';

export const usePagination = (initialPageSize = 5) => {
  // Pagination state for sent messages
  const [sentPagination, setSentPagination] = useState<PaginationState>({
    currentPage: 1,
    pageSize: initialPageSize,
    totalCount: 0
  });
  
  // Pagination state for received messages
  const [receivedPagination, setReceivedPagination] = useState<PaginationState>({
    currentPage: 1,
    pageSize: initialPageSize,
    totalCount: 0
  });

  // Calculate pagination ranges
  const sentRange = {
    from: (sentPagination.currentPage - 1) * sentPagination.pageSize,
    to: sentPagination.currentPage * sentPagination.pageSize - 1
  };
  
  const receivedRange = {
    from: (receivedPagination.currentPage - 1) * receivedPagination.pageSize,
    to: receivedPagination.currentPage * receivedPagination.pageSize - 1
  };

  // Handle page change for pagination
  const handlePageChange = (tab: 'sent' | 'received', page: number) => {
    if (tab === 'sent') {
      setSentPagination(prev => ({ ...prev, currentPage: page }));
    } else {
      setReceivedPagination(prev => ({ ...prev, currentPage: page }));
    }
  };

  return {
    sentPagination,
    setSentPagination,
    receivedPagination,
    setReceivedPagination,
    sentRange,
    receivedRange,
    handlePageChange
  };
};
