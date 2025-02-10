
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";

const API_ENDPOINT = "wss://ws-api.runware.ai/v1";
const RUNWARE_API_KEY = Deno.env.get('RUNWAYML_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (!RUNWARE_API_KEY) {
      throw new Error('RUNWAYML_API_KEY is not set');
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Fetch all artists
    const { data: artists, error: fetchError } = await supabase
      .from('artists')
      .select('*');

    if (fetchError) throw fetchError;
    if (!artists) throw new Error('No artists found');

    const ws = new WebSocket(API_ENDPOINT);
    const results: { id: number; imageUrl: string }[] = [];
    let authenticated = false;

    const processArtist = async (artist: any) => {
      const attireStyles = ['street wear', 'casual', 'smart', 'formal', 'stylish', 'modern', 'messy'];
      const hairStyles = ['short', 'long', 'messy', 'curly', 'straight', 'wavy', 'spiky', 'mohawk', 'ponytail', 'bun'];
      const randomAttire = attireStyles[Math.floor(Math.random() * attireStyles.length)];
      const randomHair = hairStyles[Math.floor(Math.random() * hairStyles.length)];

      const prompt = `Create a pop art comic book style superhero portrait of an artist named ${artist.name}, who specializes in ${artist.specialty}. The style should be vibrant and bold, with dramatic lighting and comic book aesthetics, similar to Roy Lichtenstein's work. Use strong black outlines, halftone dots pattern in the background, and dynamic composition. The character should look artistic, with clear facial features and expressions, with ${randomHair} hair, wearing ${randomAttire} clothing for their gender and specialty`;

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

      return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          reject(new Error(`Timeout generating image for artist ${artist.id}`));
        }, 30000);

        const messageHandler = async (event: MessageEvent) => {
          const response = JSON.parse(event.data);
          if (response.error || response.errors) {
            const errorMessage = response.errorMessage || response.errors[0].message;
            reject(new Error(errorMessage));
            return;
          }

          if (response.data) {
            for (const item of response.data) {
              if (item.taskUUID === taskUUID && item.imageURL) {
                clearTimeout(timeoutId);
                
                // Update the artist's image in the database
                const { error: updateError } = await supabase
                  .from('artists')
                  .update({ image: item.imageURL })
                  .eq('id', artist.id);

                if (updateError) {
                  reject(updateError);
                  return;
                }

                results.push({ id: artist.id, imageUrl: item.imageURL });
                resolve(null);
                return;
              }
            }
          }
        };

        ws.addEventListener('message', messageHandler);
        ws.send(JSON.stringify(message));
      });
    };

    // Process artists sequentially
    for (const artist of artists) {
      try {
        // If not authenticated yet, authenticate first
        if (!authenticated) {
          await new Promise((resolve, reject) => {
            const authMessage = [{
              taskType: "authentication",
              apiKey: RUNWARE_API_KEY,
            }];
            
            const authHandler = (event: MessageEvent) => {
              const response = JSON.parse(event.data);
              if (response.data?.[0]?.taskType === "authentication") {
                authenticated = true;
                ws.removeEventListener('message', authHandler);
                resolve(null);
              }
            };
            
            ws.addEventListener('message', authHandler);
            ws.send(JSON.stringify(authMessage));
          });
        }

        await processArtist(artist);
        // Add a small delay between requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Error processing artist ${artist.id}:`, error);
        // Continue with next artist even if one fails
      }
    }

    ws.close();

    return new Response(
      JSON.stringify({ 
        message: `Successfully processed ${results.length} out of ${artists.length} artists`,
        results 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    );
  }
});
