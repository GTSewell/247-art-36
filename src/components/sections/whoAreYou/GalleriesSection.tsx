
import { useState } from "react";
import FeaturedGalleries from "@/components/galleries/FeaturedGalleries";
import { Gallery } from "@/data/types/gallery";
import { useToast } from "@/components/ui/use-toast";

interface GalleriesSectionProps {
  galleries: Gallery[];
  isLoading: boolean;
}

const GalleriesSection = ({ galleries, isLoading }: GalleriesSectionProps) => {
  const [favoriteGalleries, setFavoriteGalleries] = useState<Set<number>>(new Set());
  const { toast } = useToast();

  const handleGallerySelect = (gallery: Gallery) => {
    toast({
      title: "Coming Soon",
      description: "Gallery details view will be implemented soon!"
    });
  };

  const handleFavoriteToggle = (galleryId: number, isFavorite: boolean) => {
    setFavoriteGalleries(prev => {
      const newFavorites = new Set(prev);
      if (isFavorite) {
        newFavorites.add(galleryId);
        toast({
          title: "Added to Favorites",
          description: "Gallery has been added to your favorites."
        });
      } else {
        newFavorites.delete(galleryId);
        toast({
          title: "Removed from Favorites",
          description: "Gallery has been removed from your favorites."
        });
      }
      return newFavorites;
    });
  };

  if (isLoading) {
    return <div className="mt-12">Loading galleries...</div>;
  }

  return (
    <div className="mt-12">
      <FeaturedGalleries 
        galleries={galleries} 
        onSelect={handleGallerySelect} 
        onFavoriteToggle={handleFavoriteToggle} 
        favoriteGalleries={favoriteGalleries} 
      />
    </div>
  );
};

export default GalleriesSection;
