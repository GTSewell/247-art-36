import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RefreshCw, Package, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { useShopifyIntegration } from '@/hooks/useShopifyIntegration';
import { toast } from 'sonner';
import { logger } from '@/utils/logger';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const ShopifyIntegration = () => {
  const { isSyncing, syncProducts, getSyncLogs, getShopifyProducts } = useShopifyIntegration();
  const [syncLogs, setSyncLogs] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    syncedProducts: 0,
    lastSync: null as string | null
  });
  const [autoActivateProducts, setAutoActivateProducts] = useState(false);
  const [showAllProducts, setShowAllProducts] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [logs, shopifyProducts] = await Promise.all([
        getSyncLogs(),
        getShopifyProducts()
      ]);
      
      setSyncLogs(logs);
      setProducts(shopifyProducts);
      
      // Calculate stats
      const syncedCount = shopifyProducts.length;
      const lastSyncDate = logs[0]?.created_at || null;
      
      setStats({
        totalProducts: syncedCount,
        syncedProducts: syncedCount,
        lastSync: lastSyncDate
      });
    } catch (error) {
      logger.error('Error loading Shopify data:', error);
      toast.error('Failed to load Shopify integration data');
    }
  };

  const handleSync = async () => {
    try {
      await syncProducts(autoActivateProducts);
      await loadData(); // Refresh data after sync
    } catch (error) {
      // Error already handled in syncProducts
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Shopify Integration</h2>
          <p className="text-muted-foreground">
            Manage your Shopify store integration and product synchronization
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="auto-activate"
              checked={autoActivateProducts}
              onCheckedChange={setAutoActivateProducts}
            />
            <Label htmlFor="auto-activate">Auto-activate new products</Label>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                const guideContent = `SHOPIFY PRODUCT FORMAT GUIDE
================================

This guide outlines the recommended format for creating products in Shopify 
to ensure proper synchronization with the 247 system.

PRODUCT TITLE FORMAT
-------------------
Format: [Artist Name] - [Artwork Title]
Examples:
- "John Smith - Sunset Dreams"
- "Jane Doe - Abstract Flow #3"
- "Mike Wilson - City Lights Original"

PRODUCT TYPE FIELD
-----------------
Use broad categories:
- Original Artwork
- Print
- Apparel  
- Sticker
- Accessories

TAGS FORMAT
----------
Use these specific tag formats (comma-separated):

1. ARTIST TAG (Required)
   Format: artist:[Artist Name]
   Example: artist:John Smith

2. CATEGORY TAGS (Required - choose one)
   - category:original-artwork (for original pieces)
   - category:print (for prints, posters, giclee)
   - category:sticker (for stickers, decals)
   - category:merch (for t-shirts, apparel, accessories)

3. CLASSIFICATION TAGS (Optional)
   - featured (will be highlighted on homepage)
   - limited-edition (shows limited badge)
   - artist-exclusive (exclusive to specific artist)
   - new-release (for recent additions)

DESCRIPTION FORMAT
-----------------
Include relevant details such as:
- Artwork dimensions
- Materials used
- Print specifications
- Care instructions
- Edition information (if limited)

EXAMPLE PRODUCTS
---------------

Original Artwork:
Title: Sarah Johnson - Ocean Waves
Product Type: Original Artwork
Tags: artist:Sarah Johnson, category:original-artwork, featured
Description: Original acrylic painting on canvas, 24" x 36", signed by artist

Art Print:
Title: Sarah Johnson - Ocean Waves Print
Product Type: Print
Tags: artist:Sarah Johnson, category:print, limited-edition
Description: High-quality giclee print on archival paper, 18" x 24", limited edition of 100

T-Shirt:
Title: Mike Davis - Street Art Design Tee
Product Type: Apparel
Tags: artist:Mike Davis, category:merch, new-release
Description: 100% cotton t-shirt featuring original street art design, available in S-XXL

Sticker Pack:
Title: Amy Chen - Floral Sticker Set
Product Type: Sticker
Tags: artist:Amy Chen, category:sticker, featured
Description: Set of 6 waterproof vinyl stickers, perfect for laptops and water bottles

SYSTEM MAPPING
-------------
The sync system will automatically:
- Extract artist name from artist: tags
- Map Product Type to internal categories
- Set featured status based on tags
- Track inventory and pricing
- Generate product URLs

NOTES
-----
- Always include the artist: tag for proper attribution
- Use consistent naming for artist tags across products
- Featured tag will make products appear on homepage
- Limited-edition tag adds special badge display
- Product Type determines main category classification`;
                
                const blob = new Blob([guideContent], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'shopify-product-format-guide.txt';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                toast.success('Format guide downloaded!');
              }}
            >
              Download Format Guide
            </Button>
            <Button onClick={handleSync} disabled={isSyncing}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Syncing...' : 'Sync Products'}
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              Synced from Shopify
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sync Status</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Active</div>
            <p className="text-xs text-muted-foreground">
              Integration is working
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Sync</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold">
              {stats.lastSync ? formatDate(stats.lastSync) : 'Never'}
            </div>
            <p className="text-xs text-muted-foreground">
              Most recent sync
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Products */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Shopify Products</CardTitle>
              <CardDescription>
                Products synced from your Shopify store
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="show-all"
                checked={showAllProducts}
                onCheckedChange={setShowAllProducts}
              />
              <Label htmlFor="show-all">Show all products</Label>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {products.length > 0 ? (
            <div className="space-y-4">
              {(showAllProducts ? products : products.slice(0, 5)).map((product) => (
                <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    {product.image_url && (
                      <img 
                        src={product.image_url} 
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                    <div>
                      <h4 className="font-medium">{product.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        ${product.price} • {product.category}
                      </p>
                      {product.artist_name && (
                        <p className="text-xs text-muted-foreground">
                          By {product.artist_name}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={product.shopify_inventory_quantity > 0 ? "default" : "secondary"}>
                      {product.shopify_inventory_quantity || 0} in stock
                    </Badge>
                    <Badge variant={product.is_featured ? "default" : "outline"}>
                      {product.is_featured ? "Featured" : "Not Featured"}
                    </Badge>
                    <Badge variant="outline">
                      Shopify ID: {product.shopify_product_id}
                    </Badge>
                  </div>
                </div>
              ))}
              {!showAllProducts && products.length > 5 && (
                <div className="text-center pt-4">
                  <p className="text-sm text-muted-foreground">
                    Showing 5 of {products.length} products. Toggle "Show all products" to see more.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No products synced yet</h3>
              <p className="text-muted-foreground mb-4">
                Click "Sync Products" to import your Shopify products
              </p>
              <Button onClick={handleSync} disabled={isSyncing}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                Sync Now
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sync Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Sync History</CardTitle>
          <CardDescription>
            Recent synchronization activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          {syncLogs.length > 0 ? (
            <div className="space-y-3">
              {syncLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="font-medium">
                        {log.sync_type} sync completed
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(log.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">
                      {log.products_synced} synced
                    </p>
                    {log.products_failed > 0 && (
                      <p className="text-sm text-red-600">
                        {log.products_failed} failed
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No sync history available</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ShopifyIntegration;