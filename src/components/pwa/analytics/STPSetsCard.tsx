
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Plus } from "lucide-react";

interface STPSetsCardProps {
  onAction?: () => boolean;
}

const STPSetsCard: React.FC<STPSetsCardProps> = ({ onAction }) => {
  const handleAddSet = () => {
    if (onAction && onAction()) return;
    // Normal add set logic would go here
  };

  // Demo account has 2 STP sets
  const demoMode = localStorage.getItem('demoSession') === 'active';
  const setCount = demoMode ? 2 : 0;

  if (setCount === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="mr-2 h-5 w-5" />
            STP Sets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Package className="mx-auto h-12 w-12 mb-4 text-gray-400" />
            <p className="text-gray-500">You haven't created any STP sets yet</p>
            <Button onClick={handleAddSet} className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Create STP Set
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Package className="mr-2 h-5 w-5" />
            STP Sets
          </div>
          <Button size="sm" onClick={handleAddSet}>
            <Plus className="mr-2 h-4 w-4" />
            Create New
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {demoMode && (
            <>
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold">Abstract Collection</h3>
                  <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">Live</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">5 products, $770 revenue</p>
                <div className="flex justify-end mt-2 space-x-2">
                  <Button variant="outline" size="sm" onClick={handleAddSet}>View</Button>
                  <Button variant="outline" size="sm" onClick={handleAddSet}>Edit</Button>
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold">Limited Edition Prints</h3>
                  <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Draft</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">3 products, Not published</p>
                <div className="flex justify-end mt-2 space-x-2">
                  <Button variant="outline" size="sm" onClick={handleAddSet}>View</Button>
                  <Button variant="outline" size="sm" onClick={handleAddSet}>Edit</Button>
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default STPSetsCard;
