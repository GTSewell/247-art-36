import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { v4 as uuidv4 } from 'https://esm.sh/uuid@9.0.1';

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Function to download an image from a URL
async function downloadImage(url: string): Promise<Uint8Array> {
  console.log(`Downloading image from ${url}`);
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
  }
  
  const arrayBuffer = await response.arrayBuffer();
  return new Uint8Array(arrayBuffer);
}

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
              artist_ids: [artist_id],
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
        // Continue with returning success even if download fails
      }
      
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

    // Generate artist image or artworks using Runware API
    if (generate_artworks) {
      // Generate multiple artworks
      console.log(`Generating ${count} artworks for artist ${artist_id}`);
      
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
      
      // Call Runware API to generate artworks
      const artworksPayload = [
        {
          taskType: "authentication",
          apiKey: runwareApiKey
        },
        ...Array(count).fill(null).map(() => ({
          taskType: "imageInference",
          taskUUID: uuidv4(),
          positivePrompt: artworkPrompt,
          model: "runware:100@1",
          width: 1024,
          height: 1024,
          numberResults: 1,
          outputFormat: "WEBP",
          CFGScale: 1,
        }))
      ];

      try {
        console.log('Sending artwork generation request to Runware API');
        const artworksResponse = await fetch('https://api.runware.ai/v1', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(artworksPayload),
        });

        if (!artworksResponse.ok) {
          const errorText = await artworksResponse.text();
          console.error(`Runware API error status: ${artworksResponse.status}, response: ${errorText}`);
          throw new Error(`Runware API returned ${artworksResponse.status}: ${errorText}`);
        }

        const artworksResult = await artworksResponse.json();
        console.log('Artworks generation response received');

        if (!artworksResult.data) {
          console.error('No data in Runware API response:', artworksResult);
          throw new Error('No data returned from Runware API');
        }

        // Extract image URLs from the response
        imageUrls = artworksResult.data
          .filter((item: any) => item.taskType === 'imageInference' && item.imageURL)
          .map((item: any) => item.imageURL);

        console.log(`Generated ${imageUrls.length} artwork URLs`);

        if (imageUrls.length === 0) {
          console.error('No image URLs in response:', artworksResult);
          throw new Error('No image URLs returned from Runware API');
        }
      } catch (error) {
        console.error('Error calling Runware API for artworks:', error);
        return new Response(
          JSON.stringify({ 
            error: 'Failed to generate artworks with Runware', 
            details: error.message 
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500 
          }
        );
      }

      // If requested, store the artwork images
      if (download_images && imageUrls.length > 0) {
        try {
          console.log('Updating artist record with new artworks');
          
          // Format artworks array based on how it's stored
          // Convert string arrays to actual arrays if needed
          let existingArtworks = [];
          if (artistData.artworks) {
            if (typeof artistData.artworks === 'string') {
              existingArtworks = JSON.parse(artistData.artworks);
            } else {
              existingArtworks = artistData.artworks;
            }
          }
          
          const artworksArray = [...imageUrls];
          
          // Update artist record with new artworks
          const { error: updateError } = await supabaseAdmin
            .from('artists')
            .update({ 
              artworks: artworksArray,
              locked_artworks: true 
            })
            .eq('id', artist_id);
            
          if (updateError) {
            console.error('Error updating artist artworks:', updateError);
            throw new Error(`Failed to update artist record: ${updateError.message}`);
          }
          
          console.log('Artist artworks updated successfully');
        } catch (error) {
          console.error('Error storing artworks:', error);
          // Continue with returning the URLs even if storage fails
        }
      }

      return new Response(
        JSON.stringify({ 
          message: 'Artworks generated successfully', 
          artworkUrls: imageUrls 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      // Generate a single artist portrait
      console.log(`Generating portrait for artist ${artist_id}`);
      
      // If no prompt provided, build one from artist data
      const userPrompt = prompt || `Professional portrait photograph of a ${artistData.specialty} artist named ${artistData.name} from ${artistData.city || ''} ${artistData.country || ''}. ${artistData.bio || ''}`;
      
      console.log(`Portrait prompt: ${userPrompt}`);
      
      // Call Runware API to generate portrait
      const portraitPayload = [
        {
          taskType: "authentication",
          apiKey: runwareApiKey
        },
        {
          taskType: "imageInference",
          taskUUID: uuidv4(),
          positivePrompt: userPrompt,
          model: "runware:100@1",
          width: 1024,
          height: 1024,
          numberResults: 1,
          outputFormat: "WEBP",
          CFGScale: 1,
        }
      ];

      try {
        console.log('Sending portrait generation request to Runware API');
        const portraitResponse = await fetch('https://api.runware.ai/v1', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(portraitPayload),
        });

        if (!portraitResponse.ok) {
          const errorText = await portraitResponse.text();
          console.error(`Runware API error status: ${portraitResponse.status}, response: ${errorText}`);
          throw new Error(`Runware API returned ${portraitResponse.status}: ${errorText}`);
        }

        const portraitResult = await portraitResponse.json();
        console.log('Portrait generation response received');

        if (!portraitResult.data) {
          console.error('No data in Runware API response:', portraitResult);
          throw new Error('No data returned from Runware API');
        }

        // Extract image URL from the response
        const imageResult = portraitResult.data.find((item: any) => 
          item.taskType === 'imageInference' && item.imageURL
        );

        if (!imageResult || !imageResult.imageURL) {
          console.error('No image URL in response:', portraitResult);
          throw new Error('No image URL returned from Runware API');
        }

        const imageUrl = imageResult.imageURL;
        console.log('Generated portrait URL:', imageUrl);

        // If requested, store the portrait image
        if (download_image) {
          try {
            console.log('Updating artist record with new image URL');
            const { error: updateError } = await supabaseAdmin
              .from('artists')
              .update({ image: imageUrl })
              .eq('id', artist_id);
              
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

        return new Response(
          JSON.stringify({ 
            message: 'Artist image generated successfully', 
            imageUrl: imageUrl 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (error) {
        console.error('Error calling Runware API for portrait:', error);
        return new Response(
          JSON.stringify({ 
            error: 'Failed to generate image with Runware', 
            details: error.message 
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500 
          }
        );
      }
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
