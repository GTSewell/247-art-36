
import { motion } from "framer-motion";

const WhyUseZap = () => {
  return (
    <section className="py-40 px-4 bg-gradient-to-b from-zap-blue to-transparent relative z-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto"
      />
    </section>
  );
};

export default WhyUseZap;
