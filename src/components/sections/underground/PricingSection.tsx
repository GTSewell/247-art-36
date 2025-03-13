
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import PricingPackage from "@/components/details/PricingPackage";

// Features data
const studioArtistFeatures = [
  { text: "100 Days Exhibition (3 months+)" },
  { text: "Gallery Commission on Original Artwork", percentage: "25%" },
  { text: "Artist Commission of RRP on Retail Sales", percentage: "30%" },
  { text: "1 sqm Artwork Space" },
  { text: "1 Artwork Change Per Month" },
  { text: "1 Artwork per sqm" },
  { text: "Video Wall Profile (1 rotation every 3)" },
  { text: "24hr Timed Edition Drops Available" },
  { text: "Black or White T-shirt Options" },
  { text: "Custom 247 Artist Profile [yournamehere].247.art", isBoldUrl: true },
  { text: "No Priority Art Hanging", isIncluded: false },
];

// Feature Artist exclusive features (not in Studio Artist)
const featureArtistExclusiveFeatures = [
  { text: "Everything in the Studio Artist package plus,", isHeader: true },
  { text: "Gallery Commission on Original Artwork", percentage: "0%" },
  { text: "Artist Commission of RRP on Retail Sales", percentage: "40%" },
  { text: "Priority Art Hanging" },
  { text: "Unlimited Artwork Changes (within reason)" },
  { text: "Up to 4 Artworks per sqm" },
  { text: "Video Wall Profile (2 rotations every 3)" },
  { text: "Sculpture Display (40cm x 40cm plinth)" },
  { text: "Retail 'STP' Merch Pack (Choose any artist)" },
  { text: "247 Artist ATLAS Book + 3 Card Packs" },
  { text: "Shop-front Feature Display" },
  { text: "Custom Embosser for Prints" },
  { text: "Specialty Sticker Options (Metallics, Holographic)" },
  { text: "Full Color Range T-shirt Options" },
];

const PricingSection = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-16 mb-12"
    >
      <h2 className="text-3xl font-bold text-white text-center mb-10">
        Ok. So what's the cost?
      </h2>
      
      {/* Images and tiers section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        <PricingPackage
          title="Studio Artist"
          price="$995"
          priceColor="zap-blue"
          iconColor="zap-yellow"
          imageSrc="/lovable-uploads/a550ea7f-48f9-4a07-b026-eb1e74f3d31d.png"
          features={studioArtistFeatures}
          animationDirection="left"
        />

        {/* Center Rocket Icon */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="hidden md:flex justify-center items-center"
        >
          <img 
            src="/lovable-uploads/8045e416-b0d7-482c-b222-33fee5d700fc.png"
            alt="Rocket Icon"
            className="w-full max-w-[260px] animate-float"
          />
        </motion.div>

        <PricingPackage
          title="Feature Artist"
          price="$1,495"
          priceColor="zap-red"
          iconColor="zap-blue"
          imageSrc="/lovable-uploads/76e20a37-89c0-48dc-bc0f-fe0bc589ed9f.png"
          features={featureArtistExclusiveFeatures}
          animationDirection="right"
        />
      </div>
      
      {/* Mobile Rocket Icon */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="md:hidden flex justify-center items-center mt-8 mb-8"
      >
        <img 
          src="/lovable-uploads/8045e416-b0d7-482c-b222-33fee5d700fc.png"
          alt="Rocket Icon"
          className="w-full max-w-[220px] animate-float"
        />
      </motion.div>

      {/* Link to Details page */}
      <div className="text-center mt-8">
        <Link 
          to="/details" 
          className="text-zap-yellow hover:text-white transition-colors inline-flex items-center gap-2"
        >
          <span>View more details</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  );
};

export default PricingSection;
