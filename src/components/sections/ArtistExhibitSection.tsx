
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const ArtistExhibitSection = () => {
  useEffect(() => {
    // Load Tally script if not already loaded
    if (!document.querySelector('script[src*="tally.so"]')) {
      const script = document.createElement('script');
      script.src = 'https://tally.so/widgets/embed.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  return (
    <section className="max-w-5xl mx-auto py-10 px-4 md:px-8">
      <div className="text-center mb-12">
        <motion.h2 initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5
      }} className="text-3xl md:text-4xl font-bold mb-6">247 Artists. One EPIC movement</motion.h2>
        
        <motion.p initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5
      }} className="text-lg md:text-xl max-w-3xl mx-auto">Exhibit your work in our Melbourne gallery for 3 months, keep your [dxp] profile ... FOREVER!</motion.p>
        
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5
      }} className="mt-6 bg-zap-yellow text-black inline-flex items-center px-6 py-3 rounded-lg font-bold text-xl md:text-2xl">
          $365 AUD / $225 USD / ~0.091 Ξ
        </motion.div>
      </div>
      
      <Card className="border-2 border-zap-yellow mb-12">
        <CardContent className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <span className="bg-zap-yellow text-black w-8 h-8 inline-flex items-center justify-center rounded-full mr-2">1</span>
                Your Art, Printed & Exhibited
              </h3>
              <p className="ml-10">We print your work on your choice of premium archival museum grade paper (giclee) and frame it in a 50x70cm / 19.75x27.5in box frame. On exhibition in front of 50k people per day in our Melbourne gallery for 3 months.</p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <span className="bg-zap-yellow text-black w-8 h-8 inline-flex items-center justify-center rounded-full mr-2">2</span>
                Digital Artist Profile & Shop
              </h3>
              <p className="ml-10">Get your own online 247 "Link-in-Bio" profile with a direct sales funnel for prints, merch, stickers, or originals. You create the art, we take care of everything else. You keep 100% of the profits!</p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <span className="bg-zap-yellow text-black w-8 h-8 inline-flex items-center justify-center rounded-full mr-2">3</span>
                Retail Placement
              </h3>
              <p className="ml-10">Your art produced at the highest retail quality as Fine Art Prints, Stickers, T-shirts &amp; more. Sold in-gallery and online directly through your own 247.art profile.</p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <span className="bg-zap-yellow text-black w-8 h-8 inline-flex items-center justify-center rounded-full mr-2">4</span>
                Global Exposure
              </h3>
              <p className="ml-10">Not everyone can make it IRL to one of Melbourne's busiest (and coolest) streets, so we'll bring the exhibition to you via 3D lidar scan (See our previous gallery scan below)</p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <span className="bg-zap-yellow text-black w-8 h-8 inline-flex items-center justify-center rounded-full mr-2">5</span>
                Community, Not Competition
              </h3>
              <p className="ml-10">You're not just exhibiting — you're joining a movement of 247 creatives working together to shift the culture.</p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <span className="bg-zap-yellow text-black w-8 h-8 inline-flex items-center justify-center rounded-full mr-2">6</span>
                Collector & Patron Sponsorships
              </h3>
              <p className="ml-10">
                Can't afford it right now? Collectors can sponsor you. We'll help match artists with patrons.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex flex-col md:flex-row justify-center gap-4">
        <Button size="lg" className="px-8 py-6 text-lg bg-zap-yellow text-black hover:bg-yellow-400">
          I'm an Artist. LFG!
        </Button>
        <Button size="lg" variant="outline" className="px-8 py-6 text-lg border-2 border-zap-yellow text-black hover:bg-yellow-100">
          I'd like to sponsor an artist
        </Button>
      </div>
      
      {/* Tally Form - Styled to match website */}
      <Card className="mt-12 border-2 border-zap-yellow">
        <CardContent className="p-0">
          <iframe 
            data-tally-src="https://tally.so/r/nGy8AO" 
            width="100%" 
            height="1250" 
            frameBorder="0" 
            marginHeight={0} 
            marginWidth={0} 
            title="Artist Registration Form"
            className="rounded-lg"
          ></iframe>
        </CardContent>
      </Card>
    </section>
  );
};

export default ArtistExhibitSection;
