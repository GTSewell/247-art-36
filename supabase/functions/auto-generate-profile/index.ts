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

    // Enhanced content fetching with progress tracking
    const urlContents = await Promise.allSettled(
      urls.map(async (url: string, index: number) => {
        try {
          console.log(`[${index + 1}/${urls.length}] 🔍 Reading content from: ${url}`);
          
          // Determine platform type for better extraction
          const platform = url.includes('instagram.com') ? 'instagram' :
                          url.includes('twitter.com') || url.includes('x.com') ? 'twitter' :
                          url.includes('linkedin.com') ? 'linkedin' :
                          url.includes('behance.net') ? 'behance' :
                          url.includes('dribbble.com') ? 'dribbble' :
                          'website';
          
          console.log(`📱 Detected platform: ${platform}`);
          
          // Extended timeout for thorough content loading
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 30000);
          
          const response = await fetch(url, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (compatible; ArtistProfileBot/1.0; +https://lovable.dev)',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
              'Accept-Language': 'en-US,en;q=0.5',
              'Accept-Encoding': 'gzip, deflate',
              'DNT': '1',
              'Connection': 'keep-alive',
            },
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);
          
          if (!response.ok) {
            throw new Error(`Failed to fetch ${url}: ${response.status}`);
          }
          
          const text = await response.text();
          console.log(`✅ Successfully fetched ${text.length} characters from ${url}`);
          
          // Massive content analysis - 50,000 characters per URL
          return { 
            url, 
            content: text.substring(0, 50000),
            platform,
            contentLength: text.length
          };
        } catch (error) {
          console.error(`❌ Error fetching ${url}:`, error);
          return { url, error: error.message, platform: 'unknown' };
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

    console.log('🎨 Now crafting your professional artist profile...');

    // Enhanced AI prompt for comprehensive extraction
    const prompt = `
You are an elite AI specialist in creating exceptional artist profiles. Your mission is to perform DEEP ANALYSIS of web content and extract COMPREHENSIVE artistic and professional information.

🎯 MANDATORY EXTRACTION REQUIREMENTS:
YOU MUST FILL EVERY POSSIBLE FIELD. Do not leave fields empty unless absolutely no relevant information exists.

PLATFORM-SPECIFIC ANALYSIS:
${validContents.map(content => `
PLATFORM: ${content.platform.toUpperCase()} (${content.url})
CONTENT LENGTH: ${content.contentLength} characters
ANALYSIS DEPTH: Deep scan for artistic content, bio information, contact details, and professional data
---`).join('\n')}

ARTISTIC CONTENT PRIORITY RULES:
1. HIGH PRIORITY: Artwork posts, studio documentation, exhibition announcements, artistic process videos, technique discussions, professional achievements, artistic education, gallery features, commission work, art sales, creative collaborations
2. MEDIUM PRIORITY: Art-related travel, artistic inspirations, studio setup, art supply discussions, creative challenges
3. IGNORE: Personal food photos, family events, unrelated travel, casual social content, non-art opinions

COMPREHENSIVE EXTRACTION STRATEGY:
- SCAN EVERY: Profile descriptions, bio sections, post captions, hashtags, linked websites, contact information
- EXTRACT: Names from profiles and professional contexts
- IDENTIFY: Artistic specialties from work displayed and descriptions
- LOCATE: Geographic information from location tags, bio mentions, exhibition venues
- COMPILE: Techniques from process videos, tutorials, and artwork descriptions
- CATEGORIZE: Styles from artwork analysis and self-descriptions
- HARVEST: Social handles directly from URLs and cross-references

WEB CONTENT TO ANALYZE:
${validContents.map(content => `
========== ${content.platform.toUpperCase()}: ${content.url} ==========
${content.content}
==================================================
`).join('\n')}

ARTISTIC TERMINOLOGY MASTERY:
- MEDIUMS: Oil Painting, Watercolor, Acrylic, Digital Art, Digital Illustration, 3D Modeling, Sculpture, Ceramics, Photography, Printmaking, Mixed Media, Collage, Graphic Design, Typography, Murals
- TECHNIQUES: Impasto, Glazing, Wet-on-wet, Dry brush, Stippling, Cross-hatching, Perspective drawing, Color theory, Composition, Lighting, Texture work, Layering
- STYLES: Contemporary, Modern, Abstract, Realism, Surrealism, Minimalism, Pop Art, Street Art, Fine Art, Commercial Art, Conceptual Art, Expressionism

GENERATE COMPREHENSIVE ARTIST PROFILE (JSON FORMAT):
{
  "name": "REQUIRED: Extract full artist name from profile sections, about pages, professional mentions, exhibition credits",
  "highlight_bio": "REQUIRED: Create punchy 1-2 sentence introduction capturing essence and specialty",
  "bio": "REQUIRED: Write comprehensive 2-3 paragraph story including background, artistic journey, achievements, style, and professional experience",
  "specialty": "REQUIRED: Identify primary medium/specialty from work shown and descriptions", 
  "city": "REQUIRED: Extract from location tags, bio mentions, exhibition venues, contact info",
  "country": "REQUIRED: Extract from location data, bio information, exhibition locations",
  "techniques": "REQUIRED: Extract 3-6 specific artistic techniques from content analysis",
  "styles": "REQUIRED: Identify 3-5 artistic styles/movements from artwork and descriptions", 
  "social_platforms": "REQUIRED: Extract ALL social handles and website URLs with proper formatting"
}

EXTRACTION INTENSITY LEVELS:
🔍 BASIC: Obvious profile information and main posts
🔎 DETAILED: Deep dive into captions, comments, tagged locations, linked content  
🔬 COMPREHENSIVE: Meta analysis of artistic progression, style evolution, professional network
🧠 EXPERT: Cross-reference multiple sources, infer professional trajectory, synthesize complete picture

USE LEVEL: 🧠 EXPERT ANALYSIS

MANDATORY COMPLETION CHECKLIST:
✅ Name extracted from multiple sources and verified
✅ Specialty identified from primary body of work
✅ Location data cross-referenced and confirmed  
✅ Techniques compiled from process documentation
✅ Styles identified from artistic analysis
✅ Social platforms harvested from all available sources
✅ Bios crafted with professional tone and compelling narrative

FINAL VALIDATION:
- ALL fields must contain meaningful, accurate information
- NO generic or placeholder content
- VERIFY artistic authenticity and professional relevance
- ENSURE compelling and memorable presentation

Respond ONLY with the comprehensive JSON object containing ALL extracted information.`;

    console.log('Calling OpenAI API...');
    
    // Call OpenAI API
    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { role: 'user', content: prompt }
        ],
        temperature: 0.5,
        max_tokens: 10000,
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