
import Navigation from "@/components/navigation/Navigation";
import { motion } from "framer-motion";
import PricingPackage from "@/components/details/PricingPackage";

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

const featureArtistExclusiveFeatures = [
  { text: "Everything in the Studio Artist package plus," isHeader: true },
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

const Details = () => {
  return (
    <main className="min-h-screen bg-[#9ec0d2]">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* Intro paragraph */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <h1 className="text-4xl font-bold mb-6 text-gray-800">Choose Your Launch Path</h1>
          <p className="text-lg text-gray-800">
            Whether you're ready to take off or just starting your journey, we have the perfect package for you. Select between our Launchpad and Rocket options to begin your artistic ascent.
          </p>
        </motion.div>

        {/* Rocket Icon for Mobile */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="md:hidden flex justify-center items-center mb-8"
        >
          <img 
            src="/lovable-uploads/8045e416-b0d7-482c-b222-33fee5d700fc.png"
            alt="Rocket Icon"
            className="w-full max-w-[250px] animate-float"
          />
        </motion.div>

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

          {/* Center Rocket Icon for Desktop */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden md:flex justify-center items-center"
          >
            <img 
              src="/lovable-uploads/8045e416-b0d7-482c-b222-33fee5d700fc.png"
              alt="Rocket Icon"
              className="w-full max-w-[400px] animate-float"
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
      </div>
    </main>
  );
};

export default Details;
