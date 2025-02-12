
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const API_ENDPOINT = "wss://ws-api.runware.ai/v1";
const RUNWARE_API_KEY = Deno.env.get('RUNWAYML_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { name, specialty, techniques, styles } = await req.json();

    if (!RUNWARE_API_KEY) {
      throw new Error('RUNWAYML_API_KEY is not set');
    }

    // Create a more personalized prompt using the artist's details
    const createArtworkPrompt = (index: number) => {
      const randomStyle = styles && styles.length > 0 ? styles[Math.floor(Math.random() * styles.length)] : 'contemporary';
      const randomTechnique = techniques && techniques.length > 0 ? techniques[Math.floor(Math.random() * techniques.length)] : specialty;
      
      return `Create an artwork that showcases ${name}'s expertise in ${specialty} in a ${randomStyle} style. The piece should demonstrate mastery of ${randomTechnique}. Make it a professional, gallery-worthy piece with rich colors and compelling composition. Artwork ${index + 1} of 4.`;
    };

    const ws = new WebSocket(API_ENDPOINT);
    const results: any[] = [];
    let authenticated = false;

    await new Promise((resolve, reject) => {
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
              // Generate 4 artworks
              for (let i = 0; i < 4; i++) {
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
              if (results.length === 4) {
                console.log("All artworks generated successfully");
                ws.close();
                resolve(null);
              }
            }
          }
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        reject(error);
      };

      ws.onclose = () => {
        console.log("WebSocket connection closed");
        if (!authenticated || results.length < 4) {
          reject(new Error("WebSocket connection closed before completion"));
        }
      };
    });

    const artworkUrls = results.map(result => result.imageURL);
    console.log("Returning artwork URLs:", artworkUrls);

    return new Response(
      JSON.stringify({ artworkUrls }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
