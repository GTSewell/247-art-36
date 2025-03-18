
import React from 'react';
import { Message } from './types';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { format } from "date-fns";
import MessageStatusBadge from './MessageStatusBadge';

interface SentMessageCardProps {
  message: Message;
  onDelete: (messageId: string) => Promise<void>;
}

const SentMessageCard = ({ message, onDelete }: SentMessageCardProps) => {
  return (
    <div className="border rounded-lg p-4 bg-card">
      <div className="flex items-start gap-4">
        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarImage src={message.artist?.image || ''} alt={message.artist?.name || 'Artist'} />
          <AvatarFallback>{message.artist?.name?.substring(0, 2) || 'AR'}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{message.artist?.name || 'Unknown Artist'}</h3>
              <p className="text-sm text-muted-foreground">
                {format(new Date(message.created_at), 'PPP p')}
              </p>
            </div>
            
            <MessageStatusBadge status={message.status} />
          </div>
          
          <div className="mt-3 p-3 bg-muted rounded-md">
            <p>{message.message}</p>
          </div>
          
          {message.replied_at && (
            <div className="mt-3">
              <p className="text-sm text-muted-foreground">
                Replied on {format(new Date(message.replied_at), 'PPP p')}
              </p>
            </div>
          )}
          
          <div className="mt-3 flex justify-between items-center">
            <p className="text-sm">
              Credit: ${message.credit_amount?.toFixed(2)}
            </p>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="text-destructive hover:bg-destructive/10"
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

export default SentMessageCard;
