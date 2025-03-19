
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Message } from './types';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Trash2, MessageSquare, Loader2 } from "lucide-react";
import { format } from "date-fns";
import MessageStatusBadge from './MessageStatusBadge';
import CountdownTimer from './CountdownTimer';

interface SentMessageCardProps {
  message: Message;
  onDelete: (messageId: string) => Promise<void>;
}

const SentMessageCard = ({ message, onDelete }: SentMessageCardProps) => {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent event bubbling
    e.stopPropagation(); // Ensure the event doesn't trigger other handlers
    
    if (isDeleting) return; // Prevent multiple clicks
    
    try {
      setIsDeleting(true);
      await onDelete(message.id);
      // The component should unmount when the message is removed from the list
      // If it doesn't unmount, we still want to reset the state after a timeout
      setTimeout(() => {
        setIsDeleting(false);
      }, 5000); // Safety timeout in case component doesn't unmount
    } catch (error) {
      console.error('Error deleting message:', error);
      setIsDeleting(false);
    }
  };
  
  return (
    <div className="border rounded-lg p-4 bg-card shadow">
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
            
            <div className="flex flex-col items-end gap-1">
              <MessageStatusBadge status={message.status} />
              {message.status === 'pending' && (
                <CountdownTimer createdAt={message.created_at} expiryHours={24} />
              )}
            </div>
          </div>
          
          <div className="mt-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
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
            
            <div className="space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-destructive hover:bg-destructive/10"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Deleting</>
                ) : (
                  <><Trash2 className="h-4 w-4 mr-1" /> Delete</>
                )}
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate(`/messages/${message.id}`)}
                disabled={isDeleting}
              >
                <MessageSquare className="h-4 w-4 mr-1" /> View Thread
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SentMessageCard;
