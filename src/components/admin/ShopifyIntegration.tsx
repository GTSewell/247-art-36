import React, { useState, useEffect } from 'react';
import { useShopifyIntegration } from '@/hooks/useShopifyIntegration';
import { toast } from 'sonner';
import { logger } from '@/utils/logger';
import { supabase } from '@/integrations/supabase/client';
import { storeCategories } from '@/components/store/utils/categoryUtils';
import SyncStats from './shopify/SyncStats';
import ShopifyProductManagement from './shopify/ShopifyProductManagement';
import ShopifySyncControls from './shopify/ShopifySyncControls';
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
    logger.info('handleBulkAssignment called:', { assignmentType, value, selectedProducts: Array.from(selectedProducts) });
    
    if (selectedProducts.size === 0) {
      toast.error('Please select products first');
      return;
    }

    setIsUpdating(true);
    try {
      // Process updates sequentially to avoid overwhelming the database
      const updateResults = [];
      
      for (const productId of Array.from(selectedProducts)) {
        const updateData: any = {};
        
        if (assignmentType === 'category') {
          updateData.category = value;
          logger.info(`Updating product ${productId} category to:`, value);
        } else if (assignmentType === 'artist') {
          const artistId = parseInt(value);
          updateData.artist_id = artistId;
          logger.info(`Updating product ${productId} artist_id to:`, artistId);
        }
        
        logger.info('Update data for product ' + productId + ':', updateData);
        
        const { data, error } = await supabase
          .from('products')
          .update(updateData)
          .eq('id', productId)
          .select(`
            *,
            artists (
              id,
              name,
              image
            )
          `);
          
        if (error) {
          logger.error('Database error for product ' + productId + ':', error);
          throw error;
        }
        
        logger.info('Successfully updated product ' + productId + ':', data);
        updateResults.push({ productId, success: true, data });
      }
      
      const assignmentLabel = assignmentType === 'category' 
        ? storeCategories.find(c => c.id === value)?.label
        : artists.find(a => a.id.toString() === value)?.name;
      
      toast.success(`Successfully assigned ${selectedProducts.size} products to ${assignmentLabel}`);
      
      logger.info('Bulk assignment completed successfully, reloading data...');
      
      // Force refresh of products to show updated assignments
      await loadData();
      
      // Verify the updates worked by checking a sample product
      if (updateResults.length > 0) {
        const sampleProductId = updateResults[0].productId;
        const { data: verifyData } = await supabase
          .from('products')
          .select('id, name, category, artist_id')
          .eq('id', sampleProductId)
          .single();
        
        logger.info('Verification check - product after update:', verifyData);
      }
      
      logger.info('Data reload completed');
    } catch (error) {
      logger.error('Error updating products:', error);
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
        <ShopifySyncControls
          autoActivateProducts={autoActivateProducts}
          isSyncing={isSyncing}
          onAutoActivateChange={setAutoActivateProducts}
          onSync={handleSync}
        />
      </div>

      {/* Stats Cards */}
      <SyncStats stats={stats} formatDate={formatDate} />

      {/* Product Management */}
      <ShopifyProductManagement
        products={products}
        selectedProducts={selectedProducts}
        showAllProducts={showAllProducts}
        isSyncing={isSyncing}
        artists={artists}
        isUpdating={isUpdating}
        onProductSelect={handleProductSelect}
        onSelectAll={handleSelectAll}
        onSync={handleSync}
        onShowAllProductsChange={setShowAllProducts}
        onClearSelection={() => setSelectedProducts(new Set())}
        onBulkAssignment={handleBulkAssignment}
      />

      {/* Sync Logs */}
      <SyncLogs syncLogs={syncLogs} formatDate={formatDate} />
    </div>
  );
};

export default ShopifyIntegration;