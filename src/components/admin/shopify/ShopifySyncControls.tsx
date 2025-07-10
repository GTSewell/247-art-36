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
    <div className="flex items-center gap-4">
      <div className="flex items-center space-x-2">
        <Switch
          id="auto-activate"
          checked={autoActivateProducts}
          onCheckedChange={onAutoActivateChange}
        />
        <Label htmlFor="auto-activate">Auto-activate new products</Label>
      </div>
      <div className="flex gap-2">
        <ShopifyFormatGuide />
        <Button onClick={onSync} disabled={isSyncing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? 'Syncing...' : 'Sync Products'}
        </Button>
      </div>
    </div>
  );
};

export default ShopifySyncControls;