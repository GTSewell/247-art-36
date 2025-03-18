
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ChevronLeft, Loader2 } from "lucide-react";
import { Message } from './types';
import MessageReplyForm from './MessageReplyForm';
import MessageThreadItem from './MessageThreadItem';

interface MessageThreadProps {
  message?: Message;
  replies: Message[];
  isLoading: boolean;
  onReply: (messageId: string, replyText: string) => Promise<void>;
  onDelete: (messageId: string) => Promise<void>;
}

const MessageThread = ({ message, replies, isLoading, onReply, onDelete }: MessageThreadProps) => {
  const navigate = useNavigate();
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!message) {
    return (
      <div className="text-center py-10">
        <p>Message not found</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => navigate('/messages')}
        >
          Back to Messages
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate('/messages')}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Messages
        </Button>
      </div>

      <div className="space-y-6">
        <MessageThreadItem 
          message={message}
          isOriginal={true}
          onDelete={onDelete}
        />

        {replies.length > 0 && (
          <div className="ml-8 space-y-4">
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
          <div className="ml-8 mt-4">
            <MessageReplyForm 
              messageId={message.id}
              onReply={onReply}
              creditAmount={message.credit_amount}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageThread;
