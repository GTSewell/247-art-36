
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

const initialBenefits = [
  "Receive payments instantly upon sale—no more waiting or chasing invoices.",
  "Automate split payments between artists, galleries, curators, and service providers.",
  "Sell artwork online, in retail spaces, and at live events with seamless integrations.",
  "Use crypto or fiat—choose how you want to get paid.",
  "Get your own custom payment page & account.",
  "A simple, fun, and enjoyable experience."
];

const WhatIsZap = () => {
  const [benefits, setBenefits] = useState(initialBenefits);

  const handleBenefitChange = (index: number, value: string) => {
    const newBenefits = [...benefits];
    newBenefits[index] = value;
    setBenefits(newBenefits);
  };

  return (
    <section id="what-is-zap" className="py-32 px-4 relative overflow-hidden">
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
      >
        <h1 className="text-5xl font-bold text-white mb-12 text-center">So whats this all about?</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-zap-yellow rounded-full flex items-center justify-center mb-4">
                    <Zap className="w-6 h-6 text-black" />
                  </div>
                  <div className="text-lg font-semibold">
                    <textarea
                      value={benefit}
                      onChange={(e) => handleBenefitChange(index, e.target.value)}
                      className="w-full text-lg font-semibold"
                      rows={3}
                    />
                  </div>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default WhatIsZap;
