
import React from "react";
import { CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ArtistCarouselNavigationProps {
  isFirstArtist?: boolean;
  isLastArtist?: boolean;
  isMobile?: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
}

const ArtistCarouselNavigation: React.FC<ArtistCarouselNavigationProps> = ({ 
  isFirstArtist = false,
  isLastArtist = false,
  isMobile = false,
  onPrevious,
  onNext
}) => {
  return (
    <>
      <div className="hidden md:block absolute top-1/2 -translate-y-1/2 left-0 right-0 z-10">
        <button 
          onClick={onPrevious}
          disabled={isFirstArtist}
          className={`absolute left-1 md:left-3 bg-white/70 backdrop-blur-sm hover:bg-white hover:text-black border-none rounded-full p-2 ${isFirstArtist ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous artist</span>
        </button>
        <button 
          onClick={onNext}
          disabled={isLastArtist}
          className={`absolute right-1 md:right-3 bg-white/70 backdrop-blur-sm hover:bg-white hover:text-black border-none rounded-full p-2 ${isLastArtist ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next artist</span>
        </button>
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
