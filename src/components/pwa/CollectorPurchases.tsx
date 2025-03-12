
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag } from "lucide-react";
import { PurchaseItem } from "./purchases/types";
import { samplePurchases } from "./purchases/samplePurchases";
import PurchasesList from "./purchases/PurchasesList";
import PurchaseDetailsModal from "./purchases/PurchaseDetailsModal";

const CollectorPurchases: React.FC = () => {
  const [selectedPurchase, setSelectedPurchase] = useState<PurchaseItem | null>(null);
  
  // Function to open details modal
  const showDetails = (purchase: PurchaseItem) => {
    setSelectedPurchase(purchase);
  };
  
  // Function to close details modal
  const closeDetails = () => {
    setSelectedPurchase(null);
  };
  
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
          <PurchasesList 
            purchases={samplePurchases} 
            onShowDetails={showDetails} 
          />
        </CardContent>
      </Card>
      
      <PurchaseDetailsModal 
        selectedPurchase={selectedPurchase} 
        onClose={closeDetails} 
      />
    </>
  );
};

export default CollectorPurchases;
