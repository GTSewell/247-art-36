
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { MessageSquare, ArrowRightCircle, Clock, CheckCircle, XCircle } from 'lucide-react';

const Messages247 = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<any[]>([]);
  const [credits, setCredits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
      return;
    }

    if (user) {
      fetchMessages();
      fetchCredits();
    }
  }, [user, isLoading]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      
      // Get all messages where user is either sender or artist
      const { data, error } = await supabase
        .from('messages_247')
        .select('*, sender:sender_id(*), artist:artist_id(*)')
        .or(`sender_id.eq.${user?.id},artist_id.eq.${user?.id}`)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const fetchCredits = async () => {
    try {
      const { data, error } = await supabase
        .from('message_credits')
        .select('*, message:message_id(*)')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setCredits(data || []);
    } catch (error) {
      console.error('Error fetching credits:', error);
      toast.error('Failed to load credits');
    }
  };

  const handleReply = async (messageId: string) => {
    if (!replyText.trim()) {
      toast.error('Please enter a reply message');
      return;
    }

    try {
      // Update the message status to replied
      const { error: updateError } = await supabase
        .from('messages_247')
        .update({
          status: 'replied',
          replied_at: new Date().toISOString()
        })
        .eq('id', messageId);

      if (updateError) throw updateError;

      // Update the credit to mark it as used
      const { error: creditError } = await supabase
        .from('message_credits')
        .update({
          status: 'used'
        })
        .eq('message_id', messageId);

      if (creditError) throw creditError;

      // Refresh the messages
      fetchMessages();
      fetchCredits();
      setReplyText('');
      setActiveMessageId(null);

      toast.success('Reply sent successfully');
    } catch (error) {
      console.error('Error sending reply:', error);
      toast.error('Failed to send reply');
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'replied':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Replied</Badge>;
      case 'expired':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Expired</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getCreditStatusBadge = (status: string) => {
    switch(status) {
      case 'active':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Active</Badge>;
      case 'used':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Used</Badge>;
      case 'expired':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Expired</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getTimeLeft = (expiresAt: string) => {
    const now = new Date();
    const expiration = new Date(expiresAt);
    const diff = expiration.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} left`;
    } else {
      return `${hours} hour${hours > 1 ? 's' : ''} left`;
    }
  };

  const renderReceivedMessages = () => {
    const receivedMessages = messages.filter(msg => msg.artist_id === user?.id);
    
    if (receivedMessages.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <MessageSquare className="h-12 w-12 text-gray-400 mb-2" />
          <h3 className="text-lg font-medium">No messages yet</h3>
          <p className="text-sm text-gray-500 mt-1">Messages from collectors will appear here</p>
        </div>
      );
    }
    
    return receivedMessages.map(message => (
      <Card key={message.id} className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>{message.sender?.email?.substring(0, 2).toUpperCase() || 'U'}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-base">{message.sender?.email?.split('@')[0] || 'User'}</CardTitle>
                <CardDescription className="text-xs">{formatDate(message.created_at)}</CardDescription>
              </div>
            </div>
            {getStatusBadge(message.status)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg mb-3">
            <p className="text-sm">{message.message}</p>
          </div>
          
          {message.status === 'pending' ? (
            <div className="border-t pt-3">
              <div className="flex items-center text-sm text-amber-600 mb-2">
                <Clock className="h-4 w-4 mr-1" />
                <span>Reply within 24 hours or collector gets a refund</span>
              </div>
              
              {activeMessageId === message.id ? (
                <div className="space-y-2">
                  <Input 
                    placeholder="Type your reply..." 
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                  />
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setActiveMessageId(null)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => handleReply(message.id)}
                    >
                      Send Reply
                    </Button>
                  </div>
                </div>
              ) : (
                <Button 
                  className="w-full"
                  onClick={() => setActiveMessageId(message.id)}
                >
                  Reply Now
                </Button>
              )}
            </div>
          ) : message.status === 'replied' ? (
            <div className="flex items-center text-sm text-green-600">
              <CheckCircle className="h-4 w-4 mr-1" />
              <span>You replied on {formatDate(message.replied_at)}</span>
            </div>
          ) : (
            <div className="flex items-center text-sm text-red-600">
              <XCircle className="h-4 w-4 mr-1" />
              <span>This message has expired</span>
            </div>
          )}
        </CardContent>
      </Card>
    ));
  };

  const renderSentMessages = () => {
    const sentMessages = messages.filter(msg => msg.sender_id === user?.id);
    
    if (sentMessages.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <MessageSquare className="h-12 w-12 text-gray-400 mb-2" />
          <h3 className="text-lg font-medium">No messages sent yet</h3>
          <p className="text-sm text-gray-500 mt-1">Messages you send to artists will appear here</p>
        </div>
      );
    }
    
    return sentMessages.map(message => (
      <Card key={message.id} className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>{message.artist?.email?.substring(0, 2).toUpperCase() || 'A'}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-base">To: {message.artist?.email?.split('@')[0] || 'Artist'}</CardTitle>
                <CardDescription className="text-xs">{formatDate(message.created_at)}</CardDescription>
              </div>
            </div>
            {getStatusBadge(message.status)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
            <p className="text-sm">{message.message}</p>
          </div>
          
          {message.status === 'pending' && (
            <div className="mt-3 text-sm text-amber-600 flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>Waiting for reply (24 hour window)</span>
            </div>
          )}
          
          {message.status === 'replied' && (
            <div className="mt-3 text-sm text-green-600 flex items-center">
              <CheckCircle className="h-4 w-4 mr-1" />
              <span>Artist replied on {formatDate(message.replied_at)}</span>
            </div>
          )}
          
          {message.status === 'expired' && (
            <div className="mt-3 text-sm text-red-600 flex items-center">
              <XCircle className="h-4 w-4 mr-1" />
              <span>No reply received within 24 hours</span>
            </div>
          )}
        </CardContent>
      </Card>
    ));
  };

  const renderCredits = () => {
    if (credits.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <ArrowRightCircle className="h-12 w-12 text-gray-400 mb-2" />
          <h3 className="text-lg font-medium">No credits yet</h3>
          <p className="text-sm text-gray-500 mt-1">Your message credits will appear here</p>
        </div>
      );
    }
    
    return credits.map(credit => (
      <Card key={credit.id} className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-base">${credit.amount} Credit</CardTitle>
              <CardDescription className="text-xs">Created on {formatDate(credit.created_at)}</CardDescription>
            </div>
            {getCreditStatusBadge(credit.status)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Artist:</span>
              <span className="font-medium">{credit.message?.artist?.email?.split('@')[0] || 'Artist'}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Expires:</span>
              <span className="font-medium">{getTimeLeft(credit.expires_at)}</span>
            </div>
            
            {credit.status === 'active' && (
              <div className="text-sm text-blue-600 mt-2">
                This credit can be used on your next purchase from this artist
              </div>
            )}
            
            {credit.status === 'used' && (
              <div className="text-sm text-green-600 mt-2">
                This credit has been applied to a purchase
              </div>
            )}
            
            {credit.status === 'expired' && (
              <div className="text-sm text-red-600 mt-2">
                This credit has expired
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    ));
  };

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center mb-6">
        <MessageSquare className="h-6 w-6 mr-3" />
        <h1 className="text-2xl font-bold">247 Messages</h1>
      </div>
      
      <Tabs defaultValue="received">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="received">Received</TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
          <TabsTrigger value="credits">Credits</TabsTrigger>
        </TabsList>

        <TabsContent value="received" className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg mb-4">
            <h2 className="font-medium text-blue-700 dark:text-blue-300 mb-1">Artist Messages</h2>
            <p className="text-sm text-blue-600 dark:text-blue-400">
              Messages sent by collectors appear here. Reply within 24 hours to give them a $5 credit on your art.
            </p>
          </div>
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : renderReceivedMessages()}
        </TabsContent>

        <TabsContent value="sent" className="space-y-4">
          <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-lg mb-4">
            <h2 className="font-medium text-green-700 dark:text-green-300 mb-1">Your Messages to Artists</h2>
            <p className="text-sm text-green-600 dark:text-green-400">
              See messages you've sent to artists and their status. If an artist replies within 24 hours, 
              you'll receive a $5 credit.
            </p>
          </div>
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : renderSentMessages()}
        </TabsContent>

        <TabsContent value="credits" className="space-y-4">
          <div className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-lg mb-4">
            <h2 className="font-medium text-purple-700 dark:text-purple-300 mb-1">Your 247 Credits</h2>
            <p className="text-sm text-purple-600 dark:text-purple-400">
              Credits earned when artists reply to your messages. Use them on your next purchase from that artist.
            </p>
          </div>
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : renderCredits()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Messages247;
