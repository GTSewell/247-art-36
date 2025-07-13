import React from 'react';
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, RefreshCw, Calendar } from 'lucide-react';
import { formatDistance } from 'date-fns';

interface ProductShopifyTabProps {
  product: any;
}

const ProductShopifyTab: React.FC<ProductShopifyTabProps> = ({ product }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Never';
    return formatDistance(new Date(dateString), new Date(), { addSuffix: true });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-lg font-medium">Shopify Integration</Label>
        <p className="text-sm text-muted-foreground">
          View Shopify connection status and sync information
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Shopify Product ID</Label>
            <div className="flex items-center space-x-2">
              <code className="text-sm bg-muted px-2 py-1 rounded">
                {product?.shopify_product_id || 'Not connected'}
              </code>
              {product?.shopify_product_id && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const shopifyUrl = `https://${process.env.SHOPIFY_STORE_DOMAIN || 'your-store'}.myshopify.com/admin/products/${product.shopify_product_id}`;
                    window.open(shopifyUrl, '_blank');
                  }}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Shopify Handle</Label>
            <code className="text-sm bg-muted px-2 py-1 rounded block">
              {product?.shopify_handle || 'No handle'}
            </code>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Variant ID</Label>
            <code className="text-sm bg-muted px-2 py-1 rounded block">
              {product?.shopify_variant_id || 'No variant'}
            </code>
          </div>
        </div>

        <div className="space-y-3">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Last Synced</Label>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {formatDate(product?.last_synced_at)}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Inventory Status</Label>
            <Badge variant={product?.shopify_inventory_quantity > 0 ? "default" : "secondary"}>
              {product?.shopify_inventory_quantity || 0} in stock
            </Badge>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Shopify Tags</Label>
            <div className="flex flex-wrap gap-1">
              {product?.shopify_tags?.length > 0 ? (
                product.shopify_tags.map((tag: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">No tags</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="border rounded-lg p-4 bg-muted/50">
        <h4 className="font-medium mb-2">Sync Information</h4>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>• Local edits will override Shopify data when displayed on the website</p>
          <p>• Price and inventory are still synced from Shopify</p>
          <p>• Use the main sync function to update from Shopify</p>
          <p>• Custom images and content are stored locally</p>
        </div>
      </div>

      <div className="flex space-x-2">
        <Button variant="outline" disabled>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh from Shopify
        </Button>
        <Button variant="outline" disabled>
          <ExternalLink className="h-4 w-4 mr-2" />
          View in Shopify Admin
        </Button>
      </div>
    </div>
  );
};

export default ProductShopifyTab;