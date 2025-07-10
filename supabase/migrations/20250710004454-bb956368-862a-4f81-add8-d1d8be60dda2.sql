-- Update Pure Evil's artist profile with comprehensive links and information from Linktree
UPDATE artists 
SET 
  bio = 'Pure Evil is the moniker of British artist Charles Uzzell-Edwards, a prominent figure in the street art scene and contemporary music. His work often features darkly iconic images with a pop-art twist, notably his "Nightmare Series," where famous figures are depicted with a distinctive teardrop running from one eye. This unique style reflects themes of fame, celebrity culture, and the darker aspects of modern society. He operates Pure Evil Gallery and also creates music under his real name Charles Uzzell Edwards.',
  social_platforms = jsonb_build_array(
    'https://www.facebook.com/charlesuzzelledwards',
    'https://x.com/pureevilgallery', 
    'mailto:cue@pureevilgallery.com',
    'https://open.spotify.com/artist/3oD1FAf1aDqm4h7xJTgzvQ',
    'https://charlesuzzelledwards.bandcamp.com/',
    'https://pureevilgallery.com',
    'https://www.youtube.com/watch?v=tBy4zZBogDE',
    'https://foundation.app/PureEvilGallery',
    'https://opensea.io/PURE_EVIL'
  ),
  specialty = 'Street Art, Pop Art, Nightmare Series & Music',
  techniques = jsonb_build_array(
    'Street Art',
    'Pop Art', 
    'Painting',
    'Mixed Media',
    'Digital Art',
    'NFT Creation'
  ),
  styles = jsonb_build_array(
    'Pop Art',
    'Dark Pop', 
    'Celebrity Culture',
    'Contemporary',
    'Street Art',
    'Nightmare Series'
  )
WHERE id = 107;