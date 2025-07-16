
import { logger } from "@/utils/logger";

export const getNumberFromProductId = (productId: string | number): number => {
  // If productId is already a number, return it directly
  if (typeof productId === 'number') {
    return productId;
  }
  
  // If it's a string, try to parse it
  const parts = productId.split('-');
  const lastPart = parts[parts.length - 1];
  const num = parseInt(lastPart, 10);
  return isNaN(num) ? 1 : num;
};

// Different image sets for each category
const categoryImages: Record<string, string[]> = {
  'original': [
    'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=600&auto=format', // river between mountains
    'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=600&auto=format', // pine trees
    'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=600&auto=format', // low angle trees
    'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=600&auto=format', // sun through trees
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&auto=format', // mountain sun rays
    'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=600&auto=format', // blue starry night
  ],
  'signed': [
    'https://images.unsplash.com/photo-1486718448742-163732cd1544?w=600&auto=format', // brown wavy structure
    'https://images.unsplash.com/photo-1439337153520-7082a56a81f4?w=600&auto=format', // clear glass roof
    'https://images.unsplash.com/photo-1497604401993-f2e922e5cb0a?w=600&auto=format', // glass building
    'https://images.unsplash.com/photo-1473177104440-ffee2f376098?w=600&auto=format', // empty cathedral
    'https://images.unsplash.com/photo-1494891848038-7bd202a2afeb?w=600&auto=format', // black and red building
    'https://images.unsplash.com/photo-1551038247-3d9af20df552?w=600&auto=format', // blue and white building
  ],
  'collection': [
    'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600&auto=format', // abstract colorful paint splash
    'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600&auto=format', // vibrant watercolor splash
    'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?w=600&auto=format', // abstract art blue and orange
    'https://images.unsplash.com/photo-1507908708918-778587c9e563?w=600&auto=format', // modern art gallery exhibition
    'https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format', // artistic paint swirls
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&auto=format', // abstract fluid art
  ],
  'sticker': [
    'https://images.unsplash.com/photo-1498936178812-4b2e558d2937?w=600&auto=format', // bees
    'https://images.unsplash.com/photo-1452960962994-acf4fd70b632?w=600&auto=format', // sheep
    'https://images.unsplash.com/photo-1518877593221-1f28583780b4?w=600&auto=format', // humpback whale
    'https://images.unsplash.com/photo-1439886183900-e79ec0057170?w=600&auto=format', // two deer
    'https://images.unsplash.com/photo-1465379944081-7f47de8d74ac?w=600&auto=format', // brown cattle
    'https://images.unsplash.com/photo-1441057206919-63d19fac2369?w=600&auto=format', // penguins
  ],
  'merch': [
    'https://images.unsplash.com/photo-1485833077593-4278bba3f11f?w=600&auto=format', // brown deer near trees
    'https://images.unsplash.com/photo-1438565434616-3ef039228b15?w=600&auto=format', // two mountain goats
    'https://images.unsplash.com/photo-1501286353178-1ec871bba838?w=600&auto=format', // monkey with banana
    'https://images.unsplash.com/photo-1469041797191-50ace28483c3?w=600&auto=format', // five camels on field
    'https://images.unsplash.com/photo-1452378174528-3090a4bba7b2?w=600&auto=format', // four brown horses
    'https://images.unsplash.com/photo-1487252665478-49b61b47f302?w=600&auto=format', // comodo dragons
  ],
  'print': [
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&auto=format', // foggy mountains
    'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=600&auto=format', // ocean wave
    'https://images.unsplash.com/photo-1458668383970-8ddd3927deed?w=600&auto=format', // mountain alps
    'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=600&auto=format', // river surrounded by rocks
    'https://images.unsplash.com/photo-1482881497185-d4a9ddbe4151?w=600&auto=format', // desert sand
    'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=600&auto=format', // trees near rocky mountain
  ]
};

// Function to get artwork images from Unsplash
export const getArtworkImage = (category: string, index: number = 1): string => {
  const imageIndex = Math.max(1, Math.min(6, index));
  
  // If category doesn't exist in our mapping, use a default image
  if (!categoryImages[category]) {
    return 'https://images.unsplash.com/photo-1548502499-ef49e8cf98d4?w=600&auto=format';
  }
  
  return categoryImages[category][imageIndex - 1] || categoryImages[category][0];
};

export const getProductImageUrl = (product: any): string => {
  // Prioritize hero_image_url, then image_url, then fallback
  const primaryImage = product.hero_image_url || product.image_url;
  
  if (primaryImage && !primaryImage.includes('undefined') && !primaryImage.includes('lovable-uploads')) {
    return `${primaryImage}?t=${Date.now()}`;
  }
  
  return getArtworkImage(product.category, getNumberFromProductId(product.id));
};

// Get all product images including hero and additional images
export const getAllProductImages = (product: any): string[] => {
  const images: string[] = [];
  
  // Add hero image first
  const heroImage = product.hero_image_url || product.image_url;
  if (heroImage && !heroImage.includes('undefined') && !heroImage.includes('lovable-uploads')) {
    images.push(heroImage);
  }
  
  // Add additional images from Shopify
  if (product.additional_images && Array.isArray(product.additional_images)) {
    const additionalUrls = product.additional_images
      .filter(img => img.src && !img.src.includes('undefined') && !img.src.includes('lovable-uploads'))
      .map(img => img.src);
    images.push(...additionalUrls);
  }
  
  // If no images, use fallback
  if (images.length === 0) {
    images.push(getArtworkImage(product.category, getNumberFromProductId(product.id)));
  }
  
  return images;
};

export const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  logger.error("Image failed to load", { src: e.currentTarget.src });
  const img = e.currentTarget;
  const productIdAttr = img.getAttribute('data-product-id') || '';
  const category = img.getAttribute('data-category') || '';
  
  // Convert string attribute to number if it's a valid number, otherwise use it as is
  const productId = productIdAttr && !isNaN(Number(productIdAttr)) ? Number(productIdAttr) : productIdAttr;
  
  img.src = getArtworkImage(category, getNumberFromProductId(productId));
};
