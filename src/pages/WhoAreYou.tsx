
import React, { useState } from "react";
import Navigation from "@/components/Navigation";
import FeaturedGalleries from "@/components/galleries/FeaturedGalleries";
import { useGalleries } from "@/hooks/use-galleries";
import { Gallery } from "@/data/types/gallery";
import { useToast } from "@/components/ui/use-toast";
import PartnerLogoBanner from "@/components/galleries/PartnerLogoBanner";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";

const WhoAreYou = () => {
  const { data: galleries = [], isLoading } = useGalleries();
  const [favoriteGalleries, setFavoriteGalleries] = useState<Set<number>>(new Set());
  const [isJaneHovered, setIsJaneHovered] = useState(false);
  const [isGTHovered, setIsGTHovered] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

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
      <div className="min-h-screen bg-zap-blue">
        <Navigation />
        <div className="container mx-auto pt-20 px-4">
          <p className="text-lg">Loading galleries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zap-blue pb-[50px]">
      <Navigation />
      <div className="pt-16 relative">
        <img 
          src="https://iqmskopbhrzqqqjewdzv.supabase.co/storage/v1/object/public/patterns/247-art-Jane%26GT-Halftone-white-soft%20edge-short.png"
          alt="Jane & GT Halftone" 
          className="w-full h-auto"
        />
        {isJaneHovered && (
          <img 
            src="https://iqmskopbhrzqqqjewdzv.supabase.co/storage/v1/object/public/patterns/janesolo-hover-5.png"
            alt="Jane Solo Hover"
            className="absolute top-[55px] -left-[3px] w-full h-auto opacity-100 transition-opacity duration-300"
          />
        )}
        {isGTHovered && (
          <img 
            src="https://iqmskopbhrzqqqjewdzv.supabase.co/storage/v1/object/public/patterns/gtsolo-hover-2.png?v=2"
            alt="GT Solo Hover"
            className="absolute top-[62px] -left-[1px] w-full h-auto opacity-100 transition-opacity duration-300"
          />
        )}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="relative w-full h-full max-w-[1920px] mx-auto">
            <a 
              href="https://www.instagram.com/gtsewell/"
              target="_blank"
              rel="noopener noreferrer"
              className="block absolute transition-all duration-300"
              style={{
                width: isMobile ? '9rem' : '18rem',
                height: isMobile ? '9rem' : '18rem',
                left: isMobile ? '50px' : '20%',
                top: isMobile ? '2rem' : '50px'
              }}
            >
              <img 
                src={isGTHovered
                  ? "https://iqmskopbhrzqqqjewdzv.supabase.co/storage/v1/object/public/patterns/thatsgt-hover.png"
                  : "https://iqmskopbhrzqqqjewdzv.supabase.co/storage/v1/object/public/patterns/thatsGT.png"
                }
                alt="That's GT" 
                onMouseEnter={() => setIsGTHovered(true)}
                onMouseLeave={() => setIsGTHovered(false)}
                className="w-full h-full"
              />
            </a>
            <a 
              href="https://www.instagram.com/jlartsphere/"
              target="_blank"
              rel="noopener noreferrer"
              className="block absolute transition-all duration-300"
              style={{
                width: isMobile ? '6rem' : '12rem',
                height: isMobile ? '6rem' : '12rem',
                right: isMobile ? '35px' : '20%',
                top: isMobile ? '15px' : '50px'
              }}
            >
              <img 
                src={isJaneHovered 
                  ? "https://iqmskopbhrzqqqjewdzv.supabase.co/storage/v1/object/public/patterns/thatsJane-hover.png"
                  : "https://iqmskopbhrzqqqjewdzv.supabase.co/storage/v1/object/public/patterns/thatsJane-1.png"
                }
                alt="That's Jane" 
                onMouseEnter={() => setIsJaneHovered(true)}
                onMouseLeave={() => setIsJaneHovered(false)}
                className="w-full h-full"
              />
            </a>
          </div>
        </div>
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
