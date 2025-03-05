
// This utility extracts color themes from artwork images
import { ArtistProfile } from '@/data/types/artistProfile';
import { Artist } from '@/data/types/artist';

// Default color themes that can be used as fallbacks
export const defaultColorThemes = {
  // Desert theme (Ahmad Hassan)
  desert: {
    background: '#d1b399', // Sandy beige
    panel: '#f5f0e6',     // Light sand
    button: '#97b1c9',    // Light blue
    buttonText: '#5a4a3f', // Dark brown
    buttonHover: '#7596b5', // Darker blue
    buttonBorder: '#816c5b', // Medium brown
    badgeBg: '#e8e1d6'     // Lightest sand
  },
  // Ocean theme
  ocean: {
    background: '#b8d0e0', // Light blue
    panel: '#f5f9fc',     // Almost white blue
    button: '#4a7c9b',    // Medium blue
    buttonText: '#ffffff', // White
    buttonHover: '#3d6a86', // Darker blue
    buttonBorder: '#3d6a86', // Darker blue
    badgeBg: '#e6f0f7'     // Very light blue
  },
  // Forest theme
  forest: {
    background: '#a4c3a2', // Light green
    panel: '#f5f9f5',     // Almost white green
    button: '#5a8c69',    // Medium green
    buttonText: '#ffffff', // White
    buttonHover: '#4a7358', // Darker green
    buttonBorder: '#4a7358', // Darker green
    badgeBg: '#e6f2e6'     // Very light green
  },
  // Urban theme
  urban: {
    background: '#b8b8b8', // Light gray
    panel: '#f7f7f7',     // Almost white
    button: '#555555',    // Dark gray
    buttonText: '#ffffff', // White
    buttonHover: '#444444', // Darker gray
    buttonBorder: '#444444', // Darker gray
    badgeBg: '#eeeeee'     // Very light gray
  },
  // Yellow (default ZAP theme)
  yellow: {
    background: '#f7cf1e', // ZAP yellow
    panel: '#ffffff',     // White
    button: '#f7cf1e',    // ZAP yellow
    buttonText: '#000000', // Black
    buttonHover: '#e6bf1a', // Darker yellow
    buttonBorder: '#000000', // Black
    badgeBg: '#f5f5f5'     // Light gray
  }
};

// Generate a color theme based on artist specialty and artworks
export function generateColorTheme(artist: Artist, profile: ArtistProfile | null, artworks: string[]): {
  background: string;
  panel: string;
  button: string;
  buttonText: string;
  buttonHover: string;
  buttonBorder: string;
  badgeBg: string;
} {
  // If profile already has custom colors, use those
  if (profile?.background_color && profile?.background_color !== '#f7cf1e') {
    // Custom background color exists, derive other colors
    const bgColor = profile.background_color;
    const panelColor = profile.panel_color || '#ffffff';
    
    return {
      background: bgColor,
      panel: panelColor,
      button: bgColor,
      buttonText: isLightColor(bgColor) ? '#000000' : '#ffffff',
      buttonHover: adjustBrightness(bgColor, -10),
      buttonBorder: isLightColor(bgColor) ? '#000000' : '#ffffff',
      badgeBg: isLightColor(panelColor) ? adjustBrightness(panelColor, -5) : adjustBrightness(panelColor, 10)
    };
  }

  // Select a theme based on artist specialty or name
  const specialty = artist.specialty?.toLowerCase() || '';
  const name = artist.name?.toLowerCase() || '';

  // Ahmad Hassan - Desert theme
  if (name.includes('ahmad') && name.includes('hassan')) {
    return defaultColorThemes.desert;
  }
  
  // Choose theme based on specialty keywords
  if (
    specialty.includes('desert') || 
    specialty.includes('minimal') || 
    specialty.includes('landscape') || 
    specialty.includes('sand')
  ) {
    return defaultColorThemes.desert;
  } else if (
    specialty.includes('ocean') || 
    specialty.includes('sea') || 
    specialty.includes('water') || 
    specialty.includes('blue')
  ) {
    return defaultColorThemes.ocean;
  } else if (
    specialty.includes('forest') || 
    specialty.includes('nature') || 
    specialty.includes('green') || 
    specialty.includes('plant')
  ) {
    return defaultColorThemes.forest;
  } else if (
    specialty.includes('urban') || 
    specialty.includes('city') || 
    specialty.includes('street') || 
    specialty.includes('modern')
  ) {
    return defaultColorThemes.urban;
  }

  // Default to yellow theme if no matches
  return defaultColorThemes.yellow;
}

// Helper function to determine if a color is light or dark
function isLightColor(color: string): boolean {
  // Convert hex to RGB
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calculate brightness (YIQ formula)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  
  // Return true if color is light (brightness > 128)
  return brightness > 128;
}

// Helper function to adjust brightness of a color
function adjustBrightness(color: string, percent: number): string {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  const adjustR = Math.max(0, Math.min(255, r + (r * percent / 100)));
  const adjustG = Math.max(0, Math.min(255, g + (g * percent / 100)));
  const adjustB = Math.max(0, Math.min(255, b + (b * percent / 100)));

  return `#${Math.round(adjustR).toString(16).padStart(2, '0')}${Math.round(adjustG).toString(16).padStart(2, '0')}${Math.round(adjustB).toString(16).padStart(2, '0')}`;
}
