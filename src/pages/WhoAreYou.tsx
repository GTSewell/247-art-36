
import React from "react";
import Navigation from "@/components/navigation/Navigation";
import { useGalleries } from "@/hooks/use-galleries";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";

// Extracted components
import HeroSection from "@/components/sections/whoAreYou/HeroSection";
import AboutSection from "@/components/sections/whoAreYou/AboutSection";
import ServicesSection from "@/components/sections/whoAreYou/ServicesSection";
import GalleriesSection from "@/components/sections/whoAreYou/GalleriesSection";

const WhoAreYou = () => {
  const {
    data: galleries = [],
    isLoading
  } = useGalleries();
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-zap-blue pb-[50px] relative">
      <Navigation />
      
      {/* Hero section with Jane & GT images */}
      <HeroSection />

      <div>
        {/* About section */}
        <AboutSection />
        
        {/* Services section (previously on Services.tsx) */}
        <ServicesSection />

        {/* Galleries section */}
        <GalleriesSection galleries={galleries} isLoading={isLoading} />
      </div>

      {/* Bottom banner image with 0.5 opacity */}
      <div className="absolute bottom-0 left-0 w-full">
        <img 
          src="/lovable-uploads/ddc18b16-629a-42e8-a97e-af21acb3e67a.png" 
          alt="Bottom Banner" 
          className="w-full opacity-50" 
          onError={(e) => e.currentTarget.src = '/placeholder.svg'} 
        />
      </div>
    </div>
  );
};

export default WhoAreYou;
