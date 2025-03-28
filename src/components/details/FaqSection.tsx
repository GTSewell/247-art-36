
import { motion } from "framer-motion";
import DetailsFaqAccordion from "./DetailsFaqAccordion";
import { detailsFaqItems } from "./detailsFaqData";

const FaqSection = () => {
  return (
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
        delay: 0.5
      }} 
      className="flex justify-center items-center my-12 flex-col"
    >
      <h2 className="text-3xl font-bold text-black mb-6">Frequently Asked Questions</h2>
      <div className="w-full max-w-4xl">
        <DetailsFaqAccordion items={detailsFaqItems} />
      </div>
    </motion.div>
  );
};

export default FaqSection;
