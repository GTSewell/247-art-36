
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

/**
 * Upload artist profile image to Supabase Storage
 */
export const uploadImage = async (file: File): Promise<string | null> => {
  try {
    // Generate unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `profiles/${fileName}`;
    
    console.log(`Uploading image to profiles/${fileName}`);
    
    // Upload image to Supabase
    const { data, error } = await supabase.storage
      .from('artist-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
    
    // Get public URL for the uploaded image
    const { data: { publicUrl } } = supabase.storage
      .from('artist-images')
      .getPublicUrl(filePath);
    
    console.log("Image uploaded successfully:", publicUrl);
    return publicUrl;
  } catch (error) {
    console.error("Error in uploadImage:", error);
    return null;
  }
};
