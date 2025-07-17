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

interface MultiTagSelectorProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  label: string;
  className?: string;
}

const MultiTagSelector: React.FC<MultiTagSelectorProps> = ({
  value,
  onChange,
  options,
  label,
  className
}) => {
  const [open, setOpen] = useState(false);
  const [customValue, setCustomValue] = useState('');

  // Parse the comma-separated value into an array
  const selectedValues = value ? value.split(',').map(v => v.trim()).filter(v => v) : [];

  const toggleValue = (selectedValue: string) => {
    const newValues = selectedValues.includes(selectedValue)
      ? selectedValues.filter(v => v !== selectedValue)
      : [...selectedValues, selectedValue];
    
    onChange(newValues.join(', '));
  };

  const removeValue = (selectedValue: string) => {
    const newValues = selectedValues.filter(v => v !== selectedValue);
    onChange(newValues.join(', '));
  };

  const addCustomValue = () => {
    if (customValue.trim() && !selectedValues.includes(customValue.trim())) {
      const newValues = [...selectedValues, customValue.trim()];
      onChange(newValues.join(', '));
      setCustomValue('');
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Label className="text-sm font-medium">{label}</Label>
      
      {/* Selected values display */}
      <div className="flex flex-wrap gap-2">
        {selectedValues.map((selectedValue) => (
          <Badge key={selectedValue} variant="secondary" className="flex items-center gap-1">
            {selectedValue}
            <X
              className="h-3 w-3 cursor-pointer hover:text-destructive"
              onClick={() => removeValue(selectedValue)}
            />
          </Badge>
        ))}
      </div>

      {/* Value selector */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start">
            <Plus className="h-4 w-4 mr-2" />
            Add {label.toLowerCase()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-3">
            <div>
              <Label className="text-sm font-medium">Select from options</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {options.map((option) => (
                  <Button
                    key={option}
                    variant={selectedValues.includes(option) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleValue(option)}
                    className="text-xs justify-start"
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>
            
            <div>
              <Label className="text-sm font-medium">Add custom {label.toLowerCase()}</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder={`Enter custom ${label.toLowerCase()}`}
                  value={customValue}
                  onChange={(e) => setCustomValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCustomValue()}
                />
                <Button
                  size="sm"
                  onClick={addCustomValue}
                  disabled={!customValue.trim()}
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

export default MultiTagSelector;