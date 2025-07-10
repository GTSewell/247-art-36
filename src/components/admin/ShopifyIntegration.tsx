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