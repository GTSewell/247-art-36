
import React from 'react';
import { Message } from './types';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { format } from "date-fns";
import MessageStatusBadge from './MessageStatusBadge';

interface ReceivedMessageCardProps {
  message: Message;
  onReply: (messageId: string, replyText: string) => Promise<void>;
}

const ReceivedMessageCard = ({ message, onReply }: ReceivedMessageCardProps) => {
  return (
    <div key={message.id} className="border rounded-lg p-4 bg-card">
      <div className="flex items-start gap-4">
        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarFallback>{message.sender?.email?.substring(0, 2) || 'US'}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{message.sender?.email || 'Unknown User'}</h3>
              <p className="text-sm text-muted-foreground">
                {format(new Date(message.created_at), 'PPP p')}
              </p>
            </div>
            
            <MessageStatusBadge status={message.status} />
          </div>
          
          <div className="mt-3 p-3 bg-muted rounded-md">
            <p>{message.message}</p>
          </div>
          
          {message.status === 'pending' ? (
            <div className="mt-3">
              <form onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const replyInput = form.elements.namedItem('reply') as HTMLTextAreaElement;
                onReply(message.id, replyInput.value);
                form.reset();
              }}>
                <textarea
                  name="reply"
                  className="w-full p-3 border rounded-md h-20 resize-none mb-2"
                  placeholder="Type your reply here..."
                  required
                />
                <div className="flex justify-between items-center">
                  <p className="text-sm">
                    Reply to earn ${message.credit_amount?.toFixed(2)} credit
                  </p>
                  <Button type="submit" className="flex gap-2 items-center">
                    <Send className="h-4 w-4" />
                    Send Reply
                  </Button>
                </div>
              </form>
            </div>
          ) : message.replied_at && (
            <div className="mt-3">
              <p className="text-sm text-muted-foreground">
                You replied on {format(new Date(message.replied_at), 'PPP p')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReceivedMessageCard;
