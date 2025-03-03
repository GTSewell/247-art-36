
// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS headers for the function
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  regenerateAll?: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const requestBody: RequestBody = await req.json();
    const regenerateAll = requestBody.regenerateAll || false;

    // Extract the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Initialize results
    const results = {
      success: [] as Array<{ id: number; name: string; newUrl: string }>,
      failed: [] as Array<{ id: number; reason: string }>,
      skipped: [] as Array<{ id: number; reason: string }>,
    };

    // Get the current timestamp for the storage folder
    const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
    const storageFolder = `artist-images/${timestamp}`;

    // Create or ensure the storage bucket exists
    const { data: bucketData, error: bucketError } = await supabase
      .storage
      .getBucket('artist-images');
    
    if (bucketError && bucketError.message.includes('does not exist')) {
      // Create the bucket if it doesn't exist
      const { error: createBucketError } = await supabase
        .storage
        .createBucket('artist-images', {
          public: true
        });
      
      if (createBucketError) {
        console.error('Error creating storage bucket:', createBucketError);
        throw new Error(`Failed to create storage bucket: ${createBucketError.message}`);
      }
    }
    
    // Fetch all artists
    const { data: artists, error: artistsError } = await supabase
      .from('artists')
      .select('*');

    if (artistsError) {
      throw new Error(`Failed to fetch artists: ${artistsError.message}`);
    }
    
    console.log(`Processing ${artists.length} artists, regenerateAll=${regenerateAll}`);

    // Process each artist
    for (const artist of artists) {
      try {
        // Only process artists with an id and name
        if (!artist.id || !artist.name) {
          results.skipped.push({
            id: artist.id || 0,
            reason: 'Missing ID or name'
          });
          continue;
        }

        console.log(`Processing artist: ${artist.name} (ID: ${artist.id})`);

        // Generate a profile image using Runware API
        const profileImageData = await generateArtistImage(artist.name, artist.specialty || '', artist.id);
        
        if (!profileImageData || !profileImageData.imageURL) {
          results.failed.push({
            id: artist.id,
            reason: 'Failed to generate profile image'
          });
          continue;
        }

        // Download and upload the profile image to Supabase Storage
        const profileImageUrl = await downloadAndUploadImage(
          profileImageData.imageURL,
          `${storageFolder}/profiles/${artist.id}.webp`,
          supabase
        );

        if (!profileImageUrl) {
          results.failed.push({
            id: artist.id,
            reason: 'Failed to download and store profile image'
          });
          continue;
        }

        // Generate artwork images (up to 4)
        const artworkUrls = [];
        const numberOfArtworks = Math.min(4, artist.artworks?.length || 0);
        
        for (let i = 0; i < numberOfArtworks; i++) {
          // Generate a prompt based on artist's style and technique
          const artworkPrompt = generateArtworkPrompt(artist);
          
          // Generate the artwork
          const artworkData = await generateArtistImage(artist.name, artworkPrompt, artist.id);
          
          if (!artworkData || !artworkData.imageURL) {
            console.warn(`Failed to generate artwork ${i+1} for artist ${artist.name}`);
            continue;
          }
          
          // Download and upload artwork to Supabase Storage
          const artworkUrl = await downloadAndUploadImage(
            artworkData.imageURL,
            `${storageFolder}/artworks/${artist.id}_${i+1}.webp`,
            supabase
          );
          
          if (artworkUrl) {
            artworkUrls.push(artworkUrl);
          }
        }

        // Update the artist record with new profile image and artworks
        const { error: updateError } = await supabase
          .from('artists')
          .update({
            image: profileImageUrl,
            artworks: artworkUrls,
          })
          .eq('id', artist.id);

        if (updateError) {
          results.failed.push({
            id: artist.id,
            reason: `Failed to update artist record: ${updateError.message}`
          });
          continue;
        }

        // Log success
        results.success.push({
          id: artist.id,
          name: artist.name,
          newUrl: profileImageUrl
        });
        
        console.log(`Successfully processed artist ${artist.name} (ID: ${artist.id})`);
        
      } catch (error) {
        console.error(`Error processing artist ${artist.id}:`, error);
        results.failed.push({
          id: artist.id,
          reason: error.message || 'Unknown error'
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

// Helper function to generate a prompt for artwork
function generateArtworkPrompt(artist: any): string {
  const styles = Array.isArray(artist.styles) ? artist.styles : [];
  const techniques = Array.isArray(artist.techniques) ? artist.techniques : [];
  
  // Combine artist's style and techniques into a prompt
  const styleText = styles.length > 0 ? styles.join(', ') : 'contemporary';
  const techniqueText = techniques.length > 0 ? techniques.join(', ') : 'mixed media';
  
  return `${styleText} artwork using ${techniqueText} by artist ${artist.name}, ${artist.specialty || 'visual art'}`;
}

// Helper function to generate an image using Runware API
async function generateArtistImage(
  artistName: string, 
  specialty: string,
  seed: number
): Promise<{ imageURL: string } | null> {
  try {
    const runwareApiKey = Deno.env.get('RUNWARE_API_KEY');
    if (!runwareApiKey) {
      throw new Error('RUNWARE_API_KEY is not set in environment variables');
    }

    // Create a descriptive prompt for the artist
    const prompt = `Professional portrait photograph of ${artistName}, a ${specialty} artist, high quality, award-winning photograph, studio lighting, professional photoshoot`;
    
    // Generate a unique task ID
    const taskUUID = crypto.randomUUID();
    
    // Prepare the API request
    const requestData = [
      {
        taskType: "authentication",
        apiKey: runwareApiKey
      },
      {
        taskType: "imageInference",
        taskUUID,
        positivePrompt: prompt,
        model: "runware:100@1",
        width: 1024,
        height: 1024,
        numberResults: 1,
        outputFormat: "WEBP",
        CFGScale: 1,
        scheduler: "FlowMatchEulerDiscreteScheduler",
        strength: 0.8,
        seed: seed // Use the artist ID as seed for consistency
      }
    ];

    // Make the API request
    const response = await fetch('https://api.runware.ai/v1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    // Check if the request was successful
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Runware API error: ${response.status} ${text}`);
    }

    // Parse the response
    const responseData = await response.json();
    
    // Find the image generation result
    const imageResult = responseData.data?.find((item: any) => 
      item.taskType === 'imageInference' && item.taskUUID === taskUUID
    );

    if (!imageResult || !imageResult.imageURL) {
      throw new Error('No image URL found in the API response');
    }

    return {
      imageURL: imageResult.imageURL
    };
  } catch (error) {
    console.error('Error generating artist image:', error);
    return null;
  }
}

// Helper function to download an image and upload it to Supabase Storage
async function downloadAndUploadImage(
  imageUrl: string,
  storagePath: string,
  supabase: any
): Promise<string | null> {
  try {
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

    return publicUrl;
  } catch (error) {
    console.error('Error in downloadAndUploadImage:', error);
    return null;
  }
}
