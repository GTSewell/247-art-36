import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { v4 as uuidv4 } from 'https://esm.sh/uuid@9.0.1';

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Create a Supabase client
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    // Get the request body
    const { regenerateAll = false } = await req.json();

    console.log(`Processing request to download artist images, regenerateAll=${regenerateAll}`);

    // Check if the artist-images bucket exists, create it if it doesn't
    try {
      const { data: bucketData, error: bucketError } = await supabaseAdmin
        .storage
        .getBucket('artist-images');
      
      if (bucketError && bucketError.message.includes('does not exist')) {
        // Create the bucket if it doesn't exist
        const { error: createBucketError } = await supabaseAdmin
          .storage
          .createBucket('artist-images', {
            public: true
          });
        
        if (createBucketError) {
          console.error('Error creating storage bucket:', createBucketError);
          throw new Error(`Failed to create storage bucket: ${createBucketError.message}`);
        }
        console.log('Created artist-images bucket successfully');
      }
    } catch (error) {
      console.error('Error checking/creating bucket:', error);
      // Continue execution, as this might not be fatal
    }

    // Initialize results
    const results = {
      success: [] as Array<{ id: number; name: string; newUrl: string }>,
      failed: [] as Array<{ id: number; reason: string }>,
      skipped: [] as Array<{ id: number; reason: string }>,
    };

    // Get the current timestamp for the storage folder
    const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
    const storageFolder = `processed-${timestamp}`;

    // Fetch all artists
    const { data: artists, error: artistsError } = await supabaseAdmin
      .from('artists')
      .select('*');

    if (artistsError) {
      throw new Error(`Failed to fetch artists: ${artistsError.message}`);
    }
    
    console.log(`Found ${artists.length} artists to process`);

    // Process each artist
    for (const artist of artists) {
      try {
        // Skip artists without an id or name
        if (!artist.id || !artist.name) {
          results.skipped.push({
            id: artist.id || 0,
            reason: 'Missing ID or name'
          });
          continue;
        }

        console.log(`Processing artist: ${artist.name} (ID: ${artist.id})`);

        // Process profile image
        if (artist.image) {
          try {
            // Download and store the profile image
            const profileImageUrl = await downloadAndStoreImage(
              artist.image,
              `${storageFolder}/profiles/${artist.id}.webp`,
              supabaseAdmin
            );

            if (profileImageUrl) {
              // Update the artist record with the new image URL
              const { error: updateError } = await supabaseAdmin
                .from('artists')
                .update({ image: profileImageUrl })
                .eq('id', artist.id);

              if (updateError) {
                console.error(`Error updating profile image for artist ${artist.id}:`, updateError);
              } else {
                console.log(`Updated profile image for artist ${artist.name}`);
              }
            }
          } catch (imageError) {
            console.error(`Error processing profile image for artist ${artist.id}:`, imageError);
          }
        }

        // Process artwork images
        if (artist.artworks) {
          try {
            const artworks = typeof artist.artworks === 'string' 
              ? JSON.parse(artist.artworks) 
              : artist.artworks;
            
            if (Array.isArray(artworks)) {
              const updatedArtworks = [];
              
              for (let i = 0; i < artworks.length; i++) {
                try {
                  // Download and store the artwork
                  const artworkUrl = await downloadAndStoreImage(
                    artworks[i],
                    `${storageFolder}/artworks/${artist.id}_${i+1}.webp`,
                    supabaseAdmin
                  );
                  
                  if (artworkUrl) {
                    updatedArtworks.push(artworkUrl);
                  } else {
                    // Keep the original URL if download fails
                    updatedArtworks.push(artworks[i]);
                  }
                } catch (artworkError) {
                  console.error(`Error processing artwork ${i+1} for artist ${artist.id}:`, artworkError);
                  // Keep the original URL if processing fails
                  updatedArtworks.push(artworks[i]);
                }
              }
              
              // Update the artist record with the new artwork URLs
              const { error: updateError } = await supabaseAdmin
                .from('artists')
                .update({ artworks: updatedArtworks })
                .eq('id', artist.id);
              
              if (updateError) {
                console.error(`Error updating artworks for artist ${artist.id}:`, updateError);
              } else {
                console.log(`Updated ${updatedArtworks.length} artworks for artist ${artist.name}`);
              }
            }
          } catch (artworksError) {
            console.error(`Error processing artworks for artist ${artist.id}:`, artworksError);
          }
        }

        // Record success
        results.success.push({
          id: artist.id,
          name: artist.name,
          newUrl: artist.image
        });
        
        console.log(`Successfully processed artist ${artist.name} (ID: ${artist.id})`);
        
      } catch (artistError) {
        console.error(`Error processing artist ${artist.id}:`, artistError);
        results.failed.push({
          id: artist.id,
          reason: artistError.message || 'Unknown error'
        });
      }
    }

    // Return results
    return new Response(
      JSON.stringify({
        success: results.success.length,
        failed: results.failed.length,
        skipped: results.skipped.length,
        results
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in download-artist-images function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'An unexpected error occurred' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

// Helper function to download and store an image
async function downloadAndStoreImage(
  imageUrl: string,
  storagePath: string,
  supabase: any
): Promise<string | null> {
  try {
    console.log(`Downloading image from ${imageUrl}`);
    
    // Skip if the URL is already a Supabase storage URL
    if (imageUrl.includes('storage.googleapis.com') && imageUrl.includes('artist-images')) {
      console.log('Image is already in Supabase storage, skipping');
      return imageUrl;
    }
    
    // Download the image
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to download image: ${imageResponse.status}`);
    }

    // Get the image data as a blob
    const imageBlob = await imageResponse.blob();

    // Upload to Supabase Storage
    const { data, error } = await supabase
      .storage
      .from('artist-images')
      .upload(storagePath, imageBlob, {
        contentType: 'image/webp',
        upsert: true
      });

    if (error) {
      throw new Error(`Failed to upload to storage: ${error.message}`);
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from('artist-images')
      .getPublicUrl(storagePath);

    console.log(`Successfully stored image at ${publicUrl}`);
    return publicUrl;
  } catch (error) {
    console.error('Error in downloadAndStoreImage:', error);
    return null;
  }
}
