import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Plus } from 'lucide-react';
import { SPECIFICATION_CATEGORIES, SPECIFICATION_OPTIONS } from '@/data/specificationOptions';
import { useSpecificationOptions } from '@/hooks/useSpecificationOptions';
import SpecificationDropdown from './specifications/SpecificationDropdown';
import SizeInput from './specifications/SizeInput';
import ColorTagSelector from './specifications/ColorTagSelector';
import EditionInput from './specifications/EditionInput';

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
  const { options, addOption, incrementUsage } = useSpecificationOptions();

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
    // Don't allow removing common specs, just clear their value
    if (SPECIFICATION_CATEGORIES.includes(key as any)) {
      const updatedSpecs = { ...specifications };
      updatedSpecs[key] = '';
      onChange({ ...formData, specifications: updatedSpecs });
    } else {
      const updatedSpecs = { ...specifications };
      delete updatedSpecs[key];
      onChange({ ...formData, specifications: updatedSpecs });
    }
  };

  const updateSpecification = (key: string, value: string) => {
    const updatedSpecs = { ...specifications };
    updatedSpecs[key] = value;
    onChange({ ...formData, specifications: updatedSpecs });
    
    // Track usage for predefined options
    if (SPECIFICATION_CATEGORIES.includes(key as any) && value) {
      incrementUsage(key, value);
    }
  };

  // Get additional specs (not in common specs)
  const additionalSpecs = Object.entries(specifications).filter(
    ([key]) => !SPECIFICATION_CATEGORIES.includes(key as any)
  );

  const getDisplayValue = (value: string) => {
    return value && value.trim() ? value : 'N/A';
  };

  const getAvailableOptions = (category: string) => {
    const predefinedOptions = SPECIFICATION_OPTIONS[category as keyof typeof SPECIFICATION_OPTIONS] || [];
    const userOptions = options[category]?.map(opt => opt.option_value) || [];
    
    // Combine and deduplicate
    const allOptions = [...predefinedOptions, ...userOptions];
    return [...new Set(allOptions)].sort();
  };

  const handleOptionChange = async (category: string, value: string) => {
    updateSpecification(category, value);
    
    // If this is a new option, add it to the database
    const allOptions = getAvailableOptions(category);
    if (value && !allOptions.includes(value)) {
      await addOption(category, value);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-lg font-medium">Product Specifications</Label>
        <p className="text-sm text-muted-foreground">
          Standard specifications are always displayed. Additional specs can be added below.
        </p>
      </div>

      {/* Common Specifications Section */}
      <div className="space-y-4">
        <div>
          <Label className="text-base font-medium">Standard Specifications</Label>
          <p className="text-sm text-muted-foreground mb-4">
            These specifications are always displayed in order
          </p>
        </div>
        
        {SPECIFICATION_CATEGORIES.map((specKey) => (
          <div key={specKey} className="space-y-2 p-4 border rounded bg-muted/20">
            <Label className="text-sm font-medium">{specKey}</Label>
            
            {specKey === 'Size' ? (
              <SizeInput
                value={specifications[specKey] || ''}
                onChange={(value) => updateSpecification(specKey, value)}
                className="w-full"
              />
            ) : specKey === 'Color' ? (
              <ColorTagSelector
                value={specifications[specKey] || ''}
                onChange={(value) => handleOptionChange(specKey, value)}
                options={getAvailableOptions(specKey)}
                className="w-full"
              />
            ) : specKey === 'Edition' ? (
              <EditionInput
                value={specifications[specKey] || ''}
                onChange={(value) => updateSpecification(specKey, value)}
                productCategory={formData.category}
                className="w-full"
              />
            ) : specKey === 'Weight' ? (
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Enter weight"
                  value={specifications[specKey] || ''}
                  onChange={(e) => updateSpecification(specKey, e.target.value)}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground">g</span>
              </div>
            ) : (
              <SpecificationDropdown
                value={specifications[specKey] || ''}
                onChange={(value) => handleOptionChange(specKey, value)}
                options={getAvailableOptions(specKey)}
                placeholder={`Select ${specKey.toLowerCase()}...`}
                className="w-full"
              />
            )}
            
            <div className="text-xs text-muted-foreground">
              Display: <strong>{getDisplayValue(specifications[specKey] || '')}</strong>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Specifications Section */}
      <div className="space-y-4">
        <div>
          <Label className="text-base font-medium">Additional Specifications</Label>
          <p className="text-sm text-muted-foreground mb-4">
            Custom specifications for this product
          </p>
        </div>

        {additionalSpecs.map(([key, value]) => (
          <div key={key} className="flex items-center space-x-2 p-3 border rounded">
            <div className="flex-1 grid grid-cols-2 gap-2">
              <Input
                placeholder="Specification name"
                value={key}
                onChange={(e) => {
                  const oldKey = key;
                  const newKey = e.target.value;
                  const updatedSpecs = { ...specifications };
                  if (oldKey !== newKey) {
                    delete updatedSpecs[oldKey];
                  }
                  updatedSpecs[newKey] = value as string;
                  onChange({ ...formData, specifications: updatedSpecs });
                }}
              />
              <Input
                placeholder="Specification value"
                value={value as string}
                onChange={(e) => updateSpecification(key, e.target.value)}
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
              placeholder="Specification name (e.g., Texture, Finish)"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
            />
            <Input
              placeholder="Specification value"
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
        <h4 className="font-medium mb-2">Quick Add to Additional Specs</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
          <button
            onClick={() => setNewKey('Texture')}
            className="text-left text-muted-foreground hover:text-foreground"
          >
            Texture
          </button>
          <button
            onClick={() => setNewKey('Finish')}
            className="text-left text-muted-foreground hover:text-foreground"
          >
            Finish
          </button>
          <button
            onClick={() => setNewKey('Packaging')}
            className="text-left text-muted-foreground hover:text-foreground"
          >
            Packaging
          </button>
          <button
            onClick={() => setNewKey('Care Instructions')}
            className="text-left text-muted-foreground hover:text-foreground"
          >
            Care Instructions
          </button>
          <button
            onClick={() => setNewKey('Origin')}
            className="text-left text-muted-foreground hover:text-foreground"
          >
            Origin
          </button>
          <button
            onClick={() => setNewKey('Frame Included')}
            className="text-left text-muted-foreground hover:text-foreground"
          >
            Frame Included
          </button>
          <button
            onClick={() => setNewKey('Signed')}
            className="text-left text-muted-foreground hover:text-foreground"
          >
            Signed
          </button>
          <button
            onClick={() => setNewKey('Certificate')}
            className="text-left text-muted-foreground hover:text-foreground"
          >
            Certificate
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductSpecificationsTab;