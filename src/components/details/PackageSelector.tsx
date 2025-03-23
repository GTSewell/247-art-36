
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PackageSelectorProps {
  value: 'signature';
  onChange: (value: 'signature') => void;
}

const PackageSelector: React.FC<PackageSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="package-select">Select Package Type</Label>
      <Select 
        value={value} 
        onValueChange={(value: 'signature') => onChange(value)}
      >
        <SelectTrigger 
          id="package-select" 
          className="border-2 border-gray-300 focus:border-gray-500 focus:ring-gray-500 shadow-sm"
        >
          <SelectValue placeholder="Select package" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="signature">Signature Artist (10,000 sq cm)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default PackageSelector;
