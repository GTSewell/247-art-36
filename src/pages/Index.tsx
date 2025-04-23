
import Hero from "@/components/Hero";
import Navigation from "@/components/navigation/Navigation";
import JoinUndergroundSection from "@/components/sections/JoinUndergroundSection";
import ReadyToHustleSection from "@/components/sections/ReadyToHustleSection";
import FlipTheOldSection from "@/components/sections/FlipTheOldSection";
import { useAppMode } from "@/contexts/AppModeContext";
import PWANavigation from "@/components/pwa/PWANavigation";
import { Helmet } from "react-helmet";

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
        <div className="bg-[#f0f0e7] py-[82px]">
          <Hero />
          <JoinUndergroundSection />
          <ReadyToHustleSection />
          <FlipTheOldSection />
          {/* Floating banner at the bottom */}
          <div className="flex justify-center items-center mt-16 mb-0">
            <img
              src="/lovable-uploads/96c594a0-80b9-4675-b599-deb4ad4802b8.png"
              alt="BUILT BY ARTISTS FOR ARTISTS"
              className="w-full max-w-[480px] animate-float"
              style={{
                userSelect: "none",
                display: "block"
              }}
              draggable={false}
            />
          </div>
        </div>
      </main>
    </>
  );
};

export default Index;

