
import Hero from "@/components/Hero";
import WhatIsZap from "@/components/sections/WhatIsZap";
import VirtualTourSection from "@/components/sections/VirtualTourSection";
import CallToAction from "@/components/sections/CallToAction";
import Navigation from "@/components/navigation/Navigation";
import JoinUndergroundSection from "@/components/sections/JoinUndergroundSection";
import { useAppMode } from "@/contexts/AppModeContext";
import PWANavigation from "@/components/pwa/PWANavigation";

const Index = () => {
  const { isPWA } = useAppMode();

  return (
    <main className={`min-h-screen ${isPWA ? 'overflow-hidden' : ''}`}>
      {isPWA ? <PWANavigation /> : <Navigation />}
      <Hero />
      <WhatIsZap />
      <JoinUndergroundSection />
      <VirtualTourSection />
      <CallToAction />
    </main>
  );
};

export default Index;
