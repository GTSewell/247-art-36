
import React, { useEffect } from 'react';
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
    toast.success(`Your $5 will be sent to ${artist.name}`, {
      description: "If they reply within 24 hours, you'll get $5 credit towards their art"
    });
    onOpenChange(false);
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
            // Stop propagation of keydown events directly on the textarea
            onKeyDown={(e) => {
              if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || 
                  e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                e.stopPropagation();
              }
            }}
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
