
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

export const uploadProfileImage = async (file: File, userId: string, artistId: number | null) => {
  try {
    if (!userId || !artistId) {
      throw new Error("Missing user ID or artist ID");
    }

    // Create a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `profile_${artistId}_${Date.now()}.${fileExt}`;
    const filePath = `profiles/${fileName}`;
    
    // Upload to Supabase Storage
    const { data, error } = await supabase
      .storage
      .from('artist-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (error) throw error;
    
    // Get the public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from('artist-images')
      .getPublicUrl(data.path);
    
    // Update the artist's image in the database
    const { error: updateError } = await supabase
      .from('artists')
      .update({ image: publicUrl })
      .eq('id', artistId);
    
    if (updateError) throw updateError;
    
    return publicUrl;
  } catch (error: any) {
    console.error("Error uploading profile image:", error);
    throw error;
  }
};

export const checkUserIsAdmin = async (userId: string): Promise<boolean> => {
  try {
    // Query for admin role in user_roles table instead of admin_users
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', 'admin')
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
