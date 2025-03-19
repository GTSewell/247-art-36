
import { supabase } from "@/integrations/supabase/client";
import { Artist } from "@/data/types/artist";

// Fetch artist by numeric ID
export const fetchArtistById = async (artistId: string): Promise<Artist | null> => {
  try {
    // Try to fetch by numeric ID first
    const { data: artistData, error } = await supabase
      .from('artists')
      .select('*')
      .eq('id', artistId)
      .maybeSingle();
      
    if (error) {
      console.error('Error fetching artist by ID:', error);
      
      // Try to fetch by user_id if numeric ID fails
      const { data: artistByUserId, error: userIdError } = await supabase
        .from('artists')
        .select('*')
        .eq('user_id', artistId)
        .maybeSingle();
        
      if (userIdError) {
        console.error('Error fetching artist by user_id:', userIdError);
        return null;
      }
      
      return artistByUserId || null;
    }
    
    return artistData as Artist || null;
  } catch (error) {
    console.error('Error in fetchArtistById:', error);
    return null;
  }
};

// Fetch artist by user ID
export const fetchArtistByUserId = async (userId: string): Promise<Artist | null> => {
  try {
    const { data, error } = await supabase
      .from('artists')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
      
    if (error) {
      console.error('Error fetching artist by user ID:', error);
      return null;
    }
    
    return data as Artist || null;
  } catch (error) {
    console.error('Error in fetchArtistByUserId:', error);
    return null;
  }
};
