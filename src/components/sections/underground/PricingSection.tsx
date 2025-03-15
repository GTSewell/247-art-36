
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import ArtistPackageTable from "@/components/details/ArtistPackageTable";

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
      
      {/* Comparison Table */}
      <div className="max-w-4xl mx-auto">
        <ArtistPackageTable />
      </div>
      
      {/* Desktop Logo */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex justify-center items-center my-8"
      >
        <img 
          src="/lovable-uploads/8045e416-b0d7-482c-b222-33fee5d700fc.png"
          alt="Rocket Icon"
          className="w-full max-w-[260px] animate-float"
        />
      </motion.div>

      {/* Link to Details page */}
      <div className="text-center mt-8">
        <Link 
          to="/details" 
          className="text-yellow-400 hover:text-white transition-colors inline-flex items-center gap-2"
        >
          <span>View more details</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  );
};

export default PricingSection;
