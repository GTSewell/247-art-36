import React, { useState } from "react";
import Navigation from "@/components/Navigation";
import FeaturedGalleries from "@/components/galleries/FeaturedGalleries";
import { useGalleries } from "@/hooks/use-galleries";
import { Gallery } from "@/data/types/gallery";
import { useToast } from "@/components/ui/use-toast";
import PartnerLogoBanner from "@/components/galleries/PartnerLogoBanner";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";

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

      <div className="relative">
        <img 
          src="/lovable-uploads/02b008a6-1342-42bc-b0a4-c68d4b7bab92.png"
          alt="Background Pattern"
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 pt-8 relative z-10"
        >
          <h1 className="text-3xl font-bold text-center mb-8">Who the f#@k are you?</h1>
          
          <div className="max-w-4xl mx-auto space-y-4 text-lg">
            <p className="text-black font-medium">
              We are Jane Rolls & GT Sewell, we are artists, we are creatives, but let's be real, we're better at supporting other artists than being artists ourselves. Facts!
            </p>
            <p className="text-black font-medium">
              We've been long-time advocates for Melbourne & Australia's vibrant arts community. You may have met us galivanting around artist studios, like Everfresh or Blender, or, even at a kick-ass exhibition at the likes of Backwoods or B-side, or, maybe you're more along the lines of "Who TF are you!?" ... well,
            </p>
            <p className="text-black font-medium">
              Over the past decade, we've proudly dedicated ourselves to supporting artists and their creative journeys through our work at galleries and studios we built like Lanes End, VS. Gallery (with the inimitable Ben Frost & Nixi Killick), Milkbar, and most recently, OSHI our current location on the always vibing Smith St, Collingwood.
            </p>
            <p className="text-black font-medium">
              Each of these spaces has been a labor of love, designed to foster connections between artists, collectors, and the wider community.
            </p>
            <p className="text-black font-medium">
              In addition to our gallery work, our artist printing services have been a cornerstone of our efforts to empower artists. By providing high-quality printing in fine art (Giclée), apparel, merchandise, and more, we've helped countless artists generate passive income and expand their creative practices into new avenues.
            </p>
            <p className="text-black font-medium">
              We've also helped build amazing creative activations around Australia, including{' '}
              <a 
                href="https://www.instagram.com/sandrewmelbs/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-zap-yellow bg-zap-red px-1 rounded hover:underline"
              >
                Sandrew's
              </a>
              {' '}epic street art exhibition{' '}
              <a 
                href="https://www.instagram.com/theoutsidersmelbourne/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-zap-yellow bg-zap-red px-1 rounded hover:underline"
              >
                'The Outsiders Melbourne'
              </a>
              {' '}(A MUST SEE!), to Shepard Fairey's (OBEY){' '}
              <a 
                href="https://lifewithoutandy.com/featured/party-bullshit/obey-printed-matters-shepard-fairey-ambush-pop-up-gallery-sydney/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-zap-yellow bg-zap-red px-1 rounded hover:underline"
              >
                Printed Matters
              </a>
              {' '}Gallery in Sydney.
            </p>
            <p className="text-black font-medium">
              With the relaunch of our new space, we're excited to continue our mission in fresh and innovative ways merging, Art, Technology & Culture whilst adhering to our life motto, 'CultureB4Capital', we make cool shit happen! 💙
            </p>
          </div>

          <div className="mt-12">
            <FeaturedGalleries
              galleries={galleries}
              onSelect={handleGallerySelect}
              onFavoriteToggle={handleFavoriteToggle}
              favoriteGalleries={favoriteGalleries}
            />
          </div>
        </motion.div>
      </div>
      <PartnerLogoBanner />
    </div>
  );
};

export default WhoAreYou;
