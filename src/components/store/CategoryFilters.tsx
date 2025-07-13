import React, { useState, useMemo } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface CategoryFiltersProps {
  products: any[];
  onFilteredProductsChange: (products: any[]) => void;
  categoryName: string;
}

export interface FilterState {
  searchTerm: string;
  selectedArtist: string;
  priceRange: [number, number];
  selectedType: string;
}

const CategoryFilters: React.FC<CategoryFiltersProps> = ({
  products,
  onFilteredProductsChange,
  categoryName
}) => {
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    selectedArtist: '',
    priceRange: [0, 1000],
    selectedType: ''
  });

  // Extract unique values for filter options
  const filterOptions = useMemo(() => {
    const artists = [...new Set(products.map(p => p.artists?.name).filter(Boolean))];
    const types = [...new Set(products.map(p => p.shopify_tags).flat().filter(Boolean))];
    const prices = products.map(p => parseFloat(p.price)).filter(p => !isNaN(p));
    const minPrice = Math.min(...prices) || 0;
    const maxPrice = Math.max(...prices) || 1000;

    return {
      artists: artists.sort(),
      types: types.sort(),
      priceRange: [minPrice, maxPrice] as [number, number]
    };
  }, [products]);

  // Initialize price range with actual min/max
  React.useEffect(() => {
    setFilters(prev => ({
      ...prev,
      priceRange: filterOptions.priceRange
    }));
  }, [filterOptions.priceRange]);

  // Apply filters and update parent component
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Search filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower) ||
        product.artists?.name?.toLowerCase().includes(searchLower)
      );
    }

    // Artist filter
    if (filters.selectedArtist) {
      filtered = filtered.filter(product => 
        product.artists?.name === filters.selectedArtist
      );
    }

    // Price range filter
    filtered = filtered.filter(product => {
      const price = parseFloat(product.price);
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    // Type filter
    if (filters.selectedType) {
      filtered = filtered.filter(product =>
        product.shopify_tags?.includes(filters.selectedType)
      );
    }

    return filtered;
  }, [products, filters]);

  // Notify parent of filtered products
  React.useEffect(() => {
    onFilteredProductsChange(filteredProducts);
  }, [filteredProducts, onFilteredProductsChange]);

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      selectedArtist: '',
      priceRange: filterOptions.priceRange,
      selectedType: ''
    });
  };

  const hasActiveFilters = filters.searchTerm || filters.selectedArtist || filters.selectedType ||
    (filters.priceRange[0] !== filterOptions.priceRange[0] || filters.priceRange[1] !== filterOptions.priceRange[1]);

  const activeFilterCount = [
    filters.searchTerm,
    filters.selectedArtist,
    filters.selectedType,
    (filters.priceRange[0] !== filterOptions.priceRange[0] || filters.priceRange[1] !== filterOptions.priceRange[1])
  ].filter(Boolean).length;

  return (
    <div className="space-y-3">
      {/* Filter Controls and Search in One Row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={`Search in ${categoryName}...`}
            value={filters.searchTerm}
            onChange={(e) => updateFilter('searchTerm', e.target.value)}
            className="pl-10 pr-4"
          />
        </div>

        {/* Artist Filter */}
        {filterOptions.artists.length > 0 && (
          <Select value={filters.selectedArtist} onValueChange={(value) => updateFilter('selectedArtist', value === 'all' ? '' : value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Artists" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Artists</SelectItem>
              {filterOptions.artists.map(artist => (
                <SelectItem key={artist} value={artist}>{artist}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Type Filter */}
        {filterOptions.types.length > 0 && (
          <Select value={filters.selectedType} onValueChange={(value) => updateFilter('selectedType', value === 'all' ? '' : value)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {filterOptions.types.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Price Range Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Price: ${filters.priceRange[0]}-${filters.priceRange[1]}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <Label className="text-sm font-medium">Price Range</Label>
              <Slider
                value={filters.priceRange}
                onValueChange={(value) => updateFilter('priceRange', value as [number, number])}
                max={filterOptions.priceRange[1]}
                min={filterOptions.priceRange[0]}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>${filters.priceRange[0]}</span>
                <span>${filters.priceRange[1]}</span>
              </div>
            </div>
          </PopoverContent>
        </Popover>

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
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.searchTerm && (
            <Badge variant="secondary" className="gap-1">
              Search: "{filters.searchTerm}"
              <X className="h-3 w-3 cursor-pointer" onClick={() => updateFilter('searchTerm', '')} />
            </Badge>
          )}
          {filters.selectedArtist && (
            <Badge variant="secondary" className="gap-1">
              Artist: {filters.selectedArtist}
              <X className="h-3 w-3 cursor-pointer" onClick={() => updateFilter('selectedArtist', '')} />
            </Badge>
          )}
          {filters.selectedType && (
            <Badge variant="secondary" className="gap-1">
              Type: {filters.selectedType}
              <X className="h-3 w-3 cursor-pointer" onClick={() => updateFilter('selectedType', '')} />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryFilters;