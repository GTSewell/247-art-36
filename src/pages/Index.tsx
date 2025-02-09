
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import WhatIsZap from "@/components/sections/WhatIsZap";
import WhyUseZap from "@/components/sections/WhyUseZap";
import WhoIsZapFor from "@/components/sections/WhoIsZapFor";
import CallToAction from "@/components/sections/CallToAction";

const Index = () => {
  return (
    <div className="min-h-screen relative">
      {/* Red halftone background */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-[600px] bg-contain bg-bottom bg-no-repeat pointer-events-none"
        style={{
          backgroundImage: "url('/lovable-uploads/2f1883a5-8860-43b5-bfb1-3090b1b05c4f.png')",
          opacity: 1,
          zIndex: 0,
        }}
      />
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
