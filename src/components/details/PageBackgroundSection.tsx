
import Navigation from "@/components/navigation/Navigation";

const PageBackgroundSection = () => {
  return (
    <>
      {/* Top Halftone Background - Full Width */}
      <div className="absolute top-0 left-0 right-0 w-full z-10">
        <img 
          src="/lovable-uploads/3d0f2c4c-0d2c-4734-991b-a6d7a8ead97d.png" 
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
