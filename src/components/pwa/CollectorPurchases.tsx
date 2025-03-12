
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, MessageCircle, Package, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

// Define a type for purchase items
interface PurchaseItem {
  id: string;
  title: string;
  artist: string;
  price: string;
  date: string;
  image: string;
  status: "delivered" | "processing" | "shipped";
  description?: string;
}

const CollectorPurchases: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPurchase, setSelectedPurchase] = useState<PurchaseItem | null>(null);
  
  // Sample purchase items with artwork images
  const samplePurchases: PurchaseItem[] = [
    {
      id: "P1001",
      title: "Neon Dreams",
      artist: "Emily",
      price: "$120.00",
      date: "May 12, 2024",
      image: "/lovable-uploads/5d0599b7-4561-43b3-af8b-550a349ed4fc.png",
      status: "delivered",
      description: "A vibrant abstract piece exploring the interplay of neon lights and urban landscapes. This limited edition print is signed by the artist."
    },
    {
      id: "P1002",
      title: "Urban Serenity",
      artist: "Lucas",
      price: "$85.50",
      date: "April 29, 2024",
      image: "/lovable-uploads/35c806e4-6bf2-4984-9996-9c61c1d74879.png",
      status: "shipped",
      description: "A contemplative study of urban architecture and negative space. Printed on premium archival paper with lightfast inks."
    },
    {
      id: "P1003",
      title: "Abstract Thoughts",
      artist: "Yuki",
      price: "$175.00",
      date: "April 15, 2024",
      image: "/lovable-uploads/0a46328d-bced-45e2-8877-d5c6914ff44c.png",
      status: "processing",
      description: "A mixed media piece exploring the fragmentation of consciousness in the digital age. Includes certificate of authenticity."
    }
  ];
  
  // Function to get status badge color
  const getStatusColor = (status: PurchaseItem["status"]) => {
    switch (status) {
      case "delivered":
        return "bg-green-500";
      case "shipped":
        return "bg-blue-500";
      case "processing":
        return "bg-amber-500";
      default:
        return "bg-gray-500";
    }
  };
  
  // Function to open details modal
  const showDetails = (purchase: PurchaseItem) => {
    setSelectedPurchase(purchase);
  };
  
  // Function to close details modal
  const closeDetails = () => {
    setSelectedPurchase(null);
  };
  
  // Function to handle messaging the artist
  const handleMessage = () => {
    if (selectedPurchase) {
      toast.success(`Message sent to ${selectedPurchase.artist} about "${selectedPurchase.title}"`);
      closeDetails();
    }
  };
  
  // Should we show sample purchases? For demo purposes, always true
  const hasPurchases = true;
  
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ShoppingBag className="mr-2 h-5 w-5" />
            Your Purchases
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!hasPurchases ? (
            <div className="text-center py-8 text-gray-500">
              <Package className="mx-auto h-12 w-12 mb-4 text-gray-400" />
              <p>You haven't made any purchases yet</p>
              <Button variant="outline" className="mt-4" onClick={() => navigate('/store')}>
                Browse Store
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {samplePurchases.map((purchase) => (
                <Card key={purchase.id} className="overflow-hidden">
                  <div className="flex flex-col sm:flex-row">
                    <div className="relative h-40 sm:h-auto sm:w-1/4">
                      <img
                        src={purchase.image}
                        alt={purchase.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder.svg";
                        }}
                      />
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-lg">{purchase.title}</h3>
                            <p className="text-sm text-gray-500">by {purchase.artist}</p>
                          </div>
                          <Badge className={`${getStatusColor(purchase.status)} text-white`}>
                            {purchase.status.charAt(0).toUpperCase() + purchase.status.slice(1)}
                          </Badge>
                        </div>
                        <div className="mt-2 flex justify-between">
                          <p className="text-sm">Order #{purchase.id}</p>
                          <p className="text-sm">{purchase.date}</p>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-between items-center">
                        <p className="font-bold">{purchase.price}</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="ml-auto" 
                          onClick={() => showDetails(purchase)}
                        >
                          <ExternalLink className="mr-1 h-3 w-3" />
                          Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
              <Button variant="outline" className="w-full" onClick={() => navigate('/store')}>
                Browse More Art
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Purchase Details Modal */}
      <Dialog open={!!selectedPurchase} onOpenChange={(open) => !open && closeDetails()}>
        {selectedPurchase && (
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
            
            <DialogFooter className="sm:justify-between">
              <Button
                variant="outline"
                onClick={closeDetails}
              >
                Close
              </Button>
              <Button 
                onClick={handleMessage}
                className="bg-blue-500 hover:bg-blue-600"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Message Artist
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};

export default CollectorPurchases;
