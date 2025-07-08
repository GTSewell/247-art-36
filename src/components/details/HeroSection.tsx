
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <div className="text-center py-12 md:py-16">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl md:text-5xl lg:text-6xl font-honk mb-6"
      >
        Join up to 420 Artists. One EPIC movement
      </motion.h1>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-xl md:text-2xl max-w-3xl mx-auto"
      >
        Exhibit your work in our Melbourne gallery for 3 months, and your digital profile ... FOREVER!
      </motion.p>
    </div>
  );
};

export default HeroSection;
