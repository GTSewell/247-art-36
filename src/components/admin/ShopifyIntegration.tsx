
import React, { useState, useEffect } from 'react';
import { useShopifyIntegration } from '@/hooks/useShopifyIntegration';
import { toast } from 'sonner';
import { logger } from '@/utils/logger';
import { supabase } from '@/integrations/supabase/client';
import { storeCategories } from '@/components/store/utils/categoryUtils';
import { formatInTimeZone } from 'date-fns-tz';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SyncStats from './shopify/SyncStats';
import ShopifyProductManagement from './shopify/ShopifyProductManagement';
import ShopifySyncControls from './shopify/ShopifySyncControls';
import SyncLogs from './shopify/SyncLogs';
import ProductEditModal from './ProductEditModal';
import CategoryRecoveryTool from './shopify/CategoryRecoveryTool';

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
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [statsExpanded, setStatsExpanded] = useState(true);

  useEffect(() => {
    loadData();
    loadArtists();
  }, []);

  const loadData = async (forceRefresh = false) => {
    try {
      logger.info('🔄 Loading Shopify data...', { forceRefresh });
      
      const [logs, shopifyProducts] = await Promise.all([
        getSyncLogs(),
        getShopifyProducts(undefined, forceRefresh)
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
      
      logger.info('📊 Data loaded:', { 
        productCount: syncedCount, 
        lastSync: lastSyncDate,
        categoriesSummary: shopifyProducts.reduce((acc, p) => {
          acc[p.category] = (acc[p.category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      });
    } catch (error) {
      logger.error('❌ Error loading Shopify data:', error);
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
    return formatInTimeZone(new Date(dateString), 'Australia/Melbourne', 'PPpp');
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

  const handleToggleVisibility = async (productId: number, isVisible: boolean) => {
    try {
      setIsUpdating(true);
      
      const { error } = await supabase
        .from('products')
        .update({ is_visible: isVisible })
        .eq('id', productId);
        
      if (error) throw error;
      
      // Update local state
      setProducts(prev => 
        prev.map(p => 
          p.id === productId ? { ...p, is_visible: isVisible } : p
        )
      );
      
      toast.success(`Product ${isVisible ? 'shown' : 'hidden'} successfully`);
    } catch (error) {
      logger.error('Error toggling product visibility:', error);
      toast.error('Failed to update product visibility');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleBulkAssignment = async (
    assignmentType: 'category' | 'artist',
    value: string
  ) => {
    logger.info('🚀 BULK ASSIGNMENT STARTED:', { 
      assignmentType, 
      value, 
      selectedProducts: Array.from(selectedProducts),
      selectedCount: selectedProducts.size
    });
    
    if (selectedProducts.size === 0) {
      toast.error('Please select products first');
      return;
    }

    setIsUpdating(true);
    let successCount = 0;
    let failureCount = 0;
    const errors: string[] = [];

    try {
      // Check authentication first
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error('Authentication required. Please refresh the page and try again.');
      }
      
      logger.info('🔐 User authenticated:', { userId: user.id, email: user.email });

      // Process updates with comprehensive error handling
      for (const productId of Array.from(selectedProducts)) {
        try {
          const updateData: any = {};
          
          if (assignmentType === 'category') {
            updateData.category = value;
            updateData.category_source = 'manual'; // Mark as manually set
            logger.info(`📦 Updating product ${productId} category to: ${value}`);
          } else if (assignmentType === 'artist') {
            const artistId = parseInt(value);
            if (isNaN(artistId)) {
              throw new Error(`Invalid artist ID: ${value}`);
            }
            updateData.artist_id = artistId;
            logger.info(`👨‍🎨 Updating product ${productId} artist_id to: ${artistId}`);
          }
          
          logger.info(`💾 Update data for product ${productId}:`, updateData);
          
          // First, verify the product exists
          const { data: existingProduct, error: checkError } = await supabase
            .from('products')
            .select('id, name, category, artist_id')
            .eq('id', productId)
            .single();
            
          if (checkError) {
            throw new Error(`Product ${productId} not found: ${checkError.message}`);
          }
          
          logger.info(`📋 Product ${productId} before update:`, existingProduct);
          
          // Perform the update with simple response
          const { error: updateError, count } = await supabase
            .from('products')
            .update(updateData)
            .eq('id', productId);
            
          if (updateError) {
            logger.error(`❌ Database error for product ${productId}:`, updateError);
            throw new Error(`Failed to update product ${productId}: ${updateError.message}`);
          }
          
          logger.info(`✅ Update completed for product ${productId}, affected rows:`, count);
          
          // Immediate verification
          const { data: verifyData, error: verifyError } = await supabase
            .from('products')
            .select('id, name, category, artist_id')
            .eq('id', productId)
            .single();
            
          if (verifyError) {
            logger.error(`⚠️ Verification failed for product ${productId}:`, verifyError);
            throw new Error(`Verification failed: ${verifyError.message}`);
          } else {
            logger.info(`🔍 Verification for product ${productId}:`, verifyData);
            
            // Check if the update actually took effect
            const updateWorked = assignmentType === 'category' 
              ? verifyData.category === value
              : verifyData.artist_id === parseInt(value);
              
            if (!updateWorked) {
              throw new Error(`Update verification failed - ${assignmentType} not updated correctly`);
            }
          }
          
          successCount++;
          
        } catch (productError) {
          failureCount++;
          const errorMsg = `Product ${productId}: ${productError instanceof Error ? productError.message : 'Unknown error'}`;
          errors.push(errorMsg);
          logger.error(`❌ Individual product update failed:`, errorMsg);
        }
      }
      
      // Show results
      if (successCount > 0) {
        const assignmentLabel = assignmentType === 'category' 
          ? storeCategories.find(c => c.id === value)?.label || value
          : artists.find(a => a.id.toString() === value)?.name || value;
        
        toast.success(`✅ Successfully updated ${successCount} products to ${assignmentLabel}`, {
          description: failureCount > 0 ? `${failureCount} products failed to update` : undefined
        });
      }
      
      if (failureCount > 0) {
        toast.error(`❌ Failed to update ${failureCount} products`, {
          description: errors.slice(0, 3).join('; ') + (errors.length > 3 ? '...' : '')
        });
      }
      
      logger.info('🔄 Reloading product data...');
      
      // Force refresh of products to show updated assignments
      await loadData(true);
      
      // Clear selection if all updates succeeded
      if (successCount > 0 && failureCount === 0) {
        setSelectedProducts(new Set());
      }
      
      logger.info('📊 Bulk assignment completed:', { 
        successCount, 
        failureCount, 
        errors: errors.length 
      });
      
    } catch (error) {
      logger.error('💥 Bulk assignment failed completely:', error);
      toast.error('❌ Bulk assignment failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold">Shopify Integration</h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Manage your Shopify store integration and product synchronization
          </p>
        </div>
        <div className="w-full lg:w-auto lg:flex-shrink-0">
          <ShopifySyncControls
            autoActivateProducts={autoActivateProducts}
            isSyncing={isSyncing}
            onAutoActivateChange={setAutoActivateProducts}
            onSync={handleSync}
          />
        </div>
      </div>

      {/* Stats Cards */}
      <Collapsible open={statsExpanded} onOpenChange={setStatsExpanded}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2 p-0 h-auto font-semibold text-lg">
            {statsExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            Sync Statistics
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <SyncStats stats={stats} formatDate={formatDate} />
        </CollapsibleContent>
      </Collapsible>

      {/* Category Recovery Tool */}
      {products.length > 0 && (
        <CategoryRecoveryTool 
          products={products}
          onRecoveryComplete={() => loadData(true)}
        />
      )}

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
        onEditProduct={setEditingProduct}
        onToggleVisibility={handleToggleVisibility}
      />

      {/* Sync Logs */}
      <SyncLogs syncLogs={syncLogs} formatDate={formatDate} />

      {/* Product Edit Modal */}
      <ProductEditModal
        isOpen={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        product={editingProduct}
        onProductUpdated={() => loadData(true)}
      />
    </div>
  );
};

export default ShopifyIntegration;
