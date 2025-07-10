import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Function started, checking environment variables...');
    
    if (!openAIApiKey) {
      console.error('OpenAI API key not found in environment');
      return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { urls, artistId } = await req.json();
    console.log('Request body parsed successfully');

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      console.log('No URLs provided in request');
      return new Response(JSON.stringify({ error: 'No URLs provided' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Processing auto-profile generation for artist:', artistId);
    console.log('URLs to process:', urls);

    // Fetch content from provided URLs with timeout handling
    const urlContents = await Promise.allSettled(
      urls.map(async (url: string) => {
        try {
          console.log(`Fetching content from: ${url}`);
          
          // Create timeout controller
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000);
          
          const response = await fetch(url, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (compatible; ArtistProfileBot/1.0)',
            },
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);
          
          if (!response.ok) {
            throw new Error(`Failed to fetch ${url}: ${response.status}`);
          }
          
          const text = await response.text();
          return { url, content: text.substring(0, 5000) }; // Limit content length
        } catch (error) {
          console.error(`Error fetching ${url}:`, error);
          return { url, error: error.message };
        }
      })
    );

    // Extract successful content
    const validContents = urlContents
      .filter((result): result is PromiseFulfilledResult<any> => 
        result.status === 'fulfilled' && !result.value.error
      )
      .map(result => result.value);

    if (validContents.length === 0) {
      return new Response(JSON.stringify({ error: 'Could not fetch content from any provided URLs' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create AI prompt for profile generation
    const prompt = `
You are an AI assistant that helps create professional artist profiles. Analyze the following web content from an artist's social media and websites, then extract and generate structured profile information.

Web Content:
${validContents.map(content => `URL: ${content.url}\nContent: ${content.content}\n---`).join('\n')}

Please extract and generate the following information in valid JSON format:
{
  "name": "Artist's full name",
  "bio": "Professional 2-3 sentence biography highlighting their artistic focus and experience",
  "specialty": "Primary artistic medium or focus (e.g., 'Oil Painter', 'Digital Artist')",
  "city": "City name if mentioned",
  "country": "Country name if mentioned", 
  "techniques": ["technique1", "technique2", "technique3"],
  "styles": ["style1", "style2", "style3"],
  "social_platforms": [
    {"platform": "instagram", "handle": "@username", "url": "full_url"},
    {"platform": "website", "handle": "Website", "url": "full_url"}
  ]
}

Guidelines:
- Extract only factual information found in the content
- Keep bio professional and concise (2-3 sentences max)
- Include 2-5 techniques and styles based on what you find
- Only include social platforms that are explicitly mentioned
- If information is not available, use null for that field
- Ensure all JSON is properly formatted and valid

Respond ONLY with the JSON object, no additional text.`;

    console.log('Calling OpenAI API...');
    
    // Call OpenAI API
    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    console.log('OpenAI API response status:', aiResponse.status);

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('OpenAI API error details:', errorText);
      throw new Error(`OpenAI API error: ${aiResponse.status} - ${errorText}`);
    }

    const aiData = await aiResponse.json();
    const generatedContent = aiData.choices[0].message.content;

    console.log('AI generated content:', generatedContent);

    // Parse the JSON response
    let profileData;
    try {
      profileData = JSON.parse(generatedContent);
    } catch (error) {
      console.error('Failed to parse AI response as JSON:', error);
      throw new Error('Invalid response format from AI');
    }

    // Log the successful generation
    console.log('Successfully generated profile data:', profileData);

    return new Response(JSON.stringify({ 
      success: true, 
      profileData,
      processedUrls: validContents.length,
      totalUrls: urls.length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in auto-generate-profile function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error',
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});