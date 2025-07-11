
// This utility extracts color themes from artwork images
import { ArtistProfile } from '@/data/types/artistProfile';
import { Artist } from '@/data/types/artist';
import { logger } from '@/utils/logger';

// Image color extraction utilities
interface ColorCount {
  color: string;
  count: number;
}

// Extract dominant colors from an image
export async function extractImageColors(imageUrl: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        // Scale down image for performance
        const scale = Math.min(200 / img.width, 200 / img.height);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const colors = extractColorsFromImageData(imageData);
        
        resolve(colors);
      } catch (error) {
        logger.error('Error extracting colors from image:', error);
        reject(error);
      }
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = imageUrl;
  });
}

// Extract colors from image data
function extractColorsFromImageData(imageData: ImageData): string[] {
  const data = imageData.data;
  const colorMap = new Map<string, number>();
  
  // Sample every 4th pixel for performance
  for (let i = 0; i < data.length; i += 16) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const alpha = data[i + 3];
    
    // Skip transparent pixels
    if (alpha < 128) continue;
    
    // Quantize colors to reduce noise
    const quantR = Math.round(r / 32) * 32;
    const quantG = Math.round(g / 32) * 32;
    const quantB = Math.round(b / 32) * 32;
    
    const color = `rgb(${quantR}, ${quantG}, ${quantB})`;
    colorMap.set(color, (colorMap.get(color) || 0) + 1);
  }
  
  // Sort by frequency and return top colors
  const sortedColors = Array.from(colorMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([color]) => rgbToHex(color));
  
  return sortedColors;
}

// Convert RGB string to hex
function rgbToHex(rgb: string): string {
  const match = rgb.match(/rgb\((\d+), (\d+), (\d+)\)/);
  if (!match) return '#000000';
  
  const r = parseInt(match[1]);
  const g = parseInt(match[2]);
  const b = parseInt(match[3]);
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

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
  },
  // Additional varied themes
  purple: {
    background: '#9b87f5', // Medium purple
    panel: '#f8f7fe',     // Light purple-tinted white
    button: '#7E69AB',    // Darker purple
    buttonText: '#ffffff', // White
    buttonHover: '#6E59A5', // Even darker purple
    buttonBorder: '#6E59A5', // Even darker purple
    badgeBg: '#e9e5fd'     // Very light purple
  },
  pink: {
    background: '#f39bc7', // Medium pink
    panel: '#fef8fb',     // Light pink-tinted white
    button: '#e37bb2',    // Darker pink
    buttonText: '#ffffff', // White
    buttonHover: '#d4619e', // Even darker pink
    buttonBorder: '#d4619e', // Even darker pink
    badgeBg: '#fde8f4'     // Very light pink
  },
  teal: {
    background: '#5bd9c7', // Medium teal
    panel: '#f6fcfc',     // Light teal-tinted white
    button: '#39bcab',    // Darker teal
    buttonText: '#ffffff', // White
    buttonHover: '#2aa396', // Even darker teal
    buttonBorder: '#2aa396', // Even darker teal
    badgeBg: '#e8f9f7'     // Very light teal
  },
  red: {
    background: '#f87171', // Medium red
    panel: '#fdf7f7',     // Light red-tinted white
    button: '#ef4444',    // Darker red
    buttonText: '#ffffff', // White
    buttonHover: '#dc2626', // Even darker red
    buttonBorder: '#dc2626', // Even darker red
    badgeBg: '#feebeb'     // Very light red
  },
  orange: {
    background: '#fb923c', // Medium orange
    panel: '#fefaf6',     // Light orange-tinted white
    button: '#f97316',    // Darker orange
    buttonText: '#ffffff', // White
    buttonHover: '#ea580c', // Even darker orange
    buttonBorder: '#ea580c', // Even darker orange
    badgeBg: '#fef2e7'     // Very light orange
  },
  blue: {
    background: '#60a5fa', // Medium blue
    panel: '#f8faff',     // Light blue-tinted white
    button: '#3b82f6',    // Darker blue
    buttonText: '#ffffff', // White
    buttonHover: '#2563eb', // Even darker blue
    buttonBorder: '#2563eb', // Even darker blue
    badgeBg: '#e9f2ff'     // Very light blue
  }
};

