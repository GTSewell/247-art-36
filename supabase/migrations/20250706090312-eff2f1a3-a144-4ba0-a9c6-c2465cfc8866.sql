-- Add new artist profiles from gallery spreadsheet data
-- Based on research and provided artist names

INSERT INTO artists (name, specialty, bio, city, country, techniques, styles, social_platforms, published, locked_artworks, artwork_files) VALUES

-- JAMES WILSON - Street Artist
('James Wilson', 'Street Art & Murals', 'Contemporary street artist known for urban landscape works and community-focused murals. Works across various mediums including large-scale public art installations.', 'Melbourne', 'Australia', '["Spray Paint", "Stencils", "Mixed Media"]', '["Street Art", "Contemporary", "Urban"]', '[]', true, false, '{}'),

-- LAMBIE (Jim Lambie) - Scottish Contemporary Artist  
('Lambie', 'Contemporary Art & Installation', 'Jim Lambie is a Scottish contemporary artist born in 1964, known for his intense visual stimulation through neon colors and cultural materials. Famous for his "Zobop" floor installations using vinyl tape strips and sculptures incorporating music paraphernalia.', 'Glasgow', 'Scotland', '["Installation", "Sculpture", "Mixed Media"]', '["Contemporary", "Pop Art", "Installation"]', '[]', true, false, '{}'),

-- UNWELL BUNNY (Ed Bechervaise) - Street Artist
('Unwell Bunny', 'Street Art & Character Design', 'Ed Bechervaise, known as Unwell Bunny, is a street artist exploring the popular subconscious through character-based street art and installations. Known for distinctive bunny-themed artwork and urban interventions.', 'Melbourne', 'Australia', '["Spray Paint", "Stencils", "Character Design"]', '["Street Art", "Pop Surrealism", "Character Art"]', '["http://www.unwellbunny.com"]', true, false, '{}'),

-- MIKE MAKATRON - Globe-trotting Street Artist
('Mike Makatron', 'Murals & Multidisciplinary Art', 'Australian multidisciplinary artist working across large-scale murals, canvas, illustration, and sculptures. Survivor of 9/11 who spent five years in New York''s vibrant art scene before embarking on a globe-trotting journey, painting from the Berlin Wall to Brazilian Favelas.', 'Melbourne', 'Australia', '["Murals", "Illustration", "Sculpture", "Mixed Media"]', '["Street Art", "Contemporary", "Fantasy Illustration"]', '["https://www.makatron.com"]', true, false, '{}'),

-- CRISIS (Glen Downey) - Melbourne Artist & Designer
('Crisis', 'Street Art & Graphic Design', 'Glen Downey, known as Crisis, is a Melbourne-based artist, muralist, illustrator and graphic designer. Known for his distinctive style combining street art aesthetics with professional design work.', 'Melbourne', 'Australia', '["Murals", "Illustration", "Graphic Design"]', '["Street Art", "Contemporary", "Graphic Design"]', '["https://glendowney.com"]', true, false, '{}'),

-- DAVID MEGGS HOOKE - Progressive Australian Street Artist
('David Meggs Hooke', 'Progressive Street Art', 'David "MEGGS" Hooke is among the most progressive Australian street and fine artists. Recognized for his unique energetic style using vibrant colors with illustrative elements, authentic texture, and free-flowing design that creates astonishing large-scale murals.', 'Melbourne', 'Australia', '["Murals", "Fine Art", "Illustration"]', '["Street Art", "Contemporary", "Progressive"]', '["https://davidmeggshooke.com"]', true, false, '{}'),

-- JOSHUA SMITH - Miniaturist & Former Stencil Artist
('Joshua Smith', 'Miniatures & Street Art', 'Joshua Smith is a miniaturist and former stencil artist based in South Australia. With a career spanning 20+ years, he has showcased his intricate made-from-scratch miniatures that capture urban landscapes with extraordinary detail.', 'Adelaide', 'Australia', '["Miniatures", "Stencils", "Mixed Media"]', '["Street Art", "Miniature Art", "Urban Realism"]', '["https://www.iknowjoshuasmith.com"]', true, false, '{}'),

