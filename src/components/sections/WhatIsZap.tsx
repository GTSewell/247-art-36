
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

const WhatIsZap = () => {
  const { data: { publicUrl } } = supabase
    .storage
    .from('patterns')
    .getPublicUrl('247-art-Jane&GT-Halftone-white-soft edge.png');

  return (
    <section className="py-32 px-4 relative overflow-hidden">
      <div 
        className="absolute inset-0 w-full h-full bg-zap-blue"
        style={{ zIndex: 0 }}
      />
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `url('${publicUrl}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 1,
          zIndex: 1,
          mixBlendMode: 'normal'
        }}
      />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto relative flex justify-start w-full"
        style={{ zIndex: 2 }}
      >
        <div className="flex flex-col md:flex-row items-start w-1/2">
          <div className="flex-1">
            <h1 className="text-5xl font-bold text-white mb-6">What is ZAP!?</h1>
            <p className="text-lg mb-4 text-black">
              We are GT Sewell and Jane Rolls, long-time advocates for Melbourne's vibrant arts community. You may have met us galivanting around at artist studios, like Everfresh or Blender, or, maybe at a kick-ass exhibition at Backwoods or B-side, or, maybe you're more along the lines of "Who TF are they!?"  ... well,
            </p>
            <p className="text-lg mb-4 text-black">
              Over the past decade, we've proudly dedicated ourselves to supporting artists and their creative journeys through our work at galleries and studios we built like Lanes End, VS. Gallery (with the inimitable Ben Frost & Nixi Killick), Milkbar, and most recently, OSHI our current location on the always vibing Smith St, Collingwood.
            </p>
            <p className="text-lg mb-4 text-black">
              Each of these spaces has been a labor of love, designed to foster connections between artists, collectors, and the wider community.
            </p>
            <p className="text-lg mb-4 text-black">
              In addition to our gallery work, our artist printing business has been a cornerstone of our efforts to empower artists. By providing high-quality printing services for fine art prints, merchandise, and more, we've helped countless artists generate supplementary income and expand their creative practices into new avenues. We've also helped build amazing creative activations around Australia, including the recent 'The Outsiders Melbourne' exhibition by Sandrew (A MUST SEE!), to Shephard Fairey's (OBEY) Printed Matters Gallery in Sydney creatively directed by the genius Eddie Zammit.
            </p>
            <p className="text-lg text-black">
              With the relaunch of our new space, we're excited to continue our mission in fresh and innovative ways. Adhering to our life motto 'CultureB4Capital' and get to makin' cool shit happen! 💙
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default WhatIsZap;
