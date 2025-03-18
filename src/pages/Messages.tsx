import React, { useState } from 'react';
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";
import { Loader2, Send, Clock, CheckCheck, AlertTriangle, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

// Types for messages
type MessageStatus = 'pending' | 'replied' | 'expired';

interface Message {
  id: string;
  message: string;
  created_at: string;
  status: MessageStatus;
  sender_id: string;
  artist_id: string;
  replied_at: string | null;
  credit_amount: number;
  artist?: {
    name: string;
    image: string;
  };
  sender?: {
    email: string;
  };
}

// Raw message type from database before processing
interface RawMessage {
  id: string;
  message: string;
  created_at: string;
  status: string;
  sender_id: string;
  artist_id: string;
  replied_at: string | null;
  credit_amount: number;
}

const Messages = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("sent");
  const navigate = useNavigate();

  // Fetch messages sent by the current user
  const { data: sentMessages, isLoading: sentLoading, refetch: refetchSent } = useQuery({
    queryKey: ['sentMessages', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      // First we need to get the artist details separately
      const { data: sentMessagesData, error: messagesError } = await supabase
        .from('messages_247')
        .select('*')
        .eq('sender_id', user.id)
        .order('created_at', { ascending: false });
        
      if (messagesError) {
        console.error('Error fetching sent messages:', messagesError);
        throw messagesError;
      }
      
      // Now process each message to add artist info
      const messagesWithArtists: Message[] = await Promise.all(
        (sentMessagesData as RawMessage[]).map(async (message) => {
          // Convert from numeric string to number for the lookup
          const artistIdAsNumber = typeof message.artist_id === 'string' 
            ? parseInt(message.artist_id, 10) 
            : message.artist_id;
          
          if (isNaN(artistIdAsNumber)) {
            return {
              ...message,
              status: message.status as MessageStatus,
              artist: { name: 'Unknown Artist', image: '' }
            };
          }
          
          const { data: artistData } = await supabase
            .from('artists')
            .select('name, image')
            .eq('id', artistIdAsNumber)
            .single();
            
          return {
            ...message,
            status: message.status as MessageStatus,
            artist: artistData || { name: 'Unknown Artist', image: '' }
          };
        })
      );
      
      return messagesWithArtists;
    },
    enabled: !!user,
  });

  // Fetch messages received by the current user (as an artist)
  const { data: receivedMessages, isLoading: receivedLoading, refetch: refetchReceived } = useQuery({
    queryKey: ['receivedMessages', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      // First get the artist ID for the current user
      const { data: artistData, error: artistError } = await supabase
        .from('artists')
        .select('id')
        .eq('user_id', user.id)
        .single();
        
      if (artistError) {
        if (artistError.code === 'PGRST116') {
          // No artist profile found, return empty array
          return [];
        }
        console.error('Error fetching artist profile:', artistError);
        throw artistError;
      }
      
      if (!artistData) return [];
      
      // Then get messages sent to this artist
      const { data: receivedMessagesData, error } = await supabase
        .from('messages_247')
        .select('*')
        .eq('artist_id', artistData.id.toString())
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching received messages:', error);
        throw error;
      }
      
      // Get sender emails - we can't query auth.users directly
      // Instead, we'll just use the sender_id and keep the UI simple
      const messagesWithSenders: Message[] = (receivedMessagesData as RawMessage[]).map(message => {
        return {
          ...message,
          status: message.status as MessageStatus,
          sender: { email: `User ${message.sender_id.substring(0, 8)}` }
        };
      });
      
      return messagesWithSenders;
    },
    enabled: !!user,
  });

  // Handle message reply
  const handleReply = async (messageId: string, replyText: string) => {
    if (!replyText.trim()) {
      toast.error("Reply cannot be empty");
      return;
    }
    
    try {
      // Update message status
      const { error } = await supabase
        .from('messages_247')
        .update({ 
          status: 'replied',
          replied_at: new Date().toISOString(),
        })
        .eq('id', messageId);
        
      if (error) throw error;
      
      // You would typically send the actual reply here
      // For now, just show a success toast
      toast.success("Reply sent successfully");
      
      // Refetch messages to update the UI
      refetchReceived();
    } catch (error) {
      console.error('Error replying to message:', error);
      toast.error("Failed to send reply");
    }
  };

  // Display loading state while auth is being checked
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <MessageSquare className="h-16 w-16 text-primary mb-4" />
        <h1 className="text-2xl font-bold mb-2">Sign in to access messages</h1>
        <p className="text-center mb-4">You need to be signed in to view your messages.</p>
        <Button onClick={() => navigate("/auth")}>Sign In</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-16 max-w-5xl">
        <h1 className="text-3xl font-bold mb-6">Your Messages</h1>
        
        <Tabs defaultValue="sent" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="sent">
              Sent Messages
              {sentMessages && sentMessages.length > 0 && (
                <Badge variant="secondary" className="ml-2">{sentMessages.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="received">
              Received Messages
              {receivedMessages && receivedMessages.length > 0 && (
                <Badge variant="secondary" className="ml-2">{receivedMessages.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="sent" className="space-y-4">
            {sentLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : sentMessages && sentMessages.length > 0 ? (
              <div className="space-y-4">
                {sentMessages.map((message) => (
                  <div key={message.id} className="border rounded-lg p-4 bg-card">
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
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 border rounded-lg">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <h3 className="text-lg font-medium mb-1">No messages sent</h3>
                <p className="text-muted-foreground">
                  You haven't sent any messages to artists yet.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="received" className="space-y-4">
            {receivedLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : receivedMessages && receivedMessages.length > 0 ? (
              <div className="space-y-4">
                {receivedMessages.map((message) => (
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
                              handleReply(message.id, replyInput.value);
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
                ))}
              </div>
            ) : (
              <div className="text-center py-10 border rounded-lg">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <h3 className="text-lg font-medium mb-1">No messages received</h3>
                <p className="text-muted-foreground">
                  You haven't received any messages from collectors yet.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

// Message status badge component
const MessageStatusBadge = ({ status }: { status: MessageStatus }) => {
  switch (status) {
    case 'replied':
      return (
        <Badge variant="outline" className="flex items-center gap-1 text-green-600 border-green-200 bg-green-50">
          <CheckCheck className="h-3 w-3" />
          Replied
        </Badge>
      );
    case 'expired':
      return (
        <Badge variant="outline" className="flex items-center gap-1 text-red-600 border-red-200 bg-red-50">
          <AlertTriangle className="h-3 w-3" />
          Expired
        </Badge>
      );
    case 'pending':
    default:
      return (
        <Badge variant="outline" className="flex items-center gap-1 text-amber-600 border-amber-200 bg-amber-50">
          <Clock className="h-3 w-3" />
          Pending
        </Badge>
      );
  }
};

export default Messages;
