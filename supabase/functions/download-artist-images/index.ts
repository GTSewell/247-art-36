
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { corsHeaders } from "../_shared/cors.ts";
import { processArtistProfileImage, processArtistArtworks } from "../_shared/artist-images.ts";

// Create a Supabase client
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
);

/**
 * Ensure the artist-images storage bucket exists
 */
async function ensureStorageBucketExists(): Promise<void> {
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
}

/**
 * Process a single artist's images (profile and artworks)
 */
async function processArtist(
  artist: any, 
  storageFolder: string,
  results: any
): Promise<void> {
  try {
    // Skip artists without an id or name
    if (!artist.id || !artist.name) {
      results.skipped.push({
        id: artist.id || 0,
        reason: 'Missing ID or name'
      });
      return;
    }

    console.log(`Processing artist: ${artist.name} (ID: ${artist.id})`);

    // Process profile image
    await processArtistProfileImage(artist, storageFolder, supabaseAdmin);
    
    // Process artwork images
    await processArtistArtworks(artist, storageFolder, supabaseAdmin);

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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    // Get the request body
    const { regenerateAll = false, artist_ids = [] } = await req.json();

    console.log(`Processing request to download artist images, regenerateAll=${regenerateAll}, specific artist_ids=${artist_ids.length > 0 ? artist_ids.join(',') : 'none'}`);

    // Make sure the storage bucket exists
    await ensureStorageBucketExists();

    // Initialize results
    const results = {
      success: [] as Array<{ id: number; name: string; newUrl: string }>,
      failed: [] as Array<{ id: number; reason: string }>,
      skipped: [] as Array<{ id: number; reason: string }>,
    };

    // Get the current timestamp for the storage folder
    const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
    const storageFolder = `processed-${timestamp}`;

    // Fetch all artists or specific ones
    let artistsQuery = supabaseAdmin.from('artists').select('*');
    
    // If specific artist ids were provided, filter by them
    if (artist_ids && artist_ids.length > 0) {
      artistsQuery = artistsQuery.in('id', artist_ids);
    }
    
    const { data: artists, error: artistsError } = await artistsQuery;

    if (artistsError) {
      throw new Error(`Failed to fetch artists: ${artistsError.message}`);
    }
    
    console.log(`Found ${artists.length} artists to process`);

    // Process each artist
    for (const artist of artists) {
      await processArtist(artist, storageFolder, results);
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
