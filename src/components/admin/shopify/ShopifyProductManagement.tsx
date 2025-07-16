import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import ProductBulkActions from './ProductBulkActions';
import ProductList from './ProductList';
import DebugPanel from './DebugPanel';

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
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
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
            <Label htmlFor="show-all">Show all products</Label>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <ProductBulkActions
          selectedProducts={selectedProducts}
          artists={artists}
          isUpdating={isUpdating}
          onClearSelection={onClearSelection}
          onBulkAssignment={onBulkAssignment}
        />
        
        {selectedProducts.size > 0 && (
          <DebugPanel selectedProducts={selectedProducts} />
        )}
        
        <ProductList
          products={products}
          selectedProducts={selectedProducts}
          showAllProducts={showAllProducts}
          isSyncing={isSyncing}
          onProductSelect={onProductSelect}
          onSelectAll={onSelectAll}
          onSync={onSync}
          onEditProduct={onEditProduct}
          onToggleVisibility={onToggleVisibility}
        />
      </CardContent>
    </Card>
  );
};

export default ShopifyProductManagement;