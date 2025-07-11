import { useState, useEffect } from 'react';
import { Artist } from '@/data/types/artist';
import { ArtistProfile } from '@/data/types/artistProfile';
import { generateColorTheme, defaultColorThemes } from '@/utils/colorExtraction';
import { supabase } from '@/integrations/supabase/client';

interface ColorTheme {
  background: string;
  panel: string;
  button: string;
  buttonText: string;
  buttonHover: string;
  buttonBorder: string;
  badgeBg: string;
}

export function useColorTheme(artist: Artist | null, profile: ArtistProfile | null, artworks: string[] = []) {
  const [colorTheme, setColorTheme] = useState<ColorTheme>(defaultColorThemes.yellow);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!artist) {
      setLoading(false);
      return;
    }

    const generateTheme = async () => {
      try {
        setLoading(true);
        
        // First, check if there's a custom color theme saved
        if (artist.id) {
          const { data: artistProfile, error } = await supabase
            .from('artist_profiles')
            .select('links')
            .eq('artist_id', artist.id)
            .single();

          if (!error && artistProfile?.links && 
              typeof artistProfile.links === 'object' && 
              artistProfile.links !== null && 
              'colorTheme' in artistProfile.links) {
            const customTheme = (artistProfile.links as any).colorTheme;
            if (customTheme && typeof customTheme === 'object') {
              setColorTheme(customTheme);
              setLoading(false);
              return;
            }
          }
        }
        
        // If no custom theme, generate from image
        const theme = await generateColorTheme(artist, profile, artworks);
        setColorTheme(theme);
      } catch (error) {
        console.error('Error generating color theme:', error);
        // Fallback to default theme
        setColorTheme(defaultColorThemes.yellow);
      } finally {
        setLoading(false);
      }
    };

    generateTheme();
  }, [artist, profile, artworks]);

  return { colorTheme, loading };
}