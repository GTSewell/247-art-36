import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings } from 'lucide-react';

interface ProductBulkActionsProps {
  selectedProducts: Set<number>;
  artists: any[];
  isUpdating: boolean;
  onClearSelection: () => void;
  onBulkAssignment: (type: 'category' | 'artist', value: string) => void;
}

const ProductBulkActions = ({ 
  selectedProducts, 
  artists, 
  isUpdating, 
  onClearSelection, 
  onBulkAssignment 
}: ProductBulkActionsProps) => {
  const storeCategories = [
    { value: 'print', label: 'Prints & Reproductions' },
    { value: 'merch', label: 'Merchandise' },
    { value: 'sticker', label: 'Stickers & Decals' }
  ];

  if (selectedProducts.size === 0) return null;

  return (
    <div className="bg-muted/50 p-4 rounded-lg border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Settings className="h-4 w-4" />
          <span className="font-medium">
            {selectedProducts.size} product{selectedProducts.size > 1 ? 's' : ''} selected
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onClearSelection}
          disabled={isUpdating}
        >
          Clear Selection
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Assign to Store Section</Label>
          <Select 
            onValueChange={(value) => onBulkAssignment('category', value)}
            disabled={isUpdating}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select store section" />
            </SelectTrigger>
            <SelectContent>
              {storeCategories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>Assign to Artist</Label>
          <Select 
            onValueChange={(value) => onBulkAssignment('artist', value)}
            disabled={isUpdating}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select artist" />
            </SelectTrigger>
            <SelectContent>
              {artists.map((artist) => (
                <SelectItem key={artist.id} value={artist.id.toString()}>
                  {artist.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default ProductBulkActions;