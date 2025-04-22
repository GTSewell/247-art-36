import PageBackgroundSection from "@/components/details/PageBackgroundSection";
import HeroSection from "@/components/details/HeroSection";
import CalculatorsSection from "@/components/details/CalculatorsSection";
import FaqSection from "@/components/details/FaqSection";
import CallToActionSection from "@/components/details/CallToActionSection";
import BottomSection from "@/components/details/BottomSection";
import FeaturesAccordion from "@/components/details/FeaturesAccordion";
import { features } from "@/components/details/data/featuresData";
import InterestForm from "@/components/sections/underground/InterestForm";
import { outroText } from "@/components/sections/underground/faqData";
import { motion } from "framer-motion";

const Details = () => {
  return (
    <main className="min-h-screen bg-[#f7cf1e] overflow-hidden relative">
      <PageBackgroundSection />
      
      <div className="container mx-auto px-4 pt-24 pb-0 relative z-10">
        {/* Gallery Experience Banner */}
        <div className="max-w-4xl mx-auto mb-8">
          <img 
            src="/lovable-uploads/0c0aeefe-a528-4295-987e-ad28e9224f84.png" 
            alt="A New Gallery Experience Built for Artists & Collectors" 
            className="w-full max-w-[625px] animate-float"
          />
        </div>

        {/* Features Accordion */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 border border-black p-4 rounded-lg bg-zap-yellow">
            <h2 className="text-3xl font-bold text-black">Features & Benefits</h2>
            <p className="text-lg mt-2">Explore what each artist package includes</p>
          </div>
          <FeaturesAccordion features={features} />
        </div>
        
        {/* Calculators Section */}
        <CalculatorsSection />
        
        {/* FK IT Image with Link */}
        <div className="flex justify-center items-center my-12">
          <a href="https://print.oshi.id/products/feature-247-art-exhibition" target="_blank" rel="noopener noreferrer">
            <img 
              src="/lovable-uploads/aa85567b-cb83-4628-a421-7e362fae431e.png" 
              alt="FK IT. LET'S DO THIS!" 
              className="w-full max-w-[500px] animate-float cursor-pointer" 
            />
          </a>
        </div>
        
        {/* FAQ Accordion */}
        <FaqSection />

        {/* Interest Form */}
        <div className="max-w-4xl mx-auto mt-16 mb-0 my-0 py-0">
          <InterestForm introText={outroText} />
        </div>
      </div>

      {/* Full-width Red Halftone Background with Rocket */}
      <BottomSection />
    </main>
  );
};

export default Details;
