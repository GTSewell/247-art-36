
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get all artists with their images
    const { data: artists, error: artistsError } = await supabase
      .from('artists')
      .select('id, name, image, artworks')

    if (artistsError) {
      return new Response(
        JSON.stringify({ error: 'Failed to fetch artists', details: artistsError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    const results = {
      success: [],
      failed: [],
      skipped: []
    }

    // Process each artist
    for (const artist of artists || []) {
      // Skip if no image URL
      if (!artist.image) {
        results.skipped.push({ id: artist.id, reason: 'No image URL' })
        continue
      }

      // Check if image URL is already a Supabase URL
      if (artist.image.includes('storage.googleapis.com') || artist.image.includes('supabase.co')) {
        results.skipped.push({ id: artist.id, reason: 'Already stored in Supabase' })
        continue
      }

      try {
        // Download main artist image
        const imageResponse = await fetch(artist.image)
        
        if (!imageResponse.ok) {
          results.failed.push({ id: artist.id, reason: `Failed to download image: ${imageResponse.status}` })
          continue
        }
        
        const imageBlob = await imageResponse.blob()
        const fileName = `${artist.id}_${artist.name.replace(/\s+/g, '_').toLowerCase()}.${getFileExtension(imageResponse.headers.get('content-type') || '')}`
        
        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('artist_images')
          .upload(`profiles/${fileName}`, imageBlob, {
            contentType: imageResponse.headers.get('content-type') || 'image/jpeg',
            upsert: true
          })
        
        if (uploadError) {
          results.failed.push({ id: artist.id, reason: `Failed to upload image: ${uploadError.message}` })
          continue
        }
        
        // Get public URL for the uploaded image
        const { data: { publicUrl } } = supabase.storage
          .from('artist_images')
          .getPublicUrl(`profiles/${fileName}`)
        
        // Update artist with new image URL
        const { error: updateError } = await supabase
          .from('artists')
          .update({ image: publicUrl })
          .eq('id', artist.id)
        
        if (updateError) {
          results.failed.push({ id: artist.id, reason: `Failed to update artist record: ${updateError.message}` })
          continue
        }
        
        results.success.push({ id: artist.id, name: artist.name, newUrl: publicUrl })
        
        // Now handle artist artworks if any
        if (artist.artworks && Array.isArray(artist.artworks) && artist.artworks.length > 0) {
          const updatedArtworks = []
          
          for (let i = 0; i < artist.artworks.length; i++) {
            const artworkUrl = artist.artworks[i]
            
            if (!artworkUrl || 
                artworkUrl.includes('storage.googleapis.com') || 
                artworkUrl.includes('supabase.co')) {
              updatedArtworks.push(artworkUrl)
              continue
            }
            
            try {
              const artworkResponse = await fetch(artworkUrl)
              
              if (!artworkResponse.ok) {
                updatedArtworks.push(artworkUrl) // Keep original URL on failure
                continue
              }
              
              const artworkBlob = await artworkResponse.blob()
              const artworkFileName = `${artist.id}_artwork_${i}_${artist.name.replace(/\s+/g, '_').toLowerCase()}.${getFileExtension(artworkResponse.headers.get('content-type') || '')}`
              
              // Upload artwork to Supabase Storage
              const { data: artworkUploadData, error: artworkUploadError } = await supabase.storage
                .from('artist_images')
                .upload(`artworks/${artworkFileName}`, artworkBlob, {
                  contentType: artworkResponse.headers.get('content-type') || 'image/jpeg',
                  upsert: true
                })
              
              if (artworkUploadError) {
                updatedArtworks.push(artworkUrl) // Keep original URL on failure
                continue
              }
              
              // Get public URL for the uploaded artwork
              const { data: { publicUrl: artworkPublicUrl } } = supabase.storage
                .from('artist_images')
                .getPublicUrl(`artworks/${artworkFileName}`)
              
              updatedArtworks.push(artworkPublicUrl)
            } catch (error) {
              updatedArtworks.push(artworkUrl) // Keep original URL on error
            }
          }
          
          // Update artist with new artwork URLs
          const { error: updateArtworksError } = await supabase
            .from('artists')
            .update({ artworks: updatedArtworks })
            .eq('id', artist.id)
          
          if (updateArtworksError) {
            console.error(`Failed to update artworks for artist ${artist.id}: ${updateArtworksError.message}`)
          }
        }
      } catch (error) {
        results.failed.push({ id: artist.id, reason: `Exception: ${error.message}` })
      }
    }

    return new Response(
      JSON.stringify({ 
        message: 'Image processing complete', 
        results,
        success: results.success.length,
        failed: results.failed.length,
        skipped: results.skipped.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

// Helper function to get file extension from MIME type
function getFileExtension(mimeType: string): string {
  const map: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'image/svg+xml': 'svg'
  }
  return map[mimeType] || 'jpg'
}
