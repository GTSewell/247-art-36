
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const STPSetsCard: React.FC = () => {
  const isMobile = useIsMobile();
  
  // Mock data - in a real app this would come from an API
  const stpPacksSold = 10;
  const initialCommissionRate = 25;
  const commissionReductionPerPack = 1;
  
  // Calculate current commission rate
  const commissionReduction = Math.min(stpPacksSold * commissionReductionPerPack, initialCommissionRate);
  const currentCommissionRate = initialCommissionRate - commissionReduction;
  
  // Calculate progress percentage for the green bar
  const progressPercentage = (commissionReduction / initialCommissionRate) * 100;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart3 className="mr-2 h-5 w-5" />
          STP Collecter Packs Sold: {stpPacksSold}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span className="font-bold">{initialCommissionRate}%</span>
          <span className="font-bold">0%</span>
        </div>
        <div className="relative h-10 w-full overflow-hidden rounded-lg border border-gray-200">
          <div 
            className="absolute top-0 left-0 h-full bg-green-500 flex items-center justify-center text-black font-bold"
            style={{ width: `${progressPercentage}%` }}
          >
            {progressPercentage > 15 && (
              <span className="whitespace-nowrap px-2 truncate">
                Your Gallery Commission is now: {currentCommissionRate}%
              </span>
            )}
          </div>
          {progressPercentage <= 15 && (
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
              <span className="font-bold whitespace-nowrap px-2">
                Your Gallery Commission is now: {currentCommissionRate}%
              </span>
            </div>
          )}
        </div>
        <div className="text-sm text-gray-500 mt-2">
          For every STP Collector Pack sold, your gallery commission decreases by 1%.
        </div>
      </CardContent>
    </Card>
  );
};

export default STPSetsCard;
