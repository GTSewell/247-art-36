
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { corsHeaders } from "../_shared/cors.ts";

// Create a Supabase client
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
);

// Convert artist name to sanitized folder name
function sanitizeArtistName(name: string): string {
  return name.replace(/\s+/g, '_');
}

// Revert sanitized folder name to original artist name format
function desanitizeArtistName(folderName: string): string {
  return folderName.replace(/_+/g, ' ');
}

// Sync images from storage to database for a specific artist
async function syncArtistImages(artistId: number, artistName: string) {
  try {
    console.log(`Starting sync for artist ID ${artistId}, name: "${artistName}"`);
    
    // Sanitize artist name for folder path
    const sanitizedArtistName = sanitizeArtistName(artistName);
    console.log(`Looking for folders with name: "${sanitizedArtistName}"`);
    
    // Try to list all folders in the artists bucket to verify what's available
    const { data: rootFolders, error: rootFoldersError } = await supabaseAdmin.storage
      .from('artists')
      .list('');
    
    if (rootFoldersError) {
      console.error(`Error listing root folders:`, rootFoldersError);
    } else {
      console.log(`Available folders in artists bucket:`, rootFolders.map(f => f.name).join(', '));
    }
    
    // Get profile image
    const profilePath = `${sanitizedArtistName}/Profile_Image`;
    console.log(`Checking for profile images in: ${profilePath}`);
    
    const { data: profileFiles, error: profileError } = await supabaseAdmin.storage
      .from('artists')
      .list(profilePath);
    
    if (profileError) {
      console.error(`Error listing profile images for ${artistName}:`, profileError);
    } else if (profileFiles && profileFiles.length > 0) {
      console.log(`Found ${profileFiles.length} files in profile folder: ${profileFiles.map(f => f.name).join(', ')}`);
      
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
        
        console.log(`Using profile image: ${profileImageUrl}`);
        
        // Update artist profile image in database (update both image columns)
        const { error: updateError } = await supabaseAdmin
          .from('artists')
          .update({ 
            image: profileImageUrl,
            profile_image_url: profileImageUrl 
          })
          .eq('id', artistId);
        
        if (updateError) {
          console.error(`Error updating profile image for artist ${artistId}:`, updateError);
        } else {
          console.log(`Successfully updated profile images for artist ${artistId}`);
        }
      }
    } else {
      console.log(`No profile images found for artist ${artistName} in path: ${profilePath}`);
    }
    
    // Get artwork images
    const artworksPath = `${sanitizedArtistName}/Artworks`;
    console.log(`Checking for artwork images in: ${artworksPath}`);
    
    const { data: artworkFiles, error: artworksError } = await supabaseAdmin.storage
      .from('artists')
      .list(artworksPath);
    
    if (artworksError) {
      console.error(`Error listing artwork images for ${artistName}:`, artworksError);
    } else if (artworkFiles && artworkFiles.length > 0) {
      console.log(`Found ${artworkFiles.length} files in artworks folder: ${artworkFiles.map(f => f.name).join(', ')}`);
      
      // Filter and get public URLs for all artwork files
      const artworkUrls = artworkFiles
        .filter(file => !file.id.endsWith('/'))
        .map(file => 
          supabaseAdmin.storage
            .from('artists')
            .getPublicUrl(`${artworksPath}/${file.name}`).data.publicUrl
        );
      
      if (artworkUrls.length > 0) {
        console.log(`Generated ${artworkUrls.length} artwork URLs`);
        
        // Update both artwork related columns in the database
        const { error: updateError } = await supabaseAdmin
          .from('artists')
          .update({ 
            artworks: artworkUrls,
            artwork_files: artworkUrls
          })
          .eq('id', artistId);
        
        if (updateError) {
          console.error(`Error updating artworks for artist ${artistId}:`, updateError);
        } else {
          console.log(`Successfully updated ${artworkUrls.length} artworks for artist ${artistId}`);
        }
      }
    } else {
      console.log(`No artwork images found for artist ${artistName} in path: ${artworksPath}`);
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
    
    console.log(`Processing sync request for artist ID: ${artistId}`);
    
    // Get the artist details first
    const { data: artist, error: artistError } = await supabaseAdmin
      .from('artists')
      .select('*')
      .eq('id', artistId)
      .single();
    
    if (artistError) {
      console.error(`Failed to fetch artist with ID ${artistId}:`, artistError);
      throw new Error(`Failed to fetch artist: ${artistError.message}`);
    }
    
    if (!artist || !artist.name) {
      console.error(`No artist found with ID: ${artistId}`);
      throw new Error(`Artist not found with ID: ${artistId}`);
    }
    
    console.log(`Found artist: ${artist.name} (ID: ${artistId})`);
    
    // Sync images for the artist
    const result = await syncArtistImages(artistId, artist.name);
    
    return new Response(
      JSON.stringify({
        ...result,
        artistName: artist.name,
        artistId: artist.id
      }),
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
