
import Hero from "@/components/Hero";
import Navigation from "@/components/navigation/Navigation";
import JoinUndergroundSection from "@/components/sections/JoinUndergroundSection";
import ReadyToHustleSection from "@/components/sections/ReadyToHustleSection";
import FlipTheOldSection from "@/components/sections/FlipTheOldSection";
import { useAppMode } from "@/contexts/AppModeContext";
import PWANavigation from "@/components/pwa/PWANavigation";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import MatterportViewer from "@/components/MatterportViewer";

const Index = () => {
  const { isPWA } = useAppMode();
  return (
    <>
      <Helmet>
        <meta property="og:image" content="https://247.art/lovable-uploads/c54f87f7-7b02-4bc8-999b-f5a580ad369e.png" />
        <link rel="icon" href="https://247.art/lovable-uploads/15e8cb31-73b1-4d72-9d9b-0dac8bf0baed.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="247.ART" />
        <meta name="twitter:description" content="247.ART - Art Never Sleeps" />
        <meta name="twitter:image" content="https://247.art/lovable-uploads/c54f87f7-7b02-4bc8-999b-f5a580ad369e.png" />
      </Helmet>
      <main className={`min-h-screen ${isPWA ? "overflow-hidden" : ""} bg-[#f0f0e7]`}>
        {isPWA ? <PWANavigation /> : <Navigation />}
        <div className="relative bg-[#f0f0e7] py-[82px]">
          <div
            className="absolute top-0 left-0 z-5 w-full flex"
            style={{
              pointerEvents: "none",
            }}
            aria-hidden
          >
            <img
              src="/lovable-uploads/1f33d064-8cd9-4cb0-8c3b-85aab3f611b5.png"
              alt="TWO FOUR SEVEN Text"
              className="w-[38vw] min-w-[140px] max-w-[350px] h-auto md:w-[260px] lg:w-[320px] object-contain"
              style={{
                marginTop: "30px",
                marginLeft: "20px",
                userSelect: "none",
                display: "block"
              }}
              draggable={false}
              aria-hidden
            />
          </div>
          {/* Removed the overlapping background image that was here */}
          <Hero />
          <JoinUndergroundSection />
          <ReadyToHustleSection />
          <FlipTheOldSection />
          <div className="flex justify-center items-center mt-16 mb-0 relative z-10">
            <Link to="/details" className="cursor-pointer">
              <img
                src="/lovable-uploads/96c594a0-80b9-4675-b599-deb4ad4802b8.png"
                alt="BUILT BY ARTISTS FOR ARTISTS"
                className="w-full max-w-[480px]"
                style={{
                  userSelect: "none",
                  display: "block"
                }}
                draggable={false}
              />
            </Link>
          </div>
          
          {/* Virtual Tour Section */}
          <div id="virtual-gallery" className="mt-16 mb-8 px-4 max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">Virtual Gallery Tour</h2>
            <p className="text-lg mb-8 text-center max-w-2xl mx-auto">
              Take a virtual tour of our innovative art space and see where the magic happens.
            </p>
            <div className="bg-white rounded-lg p-8 shadow-md">
              <div className="bg-zap-yellow text-black p-4 rounded-lg mb-6">
                <p className="font-semibold">
                  This is an older 3D scan of our gallery space. We will be making BIG changes to take it to the next level in preparation for the new home of 247⚡ART!
                </p>
              </div>
              
              <div className="aspect-video w-full bg-white rounded-lg overflow-hidden mb-6">
                <MatterportViewer modelId="BNNRoZpfMt6" height="500px" />
              </div>
              
              <div className="mt-4">
                <h3 className="font-medium mb-2">The Virtual Exhibition</h3>
                <p className="text-muted-foreground mb-4">
                  Once the exhibition is in installed we will recreate a new 3D lidar scan of the gallery which will allow international viewers to explore the space and select your artwork to view and purchase directly within the virtual experience.
                </p>
                
                <h3 className="font-medium mb-2">Explore Our Space</h3>
                <p className="text-muted-foreground mb-4">
                  Take a virtual walkthrough of our innovative art space. Navigate through different rooms
                  and areas to get a feel for where artists create, collaborate, and showcase their work.
                </p>
                <p className="text-muted-foreground">
                  Use your mouse to look around, click and drag to move, and scroll to zoom in and out.
                  For the best experience, view in fullscreen mode.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Index;