// Generate a color theme based on artist specialty and artworks
export async function generateColorTheme(artist: Artist, profile: ArtistProfile | null, artworks: string[]): Promise<{
  background: string;
  panel: string;
  button: string;
  buttonText: string;
  buttonHover: string;
  buttonBorder: string;
  badgeBg: string;
}> {
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

  // Try to extract colors from background image first
  if (profile?.background_image) {
    try {
      const dominantColors = await extractImageColors(profile.background_image);
      if (dominantColors.length > 0) {
        const primaryColor = dominantColors[0];
        const secondaryColor = dominantColors[1] || primaryColor;
        
        // Create a lighter version for panel
        const panelColor = isLightColor(primaryColor) ? '#ffffff' : adjustBrightness(primaryColor, 80);
        
        return {
          background: primaryColor,
          panel: panelColor,
          button: secondaryColor,
          buttonText: isLightColor(secondaryColor) ? '#000000' : '#ffffff',
          buttonHover: adjustBrightness(secondaryColor, -15),
          buttonBorder: isLightColor(secondaryColor) ? '#000000' : '#ffffff',
          badgeBg: isLightColor(panelColor) ? adjustBrightness(panelColor, -8) : adjustBrightness(panelColor, 15)
        };
      }
    } catch (error) {
      logger.warn('Failed to extract colors from background image:', error);
      // Continue to fallback themes
    }
  }

  // Use hash of artist id and name to create a more unique theme
  const idHash = hashCode(String(artist.id) + (artist.name || ''));
  
  // Select a theme based on artist specialty or name
  const specialty = artist.specialty?.toLowerCase() || '';
  const name = artist.name?.toLowerCase() || '';

  console.log(`Generating color theme for artist ${artist.name} (ID: ${artist.id}), hash: ${idHash}`);

  // Ahmad Hassan - Desert theme
  if (name.includes('ahmad') && name.includes('hassan')) {
    console.log('Using desert theme for Ahmad Hassan');
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
  } else if (
    specialty.includes('purple') ||
    specialty.includes('violet') ||
    specialty.includes('lavender')
  ) {
    return defaultColorThemes.purple;
  } else if (
    specialty.includes('pink') || 
    specialty.includes('rose') || 
    specialty.includes('magenta')
  ) {
    return defaultColorThemes.pink;
  } else if (
    specialty.includes('teal') || 
    specialty.includes('turquoise') || 
    specialty.includes('cyan')
  ) {
    return defaultColorThemes.teal;
  } else if (
    specialty.includes('red') || 
    specialty.includes('crimson') || 
    specialty.includes('scarlet')
  ) {
    return defaultColorThemes.red;
  }

  // Use arithmetic on the hash to select a theme from our available themes
  const allThemes = Object.values(defaultColorThemes);
  const themeIndex = Math.abs(idHash) % allThemes.length;
  
  // Generate a custom color based on artist id if none of the specific themes match
  const selectedTheme = allThemes[themeIndex];
  
  console.log(`Selected theme index ${themeIndex} from ${allThemes.length} themes for hash ${idHash}`);
  console.log(`Theme background: ${selectedTheme.background} -> ${adjustColorSlightly(selectedTheme.background, idHash)}`);
  
  // Adjust the colors slightly to make them more unique per artist
  return {
    background: adjustColorSlightly(selectedTheme.background, idHash),
    panel: selectedTheme.panel,
    button: adjustColorSlightly(selectedTheme.button, idHash),
    buttonText: selectedTheme.buttonText,
    buttonHover: adjustColorSlightly(selectedTheme.buttonHover, idHash),
    buttonBorder: selectedTheme.buttonBorder,
    badgeBg: selectedTheme.badgeBg
  };
}

// Simple hash function for strings
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

// Adjusts a color slightly based on a hash value
function adjustColorSlightly(color: string, hash: number): string {
  try {
    // Parse the hex color
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Use the hash to slightly adjust each component
    const adjustR = Math.max(0, Math.min(255, r + (hash % 31) - 15));
    const adjustG = Math.max(0, Math.min(255, g + (hash % 23) - 11));
    const adjustB = Math.max(0, Math.min(255, b + (hash % 17) - 8));
    
    return `#${Math.round(adjustR).toString(16).padStart(2, '0')}${Math.round(adjustG).toString(16).padStart(2, '0')}${Math.round(adjustB).toString(16).padStart(2, '0')}`;
  } catch (error) {
    logger.error("Error adjusting color:", error);
    return color; // Return original color if there's an error
  }
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
