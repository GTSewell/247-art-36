
import { motion } from "framer-motion";

const CallToAction = () => {
  return (
    <div className="py-20 px-4 relative overflow-visible min-h-[600px] bg-zap-yellow">
      {/* Halftone Background */}
      <img 
        src="/lovable-uploads/5d0599b7-4561-43b3-af8b-550a349ed4fc.png"
        alt="Halftone Pattern"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto text-center relative z-10"
      >
        <h1 className="text-5xl font-bold text-white mb-6">Join the ZAP! Revolution</h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Tired of chasing payments? Want to <span className="font-bold">get paid instantly</span> and <span className="font-bold">focus on your creativity</span>? ZAP! is built <span className="font-bold">for creators, by creators</span> to make financial transactions <span className="font-bold">fast, fair, and fun.</span>
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-zap-blue text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-opacity-90 transition-colors"
        >
          Get Started with ZAP! <img src="/lovable-uploads/eb2c14e8-c113-4c23-ad33-76d46f95badd.png" alt="ZAP!" className="inline-block w-6 h-6 ml-2 drop-shadow-md" />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default CallToAction;
