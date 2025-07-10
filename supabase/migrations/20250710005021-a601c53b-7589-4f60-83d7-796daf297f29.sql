-- First, let's create artist_profiles table to store the links properly
CREATE TABLE IF NOT EXISTS public.artist_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  artist_id BIGINT NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  background_image TEXT,
  background_color TEXT DEFAULT '#e5d0b9',
  panel_color TEXT DEFAULT '#FEF9F4',
  links JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.artist_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Artist profiles are viewable by everyone" 
ON public.artist_profiles 
FOR SELECT 
USING (true);

CREATE POLICY "Users can update their own artist profile" 
ON public.artist_profiles 
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM artists 
    WHERE artists.id = artist_profiles.artist_id 
    AND (artists.user_id = auth.uid() OR auth.uid() IN (
      SELECT user_id FROM user_roles WHERE role = 'admin'
    ))
  )
);

-- Update Pure Evil's social platforms to only include actual social media
UPDATE artists 
SET 
  social_platforms = jsonb_build_array(
    'https://www.facebook.com/charlesuzzelledwards',
    'https://x.com/pureevilgallery',
    'mailto:cue@pureevilgallery.com'
  )
WHERE id = 107;

-- Insert/Update Pure Evil's profile with proper links
INSERT INTO artist_profiles (artist_id, links)
VALUES (
  107,
  jsonb_build_array(
    jsonb_build_object('type', 'website', 'title', 'Pure Evil Gallery', 'url', 'https://pureevilgallery.com'),
    jsonb_build_object('type', 'exhibition', 'title', 'Current Exhibition', 'url', 'https://pureevilgallery.com'),
    jsonb_build_object('type', 'shop', 'title', 'Online Art Shop', 'url', 'https://pureevilgallery.com/products'),
    jsonb_build_object('type', 'video', 'title', 'Samsung Street Art Documentary', 'url', 'https://www.youtube.com/watch?v=tBy4zZBogDE'),
    jsonb_build_object('type', 'music', 'title', 'Music on Spotify', 'url', 'https://open.spotify.com/artist/3oD1FAf1aDqm4h7xJTgzvQ'),
    jsonb_build_object('type', 'music', 'title', 'Music on Bandcamp', 'url', 'https://charlesuzzelledwards.bandcamp.com/'),
    jsonb_build_object('type', 'nft', 'title', 'Foundation NFT Collection', 'url', 'https://foundation.app/PureEvilGallery'),
    jsonb_build_object('type', 'nft', 'title', 'OpenSea NFT Collection', 'url', 'https://opensea.io/PURE_EVIL')
  )
)
ON CONFLICT (artist_id) 
DO UPDATE SET 
  links = EXCLUDED.links,
  updated_at = now();