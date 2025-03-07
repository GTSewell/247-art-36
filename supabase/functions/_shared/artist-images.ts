import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { downloadAndStoreImage } from './utils.ts';

/**
 * Process a single artist's profile image
 */
export async function processArtistProfileImage(
  artist: any,
  storageFolder: string,
  supabase: any
): Promise<string | null> {
  if (!artist.image) {
    return null;
  }

  try {
    console.log(`Processing profile image for artist: ${artist.name} (ID: ${artist.id})`);
    
    // Download and store the profile image
    const profileImageUrl = await downloadAndStoreImage(
      artist.image,
      `${storageFolder}/profiles/${artist.id}.webp`,
      supabase
    );

    if (profileImageUrl) {
      // Update the artist record with the new image URL
      const { error: updateError } = await supabase
        .from('artists')
        .update({ image: profileImageUrl })
        .eq('id', artist.id);

      if (updateError) {
        console.error(`Error updating profile image for artist ${artist.id}:`, updateError);
        return null;
      } else {
        console.log(`Updated profile image for artist ${artist.name}`);
        return profileImageUrl;
      }
    }
    
    return null;
  } catch (imageError) {
    console.error(`Error processing profile image for artist ${artist.id}:`, imageError);
    return null;
  }
}

/**
 * Process an artist's artwork images
 */
export async function processArtistArtworks(
  artist: any,
  storageFolder: string,
  supabase: any
): Promise<string[] | null> {
  if (!artist.artworks) {
    return null;
  }

  try {
    const artworks = typeof artist.artworks === 'string' 
      ? JSON.parse(artist.artworks) 
      : artist.artworks;
    
    if (!Array.isArray(artworks) || artworks.length === 0) {
      return null;
    }
    
    console.log(`Processing ${artworks.length} artworks for artist: ${artist.name} (ID: ${artist.id})`);
    
    const updatedArtworks = [];
    
    for (let i = 0; i < artworks.length; i++) {
      try {
        // Download and store the artwork
        const artworkUrl = await downloadAndStoreImage(
          artworks[i],
          `${storageFolder}/artworks/${artist.id}_${i+1}.webp`,
          supabase
        );
        
        if (artworkUrl) {
          updatedArtworks.push(artworkUrl);
        } else {
          // Keep the original URL if download fails
          updatedArtworks.push(artworks[i]);
        }
      } catch (artworkError) {
        console.error(`Error processing artwork ${i+1} for artist ${artist.id}:`, artworkError);
        // Keep the original URL if processing fails
        updatedArtworks.push(artworks[i]);
      }
    }
    
    // Only update if we have any artwork URLs
    if (updatedArtworks.length > 0) {
      // Update the artist record with the new artwork URLs
      const { error: updateError } = await supabase
        .from('artists')
        .update({ artworks: updatedArtworks })
        .eq('id', artist.id);
      
      if (updateError) {
        console.error(`Error updating artworks for artist ${artist.id}:`, updateError);
        return null;
      } else {
        console.log(`Updated ${updatedArtworks.length} artworks for artist ${artist.name}`);
        return updatedArtworks;
      }
    }
    
    return null;
  } catch (artworksError) {
    console.error(`Error processing artworks for artist ${artist.id}:`, artworksError);
    return null;
  }
}
