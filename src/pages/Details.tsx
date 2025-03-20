
import Navigation from "@/components/navigation/Navigation";
import { motion } from "framer-motion";
import ArtistPackageTable from "@/components/details/ArtistPackageTable";
import ArtworkSizeCalculator from "@/components/details/ArtworkSizeCalculator";
import SalesCalculator from "@/components/details/SalesCalculator";
import InterestForm from "@/components/sections/underground/InterestForm";
import { outroText } from "@/components/sections/underground/faqData";
import { Zap, Palette, CreditCard, Gift, Coins, Trophy, Brush, Printer, ShoppingBag, BookOpen, ChevronDown } from "lucide-react";
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

const Details = () => {
  return (
    <main className="min-h-screen bg-[#9ec0d2]">
      <Navigation />
      
      {/* Benefits Section (Moved from WhatIsZap) */}
      <section className="py-20 px-4 relative overflow-hidden bg-[#9ec0d2]">
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
          
          {/* Added "Artist Packages" heading above the bouncing chevron */}
          <motion.div 
            className="flex justify-center mt-16 flex-col items-center"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Artist Packages</h2>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ChevronDown className="w-12 h-12 text-white" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* Intro paragraph */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <h1 className="text-4xl font-bold mb-6 text-gray-800">Artist Exhibition Packages</h1>
          <p className="text-lg text-gray-800">
            Whether you're just starting your journey, or, a full-time artist, we have the perfect package for you. Select between our Studio and Feature Artist options to get started.
          </p>
        </motion.div>

        {/* Comparison Table */}
        <div className="max-w-4xl mx-auto">
          <ArtistPackageTable />
        </div>
        
        {/* Artwork Size Calculator */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="max-w-4xl mx-auto mt-16"
        >
          <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Calculate Your Artwork Space</h2>
          <ArtworkSizeCalculator />
        </motion.div>

        {/* Sales Calculator - New Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="max-w-4xl mx-auto mt-16"
        >
          <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Calculate Your Exhibition Profitability</h2>
          <SalesCalculator />
        </motion.div>

        {/* Interest Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="max-w-4xl mx-auto mt-16"
        >
          <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">I'd like to know more...</h2>
          <InterestForm introText={outroText} />
        </motion.div>

        {/* Center Rocket Icon for Desktop */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center items-center my-12"
        >
          <img 
            src="/lovable-uploads/8045e416-b0d7-482c-b222-33fee5d700fc.png"
            alt="Rocket Icon"
            className="w-full max-w-[400px] animate-float"
          />
        </motion.div>
      </div>
    </main>
  );
};

export default Details;
