
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
    const { name, specialty } = await req.json();

    if (!RUNWARE_API_KEY) {
      throw new Error('RUNWAYML_API_KEY is not set');
    }

    // Randomly decide whether to include glasses
    const includeGlasses = Math.random() > 0.7; // 30% chance of having glasses
    const glassesPrompt = includeGlasses 
      ? ", the person is wearing stylish glasses" 
      : ", the person must not have any glasses or eyewear";

    const prompt = `Create a pop art comic book style superhero portrait of an artist named ${name}, who specializes in ${specialty}${glassesPrompt}. The style should be vibrant and bold, with dramatic lighting and comic book aesthetics, similar to Roy Lichtenstein's work. Use strong black outlines, halftone dots pattern in the background, and dynamic composition. The character should look professional and artistic, with clear facial features and expressions, wearing appropriate attire for their specialty. The image must strictly follow the glasses requirement.`;

    console.log('Generated prompt:', prompt);

    const ws = new WebSocket(API_ENDPOINT);
    let result = null;

    await new Promise((resolve, reject) => {
      ws.onopen = () => {
        const authMessage = [{
          taskType: "authentication",
          apiKey: RUNWARE_API_KEY,
        }];
        ws.send(JSON.stringify(authMessage));
      };

      ws.onmessage = (event) => {
        const response = JSON.parse(event.data);
        if (response.error || response.errors) {
          reject(new Error(response.errorMessage || response.errors[0].message));
          return;
        }

        if (response.data) {
          response.data.forEach((item: any) => {
            if (item.taskType === "authentication") {
              const taskUUID = crypto.randomUUID();
              const message = [{
                taskType: "imageInference",
                taskUUID,
                model: "runware:100@1",
                positivePrompt: prompt,
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
            } else if (item.taskType === "imageInference") {
              result = item;
              ws.close();
              resolve(null);
            }
          });
        }
      };

      ws.onerror = (error) => {
        reject(error);
      };
    });

    if (!result) {
      throw new Error('Failed to generate image');
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
