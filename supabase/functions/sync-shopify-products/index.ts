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
        // Extract artist name from tags
        const artistTag = product.tags.split(',')
          .find(tag => tag.trim().startsWith('artist:'))
        const artistName = artistTag ? artistTag.replace('artist:', '').trim() : null

        // Map Shopify product to our schema
        const productData = {
          name: product.title,
          description: product.body_html?.replace(/<[^>]*>/g, '') || '', // Strip HTML
          price: parseFloat(product.variants[0]?.price || '0'),
          category: mapShopifyTypeToCategory(product.product_type) as 'print' | 'merch' | 'sticker',
          image_url: product.images[0]?.src || '',
          shopify_product_id: product.id,
          shopify_variant_id: product.variants[0]?.id || '',
          shopify_inventory_quantity: product.variants[0]?.inventory_quantity || 0,
          shopify_handle: product.handle,
          shopify_tags: product.tags.split(',').map(tag => tag.trim()),
          last_synced_at: new Date().toISOString(),
          is_featured: autoActivate // Set featured status based on auto-activate setting
        }

        console.log(`Syncing product: ${product.title}`)

        // Upsert product
        const { data, error } = await supabase
          .from('products')
          .upsert(productData, { 
            onConflict: 'shopify_product_id',
            ignoreDuplicates: false 
          })
          .select()

        if (error) {
          console.error(`Error syncing product ${product.id}:`, error)
          syncResults.push({ product_id: product.id, status: 'error', error: error.message })
        } else {
          console.log(`Successfully synced: ${product.title}`)
          syncResults.push({ product_id: product.id, status: 'success' })
        }

      } catch (productError) {
        console.error(`Error processing product ${product.id}:`, productError)
        syncResults.push({ 
          product_id: product.id, 
          status: 'error', 
          error: productError instanceof Error ? productError.message : 'Unknown error'
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

function mapShopifyTypeToCategory(productType: string): 'print' | 'merch' | 'sticker' {
  const lowerType = productType.toLowerCase()
  
  if (lowerType.includes('print') || lowerType.includes('poster') || lowerType.includes('art')) {
    return 'print'
  }
  
  if (lowerType.includes('sticker') || lowerType.includes('decal')) {
    return 'sticker'
  }
  
  // Default everything else to merch (t-shirts, apparel, accessories, etc.)
  return 'merch'
}