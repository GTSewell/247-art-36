
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
    const { name, specialty, bio } = await req.json();

    if (!RUNWARE_API_KEY) {
      throw new Error('RUNWAYML_API_KEY is not set');
    }

    // Define a list of diverse art styles
    const artStyles = [
      'hyperrealism',
      'abstract expressionism',
      'surrealism',
      'impressionism',
      'pop art',
      'minimalism',
      'digital art',
      'contemporary',
      'cubism',
      'art nouveau',
      'street art',
      'fantasy art',
      'photorealism',
      'baroque',
      'neo-expressionism'
    ];

    // Function to get a random style from the array
    const getRandomStyle = () => {
      return artStyles[Math.floor(Math.random() * artStyles.length)];
    };

    // Create a more personalized prompt using the artist's details and bio
    const createArtworkPrompt = (index: number) => {
      const randomStyle = getRandomStyle();
      
      return `Create an artwork that showcases ${name}'s expertise in ${specialty} in a ${randomStyle} style. Incorporate elements that reflect their artistic vision: ${bio}. The piece should be highly detailed and professional, demonstrating mastery of the medium. Make it visually striking and gallery-worthy, with rich colors and compelling composition. The artwork should be complete and polished, suitable for a professional artist's portfolio.`;
    };

    const ws = new WebSocket(API_ENDPOINT);
    const results: any[] = [];
    let authenticated = false;

    await new Promise((resolve, reject) => {
      ws.onopen = () => {
        const authMessage = [{
          taskType: "authentication",
          apiKey: RUNWARE_API_KEY,
        }];
        ws.send(JSON.stringify(authMessage));
      };

      ws.onmessage = async (event) => {
        const response = JSON.parse(event.data);
        if (response.error || response.errors) {
          reject(new Error(response.errorMessage || response.errors[0].message));
          return;
        }

        if (response.data) {
          for (const item of response.data) {
            if (item.taskType === "authentication") {
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
                ws.send(JSON.stringify(message));
              }
            } else if (item.taskType === "imageInference" && item.imageURL) {
              results.push(item);
              if (results.length === 4) {
                ws.close();
                resolve(null);
              }
            }
          }
        }
      };

      ws.onerror = (error) => {
        reject(error);
      };
    });

    const artworkUrls = results.map(result => result.imageURL);

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
