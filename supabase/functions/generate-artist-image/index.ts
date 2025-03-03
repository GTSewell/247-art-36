
// This edge function generates artist images using the Runware API
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const runwareApiKey = Deno.env.get('RUNWARE_API_KEY') || '';

// Create client with service role key for elevated privileges
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!runwareApiKey) {
      throw new Error("RUNWARE_API_KEY is not set in environment variables");
    }

    const { artist_id, prompt, save, generate_artworks, count, download_images } = await req.json();
    
    if (!artist_id) {
      throw new Error("Missing required parameter: artist_id");
    }

    console.log(`Processing request for artist_id: ${artist_id}`);
    console.log(`Parameters: save=${save}, generate_artworks=${generate_artworks}, count=${count}, download_images=${download_images}`);

    // Get artist info
    const { data: artist, error: artistError } = await supabase
      .from('artists')
      .select('*')
      .eq('id', artist_id)
      .single();

    if (artistError) {
      throw new Error(`Failed to fetch artist: ${artistError.message}`);
    }

    if (!artist) {
      throw new Error(`Artist with ID ${artist_id} not found`);
    }

    // Handle artworks generation
    if (generate_artworks) {
      console.log("Generating artworks for artist:", artist.name);
      const generatedArtworks = await generateArtworksWithRunware(artist, count || 4);
      
      // Download and store artworks if requested
      if (download_images && generatedArtworks && generatedArtworks.length > 0) {
        const artworkUrls = await downloadAndStoreImages(generatedArtworks, `artists/${artist_id}/artworks`);
        
        // Update artist record with new artwork URLs
        const { error: updateError } = await supabase
          .from('artists')
          .update({ artworks: artworkUrls })
          .eq('id', artist_id);
          
        if (updateError) {
          throw new Error(`Failed to update artist artworks: ${updateError.message}`);
        }
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: "Artworks generated and saved successfully",
            artworkUrls
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Artworks generated successfully",
          artworkUrls: generatedArtworks 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Handle artist image generation/saving
    if (save) {
      console.log("Saving temporary artist image for:", artist.name);
      // Get the temp image from storage
      const { data: tempImage, error: tempImageError } = await supabase.storage
        .from('temp_images')
        .download(`artists/${artist_id}/profile.png`);
      
      if (tempImageError || !tempImage) {
        throw new Error(`Failed to get temp image: ${tempImageError?.message || 'Image not found'}`);
      }
      
      // Upload to permanent storage
      const { error: uploadError } = await supabase.storage
        .from('artist_images')
        .upload(`${artist_id}/profile.png`, tempImage, {
          contentType: 'image/png',
          upsert: true
        });
      
      if (uploadError) {
        throw new Error(`Failed to upload image to permanent storage: ${uploadError.message}`);
      }
      
      // Get the public URL
      const { data: publicUrlData } = await supabase.storage
        .from('artist_images')
        .getPublicUrl(`${artist_id}/profile.png`);
      
      const publicUrl = publicUrlData?.publicUrl;
      
      // Update the artist's image field
      const { error: updateError } = await supabase
        .from('artists')
        .update({ image: publicUrl })
        .eq('id', artist_id);
      
      if (updateError) {
        throw new Error(`Failed to update artist image: ${updateError.message}`);
      }
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Artist image saved successfully",
          imageUrl: publicUrl 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Generate new artist image
    let finalPrompt = prompt;
    if (!finalPrompt) {
      // Create a default prompt if none provided
      finalPrompt = `Professional portrait photograph of a ${artist.specialty} artist named ${artist.name} from ${artist.city || ''} ${artist.country || ''}. ${artist.bio || ''}`;
    }
    
    console.log("Generating artist image with prompt:", finalPrompt);
    
    // Generate image using Runware
    const imageUrl = await generateImageWithRunware(finalPrompt);
    
    // Store generated image if requested
    if (download_images && imageUrl) {
      console.log("Downloading and storing generated image");
      // Download the image
      const imageResponse = await fetch(imageUrl);
      
      if (!imageResponse.ok) {
        throw new Error(`Failed to fetch image: ${imageResponse.status} ${imageResponse.statusText}`);
      }
      
      const imageBlob = await imageResponse.blob();
      
      // Upload to temporary storage
      const { error: uploadError } = await supabase.storage
        .from('temp_images')
        .upload(`artists/${artist_id}/profile.png`, imageBlob, {
          contentType: 'image/png',
          upsert: true
        });
      
      if (uploadError) {
        throw new Error(`Failed to upload image to temp storage: ${uploadError.message}`);
      }
      
      // Get the public URL
      const { data: publicUrlData } = await supabase.storage
        .from('temp_images')
        .getPublicUrl(`artists/${artist_id}/profile.png`);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Artist image generated and saved to temp storage",
          imageUrl: publicUrlData?.publicUrl 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Artist image generated",
        imageUrl 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  
  } catch (error) {
    console.error("Error in generate-artist-image function:", error);
    return new Response(
      JSON.stringify({ 
        error: "Failed to generate artist image", 
        details: error.message || "Unknown error"
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      }
    );
  }
});

// Function to generate image using Runware API
async function generateImageWithRunware(prompt: string): Promise<string> {
  try {
    console.log("Calling Runware API for image generation with prompt:", prompt);
    
    const response = await fetch("https://api.runware.ai/v1", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        {
          taskType: "authentication",
          apiKey: runwareApiKey,
        },
        {
          taskType: "imageInference",
          positivePrompt: prompt,
          model: "runware:100@1",
          width: 512,
          height: 512,
          numberResults: 1,
          outputFormat: "WEBP",
          CFGScale: 1,
          scheduler: "FlowMatchEulerDiscreteScheduler",
          strength: 0.8,
        },
      ]),
    });
    
    if (!response.ok) {
      throw new Error(`Runware API error: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    console.log("Runware API response:", JSON.stringify(result));
    
    if (!result.data || !result.data[0] || !result.data[0].imageURL) {
      throw new Error("No image URL returned from Runware API");
    }
    
    return result.data[0].imageURL;
  } catch (error) {
    console.error("Error generating image with Runware:", error);
    throw new Error(`Failed to generate image with Runware: ${error.message}`);
  }
}

// Function to generate multiple artworks with Runware
async function generateArtworksWithRunware(artist: any, count: number): Promise<string[]> {
  try {
    const artworkPrompt = `Artwork in the style of ${artist.name}, ${artist.specialty} artist. ${artist.techniques?.join(', ') || ''} ${artist.styles?.join(', ') || ''}`;
    
    console.log(`Generating ${count} artworks with prompt:`, artworkPrompt);
    
    const artworkUrls: string[] = [];
    
    // Create payload with authentication and multiple image requests
    const payload: any[] = [
      {
        taskType: "authentication",
        apiKey: runwareApiKey,
      }
    ];
    
    // Add image inference tasks
    for (let i = 0; i < count; i++) {
      payload.push({
        taskType: "imageInference",
        positivePrompt: artworkPrompt,
        model: "runware:100@1",
        width: 512,
        height: 512,
        numberResults: 1,
        outputFormat: "WEBP",
        CFGScale: 1,
        scheduler: "FlowMatchEulerDiscreteScheduler",
        strength: 0.8,
      });
    }
    
    const response = await fetch("https://api.runware.ai/v1", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      throw new Error(`Runware API error: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    console.log("Runware artwork API response:", JSON.stringify(result));
    
    if (!result.data) {
      throw new Error("No data returned from Runware API");
    }
    
    // Extract image URLs from the response (skip the first item which is the auth response)
    for (let i = 0; i < result.data.length; i++) {
      const item = result.data[i];
      if (item.taskType === "imageInference" && item.imageURL) {
        artworkUrls.push(item.imageURL);
      }
    }
    
    console.log(`Generated ${artworkUrls.length} artwork URLs`);
    return artworkUrls;
  } catch (error) {
    console.error("Error generating artworks with Runware:", error);
    throw new Error(`Failed to generate artworks: ${error.message}`);
  }
}

// Function to download and store multiple images
async function downloadAndStoreImages(imageUrls: string[], basePath: string): Promise<string[]> {
  try {
    console.log(`Downloading and storing ${imageUrls.length} images to ${basePath}`);
    
    const storedUrls: string[] = [];
    
    for (let i = 0; i < imageUrls.length; i++) {
      const imageUrl = imageUrls[i];
      console.log(`Downloading image ${i + 1}/${imageUrls.length}: ${imageUrl}`);
      
      // Download image
      const imageResponse = await fetch(imageUrl);
      
      if (!imageResponse.ok) {
        console.warn(`Failed to fetch image ${i}: ${imageResponse.status} ${imageResponse.statusText}`);
        continue;
      }
      
      const imageBlob = await imageResponse.blob();
      
      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('artist_images')
        .upload(`${basePath}/artwork_${i}.png`, imageBlob, {
          contentType: 'image/png',
          upsert: true
        });
      
      if (uploadError) {
        console.warn(`Failed to upload image ${i} to storage: ${uploadError.message}`);
        continue;
      }
      
      // Get public URL
      const { data: publicUrlData } = await supabase.storage
        .from('artist_images')
        .getPublicUrl(`${basePath}/artwork_${i}.png`);
      
      if (publicUrlData?.publicUrl) {
        storedUrls.push(publicUrlData.publicUrl);
      }
    }
    
    console.log(`Successfully stored ${storedUrls.length}/${imageUrls.length} images`);
    return storedUrls;
  } catch (error) {
    console.error("Error downloading and storing images:", error);
    throw new Error(`Failed to download and store images: ${error.message}`);
  }
}