-- LUSH (Lushsux) - Controversial Melbourne Artist
('Lush', 'Street Art & Murals', 'Lushsux is an anonymous Australian-based graffiti artist from Melbourne, widely recognized for large murals on streets and walls. Known for controversial and topical artwork that often features pop culture references and political commentary.', 'Melbourne', 'Australia', '["Spray Paint", "Murals", "Stencils"]', '["Street Art", "Pop Culture", "Political Art"]', '[]', true, false, '{}'),

-- LING - Street Artist
('Ling', 'Street Art', 'Contemporary street artist known for urban works and graffiti-style pieces. Active in the Melbourne street art scene with distinctive style and technique.', 'Melbourne', 'Australia', '["Spray Paint", "Stencils"]', '["Street Art", "Contemporary"]', '[]', true, false, '{}'),

-- PREIST - Street Artist
('Preist', 'Street Art & Graffiti', 'Street artist and graffiti writer known for distinctive lettering and urban art pieces. Active in the Australian street art community.', 'Melbourne', 'Australia', '["Spray Paint", "Lettering"]', '["Street Art", "Graffiti"]', '[]', true, false, '{}'),

-- STEVE HAMILTON - Street Artist
('Steve Hamilton', 'Street Art', 'Melbourne-based street artist known for urban artwork and contemporary street pieces. Active member of the local street art scene.', 'Melbourne', 'Australia', '["Spray Paint", "Mixed Media"]', '["Street Art", "Contemporary"]', '[]', true, false, '{}'),

-- 23RD KEY - Street Artist
('23rd Key', 'Street Art & Typography', 'Street artist known for typographic work and urban art pieces. Creates distinctive text-based artwork and street installations.', 'Melbourne', 'Australia', '["Typography", "Spray Paint"]', '["Street Art", "Typography"]', '[]', true, false, '{}'),

-- SAM OCTIGAN - Artist
('Sam Octigan', 'Contemporary Art', 'Contemporary artist working across various mediums. Known for unique artistic style and creative approach to modern art forms.', 'Melbourne', 'Australia', '["Mixed Media", "Contemporary"]', '["Contemporary", "Modern Art"]', '[]', true, false, '{}'),

-- LUCAS GEOR - Artist
('Lucas Geor', 'Street Art', 'Street artist and contemporary creator known for urban artwork and modern artistic expressions.', 'Melbourne', 'Australia', '["Spray Paint", "Contemporary"]', '["Street Art", "Contemporary"]', '[]', true, false, '{}'),

-- CRAIG COLE - Artist
('Craig Cole', 'Contemporary Art', 'Contemporary artist working in various mediums, known for distinctive artistic style and creative expression.', 'Melbourne', 'Australia', '["Mixed Media"]', '["Contemporary"]', '[]', true, false, '{}'),

-- MYSTERIOUS AL - Street Artist
('Mysterious Al', 'Street Art & Mystery', 'Enigmatic street artist known for mysterious urban installations and artwork. Creates intriguing pieces that blur the line between art and mystery.', 'Melbourne', 'Australia', '["Mixed Media", "Installation"]', '["Street Art", "Conceptual"]', '[]', true, false, '{}'),

-- VKM - Street Artist
('VKM', 'Street Art & Graffiti', 'Street artist and graffiti writer known for distinctive style and urban artwork. Active in the street art community with unique artistic approach.', 'Melbourne', 'Australia', '["Spray Paint", "Graffiti"]', '["Street Art", "Graffiti"]', '[]', true, false, '{}'),

-- JOHN MURRAY - Artist
('John Murray', 'Contemporary Art', 'Contemporary artist known for distinctive style and creative approach to modern art forms and expressions.', 'Melbourne', 'Australia', '["Mixed Media"]', '["Contemporary"]', '[]', true, false, '{}'),

