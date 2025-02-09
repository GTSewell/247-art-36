
import { motion } from "framer-motion";

const WhatIsZap = () => {
  return (
    <section className="py-20 px-4 bg-zap-blue relative z-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto"
      >
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <h2 className="text-4xl font-bold mb-6">What is ZAP!?</h2>
            <p className="text-lg mb-4">
              ZAP! is the <span className="font-bold">next-generation payments platform</span> built for <span className="font-bold">artists, galleries, and creative businesses</span>. We make payments <span className="font-bold">instant, automated, and transparent</span>, removing the delays, friction, and invoicing headaches that creatives face every day.
            </p>
            <p className="text-lg mb-4">
              Powered by <span className="font-bold">smart contracts and Web3 technology</span>, ZAP! ensures that everyone involved in a sale—whether it's an artist, curator, gallery, or service provider—<span className="font-bold">gets paid instantly, automatically, and fairly.</span>
            </p>
            <p className="text-lg">
              ZAP! is designed to be fun, easy-to-use, and completely artist-first, that makes handling finances as exciting as making art.
            </p>
          </div>
          <div className="flex-1">
            <img
              src="/lovable-uploads/9884fa85-9b3c-4add-9873-d6f92fc2d673.png"
              alt="ZAP Platform"
              className="animate-float"
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default WhatIsZap;
