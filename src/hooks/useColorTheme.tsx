import { useState, useEffect } from 'react';
import { Artist } from '@/data/types/artist';
import { ArtistProfile } from '@/data/types/artistProfile';
import { generateColorTheme, defaultColorThemes } from '@/utils/colorExtraction';

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