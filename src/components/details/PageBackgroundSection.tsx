
import Navigation from "@/components/navigation/Navigation";
import { useIsMobile } from "@/hooks/use-mobile";

const PageBackgroundSection = () => {
  const isMobile = useIsMobile();
  
  return (
    <>
      {/* Top Halftone Background - Full Width */}
      <div className="absolute top-0 left-0 right-0 w-full z-10">
        <img 
          src="/lovable-uploads/38021187-f807-4cb5-adb2-840a75f8050f.png" 
          alt="Halftone Background Top" 
          className="w-full h-auto object-cover" 
        />
      </div>
      
      {/* Navigation sits above the halftone background */}
      <div className="relative z-20">
        <Navigation />
      </div>
    </>
  );
};

export default PageBackgroundSection;
