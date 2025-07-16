import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, X, Filter } from 'lucide-react';
import { storeCategories } from '@/components/store/utils/categoryUtils';

export interface FilterState {
  searchText: string;
  category: string;
  artistId: string;
  stockStatus: string;
  visibilityStatus: string;
  featuredStatus: string;
  categorySource: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface ProductSearchAndFilterProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  artists: any[];
  resultsCount: number;
  totalCount: number;
}

const ProductSearchAndFilter: React.FC<ProductSearchAndFilterProps> = ({
  filters,
  onFiltersChange,
  artists,
  resultsCount,
  totalCount
}) => {
  const handleFilterChange = (key: keyof FilterState, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      searchText: '',
      category: '',
      artistId: '',
      stockStatus: '',
      visibilityStatus: '',
      featuredStatus: '',
      categorySource: '',
      sortBy: 'name',
      sortOrder: 'asc'
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.searchText) count++;
    if (filters.category) count++;
    if (filters.artistId) count++;
    if (filters.stockStatus) count++;
    if (filters.visibilityStatus) count++;
    if (filters.featuredStatus) count++;
    if (filters.categorySource) count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className="space-y-4 p-4 bg-muted/20 rounded-lg border">
      {/* Search Bar */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search products, artists, descriptions..."
            value={filters.searchText}
            onChange={(e) => handleFilterChange('searchText', e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={clearAllFilters}
          disabled={activeFilterCount === 0}
        >
          <X className="h-4 w-4 mr-1" />
          Clear ({activeFilterCount})
        </Button>
      </div>

      {/* Filter Controls */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {/* Category Filter */}
        <div className="space-y-1">
          <Label className="text-xs font-medium">Category</Label>
          <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {storeCategories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Artist Filter */}
        <div className="space-y-1">
          <Label className="text-xs font-medium">Artist</Label>
          <Select value={filters.artistId} onValueChange={(value) => handleFilterChange('artistId', value)}>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Artists</SelectItem>
              <SelectItem value="unassigned">Unassigned</SelectItem>
              {artists.map((artist) => (
                <SelectItem key={artist.id} value={artist.id.toString()}>
                  {artist.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Stock Status Filter */}
        <div className="space-y-1">
          <Label className="text-xs font-medium">Stock</Label>
          <Select value={filters.stockStatus} onValueChange={(value) => handleFilterChange('stockStatus', value)}>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Stock</SelectItem>
              <SelectItem value="in-stock">In Stock</SelectItem>
              <SelectItem value="low-stock">Low Stock (&lt;5)</SelectItem>
              <SelectItem value="out-of-stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Visibility Filter */}
        <div className="space-y-1">
          <Label className="text-xs font-medium">Visibility</Label>
          <Select value={filters.visibilityStatus} onValueChange={(value) => handleFilterChange('visibilityStatus', value)}>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Products</SelectItem>
              <SelectItem value="visible">Visible</SelectItem>
              <SelectItem value="hidden">Hidden</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Featured Filter */}
        <div className="space-y-1">
          <Label className="text-xs font-medium">Featured</Label>
          <Select value={filters.featuredStatus} onValueChange={(value) => handleFilterChange('featuredStatus', value)}>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Products</SelectItem>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="standard">Standard</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Category Source Filter */}
        <div className="space-y-1">
          <Label className="text-xs font-medium">Source</Label>
          <Select value={filters.categorySource} onValueChange={(value) => handleFilterChange('categorySource', value)}>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Sources</SelectItem>
              <SelectItem value="auto">Auto-assigned</SelectItem>
              <SelectItem value="manual">Manually Set</SelectItem>
              <SelectItem value="shopify">From Shopify</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort By */}
        <div className="space-y-1">
          <Label className="text-xs font-medium">Sort By</Label>
          <Select 
            value={`${filters.sortBy}-${filters.sortOrder}`} 
            onValueChange={(value) => {
              const [sortBy, sortOrder] = value.split('-');
              onFiltersChange({
                ...filters,
                sortBy,
                sortOrder: sortOrder as 'asc' | 'desc'
              });
            }}
          >
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name-asc">Name A-Z</SelectItem>
              <SelectItem value="name-desc">Name Z-A</SelectItem>
              <SelectItem value="created_at-desc">Recently Added</SelectItem>
              <SelectItem value="last_synced_at-desc">Recently Synced</SelectItem>
              <SelectItem value="price-asc">Price Low-High</SelectItem>
              <SelectItem value="price-desc">Price High-Low</SelectItem>
              <SelectItem value="shopify_inventory_quantity-desc">Stock High-Low</SelectItem>
              <SelectItem value="shopify_inventory_quantity-asc">Stock Low-High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Count and Quick Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="text-xs">
            <Filter className="h-3 w-3 mr-1" />
            {resultsCount} of {totalCount} products
          </Badge>
          
          {/* Quick Filter Badges */}
          {filters.searchText && (
            <Badge variant="outline" className="text-xs">
              Search: "{filters.searchText}"
              <button
                onClick={() => handleFilterChange('searchText', '')}
                className="ml-1 hover:bg-muted rounded-full"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>

        {/* Quick Action Buttons */}
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onFiltersChange({ ...filters, artistId: 'unassigned' })}
          >
            Unassigned Products
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onFiltersChange({ ...filters, visibilityStatus: 'hidden' })}
          >
            Hidden Products
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onFiltersChange({ ...filters, stockStatus: 'out-of-stock' })}
          >
            Out of Stock
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductSearchAndFilter;