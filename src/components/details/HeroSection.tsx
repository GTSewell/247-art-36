
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <div className="max-w-4xl mx-auto mb-12">
      <div className="text-center bg-zap-yellow border border-black p-6 rounded-lg">
        <motion.h1 
          className="text-4xl md:text-5xl font-bold mb-6 text-black"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Welcome to 247 Art Platform
        </motion.h1>
        
        <motion.p 
          className="text-xl text-gray-800 max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Discover a revolutionary platform designed for artists and collectors. 
          Showcase your artwork, connect with art enthusiasts, and be part of our 
          growing creative community.
        </motion.p>
      </div>
    </div>
  );
};

export default HeroSection;
