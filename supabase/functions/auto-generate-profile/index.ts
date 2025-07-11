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
    console.log('Auto-generate profile function started');
    
    if (!openAIApiKey) {
      console.error('OpenAI API key not found in environment');
      return new Response(JSON.stringify({ 
        error: 'OpenAI API key not configured',
        success: false 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    const { urls, artistId, manualInstagramData } = body;
    console.log('Processing request:', { urlsCount: urls?.length, artistId, hasManualData: !!manualInstagramData });

    // Handle manual Instagram data (simplified)
    if (manualInstagramData) {
      console.log('Processing manual Instagram data');
      
      const prompt = `Create a professional artist profile from this Instagram data:

Name: ${manualInstagramData.name || 'Unknown'}
Bio: ${manualInstagramData.bio || 'No bio provided'}
Instagram: ${manualInstagramData.social_platforms?.[0] || 'No URL'}

Create a JSON response with these fields:
{
  "name": "Artist name",
  "highlight_bio": "Short compelling intro (1-2 sentences)",
  "bio": "Professional bio (2-3 paragraphs)",
  "specialty": "Primary artistic medium",
  "city": "City if mentioned",
  "country": "Country if mentioned", 
  "techniques": ["technique1", "technique2", "technique3"],
  "styles": ["style1", "style2", "style3"],
  "profile_image": "${manualInstagramData.profile_image || ''}",
  "social_platforms": [{"platform": "instagram", "url": "${manualInstagramData.social_platforms?.[0] || ''}", "username": "${manualInstagramData.username || ''}"}]
}

Respond only with valid JSON.`;

      const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });

      if (!aiResponse.ok) {
        const errorText = await aiResponse.text();
        console.error('OpenAI API error:', errorText);
        throw new Error(`OpenAI API error: ${aiResponse.status}`);
      }

      const aiData = await aiResponse.json();
      const profileData = JSON.parse(aiData.choices[0].message.content);

      return new Response(JSON.stringify({ 
        success: true, 
        profileData,
        source: 'manual_instagram'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate URLs
    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return new Response(JSON.stringify({ 
        error: 'No URLs provided',
        success: false 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Fetching content from URLs:', urls);

    // Simplified content fetching
    const urlContents = await Promise.allSettled(
      urls.map(async (url: string) => {
        try {
          console.log(`Fetching: ${url}`);
          
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 15000); // Reduced timeout
          
          const response = await fetch(url, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (compatible; ProfileBot/1.0)',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            },
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);
          
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          
          const text = await response.text();
          console.log(`✅ Fetched ${text.length} characters from ${url}`);
          
          // Reduced content size for better processing
          return { 
            url, 
            content: text.substring(0, 5000), // Reduced from 50,000
            success: true
          };
        } catch (error) {
          console.error(`❌ Error fetching ${url}:`, error.message);
          return { url, error: error.message, success: false };
        }
      })
    );

    // Get successful fetches
    const validContents = urlContents
      .filter((result): result is PromiseFulfilledResult<any> => 
        result.status === 'fulfilled' && result.value.success
      )
      .map(result => result.value);

    if (validContents.length === 0) {
      const errors = urlContents
        .filter(result => result.status === 'fulfilled' && !result.value.success)
        .map(result => `${result.value.url}: ${result.value.error}`)
        .join('; ');
      
      return new Response(JSON.stringify({ 
        error: 'Unable to access the provided URL(s). Error details: ' + errors,
        success: false,
        suggestion: 'Please check if the URLs are publicly accessible and try again.'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Generating profile with AI...');

    // Simplified AI prompt
    const combinedContent = validContents.map(c => `URL: ${c.url}\nContent: ${c.content}`).join('\n\n---\n\n');
    
    const prompt = `Analyze this web content and create an artist profile. Extract information about the artist's name, bio, location, artistic style, techniques, and social media.

Web Content:
${combinedContent}

Create a JSON response with these exact fields:
{
  "name": "Artist's full name",
  "highlight_bio": "Compelling 1-2 sentence introduction", 
  "bio": "Professional bio (2-3 paragraphs)",
  "specialty": "Primary artistic medium/focus",
  "city": "City name if found",
  "country": "Country name if found",
  "techniques": ["technique1", "technique2", "technique3"],
  "styles": ["style1", "style2", "style3"],
  "profile_image": "Profile image URL if found",
  "social_platforms": [{"platform": "platform_name", "url": "full_url", "username": "username"}]
}

Respond only with valid JSON. Fill all fields based on available information.`;

    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // More reliable model
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 3000, // Reduced from 10,000
      }),
    });

    console.log('OpenAI response status:', aiResponse.status);

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${aiResponse.status} - ${errorText}`);
    }

    const aiData = await aiResponse.json();
    console.log('AI response received, parsing...');

    let profileData;
    try {
      profileData = JSON.parse(aiData.choices[0].message.content);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Raw AI response:', aiData.choices[0].message.content);
      throw new Error('Failed to parse AI response as JSON');
    }

    console.log('Successfully generated profile:', Object.keys(profileData));

    return new Response(JSON.stringify({ 
      success: true, 
      profileData,
      processedUrls: validContents.length,
      totalUrls: urls.length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Function error:', error);
    
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error',
      success: false
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});