
import React from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { PurchaseItem, getStatusColor } from "./types";
import { toast } from "sonner";

interface PurchaseDetailsModalProps {
  selectedPurchase: PurchaseItem | null;
  onClose: () => void;
}

const PurchaseDetailsModal: React.FC<PurchaseDetailsModalProps> = ({ 
  selectedPurchase, 
  onClose 
}) => {
  // Function to handle messaging 247
  const handleMessage = () => {
    if (selectedPurchase) {
      toast.success(`Message sent to 247 about "${selectedPurchase.title}"`);
      onClose();
    }
  };
  
  // Function to handle tracking shipment
  const handleTrackShipment = () => {
    if (selectedPurchase) {
      toast.success(`Tracking information for order #${selectedPurchase.id} opened`);
      // In a real app, this would open tracking information
      // For demo purposes, we'll just show a success toast
    }
  };

  if (!selectedPurchase) return null;

  return (
    <Dialog open={!!selectedPurchase} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Order Details #{selectedPurchase.id}</DialogTitle>
          <DialogDescription>
            Purchase information for {selectedPurchase.title}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="flex flex-col space-y-4">
            <div className="relative h-40 w-full sm:h-52">
              <img
                src={selectedPurchase.image}
                alt={selectedPurchase.title}
                className="w-full h-full object-cover rounded-md"
              />
            </div>
            
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between">
                <h3 className="font-bold text-lg">{selectedPurchase.title}</h3>
                <Badge className={`${getStatusColor(selectedPurchase.status)} text-white`}>
                  {selectedPurchase.status.charAt(0).toUpperCase() + selectedPurchase.status.slice(1)}
                </Badge>
              </div>
              <p className="text-sm">by {selectedPurchase.artist}</p>
              <p className="text-sm text-gray-600">{selectedPurchase.description}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-2 border-t border-b py-3 my-1">
              <div>
                <p className="text-sm text-gray-500">Order Number</p>
                <p className="font-medium">{selectedPurchase.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Purchase Date</p>
                <p className="font-medium">{selectedPurchase.date}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Price</p>
                <p className="font-bold">{selectedPurchase.price}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Shipping</p>
                <p className="font-medium">Included</p>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="sm:justify-between flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Close
          </Button>
          <div className="flex flex-col sm:flex-row gap-2">
            {selectedPurchase.status === "shipped" && (
              <Button 
                onClick={handleTrackShipment}
                className="bg-amber-500 hover:bg-amber-600"
              >
                <Truck className="mr-2 h-4 w-4" />
                Track Shipping
              </Button>
            )}
            <Button 
              onClick={handleMessage}
              className="bg-blue-500 hover:bg-blue-600"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Message 247
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseDetailsModal;
