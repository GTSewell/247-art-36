
import React, { useState } from "react";
import Navigation from "@/components/Navigation";
import FeaturedGalleries from "@/components/galleries/FeaturedGalleries";
import { useGalleries } from "@/hooks/use-galleries";
import { Gallery } from "@/data/types/gallery";
import { useToast } from "@/components/ui/use-toast";
import PartnerLogoBanner from "@/components/galleries/PartnerLogoBanner";
import { supabase } from "@/integrations/supabase/client";

const WhoAreYou = () => {
  const { data: galleries = [], isLoading } = useGalleries();
  const [favoriteGalleries, setFavoriteGalleries] = useState<Set<number>>(new Set());
  const { toast } = useToast();

  console.log("Galleries data:", galleries); // Debug log

  const handleGallerySelect = (gallery: Gallery) => {
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zap-yellow">
        <Navigation />
        <div className="container mx-auto pt-20 px-4">
          <p className="text-lg">Loading galleries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zap-yellow pb-[50px]">
      <Navigation />
      <div className="pt-16">
        <img 
          src="https://iqmskopbhrzqqqjewdzv.supabase.co/storage/v1/object/public/patterns/247-art-Jane%26GT-Halftone-white-soft%20edge-short.png"
          alt="Jane & GT Halftone" 
          className="w-full h-auto"
        />
      </div>
      <div className="container mx-auto px-4 pt-8">
        <h1 className="text-3xl font-bold text-center mb-8">Who the f#@k are you?</h1>

        <FeaturedGalleries
          galleries={galleries}
          onSelect={handleGallerySelect}
          onFavoriteToggle={handleFavoriteToggle}
          favoriteGalleries={favoriteGalleries}
        />
      </div>
      <PartnerLogoBanner />
    </div>
  );
};

export default WhoAreYou;
