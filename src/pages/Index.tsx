
import Hero from "@/components/Hero";
import Navigation from "@/components/navigation/Navigation";
import JoinUndergroundSection from "@/components/sections/JoinUndergroundSection";
import ReadyToHustleSection from "@/components/sections/ReadyToHustleSection";
import FlipTheOldSection from "@/components/sections/FlipTheOldSection";
import NewPromoAfterFlipSection from "@/components/sections/NewPromoAfterFlipSection";
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
      <main className={`min-h-screen ${isPWA ? "overflow-hidden" : ""} bg-[#ebebdc]`}>
        {isPWA ? <PWANavigation /> : <Navigation />}
        <Hero />
        <JoinUndergroundSection />
        <ReadyToHustleSection />
        <FlipTheOldSection />
        <NewPromoAfterFlipSection />
      </main>
    </>
  );
};

export default Index;
