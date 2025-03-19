
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Message } from './types';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Trash2, MessageSquare, Loader2 } from "lucide-react";
import { format } from "date-fns";
import MessageStatusBadge from './MessageStatusBadge';
import CountdownTimer from './CountdownTimer';
import { useAuth } from "@/hooks/use-auth";

interface SentMessageCardProps {
  message: Message;
  onDelete: (messageId: string) => Promise<void>;
}

const SentMessageCard = ({ message, onDelete }: SentMessageCardProps) => {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useAuth();
  
  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation(); 
    
    if (isDeleting) return; 
    
    try {
      setIsDeleting(true);
      console.log(`Card handling delete for message with ID: ${message.id}`);
      
      await onDelete(message.id);
      
      setTimeout(() => {
        setIsDeleting(false);
      }, 5000);
    } catch (error) {
      console.error('Error deleting message:', error);
      setIsDeleting(false);
    }
  };
  
  // Get avatar based on current user
  const userAvatar = user?.user_metadata?.avatar_url || '';
  
  // Get artist information
  const artistName = message.artist?.name || 'Unknown Artist';
  
  return (
    <div className="border rounded-lg p-4 bg-card shadow-md border-gray-300 dark:border-gray-700">
      <div className="flex items-start gap-4">
        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarImage src={userAvatar} alt="You" />
          <AvatarFallback>YO</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">You</h3>
              <p className="text-sm text-muted-foreground">
                To: <span className="font-medium">{artistName}</span> • {format(new Date(message.created_at), 'PPP p')}
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
