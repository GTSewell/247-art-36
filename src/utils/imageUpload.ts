
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

/**
 * Uploads an image file to Supabase storage
 * @param file - The image file to upload
 * @param bucketName - The storage bucket name (default: 'images')
 * @param path - Optional path within the bucket
 * @returns The URL of the uploaded image or null if upload failed
 */
export const uploadImage = async (
  file: File, 
  bucketName: string = 'images',
  path?: string
): Promise<string | null> => {
  try {
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive"
      });
      return null;
    }

    // Generate a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = path ? `${path}/${fileName}` : fileName;
    
    // Upload file to Supabase
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive"
      });
      return null;
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(data.path);
    
    return publicUrl;
  } catch (error) {
    console.error('Unexpected error during upload:', error);
    toast({
      title: "Upload Failed",
      description: "An unexpected error occurred during upload",
      variant: "destructive"
    });
    return null;
  }
};

/**
 * Get a list of all images in a bucket
 * @param bucketName - The storage bucket name (default: 'images')
 * @param path - Optional path within the bucket
 * @returns Array of image objects or empty array if failed
 */
export const listImages = async (
  bucketName: string = 'images',
  path?: string
): Promise<{name: string, url: string}[]> => {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .list(path || '', {
        sortBy: { column: 'name', order: 'asc' }
      });
    
    if (error) {
      console.error('Error listing images:', error);
      return [];
    }
    
    // Filter for image files and convert to URLs
    return data
      .filter(item => !item.id.endsWith('/') && isImageFile(item.name))
      .map(item => ({
        name: item.name,
        url: supabase.storage
          .from(bucketName)
          .getPublicUrl(path ? `${path}/${item.name}` : item.name).data.publicUrl
      }));
  } catch (error) {
    console.error('Unexpected error listing images:', error);
    return [];
  }
};

// Helper to check if filename is an image
const isImageFile = (filename: string): boolean => {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'];
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  return imageExtensions.includes(ext);
};
