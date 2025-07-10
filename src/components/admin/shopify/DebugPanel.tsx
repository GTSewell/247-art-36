import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Database } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logger } from '@/utils/logger';

interface DebugPanelProps {
  selectedProducts: Set<number>;
}

const DebugPanel = ({ selectedProducts }: DebugPanelProps) => {
  const [debugData, setDebugData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDebugData = async () => {
    if (selectedProducts.size === 0) {
      toast.error('Please select products first');
      return;
    }

    setIsLoading(true);
    try {
      const productIds = Array.from(selectedProducts);
      
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          category,
          artist_id,
          shopify_product_id,
          last_synced_at,
          artists (
            id,
            name
          )
        `)
        .in('id', productIds)
        .order('id');

      if (error) {
        throw error;
      }

      setDebugData(data || []);
      logger.info('🔍 Debug panel data:', data);
      
    } catch (error) {
      logger.error('❌ Debug panel error:', error);
      toast.error('Failed to fetch debug data');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-orange-800 flex items-center gap-2">
              <Database className="h-5 w-5" />
              Debug Panel
            </CardTitle>
            <CardDescription>
              Real-time database state for selected products
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchDebugData}
            disabled={isLoading || selectedProducts.size === 0}
            className="border-orange-300"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Debug Data
          </Button>
        </div>
      </CardHeader>
      
      {debugData.length > 0 && (
        <CardContent>
          <div className="space-y-3">
            {debugData.map((product) => (
              <div key={product.id} className="p-3 bg-white rounded border border-orange-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">Product #{product.id}</h4>
                  <Badge variant="outline" className="text-xs">
                    {product.shopify_product_id ? 'Synced' : 'Local Only'}
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">{product.name}</p>
                
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="font-medium">Category:</span>
                    <br />
                    <Badge variant={product.category === 'merch' ? 'secondary' : 'default'}>
                      {product.category}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium">Artist:</span>
                    <br />
                    {product.artist_id ? (
                      <Badge variant="default">
                        {product.artists?.name || `ID: ${product.artist_id}`}
                      </Badge>
                    ) : (
                      <Badge variant="outline">Unassigned</Badge>
                    )}
                  </div>
                </div>
                
                {product.last_synced_at && (
                  <p className="text-xs text-gray-500 mt-2">
                    Last synced: {new Date(product.last_synced_at).toLocaleString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default DebugPanel;