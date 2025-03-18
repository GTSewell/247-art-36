
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { Artist } from '@/data/types/artist';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface ArtistMessageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  artist: Artist;
}

const ArtistMessageModal: React.FC<ArtistMessageModalProps> = ({
  open,
  onOpenChange,
  artist
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = React.useState('');
  const [isSending, setIsSending] = React.useState(false);

  const handleSendMessage = async () => {
    if (!user) {
      toast.error("Please sign in to send a message");
      onOpenChange(false);
      navigate('/auth');
      return;
    }

    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    setIsSending(true);

    try {
      // Get artist user ID from the artist object
      // Use the user_id if available, otherwise fallback to the id as string
      const artistUserId = artist.user_id || artist.id.toString();

      // Create expiration date (24 hours from now)
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      // Insert message
      const { data: messageData, error: messageError } = await supabase
        .from('messages_247')
        .insert({
          sender_id: user.id,
          artist_id: artistUserId,
          message: message,
        })
        .select()
        .single();

      if (messageError) throw messageError;

      // Create credit
      const { error: creditError } = await supabase
        .from('message_credits')
        .insert({
          user_id: user.id,
          artist_id: artistUserId,
          expires_at: expiresAt.toISOString(),
          message_id: messageData.id
        });

      if (creditError) throw creditError;

      toast.success(`Your $5 will be sent to ${artist.name}`, {
        description: "If they reply within 24 hours, you'll get $5 credit towards their art"
      });
      
      setMessage('');
      onOpenChange(false);
      
      // Optionally redirect to the messages page
      navigate('/messages247');
      
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Message {artist.name}
          </DialogTitle>
          <DialogDescription>
            Send a direct message to this artist for a 24-hour response. See details below on how 247 messaging works.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-medium text-sm mb-2">How 247 Messaging works:</h3>
            <ul className="text-sm space-y-2 list-disc pl-5">
              <li>Pay $5 to send a message to this artist</li>
              <li>Get a reply in 24 hours, you get $5 credit on their art/prints</li>
              <li>No reply? You can spend your credit on any artist</li>
              <li>Credit must be spent before end of current exhibition</li>
            </ul>
          </div>
          
          <textarea 
            className="w-full p-3 border rounded-md h-32 resize-none"
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSendMessage} 
            className="bg-blue-500 hover:bg-blue-600 text-white"
            disabled={isSending}
          >
            {isSending ? 'Sending...' : 'Pay $5 & Send Message'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ArtistMessageModal;
