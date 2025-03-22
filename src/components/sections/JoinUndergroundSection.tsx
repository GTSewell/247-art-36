import { motion } from "framer-motion";
import FaqAccordion from "./underground/FaqAccordion";
import { faqItems } from "./underground/faqData";
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
          <h1 className="text-4xl font-bold text-white text-center">
            IT'S TIME TO MAKE A CHANGE
          </h1>

          {/* FAQ Accordion */}
          <FaqAccordion items={faqItems} />
        </div>
      </motion.div>
    </section>;
};
export default JoinUndergroundSection;