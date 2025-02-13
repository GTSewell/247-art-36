
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

const WhatIsZap = () => {
  const { data: { publicUrl } } = supabase
    .storage
    .from('patterns')
    .getPublicUrl('247-art-Jane&GT-Halftone-white.png');

  return (
    <section className="py-32 px-4 relative overflow-hidden">
      <div 
        className="absolute inset-0 w-full h-full bg-zap-blue"
        style={{ zIndex: 0 }}
      />
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `linear-gradient(to bottom, 
            rgba(255,255,255,0) 0%,
            rgba(255,255,255,0) 85%,
            rgba(0,186,239,1) 100%
          )`,
          zIndex: 1,
          mixBlendMode: 'normal'
        }}
      />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto relative"
        style={{ zIndex: 2 }}
      />
    </section>
  );
};

export default WhatIsZap;
