import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';
import { useShopifyIntegration } from '@/hooks/useShopifyIntegration';
import { toast } from 'sonner';
import { logger } from '@/utils/logger';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { storeCategories } from '@/components/store/utils/categoryUtils';
import SyncStats from './shopify/SyncStats';
import ProductBulkActions from './shopify/ProductBulkActions';
import ProductList from './shopify/ProductList';
import SyncLogs from './shopify/SyncLogs';

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
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(new Set());
  const [artists, setArtists] = useState<any[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    loadData();
    loadArtists();
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

  const loadArtists = async () => {
    try {
      const { data, error } = await supabase
        .from('artists')
        .select('id, name')
        .eq('published', true)
        .order('name');
      
      if (error) throw error;
      setArtists(data || []);
    } catch (error) {
      logger.error('Error loading artists:', error);
    }
  };

  const handleProductSelect = (productId: number, selected: boolean) => {
    setSelectedProducts(prev => {
      const newSelected = new Set(prev);
      if (selected) {
        newSelected.add(productId);
      } else {
        newSelected.delete(productId);
      }
      return newSelected;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(new Set(products.map(p => p.id)));
    } else {
      setSelectedProducts(new Set());
    }
  };

  const handleBulkAssignment = async (
    assignmentType: 'category' | 'artist',
    value: string
  ) => {
    console.log('handleBulkAssignment called:', { assignmentType, value, selectedProducts: Array.from(selectedProducts) });
    
    if (selectedProducts.size === 0) {
      toast.error('Please select products first');
      return;
    }

    setIsUpdating(true);
    try {
      const updates = Array.from(selectedProducts).map(async (productId) => {
        const updateData: any = {};
        
        if (assignmentType === 'category') {
          updateData.category = value;
          console.log(`Updating product ${productId} category to:`, value);
        } else if (assignmentType === 'artist') {
          updateData.artist_id = parseInt(value);
          console.log(`Updating product ${productId} artist_id to:`, parseInt(value));
        }
        
        console.log('Update data for product', productId, ':', updateData);
        
        const { data, error } = await supabase
          .from('products')
          .update(updateData)
          .eq('id', productId)
          .select();
          
        if (error) {
          console.error('Database error for product', productId, ':', error);
          throw error;
        }
        
        console.log('Successfully updated product', productId, ':', data);
        return { productId, success: true };
      });

      await Promise.all(updates);
      
      const assignmentLabel = assignmentType === 'category' 
        ? storeCategories.find(c => c.id === value)?.label
        : artists.find(a => a.id.toString() === value)?.name;
      
      toast.success(`Assigned ${selectedProducts.size} products to ${assignmentLabel}`);
      
      console.log('Reloading data after bulk assignment...');
      // Don't clear selection to allow multiple assignments
      await loadData(); // Refresh products to show updated assignments
      console.log('Data reloaded successfully');
    } catch (error) {
      logger.error('Error updating products:', error);
      console.error('Bulk assignment error:', error);
      toast.error('Failed to update products');
    } finally {
      setIsUpdating(false);
    }
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
      <SyncStats stats={stats} formatDate={formatDate} />

      {/* Product Management */}
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
                onCheckedChange={setShowAllProducts}
              />
              <Label htmlFor="show-all">Show all products</Label>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ProductBulkActions
            selectedProducts={selectedProducts}
            artists={artists}
            isUpdating={isUpdating}
            onClearSelection={() => setSelectedProducts(new Set())}
            onBulkAssignment={handleBulkAssignment}
          />
          
          <ProductList
            products={products}
            selectedProducts={selectedProducts}
            showAllProducts={showAllProducts}
            isSyncing={isSyncing}
            onProductSelect={handleProductSelect}
            onSelectAll={handleSelectAll}
            onSync={handleSync}
          />
        </CardContent>
      </Card>

      {/* Sync Logs */}
      <SyncLogs syncLogs={syncLogs} formatDate={formatDate} />
    </div>
  );
};

export default ShopifyIntegration;