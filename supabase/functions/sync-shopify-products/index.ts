import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const shopifyDomain = Deno.env.get('SHOPIFY_STORE_DOMAIN')!
const shopifyAccessToken = Deno.env.get('SHOPIFY_ADMIN_ACCESS_TOKEN')!

interface ShopifyProduct {
  id: string
  title: string
  handle: string
  body_html: string
  product_type: string
  tags: string
  status: string
  images: Array<{
    id: string
    src: string
    alt: string
    width?: number
    height?: number
    position: number
  }>
  variants: Array<{
    id: string
    title: string
    price: string
    inventory_quantity: number
    sku: string
  }>
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Starting Shopify sync...')
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get request body for auto-activate setting
    let autoActivate = false
    try {
      const body = await req.json()
      autoActivate = body?.autoActivate || false
      console.log('Auto-activate new products:', autoActivate)
    } catch (e) {
      // No body or invalid JSON, use default
      console.log('No request body, using default settings')
    }

    // Fetch products from Shopify
    console.log(`Fetching products from: https://${shopifyDomain}/admin/api/2024-01/products.json`)
    const shopifyResponse = await fetch(
      `https://${shopifyDomain}/admin/api/2024-01/products.json`,
      {
        headers: {
          'X-Shopify-Access-Token': shopifyAccessToken,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!shopifyResponse.ok) {
      console.error(`Shopify API error: ${shopifyResponse.status} ${shopifyResponse.statusText}`)
      throw new Error(`Shopify API error: ${shopifyResponse.statusText}`)
    }

    const shopifyData = await shopifyResponse.json()
    const products: ShopifyProduct[] = shopifyData.products
    console.log(`Found ${products.length} products in Shopify`)

    const syncResults = []

    for (const product of products) {
      try {
        console.log(`Processing product: ${product.title}`)
        
        // Check if product already exists
        const { data: existingProduct } = await supabase
          .from('products')
          .select('*')
          .eq('shopify_product_id', product.id)
          .single()

        // Extract artist name from tags
        const artistTag = product.tags.split(',')
          .find(tag => tag.trim().startsWith('artist:'))
        const artistName = artistTag ? artistTag.replace('artist:', '').trim() : null

        // Process images - sort by position to ensure consistent ordering
        const sortedImages = product.images.sort((a, b) => a.position - b.position)
        const heroImage = sortedImages[0]?.src || ''
        const additionalShopifyImages = sortedImages.slice(1).map(img => ({
          src: img.src,
          alt: img.alt || '',
          width: img.width,
          height: img.height,
          position: img.position,
          source: 'shopify' as const
        }))

        // Merge with existing manual images if product exists
        let mergedAdditionalImages = additionalShopifyImages
        if (existingProduct?.additional_images) {
          const existingImages = Array.isArray(existingProduct.additional_images) 
            ? existingProduct.additional_images 
            : []
          
          // Keep manual images (those without 'shopify' source)
          const manualImages = existingImages.filter(img => 
            !img.source || img.source !== 'shopify'
          )
          
          // Combine Shopify images with manual images
          mergedAdditionalImages = [...additionalShopifyImages, ...manualImages]
        }

        // Prepare product data with intelligent field updates
        const baseProductData = {
          name: product.title,
          description: product.body_html?.replace(/<[^>]*>/g, '') || '', // Strip HTML
          price: parseFloat(product.variants[0]?.price || '0'),
          shopify_product_id: product.id,
          shopify_variant_id: product.variants[0]?.id || '',
          shopify_inventory_quantity: product.variants[0]?.inventory_quantity || 0,
          shopify_handle: product.handle,
          shopify_tags: product.tags.split(',').map(tag => tag.trim()),
          last_synced_at: new Date().toISOString(),
          hero_image_url: heroImage,
          additional_images: mergedAdditionalImages
        }

        // Only set category for new products or products with 'shopify'/'auto' category_source
        const shouldUpdateCategory = !existingProduct || 
          !existingProduct.category_source || 
          existingProduct.category_source === 'shopify' || 
          existingProduct.category_source === 'auto'

        if (shouldUpdateCategory) {
          baseProductData.category = mapShopifyTypeToCategory(product.product_type)
          baseProductData.category_source = 'shopify'
        }

        // For new products, set defaults
        const productData = existingProduct ? baseProductData : {
          ...baseProductData,
          image_url: heroImage, // Keep for backward compatibility
          is_featured: autoActivate, // Only set featured status for new products
          category_source: 'shopify' // Mark new products as Shopify-sourced
        }

        // Preserve certain fields from existing product if they were manually set
        if (existingProduct) {
          // Preserve custom description if it exists and is different from Shopify description
          if (existingProduct.custom_description) {
            delete productData.description // Don't overwrite custom description
          }
          
          // Preserve manual featured status
          if (existingProduct.is_featured !== null) {
            // Don't update featured status for existing products
          }
          
          // Preserve hero image if it was manually set (not from Shopify)
          if (existingProduct.hero_image_url && 
              existingProduct.hero_image_url !== existingProduct.image_url) {
            delete productData.hero_image_url // Keep manual hero image
          }
        }

        console.log(`${existingProduct ? 'Updating' : 'Creating'} product: ${product.title}`)
        console.log(`Images: Hero=${heroImage ? 'Yes' : 'No'}, Additional=${mergedAdditionalImages.length}`)

        // Upsert product with intelligent merging
        const { data, error } = await supabase
          .from('products')
          .upsert(productData, { 
            onConflict: 'shopify_product_id',
            ignoreDuplicates: false 
          })
          .select()

        if (error) {
          console.error(`Error syncing product ${product.id}:`, error)
          syncResults.push({ 
            product_id: product.id, 
            status: 'error', 
            error: error.message,
            action: existingProduct ? 'update' : 'create'
          })
        } else {
          console.log(`Successfully ${existingProduct ? 'updated' : 'created'}: ${product.title}`)
          syncResults.push({ 
            product_id: product.id, 
            status: 'success',
            action: existingProduct ? 'update' : 'create',
            images_synced: sortedImages.length
          })
        }

      } catch (productError) {
        console.error(`Error processing product ${product.id}:`, productError)
        syncResults.push({ 
          product_id: product.id, 
          status: 'error', 
          error: productError instanceof Error ? productError.message : 'Unknown error',
          action: 'failed'
        })
      }
    }

    // Log sync operation
    await supabase
      .from('shopify_sync_log')
      .insert({
        sync_type: 'products',
        products_synced: syncResults.filter(r => r.status === 'success').length,
        products_failed: syncResults.filter(r => r.status === 'error').length,
        sync_details: syncResults
      })

    console.log(`Sync completed: ${syncResults.filter(r => r.status === 'success').length} success, ${syncResults.filter(r => r.status === 'error').length} failed`)

    return new Response(
      JSON.stringify({
        success: true,
        synced: syncResults.filter(r => r.status === 'success').length,
        failed: syncResults.filter(r => r.status === 'error').length,
        results: syncResults
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Sync error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})

function mapShopifyTypeToCategory(productType: string): 'print' | 'merch' | 'sticker' | 'original' | 'signed' | 'collection' {
  const lowerType = productType.toLowerCase()
  
  // Map to valid database enum values
  if (lowerType.includes('original') || lowerType.includes('one-of-a-kind')) {
    return 'original'
  }
  
  if (lowerType.includes('limited') || lowerType.includes('signed') || lowerType.includes('numbered')) {
    return 'signed'
  }
  
  if (lowerType.includes('print') || lowerType.includes('poster') || lowerType.includes('canvas') || lowerType.includes('art print')) {
    return 'print'
  }
  
  if (lowerType.includes('sticker') || lowerType.includes('decal')) {
    return 'sticker'
  }
  
  if (lowerType.includes('collection') || lowerType.includes('247') || lowerType.includes('exclusive')) {
    return 'collection'
  }
  
  // Default to merch for apparel, accessories, t-shirts, etc.
  return 'merch'
}