
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
        <h1 className="text-5xl font-bold text-white mb-6">Join the <img src="/lovable-uploads/1012b9a0-07f9-4f8d-9297-417bb4f99733.png" alt="ZAP!" className="inline-block h-16" /> Revolution</h1>
        <p className="text-2xl mb-8 max-w-2xl mx-auto">
          Tired of chasing payments? Want to <span className="font-bold">get paid instantly</span> and <span className="font-bold">focus on your creativity</span>? <img src="/lovable-uploads/1012b9a0-07f9-4f8d-9297-417bb4f99733.png" alt="ZAP!" className="inline-block h-8" /> is built <span className="font-bold">for creators, by creators</span> to make financial transactions <span className="font-bold">fast, fair, and fun.</span>
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-zap-blue text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-opacity-90 transition-colors"
        >
          Get Started with <img src="/lovable-uploads/1012b9a0-07f9-4f8d-9297-417bb4f99733.png" alt="ZAP!" className="inline-block h-8" />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default CallToAction;
