
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
