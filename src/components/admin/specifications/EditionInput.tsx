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

  const handleInputChange = (val: string) => {
    // Allow free typing, only validate on blur or enter
    onChange(val);
  };

  const handleBlur = (val: string) => {
    if (!val) return;
    
    // Validate and suggest proper format on blur
    if (val.includes('/')) {
      // Already has format, validate it's X/Y
      const parts = val.split('/');
      if (parts.length === 2 && parts[0] && parts[1] && /^\d+$/.test(parts[0]) && /^\d+$/.test(parts[1])) {
        return; // Valid format
      }
    } else if (/^\d+$/.test(val)) {
      // Just a number, suggest adding total
      onChange(val + '/');
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Label className="text-sm font-medium">Edition</Label>
      <Input
        placeholder="e.g., 15/100"
        value={value}
        onChange={(e) => handleInputChange(e.target.value)}
        onBlur={(e) => handleBlur(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleBlur(e.currentTarget.value);
          }
        }}
        className="text-center"
      />
      <div className="text-xs text-muted-foreground text-center">
        Format: Current number / Total edition size
      </div>
    </div>
  );
};

export default EditionInput;