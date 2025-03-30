
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { uploadImage } from "@/components/pwa/artist-settings/api/imageUploadAPI";
import { logger } from "@/utils/logger";
import { ensureArray } from "@/utils/ensureArray";

/**
 * Fetch artist data including artworks from Supabase
 */
export const fetchArtistData = async (artistId: string) => {
  try {
    if (!artistId) {
      return { data: null, error: new Error("No artist ID provided") };
    }
    
    const numericId = parseInt(artistId, 10);
    
    if (isNaN(numericId)) {
      return { data: null, error: new Error("Invalid artist ID") };
    }
    
    const { data, error } = await supabase
      .from('artists')
      .select('*')
      .eq('id', numericId)
      .maybeSingle();
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error: any) {
    logger.error("Error fetching artist data:", error);
    return { data: null, error };
  }
};

/**
 * Upload artwork for an artist
 */
export const uploadArtwork = async (file: File, artistName: string, artistId: string | null) => {
  try {
    // Upload image to storage
    const safeName = artistName.replace(/\s+/g, '_');
    const imageUrl = await uploadImage(file, safeName, false);
    
    if (!imageUrl) {
      throw new Error("Failed to upload image");
    }
    
    // If there's no artist ID yet, just return the URL
    if (!artistId) {
      return { url: imageUrl, error: null };
    }
    
    // Update the artist record with the new artwork
    const numericId = parseInt(artistId, 10);
    
    if (isNaN(numericId)) {
      throw new Error("Invalid artist ID");
    }
    
    // Get current artworks
    const { data: artistData, error: fetchError } = await supabase
      .from('artists')
      .select('artworks')
      .eq('id', numericId)
      .single();
    
    if (fetchError) throw fetchError;
    
    // Convert to array and add new artwork
    const currentArtworks = ensureArray(artistData.artworks || []);
    const updatedArtworks = [...currentArtworks, imageUrl];
    
    // Update the database
    const { error: updateError } = await supabase
      .from('artists')
      .update({ artworks: updatedArtworks })
      .eq('id', numericId);
    
    if (updateError) throw updateError;
    
    return { url: imageUrl, updatedArtworks, error: null };
  } catch (error: any) {
    logger.error("Error uploading artwork:", error);
    return { url: null, error };
  }
};

/**
 * Remove artwork at specific index
 */
export const removeArtwork = async (artistId: string, artworks: string[], index: number) => {
  try {
    if (!artistId) return { success: false, error: new Error("No artist ID provided") };
    
    const numericId = parseInt(artistId, 10);
    
    if (isNaN(numericId)) {
      return { success: false, error: new Error("Invalid artist ID") };
    }
    
    // Create a copy of the artworks array and remove the selected artwork
    const updatedArtworks = [...artworks];
    updatedArtworks.splice(index, 1);
    
    // Update the database
    const { error } = await supabase
      .from('artists')
      .update({ artworks: updatedArtworks })
      .eq('id', numericId);
    
    if (error) throw error;
    
    return { success: true, updatedArtworks, error: null };
  } catch (error: any) {
    logger.error("Error removing artwork:", error);
    return { success: false, error };
  }
};

/**
 * Set artwork as artist background image
 */
export const setArtworkAsBackground = async (artistId: string, artworkUrl: string) => {
  try {
    if (!artistId) return { success: false, error: new Error("No artist ID provided") };
    
    const numericId = parseInt(artistId, 10);
    
    if (isNaN(numericId)) {
      return { success: false, error: new Error("Invalid artist ID") };
    }
    
    // Update the artist's image field with the selected artwork URL
    const { error } = await supabase
      .from('artists')
      .update({ image: artworkUrl })
      .eq('id', numericId);
    
    if (error) throw error;
    
    return { success: true, error: null };
  } catch (error: any) {
    logger.error("Error setting background image:", error);
    return { success: false, error };
  }
};

/**
 * Sync artist images via Supabase function
 */
export const syncArtistImages = async (artistId: string) => {
  try {
    if (!artistId) return { success: false, error: new Error("No artist ID provided") };
    
    // Call the sync-artist-images function
    const { data, error } = await supabase.functions.invoke('sync-artist-images', {
      body: { artistId }
    });
    
    if (error) throw error;
    
    logger.info("Image sync response:", data);
    return { success: true, data, error: null };
  } catch (error: any) {
    logger.error("Error syncing images:", error);
    return { success: false, error };
  }
};
