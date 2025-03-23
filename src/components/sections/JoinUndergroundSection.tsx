
import { motion } from "framer-motion";
import FaqAccordion from "./underground/FaqAccordion";
import { faqItems } from "./underground/faqData";
import { Link } from "react-router-dom";

const JoinUndergroundSection = () => {
  return <section className="py-24 px-4 relative bg-gradient-to-b from-zap-blue to-zap-yellow">
      <motion.div initial={{
      opacity: 0,
      y: 20
    }} whileInView={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.5
    }} className="container mx-auto max-w-4xl">
        <div className="space-y-8 mx-0">
          <a href="https://print.oshi.id/products/feature-247-art-exhibition" target="_blank" rel="noopener noreferrer" className="block w-full max-w-lg mx-auto hover:opacity-90 transition-opacity">
            <img 
              src="/lovable-uploads/d18c3542-cbb6-47d7-a6cd-b1d9d0f5fffe.png" 
              alt="TLDR; SIGN ME UP!" 
              className="w-full h-auto"
            />
          </a>

          {/* FAQ Accordion */}
          <FaqAccordion items={faqItems} />
          
          {/* Added "Built By Artists For Artists" image */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12 text-center"
          >
            <img 
              src="/lovable-uploads/7d2e39fb-84b5-4bfc-9f09-707fa8e985e1.png" 
              alt="Built By Artists For Artists" 
              className="w-full max-w-2xl mx-auto"
            />
          </motion.div>
        </div>
      </motion.div>
    </section>;
};
export default JoinUndergroundSection;
