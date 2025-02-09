
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
        className="fixed bottom-0 left-0 right-0 h-[600px] bg-no-repeat pointer-events-none"
        style={{
          backgroundImage: "url('/lovable-uploads/4268b6e1-e1dd-4d68-ad90-2a05c748ebc7.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'bottom center',
          opacity: 0.8,
          zIndex: -1,
          width: '100vw',
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
