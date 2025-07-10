-- Update artist #112 with comprehensive bio and information from makatron.com
UPDATE artists 
SET 
  bio = 'Mike Maka is a painter and multidisciplinary artist whose practice spans large-scale murals, canvas works, illustration, and sculpture. In his early twenties, Mike moved to New York, where five formative years immersed in the city''s dynamic art scene ignited a global journey. His work has since taken him around the world—from painting the Berlin Wall and the banks of the Ganges to Brazil''s favelas and remote Aboriginal communities in Australia. Maka''s art envisions a world where nature pushes back against humanity''s relentless expansion, reclaiming space from an indifferent civilization. Through striking imagery that explores the tension between human, animal, and machine, he invites viewers to step beyond the concrete jungle and reconnect with both the natural world and their own inner wilderness. A longtime member of Everfresh Studio, Mike has exhibited widely across Australia and internationally. His work is held in numerous private and public collections, including the National Gallery of Australia, the National Gallery of Victoria, the Sandrew Collection, and MONA Tasmania. Though often journeying through other dimensions, Mike is based in between NYC + Melbourne, Australia.',
  social_platforms = '["https://www.makatron.com"]'::jsonb,
  city = 'Melbourne',
  country = 'Australia',
  location = 'NYC + Melbourne, Australia',
  specialty = 'Large-scale murals, canvas works, illustration, and sculpture'
WHERE id = 112;