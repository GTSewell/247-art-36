
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { v4 as uuidv4 } from 'https://esm.sh/uuid@9.0.1'
import { corsHeaders } from "../_shared/cors.ts"

// Create a Supabase client with the Admin key
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
)

const BUCKET_NAME = 'product-images'

// Helper function to download and store an image from URL to Supabase Storage
async function downloadAndStoreImage(imageUrl: string, storagePath: string): Promise<string | null> {
  try {
    console.log(`Downloading image from ${imageUrl}`)
    
    // Download the image
    const imageResponse = await fetch(imageUrl)
    if (!imageResponse.ok) {
      throw new Error(`Failed to download image: ${imageResponse.status}`)
    }

    // Get the image data as a blob
    const imageBlob = await imageResponse.blob()
    console.log(`Downloaded image, size: ${imageBlob.size} bytes`)

    // Check if the bucket exists, create if not
    await ensureStorageBucketExists()

    // Upload to Supabase Storage
    const { data, error } = await supabaseAdmin
      .storage
      .from(BUCKET_NAME)
      .upload(storagePath, imageBlob, {
        contentType: 'image/webp',
        upsert: true,
        cacheControl: '0' // No caching to ensure fresh images
      })

    if (error) {
      throw new Error(`Failed to upload to storage: ${error.message}`)
    }
    
    // Get the public URL
    const { data: { publicUrl } } = supabaseAdmin
      .storage
      .from(BUCKET_NAME)
      .getPublicUrl(storagePath)
    
    console.log(`Successfully stored image at ${publicUrl}`)
    return publicUrl
  } catch (error) {
    console.error('Error in downloadAndStoreImage:', error)
    return null
  }
}

// Get appropriate prompt for each category
function getCategoryPrompt(category: string): string {
  const prompts: Record<string, string> = {
    'original': 'A professional photograph of an original colorful abstract painting on canvas, high-quality fine art, vibrant colors, museum quality',
    'signed': 'A professional photograph of a limited edition signed and numbered fine art print, with artist signature and edition number visible, elegant presentation',
    'sticker': 'A collection of colorful artistic stickers with fun designs, flat lay photography on white background, high detail',
    'merch': 'A stylish graphic t-shirt with artistic design, fashion photography, clean background, professional product shot',
    'print': 'A framed art print poster on a white wall, minimalist interior design, professional photography, gallery presentation',
    'collection': 'A curated collection of contemporary artwork displayed in a modern gallery setting, professional fine art photography'
  }
  
  return prompts[category] || 'Professional product photography of art merchandise'
}

// Generate image with Runware API
async function generateRunwareImage(prompt: string, category: string): Promise<string | null> {
  try {
    const RUNWARE_API_KEY = Deno.env.get('RUNWARE_API_KEY')
    if (!RUNWARE_API_KEY) {
      throw new Error('RUNWARE_API_KEY is not set in environment')
    }
    
    console.log(`Generating ${category} image with prompt: ${prompt}`)
    
    const response = await fetch('https://api.runware.ai/v1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        {
          taskType: "authentication",
          apiKey: RUNWARE_API_KEY
        },
        {
          taskType: "imageInference",
          taskUUID: crypto.randomUUID(),
          positivePrompt: prompt,
          width: 1024,
          height: 1024,
          model: "runware:100@1",
          numberResults: 1,
          outputFormat: "WEBP",
          CFGScale: 1,
          scheduler: "FlowMatchEulerDiscreteScheduler",
          strength: 0.8
        }
      ])
    })

    if (!response.ok) {
      throw new Error(`Runware API HTTP error: ${response.status} ${response.statusText}`)
    }

    const responseText = await response.text()
    console.log(`Raw response from Runware: ${responseText.substring(0, 200)}...`)
    
    let data
    try {
      data = JSON.parse(responseText)
    } catch (e) {
      throw new Error(`Failed to parse Runware response: ${e.message}, Response: ${responseText.substring(0, 200)}...`)
    }

    if (data.error || data.errors) {
      const errorMsg = data.errors?.[0]?.message || data.error || 'Unknown error'
      throw new Error(`Runware API error: ${errorMsg}`)
    }

    // Find the image URL in the response
    const imageResult = data.data?.find((item: any) => 
      item.taskType === 'imageInference' && item.imageURL
    )

    if (!imageResult || !imageResult.imageURL) {
      throw new Error('No image URL in Runware response')
    }

    console.log(`Generated image URL: ${imageResult.imageURL.substring(0, 100)}...`)
    return imageResult.imageURL
  } catch (error) {
    console.error('Error generating image with Runware:', error)
    return null
  }
}

