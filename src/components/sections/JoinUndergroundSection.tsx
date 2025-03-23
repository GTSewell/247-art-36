
import { motion } from "framer-motion";
import FaqAccordion from "./underground/FaqAccordion";
import { faqItems } from "./underground/faqData";
import { Link } from "react-router-dom";
const JoinUndergroundSection = () => {
  return <section className="px-4 relative bg-zap-blue py-[27px]">
      {/* Halftone Background Image */}
      <img src="/lovable-uploads/6fadf1da-55ba-4d36-8571-a0af3c64c197.png" alt="Halftone Pattern" className="absolute inset-0 w-full h-full object-cover z-10 opacity-100 pointer-events-none" />
      
      <motion.div initial={{
      opacity: 0,
      y: 20
    }} whileInView={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.5
    }} className="container mx-auto max-w-4xl relative z-20">
        <div className="space-y-8 mx-0">
          {/* Added paragraph with styled text above the TLDR image */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5,
          delay: 0.2
        }} className="mb-8 text-center">
            <p className="text-3xl md:text-3xl font-extrabold text-white">
              <span className="block mt-1">We built 'Lanes End'</span>
              <span className="block mt-1">We built 'VS. Gallery'</span>
              <span className="block mt-1">We built 'Milkbar'</span>
              <span className="block mt-1">We built 'OSHI'</span>
              <span className="block mt-4">Now, we build 247!</span>
            </p>
          </motion.div>
          
          {/* Swapped: Now showing "Built By Artists For Artists" image here */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5,
          delay: 0.3
        }} className="text-center">
            <img src="/lovable-uploads/2a729dda-550e-4a9f-9b77-b04246fe65d6.png" alt="Built By Artists For Artists" className="w-full max-w-2xl mx-auto animate-float" />
          </motion.div>

          {/* FAQ Accordion */}
          <FaqAccordion items={faqItems} />
          
          {/* Swapped: Now showing "TLDR; SIGN ME UP!" image here */}
          <a href="https://print.oshi.id/products/feature-247-art-exhibition" target="_blank" rel="noopener noreferrer" className="block w-full max-w-lg mx-auto hover:opacity-90 transition-opacity">
            <img src="/lovable-uploads/d18c3542-cbb6-47d7-a6cd-b1d9d0f5fffe.png" alt="TLDR; SIGN ME UP!" className="w-full h-auto" />
          </a>
        </div>
      </motion.div>
    </section>;
};
export default JoinUndergroundSection;
