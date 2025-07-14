
import React, { useState, useEffect } from 'react';
import { Artist } from '@/data/types/artist';
import { useIsMobile } from '@/hooks/use-mobile';
import { useCart } from "@/contexts/CartContext";
import { useImageErrors } from '@/components/artists/hooks/useImageErrors';
import { useAssignedProducts } from '@/hooks/useAssignedProducts';
import { ArtworkDetails } from './types/ArtworkTypes';
import { getArtworkDetails } from './utils/artworkUtils';
import MobileArtistHeader from './components/MobileArtistHeader';
import ArtworkGrid from './components/ArtworkGrid';
import ArtworkModal from './components/ArtworkModal';

interface ArtistProfileRightPanelProps {
  artist: Artist;
  artworks: string[];
  panelColor: string;
}

const ArtistProfileRightPanel: React.FC<ArtistProfileRightPanelProps> = ({
  artist,
  artworks,
  panelColor
}) => {
  const isMobile = useIsMobile();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState<ArtworkDetails | null>(null);
  const [currentArtworkIndex, setCurrentArtworkIndex] = useState(0);
  const { addItem } = useCart();
  const { artworkErrors, handleArtworkImageError } = useImageErrors(
    artist.id || 0, 
    artist.name || 'Unknown Artist'
  );
  const { products: assignedProducts } = useAssignedProducts(artist.id || null);
  
  // State to track valid artworks (not broken)
  const [validArtworks, setValidArtworks] = useState<string[]>([]);
  
  // Process and filter artworks when they change or errors are detected
  useEffect(() => {
    // Filter out empty, invalid URLs, and known broken images
    const filtered = artworks.filter((url, index) => {
      return url && 
             typeof url === 'string' && 
             url.trim() !== '' && 
             !artworkErrors[index];
    });
    
    setValidArtworks(filtered);
  }, [artworks, artworkErrors]);
  
  // Check if this is a real artist (ID 26 or above)
  const isRealArtist = artist.id ? artist.id >= 26 : false;

  const handleArtworkClick = (artwork: string, index: number) => {
    const artworkIndex = validArtworks.findIndex(art => art === artwork);
    setCurrentArtworkIndex(artworkIndex);
    setSelectedArtwork(getArtworkDetails(artwork, index, artist, assignedProducts));
    setIsModalOpen(true);
  };

  const handleNavigateArtwork = (direction: 'prev' | 'next') => {
    if (validArtworks.length === 0) return;
    
    let newIndex;
    if (direction === 'prev') {
      newIndex = currentArtworkIndex > 0 ? currentArtworkIndex - 1 : validArtworks.length - 1;
    } else {
      newIndex = currentArtworkIndex < validArtworks.length - 1 ? currentArtworkIndex + 1 : 0;
    }
    
    setCurrentArtworkIndex(newIndex);
    const newArtwork = validArtworks[newIndex];
    setSelectedArtwork(getArtworkDetails(newArtwork, newIndex, artist, assignedProducts));
  };
  
  const handleAddToCart = () => {
    if (!selectedArtwork) return;
    
    // Check if this is an assigned product
    const matchingProduct = assignedProducts?.find(p => p.image_url === selectedArtwork.image);
    
    if (matchingProduct) {
      // This is an assigned product, add it to cart with real product data
      addItem({
        id: `product-${matchingProduct.id}`,
        name: matchingProduct.name,
        price: matchingProduct.price,
        image_url: matchingProduct.image_url || selectedArtwork.image,
        artist: { name: artist.name }
      });
    } else if (!isRealArtist) {
      // This is a demo artwork for demo artists
      const price = selectedArtwork.price ? parseFloat(selectedArtwork.price.replace('$', '')) : 1000;
      
      addItem({
        id: `${artist.id || 'artwork'}-${Date.now()}`,
        name: selectedArtwork.title,
        price: price,
        image_url: selectedArtwork.image,
        artist: { name: artist.name }
      });
    }
    
    // Close the modal after adding to cart
    setIsModalOpen(false);
  };

  const handleRemoveArtwork = (artwork: string) => {
    setValidArtworks(current => current.filter(item => item !== artwork));
  };

  return (
    <div className="flex flex-col h-full p-5" style={{ backgroundColor: panelColor }}>
      {isMobile && (
        <MobileArtistHeader artist={artist} />
      )}
      
      <ArtworkGrid
        validArtworks={validArtworks}
        onArtworkClick={handleArtworkClick}
        onArtworkImageError={handleArtworkImageError}
        onRemoveArtwork={handleRemoveArtwork}
      />

      <ArtworkModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedArtwork={selectedArtwork}
        panelColor={panelColor}
        artist={artist}
        assignedProducts={assignedProducts}
        onAddToCart={handleAddToCart}
        artworks={validArtworks}
        currentIndex={currentArtworkIndex}
        onNavigate={handleNavigateArtwork}
      />
    </div>
  );
};

export default ArtistProfileRightPanel;
