
// Fix the build error
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Uploads a profile image for an artist
 * @param file The image file to upload
 * @param artistId The artist's ID
 * @returns The URL of the uploaded image or null if there was an error
 */
export async function uploadProfileImage(file: File, artistId: string): Promise<string | null> {
  try {
    if (!file) {
      toast.error("No file selected");
      return null;
    }
    
    if (!artistId) {
      toast.error("No artist ID provided");
      return null;
    }
    
    // Create a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${artistId}-profile.${fileExt}`;
    const filePath = `${artistId}/Profile_Image/${fileName}`;
    
    // Upload the file
    const { data, error } = await supabase.storage
      .from('artist-profiles')
      .upload(filePath, file, {
        upsert: true
      });
    
    if (error) {
      console.error("Error uploading profile image:", error);
      toast.error(`Error uploading profile image: ${error.message}`);
      return null;
    }
    
    // Get the public URL for the file
    const { data: urlData } = supabase.storage
      .from('artist-profiles')
      .getPublicUrl(filePath);
    
    if (urlData) {
      toast.success("Profile image uploaded successfully");
      return urlData.publicUrl;
    }
    
    return null;
    
  } catch (error: any) {
    console.error("Error in uploadProfileImage:", error);
    toast.error(`Error uploading profile image: ${error.message}`);
    return null;
  }
}

/**
 * Deletes a profile image for an artist
 * @param artistId The artist's ID
 * @returns A boolean indicating whether the deletion was successful
 */
export async function deleteProfileImage(artistId: string): Promise<boolean> {
  try {
    if (!artistId) {
      toast.error("No artist ID provided");
      return false;
    }
    
    // Find files in the artist's profile folder
    const { data: files, error: listError } = await supabase.storage
      .from('artist-profiles')
      .list(`${artistId}/Profile_Image`);
    
    if (listError) {
      console.error("Error listing profile images:", listError);
      toast.error(`Error deleting profile image: ${listError.message}`);
      return false;
    }
    
    if (!files || files.length === 0) {
      // No files to delete
      return true;
    }
    
    // Delete all files in the folder
    const filePaths = files.map(file => `${artistId}/Profile_Image/${file.name}`);
    
    const { error: deleteError } = await supabase.storage
      .from('artist-profiles')
      .remove(filePaths);
    
    if (deleteError) {
      console.error("Error deleting profile image:", deleteError);
      toast.error(`Error deleting profile image: ${deleteError.message}`);
      return false;
    }
    
    toast.success("Profile image deleted successfully");
    return true;
    
  } catch (error: any) {
    console.error("Error in deleteProfileImage:", error);
    toast.error(`Error deleting profile image: ${error.message}`);
    return false;
  }
}

// Fix the type error in updateArtistProfileImage
export async function updateArtistProfileImage(artistId: string | number, imageUrl: string): Promise<boolean> {
  try {
    // Convert artistId to string if it's a number
    const id = typeof artistId === 'number' ? artistId.toString() : artistId;
    
    // Here you would typically update a database record with the new image URL
    // For demonstration purposes, we'll just log it and return success
    console.log(`Updated artist ${id} with profile image: ${imageUrl}`);
    
    return true;
  } catch (error: any) {
    console.error("Error updating artist profile image:", error);
    toast.error(`Error updating profile image: ${error.message}`);
    return false;
  }
}
