
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

const STPSetsCard: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart3 className="mr-2 h-5 w-5" />
          STP Sets
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <h3 className="text-lg font-semibold">Stickers</h3>
            <p className="text-2xl font-bold mt-1">3</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">T-shirts</h3>
            <p className="text-2xl font-bold mt-1">8</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Prints</h3>
            <p className="text-2xl font-bold mt-1">20</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default STPSetsCard;
