
import { Artist } from '@/data/types/artist';

// Predefined palettes to use when we can't extract from artwork
const defaultPalettes = [
  {
    background: '#f7cf1e', // Default ZAP yellow
    panel: '#ffffff',
    text: '#000000',
    accent: '#ef3f36' // ZAP red
  },
  {
    background: '#00baef', // ZAP blue
    panel: '#ffffff',
    text: '#000000',
    accent: '#f7cf1e' // ZAP yellow
  },
  {
    background: '#ef3f36', // ZAP red
    panel: '#ffffff',
    text: '#000000',
    accent: '#00baef' // ZAP blue
  },
  {
    background: '#6E59A5', // Purple
    panel: '#ffffff',
    text: '#000000',
    accent: '#D946EF' // Magenta
  },
  {
    background: '#0EA5E9', // Blue
    panel: '#ffffff',
    text: '#000000',
    accent: '#F97316' // Orange
  }
];

// Color palette for each artist (keyed by artist name)
const artistColorCache: Record<string, { background: string; panel: string; text: string; accent: string }> = {};

/**
 * Gets a color palette for an artist based on their artwork or name
 */
export const getArtistColorPalette = (artist: Artist): { background: string; panel: string; text: string; accent: string } => {
  // If we already calculated a palette for this artist, use that
  if (artist.name && artistColorCache[artist.name]) {
    return artistColorCache[artist.name];
  }
  
  // Try to extract colors from artworks if available
  const artworks = Array.isArray(artist.artworks) 
    ? artist.artworks 
    : typeof artist.artworks === 'string' && artist.artworks
      ? JSON.parse(artist.artworks)
      : [];
  
  // If no artworks, use a deterministic palette based on artist's name
  if (!artworks.length) {
    const nameHash = artist.name ? hashString(artist.name) : 0;
    const paletteIndex = nameHash % defaultPalettes.length;
    const selectedPalette = defaultPalettes[paletteIndex];
    
    if (artist.name) {
      artistColorCache[artist.name] = selectedPalette;
    }
    
    return selectedPalette;
  }
  
  // For now, we'll use a deterministic palette selection based on the artist's name
  // In a real implementation, this could use color extraction techniques from images
  const nameHash = artist.name ? hashString(artist.name) : 0;
  
  // Custom palettes based on artist name hash
  const h = (nameHash % 360); // Hue (0-359)
  const s = 65 + (nameHash % 20); // Saturation (65-85)
  const l = 65 + (nameHash % 15); // Lightness (65-80)
  
  // Generate background color (pastel version of the main color)
  const background = `hsl(${h}, ${s}%, ${l}%)`;
  
  // Panel color (white or very light tint of the background)
  // Very light tint of the background color
  const panelH = h;
  const panelS = 10 + (nameHash % 5); // Very low saturation (10-15%)
  const panelL = 98; // Very high lightness for readability
  const panel = `hsl(${panelH}, ${panelS}%, ${panelL}%)`;
  
  // Text color (black or dark shade)
  const text = '#000000';
  
  // Accent color (complementary to background, for buttons/highlights)
  const accentHue = (h + 180) % 360;
  const accent = `hsl(${accentHue}, ${s}%, ${50}%)`;
  
  const palette = { background, panel, text, accent };
  
  if (artist.name) {
    artistColorCache[artist.name] = palette;
  }
  
  return palette;
};

// Simple string hash function
const hashString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
};
