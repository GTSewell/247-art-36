
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag } from "lucide-react";

const SalesBreakdownCard: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ShoppingBag className="mr-2 h-5 w-5" />
          Sales Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Original Art</h3>
              <div className="flex justify-between mt-2">
                <div>
                  <p className="text-sm text-gray-500">Revenue</p>
                  <p className="text-xl font-bold">$2,650</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Units</p>
                  <p className="text-xl font-bold">2</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Print</h3>
              <div className="flex justify-between mt-2">
                <div>
                  <p className="text-sm text-gray-500">Revenue</p>
                  <p className="text-xl font-bold">$770</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Units</p>
                  <p className="text-xl font-bold">33</p>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t">
              <h3 className="text-lg font-semibold">Total Revenue</h3>
              <p className="text-2xl font-bold mt-1">$3,420</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Most Popular</h3>
            <ol className="list-decimal pl-5 space-y-2">
              <li className="text-sm">Abstract 1 Fine art print <span className="font-semibold">[20]</span></li>
              <li className="text-sm">Abstract 1 T-shirt <span className="font-semibold">[8]</span></li>
              <li className="text-sm">Abstract 2 Art Poster <span className="font-semibold">[5]</span></li>
            </ol>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesBreakdownCard;
