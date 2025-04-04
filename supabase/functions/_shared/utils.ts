
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
      (imageUrl.includes('product-images') || imageUrl.includes('product-images')));
    
    if (isAlreadyInStorage) {
      console.log('Image is already in Supabase storage, skipping');
      return imageUrl;
    }
    
    // Download the image
    console.log(`Starting download of ${imageUrl}`);
    const imageResponse = await fetch(imageUrl);
    
    if (!imageResponse.ok) {
      throw new Error(`Failed to download image: ${imageResponse.status}`);
    }

    // Get the image data as a blob
    const imageBlob = await imageResponse.blob();
    console.log(`Successfully downloaded image, size: ${imageBlob.size} bytes`);

    // Try to upload to the bucket
    try {
      console.log(`Uploading to bucket: product-images, path: ${storagePath}`);
      const { data, error } = await supabase
        .storage
        .from('product-images')
        .upload(storagePath, imageBlob, {
          contentType: 'image/webp',
          upsert: true,
          cacheControl: '0' // Disable caching to ensure fresh images
        });
        
      if (error) {
        throw new Error(`Failed to upload to storage: ${error.message}`);
      }
      
      // Get the public URL
      const { data: { publicUrl } } = supabase
        .storage
        .from('product-images')
        .getPublicUrl(storagePath);
      
      console.log(`Successfully stored image at ${publicUrl}`);
      return publicUrl;
    } catch (error) {
      console.error('Error storing image in Supabase:', error);
      return null;
    }
  } catch (error) {
    console.error('Error in downloadAndStoreImage:', error);
    return null;
  }
}

/**
 * Ensure a storage bucket exists with CORS properly set up
 */
export async function ensureBucketExists(supabase: any, bucketName: string): Promise<boolean> {
  try {
    console.log(`Checking if bucket ${bucketName} exists`);
    
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error(`Error listing buckets: ${listError.message}`);
      return false;
    }
    
    const bucket = buckets.find((b: any) => b.name === bucketName);
    
    if (!bucket) {
      console.log(`Creating bucket ${bucketName}`);
      
      // Create bucket
      const { error: createError } = await supabase.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ['image/webp', 'image/jpeg', 'image/png', 'image/gif']
      });
      
      if (createError) {
        console.error(`Error creating bucket: ${createError.message}`);
        return false;
      }
      
      console.log(`Successfully created bucket ${bucketName}`);
    } else {
      console.log(`Bucket ${bucketName} already exists`);
    }
    
    return true;
  } catch (error) {
    console.error(`Error ensuring bucket exists: ${error}`);
    return false;
  }
}