// Ensure the storage bucket exists
async function ensureStorageBucketExists() {
  try {
    console.log(`Checking if ${BUCKET_NAME} bucket exists`)
    
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets()
    
    if (listError) {
      throw new Error(`Failed to list buckets: ${listError.message}`)
    }
    
    const bucketExists = buckets?.some(bucket => bucket.name === BUCKET_NAME)
    
    if (!bucketExists) {
      console.log(`Creating ${BUCKET_NAME} bucket`)
      const { error } = await supabaseAdmin.storage.createBucket(BUCKET_NAME, {
        public: true,
        allowedMimeTypes: ['image/webp', 'image/jpeg', 'image/png'],
        fileSizeLimit: 5242880 // 5MB
      })
        
      if (error) {
        throw new Error(`Failed to create bucket: ${error.message}`)
      }
      
      console.log(`Successfully created ${BUCKET_NAME} bucket`)
    } else {
      console.log(`${BUCKET_NAME} bucket already exists`)
    }
    
    return true
  } catch (error) {
    console.error('Error ensuring storage bucket exists:', error)
    return false
  }
}

// Generate and store product images for all categories
async function generateCategoryImages() {
  const categories = ['original', 'signed', 'sticker', 'merch', 'print', 'collection']
  const results: Record<string, string[]> = {}
  
  for (const category of categories) {
    results[category] = []
    
    // Generate multiple images per category
    for (let i = 1; i <= 6; i++) {
      try {
        console.log(`Generating image ${i} for category ${category}`)
        const prompt = getCategoryPrompt(category)
        const imageUrl = await generateRunwareImage(prompt, category)
        
        if (imageUrl) {
          // Store in Supabase
          const filename = `${category}-${i}-${uuidv4()}.webp`
          const storagePath = `${category}/${filename}`
          const storedUrl = await downloadAndStoreImage(imageUrl, storagePath)
          
          if (storedUrl) {
            results[category].push(storedUrl)
            
            // Update products table with the new image
            const { error } = await supabaseAdmin
              .from('products')
              .update({ image_url: storedUrl })
              .eq('category', category)
              .eq('id', `sample-${category}-${i}`)
              
            if (error) {
              console.error(`Error updating product: ${error.message}`)
            } else {
              console.log(`Updated sample-${category}-${i} with new image URL`)
            }
          }
        } else {
          console.error(`Failed to generate image for ${category}-${i}`)
        }
      } catch (err) {
        console.error(`Error processing image ${i} for ${category}:`, err)
      }
    }
  }
  
  return results
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Ensure storage bucket exists
    const bucketReady = await ensureStorageBucketExists()
    if (!bucketReady) {
      throw new Error('Failed to ensure storage bucket exists')
    }
    
    // Process the generate request
    let body
    try {
      body = await req.json()
    } catch (e) {
      body = {}
    }
    
    const { category, single } = body
    
    if (single && category) {
      // Generate a single category
      console.log(`Generating single image for category ${category}`)
      const prompt = getCategoryPrompt(category)
      const imageUrl = await generateRunwareImage(prompt, category)
      
      if (!imageUrl) {
        throw new Error(`Failed to generate image for category ${category}`)
      }
      
      const filename = `${category}-${Date.now()}.webp`
      const storagePath = `${category}/${filename}`
      const storedUrl = await downloadAndStoreImage(imageUrl, storagePath)
      
      if (!storedUrl) {
        throw new Error(`Failed to store image for category ${category}`)
      }
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          imageUrl: storedUrl 
        }),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate' 
          } 
        }
      )
    } else {
      // Generate all categories
      console.log("Starting generation for all categories")
      const results = await generateCategoryImages()
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          results,
          timestamp: Date.now() // Add timestamp for caching purposes
        }),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate'
          } 
        }
      )
    }
  } catch (error) {
    console.error('Error in generate-product-category-images function:', error)
    
    // Ensure we return a proper JSON response even on error
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
