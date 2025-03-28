
import { motion } from "framer-motion";
import InterestForm from "@/components/sections/underground/InterestForm";
import { outroText } from "@/components/sections/underground/faqData";

const CallToActionSection = () => {
  return (
    <>
      {/* "LFG, I Want In!" Image with animation and link */}
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
          delay: 0.6
        }} 
        className="flex justify-center items-center my-12"
      >
        <a href="https://print.oshi.id/products/feature-247-art-exhibition" target="_blank" rel="noopener noreferrer">
          <img 
            src="/lovable-uploads/125e0b0f-15c8-4d5a-a182-4a1dc5d0594c.png" 
            alt="LFG, I Want In!" 
            className="w-full max-w-[500px] animate-float cursor-pointer" 
          />
        </a>
      </motion.div>

      {/* Interest Form */}
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
          delay: 0.7
        }} 
        className="max-w-4xl mx-auto mt-16 mb-0 my-0 py-0"
      >
        <InterestForm introText={outroText} />
      </motion.div>
    </>
  );
};

export default CallToActionSection;
