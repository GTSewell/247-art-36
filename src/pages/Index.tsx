
import Hero from "@/components/Hero";
import WhatIsZap from "@/components/sections/WhatIsZap";
import VirtualTourSection from "@/components/sections/VirtualTourSection";
import CallToAction from "@/components/sections/CallToAction";
import Navigation from "@/components/navigation/Navigation";
import JoinUndergroundSection from "@/components/sections/JoinUndergroundSection";
import { useAppMode } from "@/contexts/AppModeContext";
import PWANavigation from "@/components/pwa/PWANavigation";
import { Helmet } from "react-helmet";

const Index = () => {
  const { isPWA } = useAppMode();

  return (
    <>
      <Helmet>
        <meta property="og:image" content="/lovable-uploads/052b5fb6-9f6b-4dcf-aba3-145e9e52c42a.png" />
        <link rel="icon" href="/lovable-uploads/25202ad3-8e49-4194-8405-91473b9b35e3.png" />
      </Helmet>
      <main className={`min-h-screen ${isPWA ? 'overflow-hidden' : ''}`}>
        {isPWA ? <PWANavigation /> : <Navigation />}
        <Hero />
        <WhatIsZap />
        <JoinUndergroundSection />
        <VirtualTourSection />
        <CallToAction />
      </main>
    </>
  );
};

export default Index;
