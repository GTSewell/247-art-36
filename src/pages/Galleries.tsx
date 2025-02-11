
import React, { useState } from "react";
import Navigation from "@/components/Navigation";
import FeaturedGalleries from "@/components/galleries/FeaturedGalleries";
import { useGalleries } from "@/hooks/use-galleries";
import { Gallery } from "@/data/types/gallery";
import { useToast } from "@/components/ui/use-toast";

const Galleries = () => {
  const { data: galleries = [], isLoading } = useGalleries();
  const [favoriteGalleries, setFavoriteGalleries] = useState<Set<number>>(new Set());
  const { toast } = useToast();

  const handleGallerySelect = (gallery: Gallery) => {
    // TODO: Implement gallery selection functionality
    toast({
      title: "Coming Soon",
      description: "Gallery details view will be implemented soon!",
    });
  };

  const handleFavoriteToggle = (galleryId: number, isFavorite: boolean) => {
    setFavoriteGalleries(prev => {
      const newFavorites = new Set(prev);
      if (isFavorite) {
        newFavorites.add(galleryId);
        toast({
          title: "Added to Favorites",
          description: "Gallery has been added to your favorites.",
        });
      } else {
        newFavorites.delete(galleryId);
        toast({
          title: "Removed from Favorites",
          description: "Gallery has been removed from your favorites.",
        });
      }
      return newFavorites;
    });
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="pt-16">
        <h1 className="text-3xl font-bold text-center mb-8">Featured Galleries</h1>
        {!isLoading && (
          <FeaturedGalleries
            galleries={galleries}
            onSelect={handleGallerySelect}
            onFavoriteToggle={handleFavoriteToggle}
            favoriteGalleries={favoriteGalleries}
          />
        )}
      </div>
    </div>
  );
};

export default Galleries;
