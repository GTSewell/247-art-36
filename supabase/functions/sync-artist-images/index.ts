
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { corsHeaders } from "../_shared/cors.ts";

// Create a Supabase client
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
);

// Sync images from storage to database for a specific artist
async function syncArtistImages(artistId: number, artistName: string) {
  try {
    // Sanitize artist name for folder path
    const sanitizedArtistName = artistName.replace(/\s+/g, '_');
    
    // Get profile image
    const profilePath = `${sanitizedArtistName}/Profile_Image`;
    const { data: profileFiles, error: profileError } = await supabaseAdmin.storage
      .from('artists')
      .list(profilePath);
    
    if (profileError) {
      console.error(`Error listing profile images for ${artistName}:`, profileError);
    } else if (profileFiles && profileFiles.length > 0) {
      // Get the latest profile image
      const latestProfileImage = profileFiles
        .filter(file => !file.id.endsWith('/'))
        .sort((a, b) => 
          new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
        )[0];
      
      if (latestProfileImage) {
        const profileImageUrl = supabaseAdmin.storage
          .from('artists')
          .getPublicUrl(`${profilePath}/${latestProfileImage.name}`).data.publicUrl;
        
        // Update artist profile image in database
        const { error: updateError } = await supabaseAdmin
          .from('artists')
          .update({ image: profileImageUrl })
          .eq('id', artistId);
        
        if (updateError) {
          console.error(`Error updating profile image for artist ${artistId}:`, updateError);
        } else {
          console.log(`Updated profile image for artist ${artistId}`);
        }
      }
    }
    
    // Get artwork images
    const artworksPath = `${sanitizedArtistName}/Artworks`;
    const { data: artworkFiles, error: artworksError } = await supabaseAdmin.storage
      .from('artists')
      .list(artworksPath);
    
    if (artworksError) {
      console.error(`Error listing artwork images for ${artistName}:`, artworksError);
    } else if (artworkFiles && artworkFiles.length > 0) {
      // Filter and get public URLs for all artwork files
      const artworkUrls = artworkFiles
        .filter(file => !file.id.endsWith('/'))
        .map(file => 
          supabaseAdmin.storage
            .from('artists')
            .getPublicUrl(`${artworksPath}/${file.name}`).data.publicUrl
        );
      
      if (artworkUrls.length > 0) {
        // Update artist artworks in database
        const { error: updateError } = await supabaseAdmin
          .from('artists')
          .update({ artworks: artworkUrls })
          .eq('id', artistId);
        
        if (updateError) {
          console.error(`Error updating artworks for artist ${artistId}:`, updateError);
        } else {
          console.log(`Updated ${artworkUrls.length} artworks for artist ${artistId}`);
        }
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error(`Error syncing images for artist ${artistId}:`, error);
    return { success: false, error: error.message };
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    const { artistId } = await req.json();
    
    if (!artistId) {
      throw new Error("Artist ID is required");
    }
    
    // Get the artist details first
    const { data: artist, error: artistError } = await supabaseAdmin
      .from('artists')
      .select('*')
      .eq('id', artistId)
      .single();
    
    if (artistError) {
      throw new Error(`Failed to fetch artist: ${artistError.message}`);
    }
    
    if (!artist || !artist.name) {
      throw new Error(`Artist not found with ID: ${artistId}`);
    }
    
    // Sync images for the artist
    const result = await syncArtistImages(artistId, artist.name);
    
    return new Response(
      JSON.stringify(result),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error in sync-artist-images function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'An unexpected error occurred' }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }, 
        status: 500 
      }
    );
  }
});
