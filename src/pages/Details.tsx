
import PageBackgroundSection from "@/components/details/PageBackgroundSection";
import HeroSection from "@/components/details/HeroSection";
import CalculatorsSection from "@/components/details/CalculatorsSection";
import FaqSection from "@/components/details/FaqSection";
import CallToActionSection from "@/components/details/CallToActionSection";
import BottomSection from "@/components/details/BottomSection";
import FeaturesAccordion from "@/components/details/FeaturesAccordion";
import { features } from "@/components/details/data/featuresData";

const Details = () => {
  return (
    <main className="min-h-screen bg-[#f7cf1e] overflow-hidden relative">
      <PageBackgroundSection />
      
      <div className="container mx-auto px-4 pt-24 pb-0 relative z-10">
        {/* Intro paragraph */}
        <HeroSection />

        {/* Gallery Experience Banner */}
        <div className="max-w-4xl mx-auto mb-8">
          <img 
            src="/lovable-uploads/0c0aeefe-a528-4295-987e-ad28e9224f84.png" 
            alt="A New Gallery Experience Built for Artists & Collectors" 
            className="w-full animate-float"
          />
        </div>

        {/* Features Accordion */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-black">Features & Benefits</h2>
            <p className="text-lg mt-2">Explore what each artist package includes</p>
          </div>
          <FeaturesAccordion features={features} />
        </div>
        
        {/* Calculators Section */}
        <CalculatorsSection />
        
        {/* FAQ Accordion */}
        <FaqSection />

        {/* Call to Action and Interest Form */}
        <CallToActionSection />
      </div>

      {/* Full-width Red Halftone Background with Rocket */}
      <BottomSection />
    </main>
  );
};

export default Details;
