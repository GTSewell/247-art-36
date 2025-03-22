
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const HeroSection = () => {
  const [isJaneActive, setIsJaneActive] = useState(false);
  const [isGTActive, setIsGTActive] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className={`pt-16 ${isMobile ? 'pt-20' : 'pt-16'} relative`}>
      <img 
        src="https://iqmskopbhrzqqqjewdzv.supabase.co/storage/v1/object/public/patterns/247-art-Jane%26GT-Halftone-white-soft%20edge-short.png" 
        alt="Jane & GT Halftone" 
        className="w-full h-auto" 
        onError={(e) => e.currentTarget.src = '/placeholder.svg'} 
      />
      {isJaneActive && (
        <img 
          src="https://iqmskopbhrzqqqjewdzv.supabase.co/storage/v1/object/public/patterns/janesolo-hover-5.png" 
          alt="Jane Solo Hover" 
          className="absolute top-[55px] -left-[3px] w-full h-auto opacity-100 transition-opacity duration-300" 
          onError={(e) => e.currentTarget.src = '/placeholder.svg'} 
        />
      )}
      {isGTActive && (
        <img 
          src="https://iqmskopbhrzqqqjewdzv.supabase.co/storage/v1/object/public/patterns/gtsolo-hover-2.png?v=2" 
          alt="GT Solo Hover" 
          className="absolute top-[62px] -left-[1px] w-full h-auto opacity-100 transition-opacity duration-300" 
          onError={(e) => e.currentTarget.src = '/placeholder.svg'} 
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
              top: isMobile ? '3.5rem' : '50px'
            }} 
            onMouseEnter={() => setIsGTActive(true)} 
            onMouseLeave={() => setIsGTActive(false)}
          >
            <img 
              src={isGTActive ? "https://iqmskopbhrzqqqjewdzv.supabase.co/storage/v1/object/public/patterns/thatsgt-hover.png" : "https://iqmskopbhrzqqqjewdzv.supabase.co/storage/v1/object/public/patterns/thatsGT.png"} 
              alt="That's GT" 
              className="w-full h-full" 
              onError={(e) => e.currentTarget.src = '/placeholder.svg'} 
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
              top: isMobile ? '2.5rem' : '50px'
            }} 
            onMouseEnter={() => setIsJaneActive(true)} 
            onMouseLeave={() => setIsJaneActive(false)}
          >
            <img 
              src={isJaneActive ? "https://iqmskopbhrzqqqjewdzv.supabase.co/storage/v1/object/public/patterns/thatsJane-hover.png" : "https://iqmskopbhrzqqqjewdzv.supabase.co/storage/v1/object/public/patterns/thatsJane-1.png"} 
              alt="That's Jane" 
              className="w-full h-full" 
              onError={(e) => e.currentTarget.src = '/placeholder.svg'} 
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
