
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { Artist } from '@/data/types/artist';
import { toast } from 'sonner';

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
  const handleSendMessage = () => {
    toast.success(`Your $5 message will be sent to ${artist.name}`, {
      description: "If they reply within 24 hours, you'll get $5 off your next purchase"
    });
    onOpenChange(false);
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
            Send a direct message to this artist with guaranteed 24-hour response
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-medium text-sm mb-2">How 247 Messaging works:</h3>
            <ul className="text-sm space-y-2 list-disc pl-5">
              <li>Pay $5 to send a message to this artist</li>
              <li>If they respond within 24 hours, you'll get $5 credit toward any purchase from them</li>
              <li>If they don't respond in time, you'll get a full refund</li>
              <li>Guaranteed artist response or your money back</li>
            </ul>
          </div>
          
          <textarea 
            className="w-full p-3 border rounded-md h-32 resize-none"
            placeholder="Type your message here..."
          />
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSendMessage} className="bg-blue-500 hover:bg-blue-600 text-white">
            Pay $5 & Send Message
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ArtistMessageModal;
