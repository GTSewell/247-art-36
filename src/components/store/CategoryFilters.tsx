import React from 'react';
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useCategoryFilters } from '@/hooks/useCategoryFilters';
import { SearchFilter } from './filters/SearchFilter';
import { ArtistFilter } from './filters/ArtistFilter';
import { TypeFilter } from './filters/TypeFilter';
import { PriceRangeFilter } from './filters/PriceRangeFilter';
import { ActiveFilters } from './filters/ActiveFilters';

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

      {/* Active Filters */}
      <ActiveFilters
        filters={filters}
        hasActiveFilters={hasActiveFilters}
        onClearFilter={(key, value) => updateFilter(key, value)}
      />
    </div>
  );
};

export default CategoryFilters;