
import React from 'react';
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Message } from './types';
import MessageStatusBadge from './MessageStatusBadge';

interface MessageThreadItemProps {
  message: Message;
  isOriginal?: boolean;
  onDelete: (messageId: string) => Promise<void>;
}

const MessageThreadItem = ({ message, isOriginal = false, onDelete }: MessageThreadItemProps) => {
  const isArtistMessage = !!message.artist;
  
  return (
    <div className={`border rounded-lg p-4 bg-card ${isOriginal ? '' : 'border-l-4 border-l-primary'}`}>
      <div className="flex items-start gap-4">
        <Avatar className="h-10 w-10 flex-shrink-0">
          {isArtistMessage ? (
            <AvatarImage src={message.artist?.image || ''} alt={message.artist?.name || 'Artist'} />
          ) : null}
          <AvatarFallback>
            {isArtistMessage 
              ? message.artist?.name?.substring(0, 2) || 'AR'
              : message.sender?.email?.substring(0, 2) || 'US'
            }
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">
                {isArtistMessage 
                  ? message.artist?.name || 'Unknown Artist'
                  : message.sender?.email || 'Unknown User'
                }
              </h3>
              <p className="text-sm text-muted-foreground">
                {format(new Date(message.created_at), 'PPP p')}
              </p>
            </div>
            
            {isOriginal && <MessageStatusBadge status={message.status} />}
          </div>
          
          <div className="mt-3 p-3 bg-muted rounded-md">
            <p>{message.message}</p>
          </div>
          
          <div className="mt-3 flex justify-between items-center">
            {isOriginal && (
              <p className="text-sm">
                Credit: ${message.credit_amount?.toFixed(2)}
              </p>
            )}
            
            <Button 
              variant="outline" 
              size="sm" 
              className="text-destructive hover:bg-destructive/10 ml-auto"
              onClick={() => onDelete(message.id)}
            >
              <Trash2 className="h-4 w-4 mr-1" /> Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageThreadItem;
