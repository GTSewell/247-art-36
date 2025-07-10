import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, ExternalLink, DollarSign } from 'lucide-react';
import { useAssignedProducts } from '@/hooks/useAssignedProducts';

interface AssignedProductsSectionProps {
  artistId: string | null;
  isDemo: boolean;
}

const AssignedProductsSection: React.FC<AssignedProductsSectionProps> = ({ 
  artistId, 
  isDemo 
}) => {
  // For demo accounts, we use artist ID 25 (Demo Artist)
  const numericArtistId = isDemo ? 25 : (artistId ? parseInt(artistId) : null);
  const { products, loading, error } = useAssignedProducts(numericArtistId);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-destructive">
              Error loading assigned products: {error}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Assigned Products</h2>
        <p className="text-muted-foreground mt-1">
          Products assigned to your artist profile from the 247 Art Store
        </p>
      </div>

      {products.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                No Assigned Products
              </h3>
              <p className="text-muted-foreground">
                No products have been assigned to your artist profile yet.
                Contact the admin to have products assigned to you.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <Card key={product.id}>
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  {/* Product Image */}
                  <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground truncate">
                          {product.name}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {product.category}
                          </Badge>
                          <div className="flex items-center text-sm font-medium text-foreground">
                            <DollarSign className="h-3 w-3 mr-1" />
                            {product.price.toFixed(2)}
                          </div>
                        </div>
                        {product.description && (
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                            {product.description}
                          </p>
                        )}
                      </div>
                      
                      {/* Actions */}
                      <div className="flex space-x-2">
                        {product.shopify_handle && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              window.open(`/store/products/${product.shopify_handle}`, '_blank');
                            }}
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            View in Store
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssignedProductsSection;