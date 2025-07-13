import React from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ProductContentTabProps {
  formData: any;
  onChange: (data: any) => void;
}

const ProductContentTab: React.FC<ProductContentTabProps> = ({
  formData,
  onChange
}) => {
  const handleChange = (field: string, value: string) => {
    onChange({ ...formData, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-lg font-medium">Product Content</Label>
        <p className="text-sm text-muted-foreground">
          Customize the content that appears in the product details
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="custom_description">Product Description</Label>
        <Textarea
          id="custom_description"
          value={formData.custom_description}
          onChange={(e) => handleChange('custom_description', e.target.value)}
          placeholder="Enter a detailed product description..."
          rows={6}
          className="resize-none"
        />
        <p className="text-xs text-muted-foreground">
          This will override the Shopify description if provided
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="production_info">Production & Details</Label>
        <Textarea
          id="production_info"
          value={formData.production_info}
          onChange={(e) => handleChange('production_info', e.target.value)}
          placeholder="Enter production details, techniques used, artist story, etc..."
          rows={6}
          className="resize-none"
        />
        <p className="text-xs text-muted-foreground">
          Information about how the product is made, artist background, etc.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="shipping_info">Shipping Information</Label>
        <Textarea
          id="shipping_info"
          value={formData.shipping_info}
          onChange={(e) => handleChange('shipping_info', e.target.value)}
          placeholder="Enter shipping details, delivery times, special handling, etc..."
          rows={4}
          className="resize-none"
        />
        <p className="text-xs text-muted-foreground">
          Custom shipping information for this specific product
        </p>
      </div>

      <div className="bg-muted/50 p-4 rounded">
        <h4 className="font-medium mb-2">Content Tips</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Keep descriptions engaging and informative</li>
          <li>• Include artist background and inspiration</li>
          <li>• Mention unique techniques or materials used</li>
          <li>• Specify any special care instructions</li>
          <li>• Include shipping estimates and packaging details</li>
        </ul>
      </div>
    </div>
  );
};

export default ProductContentTab;