import { Artist } from '@/data/types/artist';
import { AssignedProduct } from '@/hooks/useAssignedProducts';
import { ArtworkDetails } from '../types/ArtworkTypes';

export const getArtworkDetails = (
  artworkUrl: string, 
  index: number, 
  artist: Artist, 
  assignedProducts?: AssignedProduct[]
): ArtworkDetails => {
  const isRealArtist = artist.id ? artist.id >= 26 : false;
  
  // Check if this is an assigned product
  const matchingProduct = assignedProducts?.find(p => p.image_url === artworkUrl);
  
  if (matchingProduct) {
    // This is an assigned product, use real product data
    return {
      image: artworkUrl,
      title: matchingProduct.name,
      description: matchingProduct.description || `${matchingProduct.name} from the 247 Art Store.`,
      specifications: {
        medium: matchingProduct.category,
        size: 'Available in Store',
        year: new Date().getFullYear().toString()
      },
      price: `$${matchingProduct.price.toFixed(2)}`
    };
  } else if (isRealArtist) {
    // For real artists (ID 26+), just show empty fields for traditional artworks
    return {
      image: artworkUrl,
      title: `${artist.name}'s Art`,
      description: `This is a temporary artwork preview for ${artist.name}.`,
      specifications: {
        medium: '',
        size: '',
        year: ''
      },
      price: "$"
    };
  } else {
    // For demo artists (ID below 26), show sample data for traditional artworks
    return {
      image: artworkUrl,
      title: `${artist.name}'s Art`,
      description: "This stunning piece showcases the artist's unique style and vision, bringing together elements of color, texture, and form in perfect harmony.",
      specifications: {
        medium: 'Acrylic on Canvas',
        size: '24" x 36"',
        year: `${new Date().getFullYear()}`
      },
      price: `$${Math.floor(Math.random() * 5000) + 1000}`
    };
  }
};