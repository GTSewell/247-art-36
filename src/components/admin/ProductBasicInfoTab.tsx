import React, { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { storeCategories } from '@/components/store/utils/categoryUtils';

interface ProductBasicInfoTabProps {
  formData: any;
  onChange: (data: any) => void;
}

const ProductBasicInfoTab: React.FC<ProductBasicInfoTabProps> = ({
  formData,
  onChange
}) => {
  const [artists, setArtists] = useState<any[]>([]);

  useEffect(() => {
    const loadArtists = async () => {
      const { data } = await supabase
        .from('artists')
        .select('id, name')
        .order('name');
      
      if (data) setArtists(data);
    };
    
    loadArtists();
  }, []);

  const handleChange = (field: string, value: any) => {
    onChange({ ...formData, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Enter product name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price ($)</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
            placeholder="0.00"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => handleChange('category', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {storeCategories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="artist">Artist</Label>
          <Select
            value={formData.artist_id?.toString() || ''}
            onValueChange={(value) => handleChange('artist_id', value ? parseInt(value) : null)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select artist" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">No artist assigned</SelectItem>
              {artists.map((artist) => (
                <SelectItem key={artist.id} value={artist.id.toString()}>
                  {artist.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="hero_image_url">Hero Image URL</Label>
        <Input
          id="hero_image_url"
          value={formData.hero_image_url}
          onChange={(e) => handleChange('hero_image_url', e.target.value)}
          placeholder="Enter image URL or upload using Images tab"
        />
        {formData.hero_image_url && (
          <div className="mt-2">
            <img
              src={formData.hero_image_url}
              alt="Hero image preview"
              className="w-32 h-32 object-cover rounded border"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductBasicInfoTab;