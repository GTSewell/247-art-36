-- Update Unwell Bunny artist profile with enhanced bio and add artist profile links
UPDATE artists 
SET 
  bio = 'Ed Bechervaise, known as Unwell Bunny, is a street artist exploring the popular subconscious through character-based street art and installations. As an Executive Creative Director at The Fuel Agency, Ed combines his artistic vision with creative strategy. Known for distinctive bunny-themed artwork and urban interventions that blend art with philosophical messaging.'
WHERE id = 111;

-- Insert artist profile with website link
INSERT INTO artist_profiles (artist_id, links, background_color, panel_color)
VALUES (111, '[{"type": "website", "title": "Official Website", "url": "https://www.unwellbunny.com/"}]'::jsonb, '#e5d0b9', '#FEF9F4')
ON CONFLICT (artist_id) 
DO UPDATE SET 
  links = '[{"type": "website", "title": "Official Website", "url": "https://www.unwellbunny.com/"}]'::jsonb,
  updated_at = now();