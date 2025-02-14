
import Hero from "@/components/Hero";
import WhatIsZap from "@/components/sections/WhatIsZap";
import VirtualTourSection from "@/components/sections/VirtualTourSection";
import WhoIsZapFor from "@/components/sections/WhoIsZapFor";
import CallToAction from "@/components/sections/CallToAction";
import Navigation from "@/components/Navigation";
import JoinUndergroundSection from "@/components/sections/JoinUndergroundSection";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <WhatIsZap />
      <JoinUndergroundSection />
      <VirtualTourSection />
      <WhoIsZapFor />
      <CallToAction />
    </main>
  );
};

export default Index;
