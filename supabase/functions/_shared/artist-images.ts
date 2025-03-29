
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { downloadAndStoreImage } from './utils.ts';

/**
 * Process a single artist's profile image
 */
export async function processArtistProfileImage(
  artist: any,
  storageFolder: string,
  supabase: any,
  updateBothImageColumns: boolean = true
): Promise<string | null> {
  // Use either image or profile_image_url, preferring image if available
  const artistImage = artist.image || artist.profile_image_url;

  if (!artistImage) {
    console.log(`No profile image found for artist: ${artist.name} (ID: ${artist.id})`);
    return null;
  }

  try {
    console.log(`Processing profile image for artist: ${artist.name} (ID: ${artist.id})`);
    
    // Download and store the profile image
    const profileImageUrl = await downloadAndStoreImage(
      artistImage,
      `${storageFolder}/profiles/${artist.id}.webp`,
      supabase
    );

    if (profileImageUrl) {
      // Prepare update payload
      const updatePayload: Record<string, any> = {};
      
      // Always update image
      updatePayload.image = profileImageUrl;
      
      // Optionally update profile_image_url as well
      if (updateBothImageColumns) {
        updatePayload.profile_image_url = profileImageUrl;
      }
      
      // Update the artist record with the new image URL(s)
      const { error: updateError } = await supabase
        .from('artists')
        .update(updatePayload)
        .eq('id', artist.id);

      if (updateError) {
        console.error(`Error updating profile image for artist ${artist.id}:`, updateError);
        return null;
      } else {
        console.log(`Updated profile image for artist ${artist.name} to ${profileImageUrl}`);
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
  supabase: any,
  updateBothArtworkColumns: boolean = true
): Promise<string[] | null> {
  // Use either artworks or artwork_files, preferring artworks if available
  let artworks = null;
  
  if (artist.artworks) {
    artworks = typeof artist.artworks === 'string' 
      ? JSON.parse(artist.artworks) 
      : artist.artworks;
  } else if (artist.artwork_files) {
    artworks = typeof artist.artwork_files === 'string' 
      ? JSON.parse(artist.artwork_files) 
      : artist.artwork_files;
  }

  if (!Array.isArray(artworks) || artworks.length === 0) {
    console.log(`No artworks found for artist: ${artist.name} (ID: ${artist.id})`);
    return null;
  }
  
  try {
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
      // Prepare update payload
      const updatePayload: Record<string, any> = {};
      
      // Always update artworks
      updatePayload.artworks = updatedArtworks;
      
      // Optionally update artwork_files as well
      if (updateBothArtworkColumns) {
        updatePayload.artwork_files = updatedArtworks;
      }
      
      // Update the artist record with the new artwork URLs
      const { error: updateError } = await supabase
        .from('artists')
        .update(updatePayload)
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
