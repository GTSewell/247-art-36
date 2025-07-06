import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const shopifyWebhookSecret = Deno.env.get('SHOPIFY_WEBHOOK_SECRET')!

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Verify webhook signature
    const body = await req.text()
    const signature = req.headers.get('X-Shopify-Hmac-Sha256')
    const topic = req.headers.get('X-Shopify-Topic')

    if (!signature || !topic) {
      throw new Error('Missing required headers')
    }

    // Verify the webhook (simplified - in production, implement proper HMAC verification)
    if (!verifyWebhookSignature(body, signature, shopifyWebhookSecret)) {
      throw new Error('Invalid webhook signature')
    }

    const data = JSON.parse(body)
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    switch (topic) {
      case 'products/create':
      case 'products/update':
        await handleProductUpdate(supabase, data)
        break
      
      case 'products/delete':
        await handleProductDelete(supabase, data)
        break
      
      case 'inventory_levels/update':
        await handleInventoryUpdate(supabase, data)
        break
      
      default:
        console.log(`Unhandled webhook topic: ${topic}`)
    }

    return new Response(
      JSON.stringify({ success: true, topic, processed: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Webhook error:', error)
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

async function handleProductUpdate(supabase: any, product: any) {
  // Extract artist name from tags
  const artistTag = product.tags?.split(',')
    .find((tag: string) => tag.trim().startsWith('artist:'))
  const artistName = artistTag ? artistTag.replace('artist:', '').trim() : null

  const productData = {
    name: product.title,
    description: product.body_html?.replace(/<[^>]*>/g, '') || '',
    price: parseFloat(product.variants?.[0]?.price || '0'),
    category: mapShopifyTypeToCategory(product.product_type),
    image_url: product.images?.[0]?.src || '',
    shopify_product_id: product.id.toString(),
    shopify_variant_id: product.variants?.[0]?.id?.toString() || '',
    shopify_inventory_quantity: product.variants?.[0]?.inventory_quantity || 0,
    shopify_handle: product.handle,
    shopify_tags: product.tags?.split(',').map((tag: string) => tag.trim()) || [],
    last_synced_at: new Date().toISOString(),
    artist_name: artistName,
    status: product.status === 'active' ? 'active' : 'inactive'
  }

  const { error } = await supabase
    .from('products')
    .upsert(productData, { 
      onConflict: 'shopify_product_id',
      ignoreDuplicates: false 
    })

  if (error) {
    console.error('Error updating product:', error)
    throw error
  }
}

async function handleProductDelete(supabase: any, product: any) {
  const { error } = await supabase
    .from('products')
    .update({ status: 'deleted', last_synced_at: new Date().toISOString() })
    .eq('shopify_product_id', product.id.toString())

  if (error) {
    console.error('Error deleting product:', error)
    throw error
  }
}

async function handleInventoryUpdate(supabase: any, inventoryData: any) {
  // Update inventory quantity for the specific variant
  const { error } = await supabase
    .from('products')
    .update({ 
      shopify_inventory_quantity: inventoryData.available || 0,
      last_synced_at: new Date().toISOString()
    })
    .eq('shopify_variant_id', inventoryData.inventory_item_id?.toString())

  if (error) {
    console.error('Error updating inventory:', error)
    throw error
  }
}

function verifyWebhookSignature(body: string, signature: string, secret: string): boolean {
  // Simplified verification - implement proper HMAC-SHA256 verification in production
  // This is a placeholder for the actual verification logic
  return true
}

function mapShopifyTypeToCategory(productType: string): string {
  const typeMap: { [key: string]: string } = {
    'Original Artwork': 'original-artwork',
    'Print': 'prints',
    'Digital Art': 'digital-art',
    'Sculpture': 'sculpture',
    'Photography': 'photography',
    'Mixed Media': 'mixed-media',
    'Apparel': 'apparel',
    'Accessories': 'accessories'
  }
  
  return typeMap[productType] || 'other'
}