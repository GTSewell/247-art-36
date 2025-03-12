
import React from "react";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PurchaseItemCard from "./PurchaseItemCard";
import { PurchaseItem } from "./types";

interface PurchasesListProps {
  purchases: PurchaseItem[];
  onShowDetails: (purchase: PurchaseItem) => void;
}

const PurchasesList: React.FC<PurchasesListProps> = ({ purchases, onShowDetails }) => {
  const navigate = useNavigate();
  const hasPurchases = purchases.length > 0;

  if (!hasPurchases) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Package className="mx-auto h-12 w-12 mb-4 text-gray-400" />
        <p>You haven't made any purchases yet</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/store')}>
          Browse Store
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {purchases.map((purchase) => (
        <PurchaseItemCard 
          key={purchase.id} 
          purchase={purchase} 
          onShowDetails={onShowDetails} 
        />
      ))}
      <Button variant="outline" className="w-full" onClick={() => navigate('/store')}>
        Browse More Art
      </Button>
    </div>
  );
};

export default PurchasesList;
