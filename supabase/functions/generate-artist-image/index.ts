
// supabase/functions/generate-artist-image/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const requestData = await req.json();
    console.log("Received request:", JSON.stringify(requestData));

    // Extract data from the request
    const { prompt, artistId, preview, imageUrl } = requestData;

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get Runware API key from environment
    const runwareApiKey = Deno.env.get('RUNWARE_API_KEY');
    if (!runwareApiKey) {
      console.error("Runware API key not found in environment variables");
      return new Response(
        JSON.stringify({ error: "Runware API key configuration missing" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Check if we're saving an existing image or generating a new one
    if (!preview && imageUrl) {
      console.log(`Saving existing image URL for artist ${artistId}: ${imageUrl}`);
      
      // Update the artist record with the new image URL
      const { error: updateError } = await supabase
        .from('artists')
        .update({ image: imageUrl })
        .eq('id', artistId);
      
      if (updateError) {
        console.error("Error updating artist record:", updateError);
        return new Response(
          JSON.stringify({ error: "Failed to update artist with new image", details: updateError }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }
      
      return new Response(
        JSON.stringify({ success: true, message: "Artist image updated successfully" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If we're generating a new image
    if (!prompt) {
      return new Response(
        JSON.stringify({ error: "Missing prompt for image generation" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Check if artist exists
    const { data: artistData, error: artistError } = await supabase
      .from('artists')
      .select('*')
      .eq('id', artistId)
      .single();
    
    if (artistError || !artistData) {
      console.error("Error fetching artist:", artistError);
      return new Response(
        JSON.stringify({ error: "Artist not found", details: artistError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }

    console.log(`Generating image for artist ${artistId} with prompt: ${prompt}`);

    // Make request to Runware API
    const runwareResponse = await fetch('https://api.runware.ai/v1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        {
          taskType: "authentication",
          apiKey: runwareApiKey
        },
        {
          taskType: "imageInference",
          taskUUID: crypto.randomUUID(),
          positivePrompt: prompt,
          width: 1024,
          height: 1024,
          model: "runware:100@1",
          numberResults: 1,
          outputFormat: "WEBP",
          CFGScale: 1,
          scheduler: "FlowMatchEulerDiscreteScheduler",
          strength: 0.8
        }
      ])
    });

    if (!runwareResponse.ok) {
      const errorText = await runwareResponse.text();
      console.error(`Runware API error (${runwareResponse.status}):`, errorText);
      return new Response(
        JSON.stringify({ error: `Runware API error: ${errorText}` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    const runwareData = await runwareResponse.json();
    console.log("Runware API response:", JSON.stringify(runwareData));

    if (!runwareData.data || !runwareData.data.length) {
      return new Response(
        JSON.stringify({ error: "No image data returned from Runware" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Extract image URL from response
    const imageData = runwareData.data.find((item: any) => item.taskType === "imageInference");
    if (!imageData || !imageData.imageURL) {
      return new Response(
        JSON.stringify({ error: "No image URL found in Runware response" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    const generatedImageUrl = imageData.imageURL;
    console.log(`Generated image URL: ${generatedImageUrl}`);

    // If this is not a preview, update the artist record with the new image
    if (!preview) {
      console.log(`Updating artist ${artistId} with new image URL`);
      
      const { error: updateError } = await supabase
        .from('artists')
        .update({ image: generatedImageUrl })
        .eq('id', artistId);
      
      if (updateError) {
        console.error("Error updating artist record:", updateError);
        return new Response(
          JSON.stringify({ error: "Failed to update artist with new image", details: updateError }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }
    }

    // Return the image URL
    return new Response(
      JSON.stringify({ 
        success: true, 
        imageUrl: generatedImageUrl,
        preview: preview
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred", details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
