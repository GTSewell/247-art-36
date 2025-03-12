
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Package, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

// Define a type for purchase items
interface PurchaseItem {
  id: string;
  title: string;
  artist: string;
  price: string;
  date: string;
  image: string;
  status: "delivered" | "processing" | "shipped";
}

const CollectorPurchases: React.FC = () => {
  const navigate = useNavigate();
  
  // Sample purchase items for demonstration
  const samplePurchases: PurchaseItem[] = [
    {
      id: "P1001",
      title: "Neon Dreams",
      artist: "Emily",
      price: "$120.00",
      date: "May 12, 2024",
      image: "/lovable-uploads/0a46328d-bced-45e2-8877-d5c6914ff44c.png",
      status: "delivered"
    },
    {
      id: "P1002",
      title: "Urban Serenity",
      artist: "Lucas",
      price: "$85.50",
      date: "April 29, 2024",
      image: "/lovable-uploads/35c806e4-6bf2-4984-9996-9c61c1d74879.png",
      status: "shipped"
    },
    {
      id: "P1003",
      title: "Abstract Thoughts",
      artist: "Yuki",
      price: "$175.00",
      date: "April 15, 2024",
      image: "/lovable-uploads/5d0599b7-4561-43b3-af8b-550a349ed4fc.png",
      status: "processing"
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
  
  // Should we show sample purchases? For demo purposes, always true
  const hasPurchases = true;
  
  return (
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
                        onClick={() => navigate(`/order/${purchase.id}`)}
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
  );
};

export default CollectorPurchases;
