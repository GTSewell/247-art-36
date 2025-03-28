
import Navigation from "@/components/navigation/Navigation";

const PageBackgroundSection = () => {
  return (
    <>
      {/* Top Red Halftone Background - Full Width */}
      <div className="absolute top-0 left-0 right-0 w-full z-10">
        <img 
          src="/lovable-uploads/41f4bd11-64e7-4a89-bc4f-730883fb8f4e.png" 
          alt="Red Halftone Background Top" 
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