-- GLASS DISPLAY CASE - Artist
('Glass Display Case', 'Installation Art', 'Artist known for conceptual installations and contemporary art pieces. Creates thought-provoking works that challenge traditional artistic boundaries.', 'Melbourne', 'Australia', '["Installation", "Conceptual"]', '["Contemporary", "Conceptual Art"]', '[]', true, false, '{}'),

-- L-R - Artist
('L-R', 'Street Art', 'Street artist known for distinctive urban artwork and contemporary street pieces.', 'Melbourne', 'Australia', '["Spray Paint"]', '["Street Art"]', '[]', true, false, '{}'),

-- WILL COLES - Artist
('Will Coles', 'Contemporary Art', 'Contemporary artist working across various mediums, known for unique artistic style and creative expressions.', 'Melbourne', 'Australia', '["Mixed Media"]', '["Contemporary"]', '[]', true, false, '{}'),

-- BE FREE - Street Artist
('Be Free', 'Street Art & Motivational', 'Street artist known for uplifting and motivational artwork. Creates positive messages through urban art installations.', 'Melbourne', 'Australia', '["Spray Paint", "Stencils"]', '["Street Art", "Motivational"]', '[]', true, false, '{}'),

-- GT SEWELL - Artist
('GT Sewell', 'Contemporary Art', 'Contemporary artist known for distinctive style and modern artistic expressions across various mediums.', 'Melbourne', 'Australia', '["Mixed Media"]', '["Contemporary"]', '[]', true, false, '{}'),

-- AARON TYLER - Artist
('Aaron Tyler', 'Street Art', 'Street artist known for urban artwork and contemporary street pieces with distinctive artistic style.', 'Melbourne', 'Australia', '["Spray Paint"]', '["Street Art"]', '[]', true, false, '{}'),

-- JUNKER PROJECTS - Collective
('Junker Projects', 'Street Art Collective', 'Street art collective known for collaborative urban projects and contemporary street art installations.', 'Melbourne', 'Australia', '["Collaboration", "Mixed Media"]', '["Street Art", "Collective Work"]', '[]', true, false, '{}'),

-- LAND OF SUNSHINE - Artist
('Land of Sunshine', 'Contemporary Art', 'Artist known for bright, positive artwork that captures the essence of Australian sunshine and optimism.', 'Melbourne', 'Australia', '["Mixed Media", "Painting"]', '["Contemporary", "Positive Art"]', '[]', true, false, '{}'),

-- SUPER PLASTIC - Artist
('Super Plastic', 'Pop Art & Street Art', 'Artist known for pop culture-inspired artwork and street art pieces with plastic and synthetic aesthetics.', 'Melbourne', 'Australia', '["Mixed Media", "Pop Art"]', '["Pop Art", "Street Art"]', '[]', true, false, '{}'),

-- FACTOR - Street Artist
('Factor', 'Street Art', 'Street artist known for mathematical and geometric approach to urban artwork, creating precise and calculated street pieces.', 'Melbourne', 'Australia', '["Spray Paint", "Geometric"]', '["Street Art", "Geometric"]', '[]', true, false, '{}'),

-- S.A.S ART - Artist/Collective
('S.A.S Art', 'Contemporary Street Art', 'Contemporary street art collective or artist known for tactical and strategic approach to urban artwork and installations.', 'Melbourne', 'Australia', '["Mixed Media", "Street Art"]', '["Street Art", "Contemporary"]', '[]', true, false, '{}'),

-- HEESCO - Street Artist
('Heesco', 'Street Art', 'Street artist known for distinctive urban artwork and contemporary street art pieces with unique stylistic approach.', 'Melbourne', 'Australia', '["Spray Paint"]', '["Street Art"]', '[]', true, false, '{}');

-- Update sequence to ensure proper ID generation for future artists
SELECT setval('artists_id_seq', (SELECT COALESCE(MAX(id), 0) + 1 FROM artists));