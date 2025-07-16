import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface EditionInputProps {
  value: string;
  onChange: (value: string) => void;
  productCategory?: string;
  className?: string;
}

const EditionInput: React.FC<EditionInputProps> = ({
  value,
  onChange,
  productCategory,
  className
}) => {
  const isOriginal = productCategory === 'original';
  
  // If it's an original artwork, show N/A
  if (isOriginal) {
    return (
      <div className={`space-y-2 ${className}`}>
        <Label className="text-sm font-medium">Edition</Label>
        <div className="flex items-center h-10 px-3 py-2 border rounded-md bg-muted">
          <span className="text-muted-foreground">N/A (Original Artwork)</span>
        </div>
      </div>
    );
  }

  const formatEdition = (val: string) => {
    if (!val) return val;
    
    // Check if it's already in X/Y format
    if (val.includes('/')) return val;
    
    // If it's just a number, suggest the format
    if (/^\d+$/.test(val)) {
      return val + '/';
    }
    
    return val;
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Label className="text-sm font-medium">Edition</Label>
      <Input
        placeholder="e.g., 15/100"
        value={value}
        onChange={(e) => onChange(formatEdition(e.target.value))}
        className="text-center"
      />
      <div className="text-xs text-muted-foreground text-center">
        Format: Current number / Total edition size
      </div>
    </div>
  );
};

export default EditionInput;