
import { motion } from "framer-motion";
import { Zap, Palette, CreditCard, Gift, Coins, Trophy, Brush, Printer, ShoppingBag, BookOpen } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

const benefits = [
  "3+ month Exhibition\non always vibing\nSmith St, Collingwood",
  "25% commission?\nHow about .. 10%??\nEven better ... 0%???",
  "Exclusive print deals\n...\n Long after the show is over!",
  "Retail Merch & Prints\n ATLAS artist book\n We take care of it all!",
  "Your very own kick ass\n online artist profile\n [artistname].247.art",
  "Exclusive Events\n Workshops &\n Partner discounts"
];

const cardStyles = [{
  icon: Coins,
  bgColor: "bg-zap-yellow",
  iconBg: "bg-white",
  border: "border-white"
}, {
  icon: CreditCard,
  bgColor: "bg-zap-blue",
  iconBg: "bg-white",
  border: "border-white"
}, {
  icon: Printer,
  bgColor: "bg-zap-red",
  iconBg: "bg-white",
  border: "border-white"
}, {
  icon: ShoppingBag,
  bgColor: "bg-zap-yellow",
  iconBg: "bg-white",
  border: "border-white"
}, {
  icon: Trophy,
  bgColor: "bg-zap-blue",
  iconBg: "bg-white",
  border: "border-white"
}, {
  icon: Brush,
  bgColor: "bg-zap-red",
  iconBg: "bg-white",
  border: "border-white"
}];

const WhatIsZap = () => {
  return (
    <section id="247-details" className="py-40 px-4 relative overflow-hidden">
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
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="text-5xl md:text-6xl font-bold text-white text-center absolute bottom-8 w-full"
        >
          THERE&apos;S PLENTY MORE TO COME!
        </motion.h1>
      </div>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto relative min-h-[650px]"
        style={{ zIndex: 2 }}
      >
        <h1 className="text-5xl font-bold text-white mb-6 text-center">So what'cha, what'cha, what'cha want?</h1>
        <h3 className="text-white mb-12 text-center max-w-3xl mx-auto opacity-90 text-2xl font-semibold">We know what we want, and that's to revolutionize the way artists, creators, and the public connect, create, and prosper together .... Here's a sneak peek of what it looks like:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => {
            const CardIcon = cardStyles[index]?.icon || Zap;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <Card className={`h-full transform transition-all duration-300 hover:scale-105 group-hover:shadow-xl group-hover:border-opacity-75 ${cardStyles[index]?.bgColor || 'bg-white'} border-2 ${cardStyles[index]?.border || 'border-white'}`}>
                  <CardHeader>
                    <div className={`w-12 h-12 ${cardStyles[index]?.iconBg || 'bg-white'} rounded-full flex items-center justify-center mb-4 transform transition-transform duration-300 group-hover:scale-110`}>
                      <CardIcon className="w-6 h-6 text-black transition-transform duration-300 group-hover:rotate-12" />
                    </div>
                    <CardTitle>
                      <p className="w-full text-white whitespace-pre-line px-2 py-[6px]">
                        {benefit}
                      </p>
                    </CardTitle>
                  </CardHeader>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
};

export default WhatIsZap;
