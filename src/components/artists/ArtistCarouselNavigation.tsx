
import React from "react";
import { CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ArtistCarouselNavigationProps {
  isMobile: boolean;
}

const ArtistCarouselNavigation: React.FC<ArtistCarouselNavigationProps> = ({ isMobile }) => {
  return (
    <>
      <div className="hidden md:block">
        <CarouselPrevious className="left-1 md:left-3 bg-white/70 backdrop-blur-sm hover:bg-white hover:text-black border-none" />
        <CarouselNext className="right-1 md:right-3 bg-white/70 backdrop-blur-sm hover:bg-white hover:text-black border-none" />
      </div>
      {isMobile && (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center space-x-2 py-2 z-10">
          <div className="flex gap-1 items-center bg-white/70 backdrop-blur-sm px-3 py-1 rounded-full">
            <ChevronLeft size={16} className="text-gray-500" />
            <span className="text-xs text-gray-600">Swipe</span>
            <ChevronRight size={16} className="text-gray-500" />
          </div>
        </div>
      )}
    </>
  );
};

export default ArtistCarouselNavigation;
