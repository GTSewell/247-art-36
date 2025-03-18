
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Message } from './types';
import EmptyMessageState from './EmptyMessageState';
import LoadingState from './LoadingState';
import SentMessageCard from './SentMessageCard';
import ReceivedMessageCard from './ReceivedMessageCard';

interface MessagesContentProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  sentMessages: Message[] | undefined;
  sentLoading: boolean;
  receivedMessages: Message[] | undefined;
  receivedLoading: boolean;
  handleReply: (messageId: string, replyText: string) => Promise<void>;
}

const MessagesContent = ({ 
  activeTab, 
  setActiveTab, 
  sentMessages, 
  sentLoading,
  receivedMessages,
  receivedLoading,
  handleReply
}: MessagesContentProps) => {
  return (
    <Tabs defaultValue="sent" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="sent">
          Sent Messages
          {sentMessages && sentMessages.length > 0 && (
            <Badge variant="secondary" className="ml-2">{sentMessages.length}</Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="received">
          Received Messages
          {receivedMessages && receivedMessages.length > 0 && (
            <Badge variant="secondary" className="ml-2">{receivedMessages.length}</Badge>
          )}
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="sent" className="space-y-4">
        {sentLoading ? (
          <LoadingState />
        ) : sentMessages && sentMessages.length > 0 ? (
          <div className="space-y-4">
            {sentMessages.map((message) => (
              <SentMessageCard key={message.id} message={message} />
            ))}
          </div>
        ) : (
          <EmptyMessageState type="sent" />
        )}
      </TabsContent>
      
      <TabsContent value="received" className="space-y-4">
        {receivedLoading ? (
          <LoadingState />
        ) : receivedMessages && receivedMessages.length > 0 ? (
          <div className="space-y-4">
            {receivedMessages.map((message) => (
              <ReceivedMessageCard 
                key={message.id} 
                message={message} 
                onReply={handleReply} 
              />
            ))}
          </div>
        ) : (
          <EmptyMessageState type="received" />
        )}
      </TabsContent>
    </Tabs>
  );
};

export default MessagesContent;
