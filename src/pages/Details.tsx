
import Navigation from "@/components/navigation/Navigation";
import { motion } from "framer-motion";
import ArtistPackageTable from "@/components/details/ArtistPackageTable";
import ArtworkSizeCalculator from "@/components/details/ArtworkSizeCalculator";
import SalesCalculator from "@/components/details/SalesCalculator";
import InterestForm from "@/components/sections/underground/InterestForm";
import { outroText } from "@/components/sections/underground/faqData";
import { Zap } from "lucide-react";

const Details = () => {
  return (
    <main className="min-h-screen bg-[#f7cf1e]">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* Intro paragraph */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <h1 className="text-4xl font-bold mb-6 text-gray-800">Artist Exhibition Packages</h1>
          <p className="text-lg text-gray-800 mb-4">
            Whether you're just starting your journey, or, a full-time artist, we have the perfect package for you. Select between our Studio and Feature Artist options to get started.
          </p>
          <p className="text-lg text-gray-800">
            Below you will find full details on the available Artist packages, along with both an Artwork Size & Exhibition Profit Calculator to help you better understand your investment value.
          </p>
        </motion.div>

        {/* Comparison Table */}
        <div className="max-w-4xl mx-auto">
          <ArtistPackageTable />
        </div>
        
        {/* Artwork Size Calculator */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="max-w-4xl mx-auto mt-16"
        >
          <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Calculate Your Artwork Space</h2>
          <ArtworkSizeCalculator />
        </motion.div>

        {/* Sales Calculator - New Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="max-w-4xl mx-auto mt-16"
        >
          <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Calculate Your Exhibition Profitability</h2>
          <SalesCalculator />
        </motion.div>

        {/* Interest Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="max-w-4xl mx-auto mt-16"
        >
          <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">I'd like to know more...</h2>
          <InterestForm introText={outroText} />
        </motion.div>

        {/* Center Rocket Icon for Desktop */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center items-center my-12"
        >
          <img 
            src="/lovable-uploads/8045e416-b0d7-482c-b222-33fee5d700fc.png"
            alt="Rocket Icon"
            className="w-full max-w-[400px] animate-float"
          />
        </motion.div>
      </div>
    </main>
  );
};

export default Details;
