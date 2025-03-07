
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { corsHeaders } from "../_shared/cors.ts";
import { generateArtistPortrait, generateArtworks } from "../_shared/runware-api.ts";

// Create a Supabase client
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
);

/**
 * Trigger the download of artist images
 */
async function triggerImageDownload(artistId: number): Promise<void> {
  try {
    // Call the download-artist-images function for this specific artist
    const downloadResponse = await fetch(
      `${Deno.env.get('SUPABASE_URL')}/functions/v1/download-artist-images`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
        },
        body: JSON.stringify({ 
          artist_ids: [artistId],
          regenerateAll: false 
        }),
      }
    );

    if (!downloadResponse.ok) {
      const errorData = await downloadResponse.json();
      console.error('Error downloading images:', errorData);
    } else {
      console.log('Successfully triggered image download');
    }
  } catch (downloadError) {
    console.error('Error calling download-artist-images function:', downloadError);
  }
}

/**
 * Update artist record with artworks
 */
async function updateArtistArtworks(artistId: number, artworks: string[]): Promise<void> {
  try {
    console.log('Updating artist record with new artworks');
    
    // Update artist record with new artworks
    const { error: updateError } = await supabaseAdmin
      .from('artists')
      .update({ 
        artworks: artworks,
        locked_artworks: true 
      })
      .eq('id', artistId);
      
    if (updateError) {
      console.error('Error updating artist artworks:', updateError);
      throw new Error(`Failed to update artist record: ${updateError.message}`);
    }
    
    console.log('Artist artworks updated successfully');
  } catch (error) {
    console.error('Error storing artworks:', error);
    throw error;
  }
}

/**
 * Generate artist's portrait
 */
async function handlePortraitGeneration(
  artistData: any, 
  runwareApiKey: string, 
  prompt: string | null,
  downloadImage: boolean
): Promise<string> {
  // If no prompt provided, build one from artist data
  const userPrompt = prompt || `Professional portrait photograph of a ${artistData.specialty} artist named ${artistData.name} from ${artistData.city || ''} ${artistData.country || ''}. ${artistData.bio || ''}`;
  
  const imageUrl = await generateArtistPortrait(runwareApiKey, userPrompt);
  console.log('Generated portrait URL:', imageUrl);

  // If requested, store the portrait image
  if (downloadImage) {
    try {
      console.log('Updating artist record with new image URL');
      const { error: updateError } = await supabaseAdmin
        .from('artists')
        .update({ image: imageUrl })
        .eq('id', artistData.id);
        
      if (updateError) {
        console.error('Error updating artist image:', updateError);
        throw new Error(`Failed to update artist record: ${updateError.message}`);
      }
      
      console.log('Artist image updated successfully');
    } catch (error) {
      console.error('Error storing portrait:', error);
      // Continue with returning the URL even if storage fails
    }
  }

  return imageUrl;
}

/**
 * Generate artworks for an artist
 */
async function handleArtworkGeneration(
  artistData: any, 
  runwareApiKey: string, 
  count: number,
  downloadImages: boolean
): Promise<string[]> {
  // Build a prompt based on artist's data
  let artworkPrompt = `Professional artwork by ${artistData.name}, a ${artistData.specialty} artist.`;
  
  // Add bio if available
  if (artistData.bio) {
    artworkPrompt += ` ${artistData.bio}`;
  }
  
  // Add techniques if available
  if (artistData.techniques) {
    const techniques = Array.isArray(artistData.techniques) 
      ? artistData.techniques 
      : JSON.parse(artistData.techniques as string);
    
    if (techniques && techniques.length > 0) {
      artworkPrompt += ` Using techniques: ${techniques.join(', ')}.`;
    }
  }
  
  // Add styles if available
  if (artistData.styles) {
    const styles = Array.isArray(artistData.styles)
      ? artistData.styles
      : JSON.parse(artistData.styles as string);
    
    if (styles && styles.length > 0) {
      artworkPrompt += ` Style: ${styles.join(', ')}.`;
    }
  }
  
  console.log(`Artwork prompt: ${artworkPrompt}`);
  
  // Generate artworks
  const imageUrls = await generateArtworks(runwareApiKey, artworkPrompt, count);

  // If requested, store the artwork images
  if (downloadImages && imageUrls.length > 0) {
    try {
      await updateArtistArtworks(artistData.id, imageUrls);
    } catch (error) {
      console.error('Error updating artworks:', error);
      // Continue with returning the URLs even if storage fails
    }
  }

  return imageUrls;
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
    const { 
      artist_id, 
      prompt, 
      save = false, 
      generate_artworks = false,
      count = 1,
      download_image = false,
      download_images = false
    } = await req.json();

    console.log(`Processing request for artist ${artist_id}, save=${save}, generate_artworks=${generate_artworks}`);

    // Check if artist exists
    const { data: artistData, error: artistError } = await supabaseAdmin
      .from('artists')
      .select('*')
      .eq('id', artist_id)
      .single();

    if (artistError) {
      console.error('Error fetching artist:', artistError);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to find artist', 
          details: artistError.message 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    // If save is true, we're just updating the DB to mark the temp image as permanent
    if (save) {
      console.log('Saving existing artist image as permanent');
      
      // Trigger download of the image to Supabase storage
      await triggerImageDownload(artist_id);
      
      // Just return a success message 
      return new Response(
        JSON.stringify({ message: 'Artist image saved as permanent' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the Runware API key
    const runwareApiKey = Deno.env.get('RUNWARE_API_KEY');
    if (!runwareApiKey) {
      console.error('RUNWARE_API_KEY is not set in environment');
      return new Response(
        JSON.stringify({ 
          error: 'Configuration error', 
          details: 'Runware API key is not configured' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      );
    }

    console.log('Runware API key is configured, proceeding with generation');

    let imageUrls: string[] = [];

    // Generate artist image or artworks
    if (generate_artworks) {
      // Generate multiple artworks
      imageUrls = await handleArtworkGeneration(artistData, runwareApiKey, count, download_images);
      
      return new Response(
        JSON.stringify({ 
          message: 'Artworks generated successfully', 
          artworkUrls: imageUrls 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      // Generate a single artist portrait
      const imageUrl = await handlePortraitGeneration(artistData, runwareApiKey, prompt, download_image);
      
      return new Response(
        JSON.stringify({ 
          message: 'Artist image generated successfully', 
          imageUrl: imageUrl 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Add automatic call to download-artist-images at the end
    try {
      // This will happen in the background and won't block the response
      EdgeRuntime.waitUntil(
        fetch(
          `${Deno.env.get('SUPABASE_URL')}/functions/v1/download-artist-images`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
            },
            body: JSON.stringify({ 
              artist_ids: [artist_id],
              regenerateAll: false 
            }),
          }
        ).catch(e => console.error('Background download failed:', e))
      );
    } catch (backgroundError) {
      console.error('Error initiating background download:', backgroundError);
      // Continue with returning success even if background task fails
    }
  } catch (error) {
    console.error('Unexpected error in generate-artist-image function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process request', 
        details: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
