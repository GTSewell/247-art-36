
import { v4 as uuidv4 } from 'https://esm.sh/uuid@9.0.1';

/**
 * Interface for Runware API authentication payload
 */
interface RunwareAuthPayload {
  taskType: "authentication";
  apiKey: string;
}

/**
 * Interface for Runware image generation payload
 */
interface RunwareImagePayload {
  taskType: "imageInference";
  taskUUID: string;
  positivePrompt: string;
  model: string;
  width: number;
  height: number;
  numberResults: number;
  outputFormat: string;
  CFGScale: number;
}

/**
 * Generate an artist portrait using Runware API
 */
export async function generateArtistPortrait(
  apiKey: string, 
  userPrompt: string
): Promise<string> {
  console.log(`Generating portrait with prompt: ${userPrompt}`);
  
  const portraitPayload: [RunwareAuthPayload, RunwareImagePayload] = [
    {
      taskType: "authentication",
      apiKey: apiKey
    },
    {
      taskType: "imageInference",
      taskUUID: uuidv4(),
      positivePrompt: userPrompt,
      model: "runware:100@1",
      width: 1024,
      height: 1024,
      numberResults: 1,
      outputFormat: "WEBP",
      CFGScale: 1,
    }
  ];

  console.log('Sending portrait generation request to Runware API');
  const portraitResponse = await fetch('https://api.runware.ai/v1', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(portraitPayload),
  });

  if (!portraitResponse.ok) {
    const errorText = await portraitResponse.text();
    console.error(`Runware API error status: ${portraitResponse.status}, response: ${errorText}`);
    throw new Error(`Runware API returned ${portraitResponse.status}: ${errorText}`);
  }

  const portraitResult = await portraitResponse.json();
  console.log('Portrait generation response received');

  if (!portraitResult.data) {
    console.error('No data in Runware API response:', portraitResult);
    throw new Error('No data returned from Runware API');
  }

  // Extract image URL from the response
  const imageResult = portraitResult.data.find((item: any) => 
    item.taskType === 'imageInference' && item.imageURL
  );

  if (!imageResult || !imageResult.imageURL) {
    console.error('No image URL in response:', portraitResult);
    throw new Error('No image URL returned from Runware API');
  }

  return imageResult.imageURL;
}

/**
 * Generate multiple artwork images using Runware API
 */
export async function generateArtworks(
  apiKey: string, 
  prompt: string, 
  count: number = 1
): Promise<string[]> {
  console.log(`Generating ${count} artworks with prompt: ${prompt}`);
  
  const artworksPayload = [
    {
      taskType: "authentication",
      apiKey: apiKey
    },
    ...Array(count).fill(null).map(() => ({
      taskType: "imageInference",
      taskUUID: uuidv4(),
      positivePrompt: prompt,
      model: "runware:100@1",
      width: 1024,
      height: 1024,
      numberResults: 1,
      outputFormat: "WEBP",
      CFGScale: 1,
    }))
  ];

  console.log('Sending artwork generation request to Runware API');
  const artworksResponse = await fetch('https://api.runware.ai/v1', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(artworksPayload),
  });

  if (!artworksResponse.ok) {
    const errorText = await artworksResponse.text();
    console.error(`Runware API error status: ${artworksResponse.status}, response: ${errorText}`);
    throw new Error(`Runware API returned ${artworksResponse.status}: ${errorText}`);
  }

  const artworksResult = await artworksResponse.json();
  console.log('Artworks generation response received');

  if (!artworksResult.data) {
    console.error('No data in Runware API response:', artworksResult);
    throw new Error('No data returned from Runware API');
  }

  // Extract image URLs from the response
  const imageUrls = artworksResult.data
    .filter((item: any) => item.taskType === 'imageInference' && item.imageURL)
    .map((item: any) => item.imageURL);

  console.log(`Generated ${imageUrls.length} artwork URLs`);

  if (imageUrls.length === 0) {
    console.error('No image URLs in response:', artworksResult);
    throw new Error('No image URLs returned from Runware API');
  }

  return imageUrls;
}
