
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const API_ENDPOINT = "wss://ws-api.runware.ai/v1";
const RUNWARE_API_KEY = Deno.env.get('RUNWAYML_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (!RUNWARE_API_KEY) {
      throw new Error('RUNWAYML_API_KEY is not set');
    }

    const { name, specialty, techniques, styles, numberResults = 4, artistId } = await req.json();
    
    if (!artistId) {
      throw new Error('artistId is required');
    }
    
    console.log("Received request for artist:", { name, specialty, techniques, styles, numberResults, artistId });

    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Create a more personalized prompt using the artist's details
    const createArtworkPrompt = (index: number) => {
      const randomStyle = styles && styles.length > 0 ? styles[Math.floor(Math.random() * styles.length)] : 'contemporary';
      const randomTechnique = techniques && techniques.length > 0 ? techniques[Math.floor(Math.random() * techniques.length)] : specialty;
      
      const prompt = `Create an artwork that showcases ${name}'s expertise in ${specialty} in a ${randomStyle} style. The piece should demonstrate mastery of ${randomTechnique}. Make it a professional, gallery-worthy piece with rich colors and compelling composition. Artwork ${index + 1} of ${numberResults}.`;
      console.log(`Generated prompt ${index + 1}:`, prompt);
      return prompt;
    };

    const ws = new WebSocket(API_ENDPOINT);
    const results: any[] = [];
    let authenticated = false;
    let connectionClosed = false;
    let generationComplete = false;

    const artworkUrls = await new Promise<string[]>((resolve, reject) => {
      let timeoutId: number;

      // Set a timeout for the entire operation
      timeoutId = setTimeout(() => {
        console.error("Operation timed out");
        ws.close();
        reject(new Error('Operation timed out after 60 seconds'));
      }, 60000); // 60 second timeout

      ws.onopen = () => {
        console.log("WebSocket connected, sending authentication...");
        const authMessage = [{
          taskType: "authentication",
          apiKey: RUNWARE_API_KEY,
        }];
        ws.send(JSON.stringify(authMessage));
      };

      ws.onmessage = async (event) => {
        const response = JSON.parse(event.data);
        console.log("Received response:", response);
        
        if (response.error || response.errors) {
          console.error("Error in response:", response.error || response.errors);
          reject(new Error(response.errorMessage || response.errors[0].message));
          return;
        }

        if (response.data) {
          for (const item of response.data) {
            if (item.taskType === "authentication") {
              console.log("Authentication successful");
              authenticated = true;
              // Generate artworks
              for (let i = 0; i < numberResults; i++) {
                const taskUUID = crypto.randomUUID();
                const message = [{
                  taskType: "imageInference",
                  taskUUID,
                  model: "runware:100@1",
                  positivePrompt: createArtworkPrompt(i),
                  width: 1024,
                  height: 1024,
                  numberResults: 1,
                  outputFormat: "WEBP",
                  steps: 4,
                  CFGScale: 1,
                  scheduler: "FlowMatchEulerDiscreteScheduler",
                  strength: 0.8,
                }];
                console.log(`Sending artwork generation request ${i + 1}:`, message);
                ws.send(JSON.stringify(message));
              }
            } else if (item.taskType === "imageInference" && item.imageURL) {
              console.log(`Received artwork URL ${results.length + 1}:`, item.imageURL);
              results.push(item);
              if (results.length === numberResults) {
                generationComplete = true;
                console.log("All artworks generated, closing connection");
                ws.close();
              }
            }
          }
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        clearTimeout(timeoutId);
        reject(error);
      };

      ws.onclose = () => {
        console.log("WebSocket connection closed");
        connectionClosed = true;
        clearTimeout(timeoutId);
        
        if (!authenticated) {
          reject(new Error("Authentication failed"));
          return;
        }
        
        if (!generationComplete) {
          reject(new Error("Connection closed before all artworks were generated"));
          return;
        }

        const urls = results.map(result => result.imageURL).filter(url => typeof url === 'string');
        console.log("Final artwork URLs:", urls);
        
        if (urls.length !== numberResults) {
          reject(new Error(`Expected ${numberResults} artworks but got ${urls.length}`));
          return;
        }

        resolve(urls);
      };
    });

    // Save artworks to Supabase
    console.log("Saving artwork URLs to Supabase for artist:", artistId);
    const { error: updateError } = await supabase
      .from('artists')
      .update({
        artworks: artworkUrls,
        locked_artworks: false
      })
      .eq('id', artistId);

    if (updateError) {
      console.error("Error saving artworks to Supabase:", updateError);
      throw new Error(`Failed to save artworks: ${updateError.message}`);
    }

    console.log("Successfully saved artwork URLs to Supabase");

    return new Response(
      JSON.stringify({ artworkUrls }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    );
  }
});
