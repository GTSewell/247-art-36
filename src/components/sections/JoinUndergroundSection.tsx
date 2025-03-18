import { motion } from "framer-motion";
import FaqAccordion from "./underground/FaqAccordion";
import InterestForm from "./underground/InterestForm";
import { faqItems, introText, outroText } from "./underground/faqData";
const JoinUndergroundSection = () => {
  return <section className="py-24 px-4 bg-zap-blue relative">
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
          <h1 className="text-4xl font-bold text-white">
            This is not just a gallery, a print shop, or a retail space ... THIS IS A MOVEMENT!
          </h1>

          <p className="text-xl text-white/90 whitespace-pre-wrap">{introText}</p>

          {/* FAQ Accordion */}
          <FaqAccordion items={faqItems} />

          {/* Interest Form */}
          <InterestForm introText={outroText} />
        </div>
      </motion.div>
    </section>;
};
export default JoinUndergroundSection;