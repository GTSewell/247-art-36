
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
