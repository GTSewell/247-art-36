import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface SizeInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const SizeInput: React.FC<SizeInputProps> = ({ value, onChange, className }) => {
  const [unit, setUnit] = useState<'cm' | 'inch'>('cm');
  
  // Parse existing value to extract dimensions
  const parseValue = (val: string) => {
    if (!val) return { length: '', width: '', height: '' };
    
    const match = val.match(/(\d+(?:\.\d+)?)\s*(?:cm|inch)?\s*x\s*(\d+(?:\.\d+)?)\s*(?:cm|inch)?(?:\s*x\s*(\d+(?:\.\d+)?)\s*(?:cm|inch)?)?/);
    if (match) {
      return {
        length: match[1] || '',
        width: match[2] || '',
        height: match[3] || ''
      };
    }
    return { length: '', width: '', height: '' };
  };

  const [dimensions, setDimensions] = useState(() => parseValue(value));

  const updateValue = (newDimensions: typeof dimensions) => {
    setDimensions(newDimensions);
    
    const { length, width, height } = newDimensions;
    if (!length && !width && !height) {
      onChange('');
      return;
    }
    
    let result = '';
    if (length && width) {
      result = `${length}${unit} x ${width}${unit}`;
      if (height) {
        result += ` x ${height}${unit}`;
      }
    }
    onChange(result);
  };

  const convertUnit = (value: string, from: 'cm' | 'inch', to: 'cm' | 'inch') => {
    if (!value || from === to) return value;
    const num = parseFloat(value);
    if (isNaN(num)) return value;
    
    if (from === 'cm' && to === 'inch') {
      return (num / 2.54).toFixed(2);
    } else if (from === 'inch' && to === 'cm') {
      return (num * 2.54).toFixed(2);
    }
    return value;
  };

  const handleUnitChange = (newUnit: 'cm' | 'inch') => {
    if (newUnit === unit) return;
    
    const convertedDimensions = {
      length: convertUnit(dimensions.length, unit, newUnit),
      width: convertUnit(dimensions.width, unit, newUnit),
      height: convertUnit(dimensions.height, unit, newUnit)
    };
    
    setUnit(newUnit);
    updateValue(convertedDimensions);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Dimensions</Label>
        <div className="flex rounded-md border">
          <Button
            type="button"
            variant={unit === 'cm' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleUnitChange('cm')}
            className="rounded-r-none border-r"
          >
            cm
          </Button>
          <Button
            type="button"
            variant={unit === 'inch' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleUnitChange('inch')}
            className="rounded-l-none"
          >
            inch
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        <div>
          <Label className="text-xs text-muted-foreground">Length</Label>
          <Input
            placeholder="0"
            value={dimensions.length}
            onChange={(e) => updateValue({ ...dimensions, length: e.target.value })}
            className="text-center"
          />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Width</Label>
          <Input
            placeholder="0"
            value={dimensions.width}
            onChange={(e) => updateValue({ ...dimensions, width: e.target.value })}
            className="text-center"
          />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Height</Label>
          <Input
            placeholder="0"
            value={dimensions.height}
            onChange={(e) => updateValue({ ...dimensions, height: e.target.value })}
            className="text-center"
          />
        </div>
      </div>
      
      <div className="text-xs text-muted-foreground text-center">
        {dimensions.length && dimensions.width ? (
          `${dimensions.length}${unit} x ${dimensions.width}${unit}${dimensions.height ? ` x ${dimensions.height}${unit}` : ''}`
        ) : (
          'Enter dimensions above'
        )}
      </div>
    </div>
  );
};

export default SizeInput;