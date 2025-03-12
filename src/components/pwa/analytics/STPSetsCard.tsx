
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface STPSetsCardProps {
  onAction: (actionName?: string) => boolean;
  demoMode?: boolean;
  demoData?: {
    completionPercentage: number;
    packCount: number;
    productCount: number;
    nextAction: string;
  };
}

const STPSetsCard: React.FC<STPSetsCardProps> = ({ onAction, demoMode, demoData }) => {
  // Use demo data when in demo mode, otherwise use default values
  const completionPercentage = demoMode && demoData ? demoData.completionPercentage : 25;
  const packCount = demoMode && demoData ? demoData.packCount : 1;
  const productCount = demoMode && demoData ? demoData.productCount : 4;
  const nextAction = demoMode && demoData ? demoData.nextAction : "Set up your first STP pack";

  const handleCreateSTPClick = () => {
    // Check if we should block the action
    if (onAction("Create new STP pack")) {
      return; // Action was blocked
    }
    
    // If we get here, the action is allowed
    console.log("Create new STP pack clicked");
    // Add actual functionality here
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">STP Sets</CardTitle>
        <CardDescription>
          Your Straight-To-Print sets progress
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Progress value={completionPercentage} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              Your STP sets are {completionPercentage}% complete
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-semibold">{packCount}</p>
              <p className="text-muted-foreground">STP Packs</p>
            </div>
            <div>
              <p className="font-semibold">{productCount}</p>
              <p className="text-muted-foreground">Total Products</p>
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium">Next action</p>
            <p className="text-sm text-muted-foreground">{nextAction}</p>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={handleCreateSTPClick}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Create New STP Pack
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default STPSetsCard;
