
import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Upload, Plus } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ProductImagesTabProps {
  formData: any;
  onChange: (data: any) => void;
}

const ProductImagesTab: React.FC<ProductImagesTabProps> = ({
  formData,
  onChange
}) => {
  const [uploading, setUploading] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      // Add to additional images
      const updatedImages = [...(formData.additional_images || []), publicUrl];
      onChange({ ...formData, additional_images: updatedImages });

      toast({
        title: "Image Uploaded",
        description: "Image has been uploaded successfully.",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const addImageByUrl = () => {
    if (!newImageUrl.trim()) return;
    
    const updatedImages = [...(formData.additional_images || []), newImageUrl.trim()];
    onChange({ ...formData, additional_images: updatedImages });
    setNewImageUrl('');
  };

  const removeImage = (index: number) => {
    const updatedImages = formData.additional_images.filter((_: any, i: number) => i !== index);
    onChange({ ...formData, additional_images: updatedImages });
  };

  const setAsHeroImage = (imageUrl: string) => {
    onChange({ ...formData, hero_image_url: imageUrl });
    toast({
      title: "Hero Image Set",
      description: "This image has been set as the hero image.",
    });
  };

  // Helper function to extract URL from different formats
  const getImageUrl = (imageItem: any): string => {
    if (typeof imageItem === 'string') {
      return imageItem;
    }
    if (imageItem && typeof imageItem === 'object') {
      return imageItem.src || imageItem.url || imageItem.image_url || '';
    }
    return '';
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label className="text-lg font-medium">Hero Image</Label>
          <p className="text-sm text-muted-foreground">The main product image displayed prominently</p>
        </div>
        
        {formData.hero_image_url && (
          <div className="relative inline-block">
            <img
              src={formData.hero_image_url}
              alt="Hero image"
              className="w-48 h-48 object-cover rounded border bg-transparent"
              style={{backgroundColor: 'transparent'}}
            />
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => onChange({ ...formData, hero_image_url: '' })}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <Label className="text-lg font-medium">Additional Images</Label>
          <p className="text-sm text-muted-foreground">Gallery images that customers can view</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {formData.additional_images?.map((imageItem: any, index: number) => {
            const displayUrl = getImageUrl(imageItem);
            
            if (!displayUrl) {
              return null; // Skip invalid entries
            }
            
            return (
              <div key={index} className="relative group">
                <img
                  src={displayUrl}
                  alt={`Product image ${index + 1}`}
                  className="w-full h-32 object-cover rounded border bg-transparent"
                  style={{backgroundColor: 'transparent'}}
                  onError={(e) => {
                    console.log('Image failed to load:', displayUrl);
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1548502499-ef49e8cf98d4?w=600&auto=format';
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
                  <div className="flex space-x-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setAsHeroImage(displayUrl)}
                    >
                      Set Hero
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
          <div className="space-y-4">
            <div className="text-center">
              <Label htmlFor="image-upload" className="cursor-pointer">
                <div className="flex flex-col items-center space-y-2">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm font-medium">Upload Image</span>
                </div>
              </Label>
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
            </div>

            <div className="text-center text-sm text-muted-foreground">or</div>

            <div className="flex space-x-2">
              <Input
                placeholder="Enter image URL"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addImageByUrl()}
              />
              <Button onClick={addImageByUrl} disabled={!newImageUrl.trim()}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductImagesTab;
