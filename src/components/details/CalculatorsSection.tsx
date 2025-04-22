
import { motion } from "framer-motion";
import SalesCalculator from "./SalesCalculator";
import ArtworkSizeCalculator from "./ArtworkSizeCalculator";

const CalculatorsSection = () => {
  return (
    <>
      {/* Sales Calculator */}
      <motion.div 
        initial={{
          opacity: 0,
          y: 20
        }} 
        animate={{
          opacity: 1,
          y: 0
        }} 
        transition={{
          duration: 0.5,
          delay: 0.3
        }} 
        className="max-w-4xl mx-auto mt-16"
      >
        <SalesCalculator />
      </motion.div>
      
      {/* LFG Link Image */}
      <div className="flex justify-center items-center my-12">
        <a href="https://print.oshi.id/products/feature-247-art-exhibition" target="_blank" rel="noopener noreferrer">
          <img 
            src="/lovable-uploads/4afecec6-716f-4e98-9fd0-e5ad357b925e.png" 
            alt="LFG, I'M IN!" 
            className="w-full max-w-[500px] animate-float cursor-pointer" 
          />
        </a>
      </div>
      
      {/* Artwork Size Calculator */}
      <motion.div 
        initial={{
          opacity: 0,
          y: 20
        }} 
        animate={{
          opacity: 1,
          y: 0
        }} 
        transition={{
          duration: 0.5,
          delay: 0.4
        }} 
        className="max-w-4xl mx-auto mt-16"
      >
        <ArtworkSizeCalculator />
      </motion.div>
    </>
  );
};

export default CalculatorsSection;

