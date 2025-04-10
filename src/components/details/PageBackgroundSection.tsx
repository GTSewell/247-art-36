
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
      
      {/* Yellow background */}
      <div className="absolute inset-0 -z-10 bg-zap-yellow"></div>
      
      {/* Bottom Halftone Background - Full Width */}
      <div className="absolute bottom-0 left-0 right-0 w-full z-10">
        <img 
          src="/lovable-uploads/08903113-968a-4ec9-828b-08adc61cd6d5.png" 
          alt="Halftone Background Bottom" 
          className="w-full h-auto object-cover" 
        />
      </div>
    </>
  );
};

export default PageBackgroundSection;
