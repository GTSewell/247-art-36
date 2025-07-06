import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

const shopifyDomain = Deno.env.get('SHOPIFY_STORE_DOMAIN')!
const shopifyStorefrontToken = Deno.env.get('SHOPIFY_STOREFRONT_ACCESS_TOKEN')!

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { productId, handle } = await req.json()

    if (!productId && !handle) {
      throw new Error('Either productId or handle is required')
    }

    // GraphQL query to get product details
    const query = `
      query getProduct($id: ID, $handle: String) {
        product(id: $id, handle: $handle) {
          id
          title
          description
          handle
          tags
          productType
          availableForSale
          totalInventory
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 10) {
            edges {
              node {
                id
                url
                altText
                width
                height
              }
            }
          }
          variants(first: 100) {
            edges {
              node {
                id
                title
                availableForSale
                quantityAvailable
                price {
                  amount
                  currencyCode
                }
                image {
                  url
                  altText
                }
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
        }
      }
    `

    const variables = productId 
      ? { id: `gid://shopify/Product/${productId}` }
      : { handle }

    const response = await fetch(
      `https://${shopifyDomain}/api/2024-01/graphql.json`,
      {
        method: 'POST',
        headers: {
          'X-Shopify-Storefront-Access-Token': shopifyStorefrontToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, variables }),
      }
    )

    if (!response.ok) {
      throw new Error(`Shopify Storefront API error: ${response.statusText}`)
    }

    const data = await response.json()

    if (data.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`)
    }

    const product = data.data.product

    if (!product) {
      return new Response(
        JSON.stringify({ success: false, error: 'Product not found' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404,
        }
      )
    }

    // Transform the response to our format
    const transformedProduct = {
      id: product.id,
      title: product.title,
      description: product.description,
      handle: product.handle,
      tags: product.tags,
      productType: product.productType,
      availableForSale: product.availableForSale,
      totalInventory: product.totalInventory,
      priceRange: product.priceRange,
      images: product.images.edges.map((edge: any) => edge.node),
      variants: product.variants.edges.map((edge: any) => edge.node),
    }

    return new Response(
      JSON.stringify({
        success: true,
        product: transformedProduct
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Get product details error:', error)
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