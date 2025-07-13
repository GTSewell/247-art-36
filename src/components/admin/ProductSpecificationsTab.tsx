import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Plus } from 'lucide-react';

interface ProductSpecificationsTabProps {
  formData: any;
  onChange: (data: any) => void;
}

const ProductSpecificationsTab: React.FC<ProductSpecificationsTabProps> = ({
  formData,
  onChange
}) => {
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  const specifications = formData.specifications || {};

  const addSpecification = () => {
    if (!newKey.trim() || !newValue.trim()) return;
    
    const updatedSpecs = {
      ...specifications,
      [newKey.trim()]: newValue.trim()
    };
    
    onChange({ ...formData, specifications: updatedSpecs });
    setNewKey('');
    setNewValue('');
  };

  const removeSpecification = (key: string) => {
    const updatedSpecs = { ...specifications };
    delete updatedSpecs[key];
    onChange({ ...formData, specifications: updatedSpecs });
  };

  const updateSpecification = (oldKey: string, newKey: string, value: string) => {
    const updatedSpecs = { ...specifications };
    if (oldKey !== newKey) {
      delete updatedSpecs[oldKey];
    }
    updatedSpecs[newKey] = value;
    onChange({ ...formData, specifications: updatedSpecs });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-lg font-medium">Product Specifications</Label>
        <p className="text-sm text-muted-foreground">
          Add custom specifications that will be displayed to customers
        </p>
      </div>

      <div className="space-y-4">
        {Object.entries(specifications).map(([key, value]) => (
          <div key={key} className="flex items-center space-x-2 p-3 border rounded">
            <div className="flex-1 grid grid-cols-2 gap-2">
              <Input
                placeholder="Specification name"
                value={key}
                onChange={(e) => updateSpecification(key, e.target.value, value as string)}
              />
              <Input
                placeholder="Specification value"
                value={value as string}
                onChange={(e) => updateSpecification(key, key, e.target.value)}
              />
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => removeSpecification(key)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}

        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Specification name (e.g., Material)"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
            />
            <Input
              placeholder="Specification value (e.g., Cotton blend)"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addSpecification()}
            />
            <Button
              onClick={addSpecification}
              disabled={!newKey.trim() || !newValue.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-muted/50 p-4 rounded">
        <h4 className="font-medium mb-2">Common Specifications</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
          <button
            onClick={() => setNewKey('Material')}
            className="text-left text-muted-foreground hover:text-foreground"
          >
            Material
          </button>
          <button
            onClick={() => setNewKey('Dimensions')}
            className="text-left text-muted-foreground hover:text-foreground"
          >
            Dimensions
          </button>
          <button
            onClick={() => setNewKey('Weight')}
            className="text-left text-muted-foreground hover:text-foreground"
          >
            Weight
          </button>
          <button
            onClick={() => setNewKey('Color')}
            className="text-left text-muted-foreground hover:text-foreground"
          >
            Color
          </button>
          <button
            onClick={() => setNewKey('Style')}
            className="text-left text-muted-foreground hover:text-foreground"
          >
            Style
          </button>
          <button
            onClick={() => setNewKey('Edition Size')}
            className="text-left text-muted-foreground hover:text-foreground"
          >
            Edition Size
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductSpecificationsTab;