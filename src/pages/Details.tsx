
import Navigation from "@/components/Navigation";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

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
          {/* Launchpad Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <img 
              src="/lovable-uploads/d0e2f0f5-3e1b-4aca-ba46-dd13f40890ce.png"
              alt="Launchpad"
              className="w-full max-w-[300px] mx-auto"
            />
            <div className="bg-white/90 backdrop-blur rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-black mb-4 flex items-center justify-between">
                Launchpad Package
                <span className="text-xl font-bold text-zap-blue">$995</span>
              </h2>
              <ul className="space-y-3 text-gray-800">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 mt-0.5 text-zap-blue flex-shrink-0" />
                  <span>100 Days Exhibition (3 months+)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 mt-0.5 text-zap-blue flex-shrink-0">25%</span>
                  <span>Gallery Commission on Original Artwork</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 mt-0.5 text-zap-blue flex-shrink-0">30%</span>
                  <span>Artist Commission of RRP on Retail Sales</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 mt-0.5 text-zap-blue flex-shrink-0" />
                  <span>1 sqm Artwork Space</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 mt-0.5 text-zap-blue flex-shrink-0" />
                  <span>1 Artwork Change Per Month</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 mt-0.5 text-zap-blue flex-shrink-0" />
                  <span>1 Artwork per sqm</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 mt-0.5 text-zap-blue flex-shrink-0" />
                  <span>Video Wall Profile (1 rotation every 3)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 mt-0.5 text-zap-blue flex-shrink-0" />
                  <span>24hr Timed Edition Drops Available</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 mt-0.5 text-zap-blue flex-shrink-0" />
                  <span>Black or White T-shirt Options</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-5 h-5 mt-0.5 text-red-500 flex-shrink-0" />
                  <span>No Priority Art Hanging</span>
                </li>
              </ul>
            </div>
          </motion.div>

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

          {/* Rocket Section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <img 
              src="/lovable-uploads/ca741392-a31d-4a40-bd39-801c53aede57.png"
              alt="Rocket"
              className="w-full max-w-[300px] mx-auto"
            />
            <div className="bg-white/90 backdrop-blur rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-black mb-4 flex items-center justify-between">
                Rocket Package
                <span className="text-xl font-bold text-zap-red">$1,495</span>
              </h2>
              <ul className="space-y-3 text-gray-800">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 mt-0.5 text-zap-red flex-shrink-0" />
                  <span>100 Days Exhibition (3 months+)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 mt-0.5 text-zap-red flex-shrink-0">0%</span>
                  <span>Gallery Commission on Original Artwork</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 mt-0.5 text-zap-red flex-shrink-0">40%</span>
                  <span>Artist Commission of RRP on Retail Sales</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 mt-0.5 text-zap-red flex-shrink-0" />
                  <span>1 sqm Artwork Space</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 mt-0.5 text-zap-red flex-shrink-0" />
                  <span>Priority Art Hanging</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 mt-0.5 text-zap-red flex-shrink-0" />
                  <span>Unlimited Artwork Changes (within reason)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 mt-0.5 text-zap-red flex-shrink-0" />
                  <span>Up to 4 Artworks per sqm</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 mt-0.5 text-zap-red flex-shrink-0" />
                  <span>Video Wall Profile (2 rotations every 3)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 mt-0.5 text-zap-red flex-shrink-0" />
                  <span>Sculpture Display (40cm x 40cm plinth)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 mt-0.5 text-zap-red flex-shrink-0" />
                  <span>24hr Timed Edition Drops Available</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 mt-0.5 text-zap-red flex-shrink-0" />
                  <span>Retail 'STP' Merch Pack (Choose any artist)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 mt-0.5 text-zap-red flex-shrink-0" />
                  <span>247 Artist ATLAS Book + 3 Card Packs</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 mt-0.5 text-zap-red flex-shrink-0" />
                  <span>Shop-front Feature Display</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 mt-0.5 text-zap-red flex-shrink-0" />
                  <span>Custom Embosser for Prints</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 mt-0.5 text-zap-red flex-shrink-0" />
                  <span>Specialty Sticker Options (Metallics, Holographic)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 mt-0.5 text-zap-red flex-shrink-0" />
                  <span>Full Color Range T-shirt Options</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
};

export default Details;
