
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CollectorPurchases: React.FC = () => {
  const navigate = useNavigate();
  
  // This is a placeholder component - in a real implementation you would:
  // 1. Fetch purchase history from the database
  // 2. Display purchase items with details
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ShoppingBag className="mr-2 h-5 w-5" />
          Your Purchases
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-gray-500">
          <Package className="mx-auto h-12 w-12 mb-4 text-gray-400" />
          <p>You haven't made any purchases yet</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate('/store')}>
            Browse Store
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CollectorPurchases;
