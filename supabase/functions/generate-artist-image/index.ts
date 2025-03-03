
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.1";

// Define CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Function to generate a random string for filenames
function generateRandomString(length = 10) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// Function to download an image from a URL and convert to File object
async function downloadImage(url: string, filename: string): Promise<Uint8Array> {
  console.log(`Downloading image from: ${url}`);
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    return new Uint8Array(arrayBuffer);
  } catch (error) {
    console.error("Error downloading image:", error);
    throw error;
  }
}

// Function to upload image to Supabase Storage
async function uploadImageToStorage(
  supabase: any, 
  imageData: Uint8Array, 
  filename: string
): Promise<string> {
  console.log(`Uploading image to storage: ${filename}`);
  
  try {
    // Create the bucket if it doesn't exist
    const { data: bucketData, error: bucketError } = await supabase
      .storage
      .getBucket('artist-images');
    
    if (bucketError && bucketError.message.includes('The resource was not found')) {
      console.log('Creating artist-images bucket');
      const { error: createBucketError } = await supabase
        .storage
        .createBucket('artist-images', {
          public: true
        });
      
      if (createBucketError) {
        throw createBucketError;
      }
    } else if (bucketError) {
      throw bucketError;
    }
    
    // Upload the file
    const { data, error } = await supabase
      .storage
      .from('artist-images')
      .upload(filename, imageData, {
        contentType: 'image/jpeg',
        upsert: true
      });
    
    if (error) {
      throw error;
    }
    
    // Get the public URL
    const { data: publicURLData } = supabase
      .storage
      .from('artist-images')
      .getPublicUrl(filename);
    
    console.log(`Image uploaded successfully. Public URL: ${publicURLData.publicUrl}`);
    return publicURLData.publicUrl;
  } catch (error) {
    console.error("Error uploading image to storage:", error);
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Parse request body
    const { 
      artist_id, 
      prompt, 
      save = false, 
      generate_artworks = false, 
      count = 4,
      download_image = false,
      download_images = false
    } = await req.json();

    // Validate artist_id
    if (!artist_id) {
      return new Response(
        JSON.stringify({ error: 'artist_id is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get artist data
    const { data: artist, error: artistError } = await supabase
      .from('artists')
      .select('*')
      .eq('id', artist_id)
      .single();

    if (artistError) {
      console.error('Error fetching artist:', artistError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch artist data', details: artistError.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Process based on operation type
    if (save && artist.image) {
      // Handle save operation - download and store the existing temp image
      console.log(`Saving artist image for artist ID: ${artist_id}`);
      
      try {
        const imageData = await downloadImage(artist.image, `artist_${artist_id}.jpg`);
        const filename = `artist_${artist_id}_${generateRandomString()}.jpg`;
        const publicUrl = await uploadImageToStorage(supabase, imageData, filename);
        
        // Update artist record with new image URL
        const { error: updateError } = await supabase
          .from('artists')
          .update({ image: publicUrl })
          .eq('id', artist_id);
        
        if (updateError) {
          throw updateError;
        }
        
        return new Response(
          JSON.stringify({ success: true, message: 'Artist image saved successfully', url: publicUrl }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      } catch (error) {
        console.error('Error saving artist image:', error);
        return new Response(
          JSON.stringify({ error: 'Failed to save artist image', details: error.message }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
    } else if (generate_artworks) {
      // Handle artwork generation
      console.log(`Generating ${count} artworks for artist ID: ${artist_id}`);
      
      try {
        // Simulate artwork generation (replace this with actual API call)
        const artworkUrls = [];
        const artworkStyle = artist.styles && artist.styles.length > 0 
          ? artist.styles[0] 
          : 'contemporary';
        
        for (let i = 0; i < count; i++) {
          // In a real implementation, you would call an image generation API here
          // For now, we're using placeholder URLs
          const placeholderUrl = `https://placehold.co/600x600/random?text=${encodeURIComponent(artist.name)}_artwork_${i}`;
          artworkUrls.push(placeholderUrl);
        }
        
        // If download_images flag is true, download and store the artwork images
        if (download_images) {
          const storedUrls = [];
          
          for (let i = 0; i < artworkUrls.length; i++) {
            const imageData = await downloadImage(artworkUrls[i], `artwork_${artist_id}_${i}.jpg`);
            const filename = `artwork_${artist_id}_${i}_${generateRandomString()}.jpg`;
            const publicUrl = await uploadImageToStorage(supabase, imageData, filename);
            storedUrls.push(publicUrl);
          }
          
          // Update artist record with new artwork URLs
          const { error: updateError } = await supabase
            .from('artists')
            .update({ artworks: storedUrls })
            .eq('id', artist_id);
          
          if (updateError) {
            throw updateError;
          }
          
          return new Response(
            JSON.stringify({ success: true, message: 'Artworks generated and saved successfully', urls: storedUrls }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        } else {
          // Just update artist record with the generated URLs
          const { error: updateError } = await supabase
            .from('artists')
            .update({ artworks: artworkUrls })
            .eq('id', artist_id);
          
          if (updateError) {
            throw updateError;
          }
          
          return new Response(
            JSON.stringify({ success: true, message: 'Artworks generated successfully', urls: artworkUrls }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }
      } catch (error) {
        console.error('Error generating artworks:', error);
        return new Response(
          JSON.stringify({ error: 'Failed to generate artworks', details: error.message }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
    } else {
      // Handle image generation
      console.log(`Generating artist image for artist ID: ${artist_id}`);
      
      try {
        // Create a prompt if not provided
        const imagePrompt = prompt || `Professional portrait photograph of a ${artist.specialty} artist named ${artist.name}`;
        
        // In a real implementation, you would call an image generation API here
        // For now, we're using a placeholder URL
        const generatedImageUrl = `https://placehold.co/400x400/random?text=${encodeURIComponent(artist.name)}`;
        
        // If download_image flag is true, download and store the image
        if (download_image) {
          const imageData = await downloadImage(generatedImageUrl, `artist_${artist_id}.jpg`);
          const filename = `artist_${artist_id}_${generateRandomString()}.jpg`;
          const publicUrl = await uploadImageToStorage(supabase, imageData, filename);
          
          // Update artist record with new image URL
          const { error: updateError } = await supabase
            .from('artists')
            .update({ image: publicUrl })
            .eq('id', artist_id);
          
          if (updateError) {
            throw updateError;
          }
          
          return new Response(
            JSON.stringify({ success: true, message: 'Artist image generated and saved successfully', url: publicUrl }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        } else {
          // Just update artist record with the generated URL
          const { error: updateError } = await supabase
            .from('artists')
            .update({ image: generatedImageUrl })
            .eq('id', artist_id);
          
          if (updateError) {
            throw updateError;
          }
          
          return new Response(
            JSON.stringify({ success: true, message: 'Artist image generated successfully', url: generatedImageUrl }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }
      } catch (error) {
        console.error('Error generating artist image:', error);
        return new Response(
          JSON.stringify({ error: 'Failed to generate artist image', details: error.message }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred', details: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
