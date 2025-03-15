
import { supabase } from "@/integrations/supabase/client";
import { ArtistProfileFormData } from "../types";
import { processSocialPlatforms } from "../utils/socialPlatformUtils";
import { toast } from "sonner";

/**
 * Fetch artist profile from Supabase
 */
export const fetchArtistProfile = async (artistId: string) => {
  try {
    // First check if user already has an artist profile
    const { data, error } = await supabase
      .from('artists')
      .select('*')
      .eq('user_id', artistId)
      .maybeSingle();
    
    if (error && !error.message.includes('No rows found')) {
      throw error;
    }
    
    return { data, error: null };
  } catch (error: any) {
    console.error("Error fetching artist profile:", error);
    return { data: null, error };
  }
};

/**
 * Create or update artist profile in Supabase
 */
export const saveArtistProfile = async (formData: ArtistProfileFormData, artistId: string, existingArtist: any) => {
  try {
    // Process array values
    const processedData = {
      user_id: artistId,
      name: formData.name,
      specialty: formData.specialty,
      bio: formData.bio,
      city: formData.city,
      country: formData.country,
      techniques: formData.techniques.split(',').map(item => item.trim()).filter(item => item),
      styles: formData.styles.split(',').map(item => item.trim()).filter(item => item),
      social_platforms: processSocialPlatforms(formData.social_platforms),
      image: formData.image
    };
    
    console.log("Saving artist profile with data:", processedData);
    
    if (existingArtist) {
      // Update existing artist profile
      const { error } = await supabase
        .from('artists')
        .update(processedData)
        .eq('id', existingArtist.id);
      
      if (error) {
        console.error("Update error:", error);
        throw error;
      }
      
      return { success: true, message: "Profile updated successfully" };
    } else {
      // For new artist profiles, get the next available ID from the sequence
      const { data: maxIdData, error: maxIdError } = await supabase
        .from('artists')
        .select('id')
        .order('id', { ascending: false })
        .limit(1)
        .single();
        
      if (maxIdError && !maxIdError.message.includes('No rows found')) {
        throw maxIdError;
      }
      
      // Calculate next ID (either increment max ID or start at 1)
      const nextId = maxIdData ? maxIdData.id + 1 : 1;
      
      // Create new artist profile with the new ID
      const { error } = await supabase
        .from('artists')
        .insert([{
          id: nextId,
          ...processedData,
          published: true // Set published to true by default
        }]);
      
      if (error) {
        console.error("Insert error:", error);
        throw error;
      }
      
      return { success: true, message: "Profile created successfully" };
    }
  } catch (error: any) {
    console.error("Error saving artist profile:", error);
    return { success: false, message: error.message };
  }
};
