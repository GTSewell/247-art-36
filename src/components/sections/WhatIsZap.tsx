
import { motion } from "framer-motion";
import { Zap } from "lucide-react";

const WhatIsZap = () => {
  return (
    <section id="247-details" className="py-40 px-4 relative overflow-hidden">
      <div 
        className="absolute inset-0 w-full h-full bg-zap-blue"
        style={{ zIndex: 0 }}
      />
    </section>
  );
};

export default WhatIsZap;
