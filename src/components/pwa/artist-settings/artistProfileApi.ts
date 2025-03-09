
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { processArtistFormData } from "./artistProfileUtils";
import { ArtistProfileFormData } from "./types";

export const fetchArtistProfile = async (userId: string) => {
  try {
    // Check if user already has an artist profile
    const { data, error } = await supabase
      .from('artists')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error) {
      console.error("Error fetching artist profile:", error);
      console.log("No existing artist profile found, will create a new one if needed");
    }
    
    return data;
  } catch (error: any) {
    console.error("Error fetching artist profile:", error);
    throw error;
  }
};

export const updateArtistProfile = async (formData: ArtistProfileFormData, userId: string, artist: any) => {
  try {
    const processedData = processArtistFormData(formData, userId);
    
    if (artist) {
      // Update existing artist profile
      const { error } = await supabase
        .from('artists')
        .update(processedData)
        .eq('user_id', userId);
      
      if (error) throw error;
      
      toast.success("Profile updated successfully");
      return artist;
    } else {
      // Create new artist profile - we need to generate a numeric ID
      // First, get the next available ID by checking the max ID in the table
      const { data: maxIdData, error: maxIdError } = await supabase
        .from('artists')
        .select('id')
        .order('id', { ascending: false })
        .limit(1)
        .single();
        
      if (maxIdError && !maxIdError.message.includes('No rows found')) {
        throw maxIdError;
      }
      
      // Set the new ID as max + 1, or start at 1 if no records exist
      const newId = maxIdData ? maxIdData.id + 1 : 1;
      
      // Create new artist profile with the ID
      const { data, error } = await supabase
        .from('artists')
        .insert([{ ...processedData, id: newId }])
        .select()
        .single();
      
      if (error) throw error;
      
      toast.success("Profile created successfully");
      return data;
    }
  } catch (error: any) {
    console.error("Error updating artist profile:", error);
    throw error;
  }
};

export const checkUserIsAdmin = async (userId: string): Promise<boolean> => {
  try {
    // Query for admin role - assuming there's a table or a way to check admin status
    const { data, error } = await supabase
      .from('admin_users')
      .select('user_id')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error("Error checking admin status:", error);
      return false;
    }

    return !!data; // Return true if data exists, false otherwise
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
};
