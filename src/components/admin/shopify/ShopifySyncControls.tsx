import React from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RefreshCw } from 'lucide-react';
import ShopifyFormatGuide from './ShopifyFormatGuide';

interface ShopifySyncControlsProps {
  autoActivateProducts: boolean;
  isSyncing: boolean;
  onAutoActivateChange: (checked: boolean) => void;
  onSync: () => void;
}

const ShopifySyncControls = ({
  autoActivateProducts,
  isSyncing,
  onAutoActivateChange,
  onSync
}: ShopifySyncControlsProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
      <div className="flex items-center space-x-2">
        <Switch
          id="auto-activate"
          checked={autoActivateProducts}
          onCheckedChange={onAutoActivateChange}
        />
        <Label htmlFor="auto-activate" className="text-sm whitespace-nowrap">Auto-activate new products</Label>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <ShopifyFormatGuide />
        <Button onClick={onSync} disabled={isSyncing} className="w-full sm:w-auto">
          <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? 'Syncing...' : 'Sync Products'}
        </Button>
      </div>
    </div>
  );
};

export default ShopifySyncControls;