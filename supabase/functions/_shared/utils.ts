
// Common utility functions for Supabase Edge Functions

/**
 * Download an image from a URL and return it as a Uint8Array
 */
export async function downloadImage(url: string): Promise<Uint8Array> {
  console.log(`Downloading image from ${url}`);
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
  }
  
  const arrayBuffer = await response.arrayBuffer();
  return new Uint8Array(arrayBuffer);
}

/**
 * Generate a unique ID for tasks
 */
export function generateUUID(): string {
  return crypto.randomUUID();
}

/**
 * Download and store an image from a URL to Supabase Storage
 */
export async function downloadAndStoreImage(
  imageUrl: string,
  storagePath: string,
  supabase: any
): Promise<string | null> {
  try {
    console.log(`Downloading image from ${imageUrl}`);
    
    // Check for both possible bucket names in the URL
    const isAlreadyInStorage = 
      (imageUrl.includes('storage.googleapis.com') && 
      (imageUrl.includes('artist-images') || imageUrl.includes('artists')));
    
    if (isAlreadyInStorage) {
      console.log('Image is already in Supabase storage, skipping');
      return imageUrl;
    }
    
    // Download the image
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to download image: ${imageResponse.status}`);
    }

    // Get the image data as a blob
    const imageBlob = await imageResponse.blob();

    // Try both bucket names
    let uploadResult = null;
    let publicUrl = null;
    
    // First try with new 'artists' bucket
    try {
      const { data, error } = await supabase
        .storage
        .from('artists')
        .upload(storagePath, imageBlob, {
          contentType: 'image/webp',
          upsert: true
        });
        
      if (!error) {
        uploadResult = data;
        const { data: { publicUrl: url } } = supabase
          .storage
          .from('artists')
          .getPublicUrl(storagePath);
        publicUrl = url;
      }
    } catch (firstError) {
      console.log('Failed to upload to artists bucket, trying artist-images bucket', firstError);
    }
    
    // If first attempt failed, try with legacy 'artist-images' bucket
    if (!uploadResult) {
      try {
        const { data, error } = await supabase
          .storage
          .from('artist-images')
          .upload(storagePath, imageBlob, {
            contentType: 'image/webp',
            upsert: true
          });
          
        if (error) {
          throw new Error(`Failed to upload to storage: ${error.message}`);
        }
        
        uploadResult = data;
        const { data: { publicUrl: url } } = supabase
          .storage
          .from('artist-images')
          .getPublicUrl(storagePath);
        publicUrl = url;
      } catch (secondError) {
        throw new Error(`Failed to upload to any storage bucket: ${secondError.message}`);
      }
    }

    console.log(`Successfully stored image at ${publicUrl}`);
    return publicUrl;
  } catch (error) {
    console.error('Error in downloadAndStoreImage:', error);
    return null;
  }
}
