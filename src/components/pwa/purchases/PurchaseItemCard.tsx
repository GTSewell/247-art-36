
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PurchaseItem, getStatusColor } from "./types";

interface PurchaseItemCardProps {
  purchase: PurchaseItem;
  onShowDetails: (purchase: PurchaseItem) => void;
}

const PurchaseItemCard: React.FC<PurchaseItemCardProps> = ({ purchase, onShowDetails }) => {
  return (
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
              onClick={() => onShowDetails(purchase)}
            >
              <ExternalLink className="mr-1 h-3 w-3" />
              Details
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PurchaseItemCard;
