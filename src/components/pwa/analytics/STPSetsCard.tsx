
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const STPSetsCard: React.FC = () => {
  const isMobile = useIsMobile();
  
  // Mock data - in a real app this would come from an API
  const stpPacksSold = 11;
  const initialCommissionRate = 25;
  const commissionReductionPerPack = 1;
  const totalSegments = 25;
  
  // Calculate current commission rate
  const commissionReduction = Math.min(stpPacksSold * commissionReductionPerPack, initialCommissionRate);
  const currentCommissionRate = initialCommissionRate - commissionReduction;
  
  // Function to determine segment color based on index
  const getSegmentColor = (index: number): string => {
    if (index >= stpPacksSold) return "bg-gray-300"; // Unsold segments are gray
    if (index < 7) return "bg-zap-red"; // First 7 segments red
    if (index < 15) return "bg-zap-yellow"; // Next 8 segments yellow
    return "bg-[#05a732]"; // Remaining segments green (Zap Green)
  };
  
  // Generate all 25 segments
  const segments = Array.from({ length: totalSegments }, (_, i) => (
    <div 
      key={i} 
      className={cn(
        "h-full rounded-sm transition-colors duration-300",
        getSegmentColor(i)
      )}
    />
  ));
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart3 className="mr-2 h-5 w-5" />
          STP Collecter Packs Sold: {stpPacksSold}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Commission percentage indicator at top */}
        <div className="relative w-full mb-1">
          <div className="flex justify-between mb-1">
            <span className="font-bold">{initialCommissionRate}%</span>
            <span className="font-bold">0%</span>
          </div>
          
          {/* Horizontal line with percentage indicator */}
          <div className="relative w-full h-0.5 bg-gray-300 my-2">
            {/* Current commission percentage marker */}
            <div 
              className="absolute top-1/2 transform -translate-y-1/2 w-auto"
              style={{ 
                left: `${(stpPacksSold / totalSegments) * 100}%`,
              }}
            >
              <div className="bg-zap-blue text-white text-xs font-bold px-2 py-0.5 rounded transform -translate-x-1/2 whitespace-nowrap">
                {currentCommissionRate}%
              </div>
            </div>
          </div>
        </div>
        
        {/* Segmented progress bar container */}
        <div className="relative h-10 w-full overflow-hidden rounded-lg border border-gray-300 mb-2">
          {/* Segments grid */}
          <div className="absolute inset-0 grid grid-cols-25 gap-1 p-1">
            {segments}
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            For every STP Collector Pack sold, your gallery commission decreases by 1%.
          </div>
          
          {/* Current gallery commission label */}
          <div className="bg-zap-blue text-white text-xs font-bold px-3 py-1.5 rounded whitespace-nowrap">
            Current gallery commission
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default STPSetsCard;
