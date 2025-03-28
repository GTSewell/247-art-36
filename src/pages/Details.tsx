
import PageBackgroundSection from "@/components/details/PageBackgroundSection";
import HeroSection from "@/components/details/HeroSection";
import ArtistPackageTable from "@/components/details/ArtistPackageTable";
import CalculatorsSection from "@/components/details/CalculatorsSection";
import FaqSection from "@/components/details/FaqSection";
import CallToActionSection from "@/components/details/CallToActionSection";
import BottomSection from "@/components/details/BottomSection";

const Details = () => {
  return (
    <main className="min-h-screen bg-[#f7cf1e] overflow-hidden relative">
      <PageBackgroundSection />
      
      <div className="container mx-auto px-4 pt-24 pb-0 relative z-10">
        {/* Intro paragraph - Added black border */}
        <HeroSection />

        {/* Comparison Table */}
        <div className="max-w-4xl mx-auto">
          <ArtistPackageTable />
        </div>
        
        {/* Calculators Section */}
        <CalculatorsSection />
        
        {/* FAQ Accordion */}
        <FaqSection />

        {/* Call to Action and Interest Form */}
        <CallToActionSection />
      </div>

      {/* Full-width Red Halftone Background with Rocket - Outside the container */}
      <BottomSection />
    </main>
  );
};

export default Details;
