import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TypeFilterProps {
  selectedType: string;
  types: string[];
  onTypeChange: (value: string) => void;
}

export const TypeFilter: React.FC<TypeFilterProps> = ({
  selectedType,
  types,
  onTypeChange
}) => {
  if (types.length === 0) return null;

  return (
    <Select 
      value={selectedType} 
      onValueChange={(value) => onTypeChange(value === 'all' ? '' : value)}
    >
      <SelectTrigger className="w-[150px]">
        <SelectValue placeholder="All Types" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Types</SelectItem>
        {types.map(type => (
          <SelectItem key={type} value={type}>{type}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};