
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare } from "lucide-react";
import { Collector } from "./types";

interface CollectorMessageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCollectors: Collector[];
}

const CollectorMessageModal: React.FC<CollectorMessageModalProps> = ({
  open,
  onOpenChange,
  selectedCollectors,
}) => {
  const { toast } = useToast();
  const [message, setMessage] = useState(
    "Thank you for purchasing my art 🙏\n\nRegards,\n[Artist Name]"
  );

  const handleSendMessages = () => {
    // In a real application, this would send emails to all selected collectors
    toast({
      title: "Messages Sent",
      description: `Your message has been sent to ${selectedCollectors.length} collector(s).`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Message to Collectors
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Sending to {selectedCollectors.length} collector{selectedCollectors.length !== 1 ? 's' : ''}:
            </p>
            <div className="text-sm bg-muted p-2 rounded-md max-h-20 overflow-y-auto">
              {selectedCollectors.map((collector) => (
                <div key={collector.id} className="flex justify-between">
                  <span>{collector.name}</span>
                  <span className="text-muted-foreground">{collector.email}</span>
                </div>
              ))}
            </div>
          </div>
          
          <Textarea
            placeholder="Write your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
            className="resize-none"
          />
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSendMessages} className="bg-zap-blue text-white hover:bg-zap-blue/90">
            Send to All (Individually)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CollectorMessageModal;
