
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const STPSetsCard: React.FC = () => {
  const isMobile = useIsMobile();
  
  // Mock data - in a real app this would come from an API
  const stpPacksSold = 10;
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
        <div className="flex justify-between">
          <span className="font-bold">{initialCommissionRate}%</span>
          <span className="font-bold">0%</span>
        </div>
        
        {/* Segmented progress bar container */}
        <div className="relative h-12 w-full overflow-hidden rounded-lg border border-gray-300">
          {/* Segments grid */}
          <div className="absolute inset-0 grid grid-cols-25 gap-1 p-1">
            {segments}
          </div>
          
          {/* Commission indicator */}
          <div 
            className="absolute top-full left-0 transform -translate-y-1/2 bg-[#00baef] text-white font-bold rounded px-2 py-1 text-xs"
            style={{ 
              left: `${(stpPacksSold / totalSegments) * 100}%`, 
              transform: `translateX(-50%) translateY(-50%)` 
            }}
          >
            {currentCommissionRate}%
          </div>
        </div>
        
        <div className="text-sm text-gray-500 mt-4">
          For every STP Collector Pack sold, your gallery commission decreases by 1%.
        </div>
      </CardContent>
    </Card>
  );
};

export default STPSetsCard;
