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
    console.log('Instagram profile generation function started');
    
    if (!openAIApiKey) {
      console.error('OpenAI API key not found in environment');
      return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { userId } = await req.json();
    console.log('Processing Instagram profile generation for user:', userId);

    if (!userId) {
      console.log('No user ID provided in request');
      return new Response(JSON.stringify({ error: 'User ID is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get Instagram connection for the user
    const { data: connection, error: connectionError } = await supabase
      .from('instagram_connections')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (connectionError) {
      console.error('Error fetching Instagram connection:', connectionError);
      return new Response(JSON.stringify({ error: 'Failed to fetch Instagram connection' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!connection) {
      console.log('No Instagram connection found for user');
      return new Response(JSON.stringify({ error: 'No Instagram connection found. Please connect your Instagram account first.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Found Instagram connection for user:', connection.username);

    // Fetch Instagram user profile data
    const instagramApiUrl = `https://graph.instagram.com/${connection.instagram_user_id}?fields=id,username,account_type,media_count&access_token=${connection.access_token}`;
    
    console.log('Fetching Instagram profile data...');
    const profileResponse = await fetch(instagramApiUrl);
    
    if (!profileResponse.ok) {
      console.error('Instagram API error:', profileResponse.status, profileResponse.statusText);
      throw new Error(`Instagram API error: ${profileResponse.status}`);
    }

    const profileData = await profileResponse.json();
    console.log('Instagram profile data:', profileData);

    // Fetch recent Instagram media
    const mediaApiUrl = `https://graph.instagram.com/${connection.instagram_user_id}/media?fields=id,caption,media_type,media_url,thumbnail_url,timestamp&limit=20&access_token=${connection.access_token}`;
    
    console.log('Fetching Instagram media...');
    const mediaResponse = await fetch(mediaApiUrl);
    
    let mediaData = { data: [] };
    if (mediaResponse.ok) {
      mediaData = await mediaResponse.json();
      console.log(`Fetched ${mediaData.data?.length || 0} Instagram posts`);
    } else {
      console.warn('Could not fetch Instagram media:', mediaResponse.status);
    }

    // Prepare data for AI analysis
    const instagramContent = {
      profile: {
        username: connection.username,
        full_name: connection.full_name,
        account_type: profileData.account_type,
        media_count: profileData.media_count
      },
      recent_posts: mediaData.data?.slice(0, 10).map((post: any) => ({
        caption: post.caption,
        media_type: post.media_type,
        timestamp: post.timestamp
      })) || []
    };

    console.log('Generating profile with AI...');

    // Enhanced AI prompt for Instagram data
    const prompt = `
You are an elite AI specialist in creating professional artist profiles from Instagram data. Analyze this Instagram account and create a comprehensive artist profile.

INSTAGRAM DATA:
${JSON.stringify(instagramContent, null, 2)}

ANALYSIS REQUIREMENTS:
1. Extract artistic style and medium from post captions and visual content descriptions
2. Identify the artist's specialty and techniques from their work patterns
3. Create professional bio content that sounds authentic and engaging
4. Determine geographic location from any location mentions in captions
5. Extract artistic themes, styles, and techniques

PROFILE GENERATION RULES:
- Create content that sounds natural and authentic, not AI-generated
- Focus on artistic achievements and style evolution visible in the posts
- Use professional art terminology appropriately
- Make the bio engaging and gallery-worthy
- Fill ALL fields with meaningful content based on available data

GENERATE COMPREHENSIVE ARTIST PROFILE (JSON FORMAT):
{
  "name": "REQUIRED: Use full_name if available, otherwise derive from username and content",
  "highlight_bio": "REQUIRED: Create punchy 1-2 sentence introduction capturing artistic essence",
  "bio": "REQUIRED: Write comprehensive 2-3 paragraph professional bio based on artistic journey evident in posts",
  "specialty": "REQUIRED: Identify primary artistic medium/focus from post content", 
  "city": "REQUIRED: Extract or infer from any location references in content",
  "country": "REQUIRED: Extract or infer from location data and content patterns",
  "techniques": "REQUIRED: Extract 3-6 specific artistic techniques evident in the work",
  "styles": "REQUIRED: Identify 3-5 artistic styles/movements from the content", 
  "profile_image": "${connection.profile_picture_url || ''}",
  "social_platforms": [{"platform": "instagram", "url": "https://instagram.com/${connection.username}", "username": "${connection.username}"}]
}

Respond ONLY with the comprehensive JSON object containing ALL extracted information.`;

    // Call OpenAI API
    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 4000,
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
    console.log('Successfully generated profile data from Instagram:', profileData);

    return new Response(JSON.stringify({ 
      success: true, 
      profileData,
      source: 'instagram',
      posts_analyzed: mediaData.data?.length || 0
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in instagram-profile-generator function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error',
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});