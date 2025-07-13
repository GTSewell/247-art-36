import React from 'react';
import { X, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useCategoryFilters } from '@/hooks/useCategoryFilters';
import { SearchFilter } from './filters/SearchFilter';
import { ArtistFilter } from './filters/ArtistFilter';
import { TypeFilter } from './filters/TypeFilter';
import { PriceRangeFilter } from './filters/PriceRangeFilter';


interface CategoryFiltersProps {
  products: any[];
  onFilteredProductsChange: (products: any[]) => void;
  categoryName: string;
}

const CategoryFilters: React.FC<CategoryFiltersProps> = ({
  products,
  onFilteredProductsChange,
  categoryName
}) => {
  const {
    filters,
    filterOptions,
    filteredProducts,
    updateFilter,
    clearFilters,
    hasActiveFilters,
    activeFilterCount
  } = useCategoryFilters({ products, onFilteredProductsChange });

  return (
    <div className="space-y-3">
      {/* Filter Controls and Search in One Row */}
      <div className="flex flex-wrap items-center gap-3">
        <SearchFilter
          searchTerm={filters.searchTerm}
          categoryName={categoryName}
          onSearchChange={(value) => updateFilter('searchTerm', value)}
        />

        <ArtistFilter
          selectedArtist={filters.selectedArtist}
          artists={filterOptions.artists}
          onArtistChange={(value) => updateFilter('selectedArtist', value)}
        />

        <TypeFilter
          selectedType={filters.selectedType}
          types={filterOptions.types}
          onTypeChange={(value) => updateFilter('selectedType', value)}
        />

        <PriceRangeFilter
          priceRange={filters.priceRange}
          maxRange={filterOptions.priceRange}
          onPriceRangeChange={(value) => updateFilter('priceRange', value)}
        />

        {/* Filters Active Indicator */}
        {hasActiveFilters && (
          <div className="flex items-center gap-1 px-2 py-1 bg-black rounded text-yellow-400 animate-pulse">
            <AlertCircle className="h-3 w-3" />
            <span className="text-xs font-medium">FILTERS ACTIVE</span>
          </div>
        )}

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button variant="outline" onClick={clearFilters} className="gap-2">
            <X className="h-4 w-4" />
            Clear {activeFilterCount > 1 ? `(${activeFilterCount})` : ''}
          </Button>
        )}

        {/* Results Count */}
        <div className="text-sm text-muted-foreground whitespace-nowrap">
          {filteredProducts.length} of {products.length} products
          {hasActiveFilters && ' match your filters'}
        </div>
      </div>

    </div>
  );
};

export default CategoryFilters;