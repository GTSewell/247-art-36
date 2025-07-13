import React from 'react';
import { X } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { FilterState } from '@/hooks/useCategoryFilters';

interface ActiveFiltersProps {
  filters: FilterState;
  hasActiveFilters: boolean;
  onClearFilter: (key: keyof FilterState, value: any) => void;
}

export const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  filters,
  hasActiveFilters,
  onClearFilter
}) => {
  if (!hasActiveFilters) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {filters.searchTerm && (
        <Badge variant="secondary" className="gap-1">
          Search: "{filters.searchTerm}"
          <X 
            className="h-3 w-3 cursor-pointer" 
            onClick={() => onClearFilter('searchTerm', '')} 
          />
        </Badge>
      )}
      {filters.selectedArtist && (
        <Badge variant="secondary" className="gap-1">
          Artist: {filters.selectedArtist}
          <X 
            className="h-3 w-3 cursor-pointer" 
            onClick={() => onClearFilter('selectedArtist', '')} 
          />
        </Badge>
      )}
      {filters.selectedType && (
        <Badge variant="secondary" className="gap-1">
          Type: {filters.selectedType}
          <X 
            className="h-3 w-3 cursor-pointer" 
            onClick={() => onClearFilter('selectedType', '')} 
          />
        </Badge>
      )}
    </div>
  );
};