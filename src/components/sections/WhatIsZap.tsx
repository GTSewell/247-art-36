import React, { useState } from "react";
import { Palette, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";

const WhatIsZap = () => {
  const [heading, setHeading] = useState("What is Zap?");
  const [subheading, setSubheading] = useState("We're building Melbourne's first multi-purpose art space in the heart of Smith St. More than an art gallery, more than a store—Zap! is a creative powerhouse designed to bring artists and art lovers together.");

  return (
    <section className="relative bg-white py-24">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-zap-yellow/20 to-transparent" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto space-y-6 mb-16">
          <Textarea
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
            className="w-full text-4xl font-bold text-gray-900 bg-transparent border-none resize-none focus:ring-0 hover:bg-black/5 transition-colors overflow-hidden"
            style={{ minHeight: '60px' }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = target.scrollHeight + 'px';
            }}
          />

          <Textarea
            value={subheading}
            onChange={(e) => setSubheading(e.target.value)}
            className="w-full text-xl text-gray-600 bg-transparent border-none resize-none focus:ring-0 hover:bg-black/5 transition-colors overflow-hidden whitespace-pre-wrap"
            style={{ minHeight: '120px' }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = target.scrollHeight + 'px';
            }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-zap-yellow rounded-lg">
                <Palette className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold">Art Gallery & Store</h3>
            </div>
            <p className="text-gray-600">
              A curated space showcasing local artists, where art lovers can discover and purchase original works, prints, and merchandise. We're making art more accessible while ensuring artists get paid fairly.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-zap-yellow rounded-lg">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold">Creative Hub</h3>
            </div>
            <p className="text-gray-600">
              A dynamic space for workshops, events, and collaborations. We're creating a community where artists can connect, learn, and grow together. From exhibition openings to artist talks, there's always something happening at Zap!
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhatIsZap;
