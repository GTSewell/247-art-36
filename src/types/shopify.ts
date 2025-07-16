// Shopify integration type definitions

export interface ShopifyProduct {
  id: string
  title: string
  handle: string
  body_html: string
  product_type: string
  tags: string
  status: 'active' | 'draft' | 'archived'
  images: ShopifyImage[]
  variants: ShopifyVariant[]
  created_at: string
  updated_at: string
}

export interface ShopifyImage {
  id: string
  src: string
  alt: string | null
  width: number
  height: number
  position: number
}

export interface ShopifyVariant {
  id: string
  title: string
  price: string
  inventory_quantity: number
  sku: string | null
  weight: number
  option1: string | null
  option2: string | null
  option3: string | null
  available: boolean
}

export interface ShopifyStorefrontProduct {
  id: string
  title: string
  description: string
  handle: string
  tags: string[]
  productType: string
  availableForSale: boolean
  totalInventory: number
  priceRange: {
    minVariantPrice: ShopifyMoney
    maxVariantPrice: ShopifyMoney
  }
  images: ShopifyStorefrontImage[]
  variants: ShopifyStorefrontVariant[]
}

export interface ShopifyStorefrontImage {
  id: string
  url: string
  altText: string | null
  width: number
  height: number
}

export interface ShopifyStorefrontVariant {
  id: string
  title: string
  availableForSale: boolean
  quantityAvailable: number
  price: ShopifyMoney
  image?: ShopifyStorefrontImage
  selectedOptions: ShopifySelectedOption[]
}

export interface ShopifyMoney {
  amount: string
  currencyCode: string
}

export interface ShopifySelectedOption {
  name: string
  value: string
}

export interface ShopifySyncResult {
  product_id: string
  status: 'success' | 'error'
  error?: string
}

export interface ShopifySyncLog {
  id?: string
  sync_type: 'products' | 'inventory' | 'orders'
  products_synced: number
  products_failed: number
  sync_details: ShopifySyncResult[]
  created_at: string
}

// Extended product type that includes Shopify data
export interface ProductWithShopify {
  id: string
  name: string
  description: string
  price: number
  category: string
  image_url: string
  status: 'active' | 'inactive' | 'deleted'
  artist_name?: string
  // Enhanced image fields
  hero_image_url?: string
  additional_images?: Array<{
    src: string
    alt: string
    width?: number
    height?: number
    position?: number
    source?: 'shopify' | 'manual'
  }>
  // Shopify specific fields
  shopify_product_id?: string
  shopify_variant_id?: string
  shopify_inventory_quantity?: number
  shopify_handle?: string
  shopify_tags?: string[]
  last_synced_at?: string
}

// Webhook payload types
export interface ShopifyWebhookProduct extends ShopifyProduct {
  // Additional webhook-specific fields
}

export interface ShopifyWebhookInventory {
  inventory_item_id: string
  location_id: string
  available: number
  updated_at: string
}