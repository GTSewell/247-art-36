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
      {/* Active Filters Notification */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 p-3 bg-orange-500/20 border border-orange-500/40 rounded-lg text-orange-100 animate-pulse">
          <AlertCircle className="h-4 w-4 text-orange-300" />
          <span className="text-sm font-medium">
            Filters active - Some artworks may be hidden. {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} applied.
          </span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters}
            className="ml-auto text-orange-200 hover:text-orange-100 hover:bg-orange-500/20 h-6 px-2"
          >
            Clear all
          </Button>
        </div>
      )}
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

    </div>
  );
};

export default CategoryFilters;