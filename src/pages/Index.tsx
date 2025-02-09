
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import WhatIsZap from "@/components/sections/WhatIsZap";
import WhyUseZap from "@/components/sections/WhyUseZap";
import WhoIsZapFor from "@/components/sections/WhoIsZapFor";
import CallToAction from "@/components/sections/CallToAction";

const Index = () => {
  return (
    <div className="min-h-screen relative">
      <Navigation />
      <Hero />
      <WhatIsZap />
      <WhyUseZap />
      <WhoIsZapFor />
      <CallToAction />
    </div>
  );
};

export default Index;
