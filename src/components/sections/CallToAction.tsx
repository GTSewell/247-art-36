
import { motion } from "framer-motion";

const CallToAction = () => {
  return (
    <section className="py-20 px-4 relative overflow-visible min-h-[600px]">
      {/* Red halftone background */}
      <div 
        className="absolute inset-0 bg-contain bg-bottom bg-no-repeat pointer-events-none"
        style={{
          backgroundImage: "url('/lovable-uploads/383635db-611a-4b2b-9ae8-818a7a71f0fd.png')",
          opacity: 1,
          zIndex: 1,
        }}
      />
      {/* Original background */}
      <div 
        className="absolute inset-0 bg-contain bg-bottom bg-no-repeat pointer-events-none"
        style={{
          backgroundImage: "url('/lovable-uploads/3b781448-7908-4fe1-9315-29de1dc710a5.png')",
          opacity: 1,
          zIndex: 0,
        }}
      />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto text-center relative z-10"
      >
        <h2 className="text-4xl font-bold mb-6">Join the ZAP! Revolution</h2>
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
    </section>
  );
};

export default CallToAction;
