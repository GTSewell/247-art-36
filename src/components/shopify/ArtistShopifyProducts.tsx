
import React, { useState } from 'react';
import { useShopifyProducts, ShopifyProduct } from '@/hooks/useShopifyProducts';
import ShopifyProductCard from './ShopifyProductCard';
import ShopifyProductDetail from './ShopifyProductDetail';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface ArtistShopifyProductsProps {
  artistId?: number;
  showHeader?: boolean;
}

const ArtistShopifyProducts: React.FC<ArtistShopifyProductsProps> = ({ 
  artistId,
  showHeader = true
}) => {
  const { products, isLoading, error } = useShopifyProducts({ artistId });
  const [selectedProduct, setSelectedProduct] = useState<ShopifyProduct | null>(null);
  
  const handleProductClick = (product: ShopifyProduct) => {
    setSelectedProduct(product);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse text-xl">Loading products...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertDescription>
          Failed to load products. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }
  
  if (!products || products.length === 0) {
    return (
      <div className="py-8">
        {showHeader && <h2 className="text-2xl font-bold mb-6">Available Artworks</h2>}
        <Alert className="mb-6">
          <Info className="h-4 w-4 mr-2" />
          <AlertDescription>
            No products are currently available for this artist.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="py-8">
      {showHeader && <h2 className="text-2xl font-bold mb-6">Available Artworks</h2>}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <ShopifyProductCard
            key={product.id}
            product={product}
            onProductClick={handleProductClick}
          />
        ))}
      </div>
      
      <ShopifyProductDetail
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
};

export default ArtistShopifyProducts;
