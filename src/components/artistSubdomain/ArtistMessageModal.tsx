
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';
import { Artist } from '@/data/types/artist';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { fetchArtistByUserId } from '@/components/messages/api/messageApi';

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
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const { user } = useAuth();

  const handleSendMessage = async () => {
    if (!message.trim()) {
      toast.error("Message cannot be empty");
      return;
    }

    if (!user) {
      toast.error("You must be logged in to send messages");
      return;
    }

    try {
      setSending(true);
      
      // For artists table, the ID is numeric
      // But for messages_247 table, artist_id is a UUID
      let artistUuid;
      
      if (artist.user_id) {
        // If artist has a user_id, use that directly
        artistUuid = artist.user_id;
        console.log("Using artist's user_id as artistUuid:", artistUuid);
      } else {
        try {
          // First attempt to fetch the artist's user_id from the database
          const { data: artistData, error: lookupError } = await supabase
            .from('artists')
            .select('user_id')
            .eq('id', artist.id)
            .single();
            
          if (lookupError || !artistData?.user_id) {
            throw new Error("Artist user_id not found");
          }
          
          artistUuid = artistData.user_id;
          console.log("Found artist user_id from database:", artistUuid);
        } catch (lookupError) {
          console.error("Error looking up artist user_id:", lookupError);
          toast.error("Unable to send message to this artist at this time");
          setSending(false);
          return;
        }
      }
      
      if (!artistUuid) {
        console.error("No valid artist UUID found");
        toast.error("This artist doesn't have a valid user account to receive messages");
        setSending(false);
        return;
      }
      
      // Insert the message into the database
      const { error } = await supabase
        .from('messages_247')
        .insert({
          message: message.trim(),
          sender_id: user.id,
          artist_id: artistUuid,
          status: 'pending',
          credit_amount: 5.00
        });
        
      if (error) throw error;
      
      toast.success(`Your message has been sent to ${artist.name}`, {
        description: "If they reply within 24 hours, you'll get $5 credit towards their art"
      });
      
      setMessage('');
      onOpenChange(false);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  // Add event handler to stop keyboard events from propagating when modal is open
  useEffect(() => {
    if (!open) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent arrow keys from propagating outside the modal
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || 
          e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.stopPropagation();
      }
    };
    
    // Add the event listener to the document
    document.addEventListener('keydown', handleKeyDown, true); // true for capture phase
    
    // Clean up when component unmounts or modal closes
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            247 Artist Messaging
          </DialogTitle>
          <DialogDescription>
            Direct messaging with artists
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-8 text-center">
          <div className="flex justify-center">
            <Zap className="h-16 w-16 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">Coming Soon</h3>
          <p className="text-muted-foreground">
            247 artist messaging feature is currently in development. Stay tuned for updates!
          </p>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full">
            Got it
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ArtistMessageModal;
