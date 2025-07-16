import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface ColorTagSelectorProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  className?: string;
}

const ColorTagSelector: React.FC<ColorTagSelectorProps> = ({
  value,
  onChange,
  options,
  className
}) => {
  const [open, setOpen] = useState(false);
  const [customColor, setCustomColor] = useState('');

  // Parse the comma-separated value into an array
  const selectedColors = value ? value.split(',').map(c => c.trim()).filter(c => c) : [];

  const toggleColor = (color: string) => {
    const newColors = selectedColors.includes(color)
      ? selectedColors.filter(c => c !== color)
      : [...selectedColors, color];
    
    onChange(newColors.join(', '));
  };

  const removeColor = (color: string) => {
    const newColors = selectedColors.filter(c => c !== color);
    onChange(newColors.join(', '));
  };

  const addCustomColor = () => {
    if (customColor.trim() && !selectedColors.includes(customColor.trim())) {
      const newColors = [...selectedColors, customColor.trim()];
      onChange(newColors.join(', '));
      setCustomColor('');
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Label className="text-sm font-medium">Colors</Label>
      
      {/* Selected colors display */}
      <div className="flex flex-wrap gap-2">
        {selectedColors.map((color) => (
          <Badge key={color} variant="secondary" className="flex items-center gap-1">
            {color}
            <X
              className="h-3 w-3 cursor-pointer hover:text-destructive"
              onClick={() => removeColor(color)}
            />
          </Badge>
        ))}
      </div>

      {/* Color selector */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start">
            <Plus className="h-4 w-4 mr-2" />
            Add colors
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-3">
            <div>
              <Label className="text-sm font-medium">Select from options</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {options.map((color) => (
                  <Button
                    key={color}
                    variant={selectedColors.includes(color) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleColor(color)}
                    className="text-xs"
                  >
                    {color}
                  </Button>
                ))}
              </div>
            </div>
            
            <div>
              <Label className="text-sm font-medium">Add custom color</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="Enter custom color"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCustomColor()}
                />
                <Button
                  size="sm"
                  onClick={addCustomColor}
                  disabled={!customColor.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ColorTagSelector;