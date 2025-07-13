import React, { useState } from 'react';
import { Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
          
          {/* Range Slider */}
          <Slider
            value={priceRange}
            onValueChange={(value) => onPriceRangeChange(value as [number, number])}
            max={maxRange[1]}
            min={maxRange[0]}
            step={5}
            className="w-full"
          />
          
          {/* Min/Max Input Fields */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Min Price</Label>
              <Input
                type="number"
                value={priceRange[0]}
                onChange={(e) => {
                  const newMin = Math.max(maxRange[0], Math.min(Number(e.target.value), priceRange[1] - 5));
                  onPriceRangeChange([newMin, priceRange[1]]);
                }}
                min={maxRange[0]}
                max={priceRange[1] - 5}
                step={5}
                className="h-8"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Max Price</Label>
              <Input
                type="number"
                value={priceRange[1]}
                onChange={(e) => {
                  const newMax = Math.min(maxRange[1], Math.max(Number(e.target.value), priceRange[0] + 5));
                  onPriceRangeChange([priceRange[0], newMax]);
                }}
                min={priceRange[0] + 5}
                max={maxRange[1]}
                step={5}
                className="h-8"
              />
            </div>
          </div>
          
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};