import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Artist {
  id: number;
  name: string;
  image: string;
  profile_image_url: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    // Use service role key for admin operations
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Starting featured artists rotation...');

    // Get all published artists with profile images
    const { data: eligibleArtists, error: artistsError } = await supabase
      .from('artists')
      .select('id, name, image, profile_image_url')
      .eq('published', true)
      .not('image', 'is', null)
      .not('profile_image_url', 'is', null);

    if (artistsError) {
      console.error('Error fetching artists:', artistsError);
      throw artistsError;
    }

    if (!eligibleArtists || eligibleArtists.length < 3) {
      throw new Error('Not enough eligible artists found for rotation');
    }

    console.log(`Found ${eligibleArtists.length} eligible artists`);

    // Get current rotation data
    const { data: currentRotation, error: rotationError } = await supabase
      .from('featured_artists_rotation')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (rotationError && rotationError.code !== 'PGRST116') {
      console.error('Error fetching current rotation:', rotationError);
      throw rotationError;
    }

    let usedArtistIds: number[] = [];
    
    if (currentRotation) {
      usedArtistIds = currentRotation.used_artist_ids || [];
      console.log('Current used artist IDs:', usedArtistIds);
    }

    // Get artists that haven't been featured yet
    const availableArtists = eligibleArtists.filter(
      artist => !usedArtistIds.includes(artist.id)
    );

    let selectedArtists: Artist[];
    let newUsedArtistIds: number[];

    if (availableArtists.length >= 3) {
      // Select 3 random artists from available ones
      const shuffled = [...availableArtists].sort(() => 0.5 - Math.random());
      selectedArtists = shuffled.slice(0, 3);
      newUsedArtistIds = [...usedArtistIds, ...selectedArtists.map(a => a.id)];
      console.log('Selected from available artists:', selectedArtists.map(a => a.name));
    } else {
      // Reset cycle - all artists are now available again
      console.log('Resetting rotation cycle - all artists available again');
      const shuffled = [...eligibleArtists].sort(() => 0.5 - Math.random());
      selectedArtists = shuffled.slice(0, 3);
      newUsedArtistIds = selectedArtists.map(a => a.id);
      console.log('Selected after reset:', selectedArtists.map(a => a.name));
    }

    const selectedArtistIds = selectedArtists.map(a => a.id);

    // Insert new rotation record
    const { error: insertError } = await supabase
      .from('featured_artists_rotation')
      .insert({
        artist_ids: selectedArtistIds,
        used_artist_ids: newUsedArtistIds,
        rotation_date: new Date().toISOString().split('T')[0]
      });

    if (insertError) {
      console.error('Error inserting new rotation:', insertError);
      throw insertError;
    }

    console.log('Successfully rotated featured artists:', selectedArtists.map(a => `${a.name} (${a.id})`));

    return new Response(
      JSON.stringify({
        success: true,
        selectedArtists: selectedArtists.map(a => ({ id: a.id, name: a.name })),
        totalEligible: eligibleArtists.length,
        usedCount: newUsedArtistIds.length,
        cycleReset: availableArtists.length < 3
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in rotate-featured-artists function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});