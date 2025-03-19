
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Message } from './types';
import MessageThreadItem from './MessageThreadItem';
import MessageReplyForm from './MessageReplyForm';
import CountdownTimer from './CountdownTimer';
import { Skeleton } from "@/components/ui/skeleton";

interface MessageThreadProps {
  message?: Message;
  replies?: Message[];
  isLoading: boolean;
  onReply: (messageId: string, replyText: string) => Promise<void>;
  onDelete: (messageId: string) => Promise<void>;
}

const MessageThread = ({ 
  message, 
  replies = [], 
  isLoading, 
  onReply, 
  onDelete 
}: MessageThreadProps) => {
  const navigate = useNavigate();
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Button 
          variant="ghost" 
          className="mb-4" 
          onClick={() => navigate('/messages')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Messages
        </Button>
        
        <Skeleton className="h-40 w-full rounded-lg" />
        <Skeleton className="h-40 w-full rounded-lg" />
      </div>
    );
  }
  
  if (!message) {
    return (
      <div className="space-y-4">
        <Button 
          variant="ghost" 
          className="mb-4" 
          onClick={() => navigate('/messages')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Messages
        </Button>
        
        <div className="p-8 text-center border rounded-lg">
          <h3 className="text-lg font-medium">Message not found</h3>
          <p className="text-muted-foreground">This message may have been deleted or doesn't exist.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <Button 
        variant="ghost" 
        className="mb-4" 
        onClick={() => navigate('/messages')}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Messages
      </Button>
      
      <h1 className="text-2xl font-bold mb-6">Message Thread</h1>
      
      <MessageThreadItem 
        message={message} 
        isOriginal={true} 
        onDelete={onDelete} 
      />
      
      {message.status === 'pending' && (
        <div className="mb-4">
          <CountdownTimer createdAt={message.created_at} expiryHours={24} />
        </div>
      )}
      
      {replies.length > 0 && (
        <div className="mt-6 space-y-4">
          <h2 className="text-lg font-medium">Replies</h2>
          {replies.map(reply => (
            <MessageThreadItem 
              key={reply.id} 
              message={reply} 
              onDelete={onDelete} 
            />
          ))}
        </div>
      )}
      
      {message.status === 'pending' && (
        <div className="mt-6 p-4 border rounded-lg">
          <h2 className="text-lg font-medium mb-4">Reply to this message</h2>
          <MessageReplyForm 
            messageId={message.id} 
            onReply={onReply}
            creditAmount={message.credit_amount || 0}
          />
        </div>
      )}
    </div>
  );
};

export default MessageThread;
