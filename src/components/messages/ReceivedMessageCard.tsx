
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Message } from './types';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Send, Trash2, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import MessageStatusBadge from './MessageStatusBadge';
import CountdownTimer from './CountdownTimer';
import MessageReplyForm from './MessageReplyForm';

interface ReceivedMessageCardProps {
  message: Message;
  onReply: (messageId: string, replyText: string) => Promise<void>;
  onDelete: (messageId: string) => Promise<void>;
}

const ReceivedMessageCard = ({ message, onReply, onDelete }: ReceivedMessageCardProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="border rounded-lg p-4 bg-card">
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
          
          {message.status === 'pending' && (
            <div className="mt-3">
              <div className="mb-2">
                <CountdownTimer createdAt={message.created_at} expiryHours={24} />
              </div>
              
              <MessageReplyForm 
                messageId={message.id} 
                onReply={onReply}
                creditAmount={message.credit_amount || 0}
              />
              
              <div className="mt-2 flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  className="text-destructive hover:bg-destructive/10"
                  onClick={() => onDelete(message.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate(`/messages/${message.id}`)}
                >
                  <MessageSquare className="h-4 w-4 mr-1" /> View Thread
                </Button>
              </div>
            </div>
          )}
          
          {message.replied_at && (
            <div className="mt-3">
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  You replied on {format(new Date(message.replied_at), 'PPP p')}
                </p>
                <div className="space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => onDelete(message.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/messages/${message.id}`)}
                  >
                    <MessageSquare className="h-4 w-4 mr-1" /> View Thread
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReceivedMessageCard;
