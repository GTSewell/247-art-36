import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { X, Save, RefreshCw } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ProductBasicInfoTab from './ProductBasicInfoTab';
import ProductImagesTab from './ProductImagesTab';
import ProductSpecificationsTab from './ProductSpecificationsTab';
import ProductContentTab from './ProductContentTab';
import ProductShopifyTab from './ProductShopifyTab';
import ProductTimedEditionTab from './ProductTimedEditionTab';

interface ProductEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
  onProductUpdated: () => void;
}

const ProductEditModal: React.FC<ProductEditModalProps> = ({
  isOpen,
  onClose,
  product,
  onProductUpdated
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    custom_description: '',
    price: 0,
    category: '',
    artist_id: null,
    hero_image_url: '',
    additional_images: [],
    specifications: {},
    production_info: '',
    shipping_info: '',
    end_time: null,
    start_time: null,
    is_visible: true
  });
  const { toast } = useToast();

  useEffect(() => {
    if (product && isOpen) {
      setFormData({
        name: product.name || '',
        custom_description: product.custom_description || product.description || '',
        price: product.price || 0,
        category: product.category || '',
        artist_id: product.artist_id || null,
        hero_image_url: product.hero_image_url || product.image_url || '',
        additional_images: product.additional_images || [],
        specifications: product.specifications || {},
        production_info: product.production_info || '',
        shipping_info: product.shipping_info || '',
        end_time: product.end_time || null,
        start_time: product.start_time || null,
        is_visible: product.is_visible !== false
      });
    }
  }, [product, isOpen]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      console.log('Saving product with data:', formData);
      
      // Ensure specifications is a valid object
      const cleanedSpecifications = formData.specifications || {};
      
      const updateData = {
        name: formData.name,
        custom_description: formData.custom_description,
        price: Number(formData.price),
        category: formData.category as "print" | "merch" | "sticker" | "original" | "signed" | "collection",
        artist_id: formData.artist_id,
        hero_image_url: formData.hero_image_url,
        additional_images: formData.additional_images || [],
        specifications: cleanedSpecifications,
        production_info: formData.production_info,
        shipping_info: formData.shipping_info,
        end_time: formData.end_time,
        is_visible: formData.is_visible
      };

      console.log('Update data:', updateData);

      const { error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', product.id);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      toast({
        title: "Product Updated",
        description: "Product information has been successfully updated.",
      });
      
      onProductUpdated();
      onClose();
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Failed to update product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (product) {
      setFormData({
        name: product.name || '',
        custom_description: product.custom_description || product.description || '',
        price: product.price || 0,
        category: product.category || '',
        artist_id: product.artist_id || null,
        hero_image_url: product.hero_image_url || product.image_url || '',
        additional_images: product.additional_images || [],
        specifications: product.specifications || {},
        production_info: product.production_info || '',
        shipping_info: product.shipping_info || '',
        end_time: product.end_time || null,
        start_time: product.start_time || null,
        is_visible: product.is_visible !== false
      });
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between border-b pb-4">
          <DialogTitle className="text-xl font-semibold">
            Edit Product: {product?.name}
          </DialogTitle>
          <Button variant="ghost" size="sm" onClick={handleCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Tabs defaultValue="basic" className="flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-6 bg-muted p-1.5 rounded-lg border">
            <TabsTrigger value="basic" className="text-xs sm:text-sm px-2 py-2 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm hover:bg-background/50 transition-all font-medium">Basic Info</TabsTrigger>
            <TabsTrigger value="images" className="text-xs sm:text-sm px-2 py-2 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm hover:bg-background/50 transition-all font-medium">Images</TabsTrigger>
            <TabsTrigger value="specs" className="text-xs sm:text-sm px-2 py-2 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm hover:bg-background/50 transition-all font-medium">Specifications</TabsTrigger>
            <TabsTrigger value="content" className="text-xs sm:text-sm px-2 py-2 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm hover:bg-background/50 transition-all font-medium">Content</TabsTrigger>
            <TabsTrigger value="timed" className="text-xs sm:text-sm px-2 py-2 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm hover:bg-background/50 transition-all font-medium">Timed Edition</TabsTrigger>
            <TabsTrigger value="shopify" className="text-xs sm:text-sm px-2 py-2 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm hover:bg-background/50 transition-all font-medium">Shopify</TabsTrigger>
          </TabsList>

          <div className="mt-4 overflow-y-auto max-h-[60vh]">
            <TabsContent value="basic">
              <ProductBasicInfoTab
                formData={formData}
                onChange={setFormData}
              />
            </TabsContent>

            <TabsContent value="images">
              <ProductImagesTab
                formData={formData}
                onChange={setFormData}
              />
            </TabsContent>

            <TabsContent value="specs">
              <ProductSpecificationsTab
                formData={formData}
                onChange={setFormData}
              />
            </TabsContent>

            <TabsContent value="content">
              <ProductContentTab
                formData={formData}
                onChange={setFormData}
              />
            </TabsContent>

            <TabsContent value="timed">
              <ProductTimedEditionTab
                formData={formData}
                onChange={setFormData}
              />
            </TabsContent>

            <TabsContent value="shopify">
              <ProductShopifyTab product={product} />
            </TabsContent>
          </div>
        </Tabs>

        <div className="flex justify-end space-x-2 border-t pt-4">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductEditModal;