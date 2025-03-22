
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
          <Link to="/details" className="block w-full max-w-lg mx-auto hover:opacity-90 transition-opacity">
            <img 
              src="/lovable-uploads/d18c3542-cbb6-47d7-a6cd-b1d9d0f5fffe.png" 
              alt="TLDR; SIGN ME UP!" 
              className="w-full h-auto"
            />
          </Link>

          {/* FAQ Accordion */}
          <FaqAccordion items={faqItems} />
        </div>
      </motion.div>
    </section>;
};
export default JoinUndergroundSection;
