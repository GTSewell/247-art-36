import { ShopifyProduct, ShopifyStorefrontProduct, ProductWithShopify } from '@/types/shopify'

/**
 * Maps Shopify Admin API product to our internal product format
 */
export function mapShopifyAdminProductToInternal(shopifyProduct: ShopifyProduct): Partial<ProductWithShopify> {
  // Extract artist name from tags
  const artistTag = shopifyProduct.tags.split(',')
    .find(tag => tag.trim().startsWith('artist:'))
  const artistName = artistTag ? artistTag.replace('artist:', '').trim() : undefined

  // Process images - sort by position to ensure consistent ordering
  const sortedImages = shopifyProduct.images.sort((a, b) => (a.position || 0) - (b.position || 0))
  const heroImage = sortedImages[0]?.src || ''
  const additionalImages = sortedImages.slice(1).map(img => ({
    src: img.src,
    alt: img.alt || '',
    width: img.width,
    height: img.height,
    position: img.position,
    source: 'shopify' as const
  }))

  return {
    name: shopifyProduct.title,
    description: shopifyProduct.body_html?.replace(/<[^>]*>/g, '') || '', // Strip HTML
    price: parseFloat(shopifyProduct.variants[0]?.price || '0'),
    category: mapShopifyTypeToCategory(shopifyProduct.product_type),
    image_url: heroImage, // Keep for backward compatibility
    hero_image_url: heroImage,
    additional_images: additionalImages,
    shopify_product_id: shopifyProduct.id,
    shopify_variant_id: shopifyProduct.variants[0]?.id || '',
    shopify_inventory_quantity: shopifyProduct.variants[0]?.inventory_quantity || 0,
    shopify_handle: shopifyProduct.handle,
    shopify_tags: shopifyProduct.tags.split(',').map(tag => tag.trim()),
    last_synced_at: new Date().toISOString(),
    artist_name: artistName,
    status: shopifyProduct.status === 'active' ? 'active' : 'inactive'
  }
}

/**
 * Maps Shopify Storefront API product to our internal product format
 */
export function mapShopifyStorefrontProductToInternal(shopifyProduct: ShopifyStorefrontProduct): Partial<ProductWithShopify> {
  // Extract artist name from tags
  const artistTag = shopifyProduct.tags.find(tag => tag.startsWith('artist:'))
  const artistName = artistTag ? artistTag.replace('artist:', '').trim() : undefined

  // Process images for storefront API
  const heroImage = shopifyProduct.images[0]?.url || ''
  const additionalImages = shopifyProduct.images.slice(1).map((img, index) => ({
    src: img.url,
    alt: img.altText || '',
    width: img.width,
    height: img.height,
    position: index + 2, // Position starts from 2 since hero is position 1
    source: 'shopify' as const
  }))

  return {
    name: shopifyProduct.title,
    description: shopifyProduct.description,
    price: parseFloat(shopifyProduct.priceRange.minVariantPrice.amount),
    category: mapShopifyTypeToCategory(shopifyProduct.productType),
    image_url: heroImage, // Keep for backward compatibility
    hero_image_url: heroImage,
    additional_images: additionalImages,
    shopify_product_id: shopifyProduct.id.replace('gid://shopify/Product/', ''),
    shopify_variant_id: shopifyProduct.variants[0]?.id.replace('gid://shopify/ProductVariant/', '') || '',
    shopify_inventory_quantity: shopifyProduct.totalInventory,
    shopify_handle: shopifyProduct.handle,
    shopify_tags: shopifyProduct.tags,
    last_synced_at: new Date().toISOString(),
    artist_name: artistName,
    status: shopifyProduct.availableForSale ? 'active' : 'inactive'
  }
}

/**
 * Maps Shopify product type to our internal category system
 */
export function mapShopifyTypeToCategory(productType: string): string {
  const typeMap: { [key: string]: string } = {
    'Original Artwork': 'original-artwork',
    'Print': 'prints',
    'Digital Art': 'digital-art',
    'Sculpture': 'sculpture',
    'Photography': 'photography',
    'Mixed Media': 'mixed-media',
    'Apparel': 'apparel',
    'Accessories': 'accessories',
    'Limited Edition': 'limited-edition',
    'Canvas Print': 'prints',
    'Poster': 'prints',
    'Art Print': 'prints'
  }
  
  return typeMap[productType] || 'other'
}

/**
 * Maps our internal category to Shopify product type
 */
export function mapInternalCategoryToShopifyType(category: string): string {
  const categoryMap: { [key: string]: string } = {
    'original-artwork': 'Original Artwork',
    'prints': 'Print',
    'digital-art': 'Digital Art',
    'sculpture': 'Sculpture',
    'photography': 'Photography',
    'mixed-media': 'Mixed Media',
    'apparel': 'Apparel',
    'accessories': 'Accessories',
    'limited-edition': 'Limited Edition',
    'other': 'Other'
  }
  
  return categoryMap[category] || 'Other'
}

/**
 * Extracts artist information from Shopify tags
 */
export function extractArtistFromTags(tags: string[]): {
  artistName?: string
  artistSlug?: string
  isFeatured: boolean
  isLimitedEdition: boolean
  isArtistExclusive: boolean
} {
  const artistTag = tags.find(tag => tag.startsWith('artist:'))
  const artistName = artistTag ? artistTag.replace('artist:', '').trim() : undefined
  const artistSlug = artistName ? artistName.toLowerCase().replace(/\s+/g, '-') : undefined

  return {
    artistName,
    artistSlug,
    isFeatured: tags.includes('featured'),
    isLimitedEdition: tags.includes('limited-edition'),
    isArtistExclusive: tags.includes('artist-exclusive')
  }
}

/**
 * Generates Shopify tags from our internal product data
 */
export function generateShopifyTags(product: ProductWithShopify): string[] {
  const tags: string[] = []
  
  if (product.artist_name) {
    tags.push(`artist:${product.artist_name}`)
  }
  
  if (product.category) {
    tags.push(`category:${product.category}`)
  }
  
  // Add any existing Shopify tags
  if (product.shopify_tags) {
    tags.push(...product.shopify_tags.filter(tag => 
      !tag.startsWith('artist:') && !tag.startsWith('category:')
    ))
  }
  
  return [...new Set(tags)] // Remove duplicates
}