
import React, { useState } from 'react';
import { Message } from './types';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";

interface MessageThreadItemProps {
  message: Message;
  isOriginal?: boolean;
  onDelete: (messageId: string) => Promise<void>;
}

const MessageThreadItem = ({ message, isOriginal = false, onDelete }: MessageThreadItemProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useAuth();
  
  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isDeleting) return;
    
    try {
      setIsDeleting(true);
      await onDelete(message.id);
      // Safety timeout to reset state if component doesn't unmount
      setTimeout(() => {
        setIsDeleting(false);
      }, 5000);
    } catch (error) {
      console.error('Error deleting message:', error);
      setIsDeleting(false);
    }
  };
  
  // Determine who the message is from
  const isFromArtist = message.sender_id === message.artist_id;
  const isCurrentUserMessage = message.sender?.isCurrentUser;
  
  // Get the correct sender name
  const senderName = message.sender?.email || 'Unknown Sender';
  
  // Get avatar image
  const avatarImage = isCurrentUserMessage
    ? user?.user_metadata?.avatar_url || ''
    : message.artist?.image || '';
  
  // Get avatar initials
  const avatarInitials = senderName === 'You' ? 'YO' : senderName.substring(0, 2).toUpperCase();
  
  return (
    <div className={`p-4 border rounded-lg ${isOriginal ? 'bg-muted/50 shadow-md' : 'bg-card shadow-md'} border-gray-300 dark:border-gray-700`}>
      <div className="flex gap-4">
        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarImage src={avatarImage} alt={senderName} />
          <AvatarFallback>{avatarInitials}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{senderName}</h3>
                {isOriginal && (
                  <Badge variant="outline" className="text-xs">Original Message</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                To: <span className="font-medium">{message.recipient?.name || 'Unknown Recipient'}</span> • {format(new Date(message.created_at), 'PPP p')}
              </p>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 text-destructive hover:bg-destructive/10"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <><Loader2 className="h-4 w-4 animate-spin" /></>
              ) : (
                <><Trash2 className="h-4 w-4" /></>
              )}
            </Button>
          </div>
          
          <div className="mt-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
            <p className="text-sm">{message.message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageThreadItem;
