
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TradeRequestItem } from "../types";
import { Check, X } from "lucide-react";

interface RequestDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedRequest: TradeRequestItem | null;
  onAccept: (requestId: string) => void;
  onDecline: (requestId: string) => void;
}

const RequestDetailsDialog: React.FC<RequestDetailsDialogProps> = ({
  isOpen,
  onOpenChange,
  selectedRequest,
  onAccept,
  onDecline,
}) => {
  if (!selectedRequest) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'accepted':
        return <Badge className="bg-green-500">Accepted</Badge>;
      case 'declined':
        return <Badge className="bg-red-500">Declined</Badge>;
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Trade Request Details</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <span className="text-sm font-medium">
                {selectedRequest.type === 'received' ? 'From:' : 'To:'} {selectedRequest.type === 'received' ? selectedRequest.fromArtist.name : selectedRequest.toArtist.name}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              {new Date(selectedRequest.dateCreated).toLocaleDateString()}
            </div>
          </div>
          
          <div className="bg-muted p-4 rounded-md mb-4">
            <p className="text-sm">{selectedRequest.message}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">
                {selectedRequest.type === 'received' ? 'Their Artwork:' : 'Your Artwork:'}
              </h4>
              <div className="space-y-2">
                <img 
                  src={selectedRequest.fromArtwork.image} 
                  alt={selectedRequest.fromArtwork.title} 
                  className="w-full h-36 object-cover rounded-md"
                />
                <p className="text-sm font-medium">{selectedRequest.fromArtwork.title}</p>
                <p className="text-xs text-muted-foreground">
                  Production Cost: ${selectedRequest.fromArtwork.productionCost}
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">
                {selectedRequest.type === 'received' ? 'Your Artwork:' : 'Their Artwork:'}
              </h4>
              <div className="space-y-2">
                <img 
                  src={selectedRequest.toArtwork.image} 
                  alt={selectedRequest.toArtwork.title} 
                  className="w-full h-36 object-cover rounded-md"
                />
                <p className="text-sm font-medium">{selectedRequest.toArtwork.title}</p>
                <p className="text-xs text-muted-foreground">
                  Production Cost: ${selectedRequest.toArtwork.productionCost}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex justify-between">
          <div>
            <span className="text-sm font-medium mr-2">Status:</span>
            {getStatusBadge(selectedRequest.status)}
          </div>
          
          {selectedRequest.type === 'received' && selectedRequest.status === 'pending' && (
            <div className="flex space-x-2">
              <Button 
                variant="destructive"
                size="sm"
                onClick={() => onDecline(selectedRequest.id)}
                className="h-8 px-3 text-sm"
              >
                <X className="h-4 w-4 mr-1" /> Decline
              </Button>
              <Button 
                size="sm"
                className="bg-green-500 hover:bg-green-600 h-8 px-3 text-sm"
                onClick={() => onAccept(selectedRequest.id)}
              >
                <Check className="h-4 w-4 mr-1" /> Accept
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RequestDetailsDialog;
