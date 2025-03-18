
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Message, MessageFilter as MessageFilterType, PaginationState } from './types';
import EmptyMessageState from './EmptyMessageState';
import LoadingState from './LoadingState';
import SentMessageCard from './SentMessageCard';
import ReceivedMessageCard from './ReceivedMessageCard';
import MessageFilter from './MessageFilter';
import MessagePagination from './MessagePagination';

interface MessagesContentProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  messageFilter: MessageFilterType;
  setMessageFilter: (value: MessageFilterType) => void;
  sentMessages: Message[] | undefined;
  sentLoading: boolean;
  receivedMessages: Message[] | undefined;
  receivedLoading: boolean;
  sentPagination: PaginationState;
  receivedPagination: PaginationState;
  handleReply: (messageId: string, replyText: string) => Promise<void>;
  handleDelete: (messageId: string) => Promise<void>;
  handlePageChange: (tab: 'sent' | 'received', page: number) => void;
}

const MessagesContent = ({ 
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
  handlePageChange
}: MessagesContentProps) => {
  return (
    <Tabs defaultValue="sent" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="sent">
          Sent Messages
          {sentMessages && sentMessages.length > 0 && (
            <Badge variant="secondary" className="ml-2">{sentPagination.totalCount}</Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="received">
          Received Messages
          {receivedMessages && receivedMessages.length > 0 && (
            <Badge variant="secondary" className="ml-2">{receivedPagination.totalCount}</Badge>
          )}
        </TabsTrigger>
      </TabsList>
      
      <MessageFilter value={messageFilter} onChange={setMessageFilter} />
      
      <TabsContent value="sent" className="space-y-4">
        {sentLoading ? (
          <LoadingState />
        ) : sentMessages && sentMessages.length > 0 ? (
          <>
            <div className="space-y-4">
              {sentMessages.map((message) => (
                <SentMessageCard 
                  key={message.id} 
                  message={message} 
                  onDelete={handleDelete} 
                />
              ))}
            </div>
            
            <MessagePagination 
              pagination={sentPagination}
              onPageChange={(page) => handlePageChange('sent', page)} 
            />
          </>
        ) : (
          <EmptyMessageState type="sent" />
        )}
      </TabsContent>
      
      <TabsContent value="received" className="space-y-4">
        {receivedLoading ? (
          <LoadingState />
        ) : receivedMessages && receivedMessages.length > 0 ? (
          <>
            <div className="space-y-4">
              {receivedMessages.map((message) => (
                <ReceivedMessageCard 
                  key={message.id} 
                  message={message} 
                  onReply={handleReply}
                  onDelete={handleDelete}
                />
              ))}
            </div>
            
            <MessagePagination 
              pagination={receivedPagination}
              onPageChange={(page) => handlePageChange('received', page)} 
            />
          </>
        ) : (
          <EmptyMessageState type="received" />
        )}
      </TabsContent>
    </Tabs>
  );
};

export default MessagesContent;
