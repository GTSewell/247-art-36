import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Search, Settings, List, Filter } from 'lucide-react';
import ProductBulkActions from './ProductBulkActions';
import ProductList from './ProductList';
import DebugPanel from './DebugPanel';
import ProductSearchAndFilter, { FilterState } from './ProductSearchAndFilter';
import { useProductFilters } from './useProductFilters';

interface ShopifyProductManagementProps {
  products: any[];
  selectedProducts: Set<number>;
  showAllProducts: boolean;
  isSyncing: boolean;
  artists: any[];
  isUpdating: boolean;
  onProductSelect: (productId: number, selected: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  onSync: () => void;
  onShowAllProductsChange: (checked: boolean) => void;
  onClearSelection: () => void;
  onBulkAssignment: (type: 'category' | 'artist', value: string) => void;
  onEditProduct: (product: any) => void;
  onToggleVisibility: (productId: number, isVisible: boolean) => void;
}

const ShopifyProductManagement = ({
  products,
  selectedProducts,
  showAllProducts,
  isSyncing,
  artists,
  isUpdating,
  onProductSelect,
  onSelectAll,
  onSync,
  onShowAllProductsChange,
  onClearSelection,
  onBulkAssignment,
  onEditProduct,
  onToggleVisibility
}: ShopifyProductManagementProps) => {
  const [filters, setFilters] = useState<FilterState>({
    searchText: '',
    category: 'all',
    artistId: 'all',
    stockStatus: 'all',
    visibilityStatus: 'all',
    featuredStatus: 'all',
    categorySource: 'all',
    sortBy: 'name',
    sortOrder: 'asc'
  });

  const filteredProducts = useProductFilters(products, filters, artists);

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.searchText) count++;
    if (filters.category && filters.category !== 'all') count++;
    if (filters.artistId && filters.artistId !== 'all') count++;
    if (filters.stockStatus && filters.stockStatus !== 'all') count++;
    if (filters.visibilityStatus && filters.visibilityStatus !== 'all') count++;
    if (filters.featuredStatus && filters.featuredStatus !== 'all') count++;
    if (filters.categorySource && filters.categorySource !== 'all') count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Product Management</CardTitle>
              <CardDescription>
                Select products and assign them to store sections and artists
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="show-all"
                checked={showAllProducts}
                onCheckedChange={onShowAllProductsChange}
              />
              <Label htmlFor="show-all" className="text-sm whitespace-nowrap">Show all products</Label>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Collapsible Sections */}
      <Accordion type="multiple" defaultValue={["search-filters", "product-list"]} className="space-y-4">
        {/* Search & Filters Section */}
        <AccordionItem value="search-filters">
          <Card>
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4" />
                <span className="font-medium">Search & Filters</span>
                {activeFilterCount > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {activeFilterCount} active
                  </Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <ProductSearchAndFilter
                filters={filters}
                onFiltersChange={setFilters}
                artists={artists}
                resultsCount={filteredProducts.length}
                totalCount={products.length}
              />
            </AccordionContent>
          </Card>
        </AccordionItem>

        {/* Bulk Actions Section */}
        {selectedProducts.size > 0 && (
          <AccordionItem value="bulk-actions">
            <Card>
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <div className="flex items-center space-x-2">
                  <Settings className="h-4 w-4" />
                  <span className="font-medium">Bulk Actions</span>
                  <Badge variant="secondary" className="text-xs">
                    {selectedProducts.size} selected
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 space-y-4">
                <ProductBulkActions
                  selectedProducts={selectedProducts}
                  artists={artists}
                  isUpdating={isUpdating}
                  onClearSelection={onClearSelection}
                  onBulkAssignment={onBulkAssignment}
                />
                <DebugPanel selectedProducts={selectedProducts} />
              </AccordionContent>
            </Card>
          </AccordionItem>
        )}

        {/* Product List Section */}
        <AccordionItem value="product-list">
          <Card>
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex items-center space-x-2">
                <List className="h-4 w-4" />
                <span className="font-medium">Product List</span>
                <Badge variant="secondary" className="text-xs">
                  {filteredProducts.length} of {products.length} products
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <ProductList
                products={filteredProducts}
                selectedProducts={selectedProducts}
                showAllProducts={showAllProducts}
                isSyncing={isSyncing}
                onProductSelect={onProductSelect}
                onSelectAll={onSelectAll}
                onSync={onSync}
                onEditProduct={onEditProduct}
                onToggleVisibility={onToggleVisibility}
              />
            </AccordionContent>
          </Card>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default ShopifyProductManagement;