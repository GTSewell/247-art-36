
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Message } from './types';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Trash2, MessageSquare, Loader2 } from "lucide-react";
import { format } from "date-fns";
import MessageStatusBadge from './MessageStatusBadge';
import CountdownTimer from './CountdownTimer';
import MessageReplyForm from './MessageReplyForm';
import { useAuth } from "@/hooks/use-auth";

interface ReceivedMessageCardProps {
  message: Message;
  onReply: (messageId: string, replyText: string) => Promise<void>;
  onDelete: (messageId: string) => Promise<void>;
}

const ReceivedMessageCard = ({ message, onReply, onDelete }: ReceivedMessageCardProps) => {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useAuth();
  
  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isDeleting) return;
    
    try {
      setIsDeleting(true);
      console.log(`Deleting received message with ID: ${message.id}`);
      await onDelete(message.id);
      setTimeout(() => {
        setIsDeleting(false);
      }, 5000);
    } catch (error) {
      console.error('Error deleting message:', error);
      setIsDeleting(false);
    }
  };
  
  // Get sender information
  const senderName = message.sender?.email || 'Unknown Sender';
  const isFromCurrentUser = message.sender?.isCurrentUser;
  
  // Get artist information
  const artistName = message.artist?.name || 'Unknown Artist';
  const artistAvatar = message.artist?.image || '';
  
  // Get avatar initials
  const avatarInitials = senderName === 'You' ? 'YO' : senderName.substring(0, 2).toUpperCase();
  
  return (
    <div className="border rounded-lg p-4 bg-card shadow-md border-gray-300 dark:border-gray-700">
      <div className="flex items-start gap-4">
        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarImage src={artistAvatar} alt={senderName} />
          <AvatarFallback>{avatarInitials}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{senderName}</h3>
              <p className="text-sm text-muted-foreground">
                To: <span className="font-medium">{message.recipient?.name || 'You'}</span> • {format(new Date(message.created_at), 'PPP p')}
              </p>
            </div>
            
            <MessageStatusBadge status={message.status} />
          </div>
          
          <div className="mt-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
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
          )}
        </div>
      </div>
    </div>
  );
};

export default ReceivedMessageCard;
