import React from 'react';
import { Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface PriceRangeFilterProps {
  priceRange: [number, number];
  maxRange: [number, number];
  onPriceRangeChange: (value: [number, number]) => void;
}

export const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({
  priceRange,
  maxRange,
  onPriceRangeChange
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Price: ${priceRange[0]}-${priceRange[1]}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <Label className="text-sm font-medium">Price Range</Label>
          
          {/* Range Slider with dual handles */}
          <Slider
            value={priceRange}
            onValueChange={(value) => onPriceRangeChange(value as [number, number])}
            max={maxRange[1]}
            min={maxRange[0]}
            step={5}
            className="w-full"
          />
          
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};