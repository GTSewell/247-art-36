import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Package, Edit, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { storeCategories } from '@/components/store/utils/categoryUtils';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image_url?: string;
  artist_name?: string;
  shopify_inventory_quantity: number;
  is_featured: boolean;
  is_visible?: boolean;
  category_source?: 'manual' | 'shopify' | 'auto';
}

interface ProductListProps {
  products: Product[];
  selectedProducts: Set<number>;
  showAllProducts: boolean;
  isSyncing: boolean;
  onProductSelect: (productId: number, selected: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  onSync: () => void; 
  onEditProduct?: (product: Product) => void;
  onToggleVisibility?: (productId: number, isVisible: boolean) => void;
}

const ProductList = ({ 
  products, 
  selectedProducts, 
  showAllProducts, 
  isSyncing,
  onProductSelect, 
  onSelectAll,
  onSync,
  onEditProduct,
  onToggleVisibility
}: ProductListProps) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No products synced yet</h3>
        <p className="text-muted-foreground mb-4">
          Click "Sync Products" to import your Shopify products
        </p>
        <Button onClick={onSync} disabled={isSyncing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
          Sync Now
        </Button>
      </div>
    );
  }

  const displayedProducts = showAllProducts ? products : products.slice(0, 5);

  return (
    <div className="space-y-4">
      {/* Select All Checkbox */}
      <div className="flex items-center space-x-2 py-2 border-b">
        <Checkbox
          id="select-all"
          checked={products.length > 0 && selectedProducts.size === products.length}
          onCheckedChange={onSelectAll}
        />
        <Label htmlFor="select-all" className="font-medium">
          Select All Products
        </Label>
      </div>

      {/* Product List */}
      <div className="space-y-3">
        {displayedProducts.map((product) => (
          <div key={product.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
            <Checkbox
              id={`product-${product.id}`}
              checked={selectedProducts.has(product.id)}
              onCheckedChange={(checked) => onProductSelect(product.id, checked as boolean)}
            />
            
            <div className="flex items-center space-x-4 flex-1">
              {product.image_url && (
                <img 
                  src={product.image_url} 
                  alt={product.name}
                  className="w-12 h-12 object-cover rounded"
                />
              )}
              <div className="flex-1">
                <h4 className="font-medium">{product.name}</h4>
                <p className="text-sm text-muted-foreground">
                  ${product.price}
                </p>
                <div className="flex gap-2 mt-1">
                  <span className="text-xs bg-muted px-2 py-1 rounded">
                    Section: {product.category ? storeCategories.find(c => c.id === product.category)?.label || product.category : 'Unassigned'}
                  </span>
                  <span className="text-xs bg-primary/10 px-2 py-1 rounded">
                    Artist: {product.artist_name || 'Unassigned'}
                  </span>
                  {product.category_source && (
                    <span className={`text-xs px-2 py-1 rounded ${
                      product.category_source === 'manual' 
                        ? 'bg-green-100 text-green-800' 
                        : product.category_source === 'shopify'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {product.category_source === 'manual' ? '🔒 Manual' : 
                       product.category_source === 'shopify' ? '🛒 Shopify' : '🤖 Auto'}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge variant={product.shopify_inventory_quantity > 0 ? "default" : "secondary"}>
                {product.shopify_inventory_quantity || 0} in stock
              </Badge>
              <Badge variant={product.is_featured ? "default" : "outline"}>
                {product.is_featured ? "Featured" : "Standard"}
              </Badge>
              <div className="flex items-center space-x-1">
                {product.is_visible !== false ? <Eye className="h-3 w-3 text-green-600" /> : <EyeOff className="h-3 w-3 text-red-600" />}
                {onToggleVisibility && (
                  <Switch
                    checked={product.is_visible !== false}
                    onCheckedChange={(checked) => onToggleVisibility(product.id, checked)}
                    size="sm"
                  />
                )}
              </div>
              {onEditProduct && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditProduct(product)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {!showAllProducts && products.length > 5 && (
        <div className="text-center pt-4">
          <p className="text-sm text-muted-foreground">
            Showing 5 of {products.length} products. Toggle "Show all products" to see more.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductList;