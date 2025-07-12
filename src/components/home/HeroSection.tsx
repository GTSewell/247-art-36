import React from 'react';
import { motion } from 'framer-motion';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
const HeroSection: React.FC = () => {
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.8
  }} className="">
      <AccordionItem value="hero" className="border-none">
      <AccordionTrigger className="hover:no-underline px-0 my-0 font-extrabold text-9xl py-0 homepage-accordion-group group">
        <div className="flex flex-col md:flex-row md:items-center w-full md:justify-between">
          <h1 
            className="text-[8rem] sm:text-[12rem] md:text-[16rem] lg:text-[24rem] xl:text-[32rem] font-agharti font-black leading-none uppercase homepage-accordion-title bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] whitespace-nowrap w-full text-left md:w-auto"
            style={{
              '--homepage-bg-image': 'url(/lovable-uploads/962ca824-a496-4210-8240-a2d0070f4f30.png)'
            } as React.CSSProperties}
          >
            247.ART
          </h1>
          <p className="hidden md:block text-xl font-light text-gray-600 ml-8">
            The official home for all creative minds
          </p>
        </div>
      </AccordionTrigger>
        <AccordionContent className="px-0 pb-16">
          <div className="mb-20">
            <div className="mt-8 max-w-lg">
              <p className="text-xl font-light mb-8">
                The official home for all creative minds.
              </p>
              <button className="px-8 py-3 border-2 border-black text-lg font-medium hover:bg-black hover:text-white transition-colors">
                Enter Gallery
              </button>
            </div>
          </div>

          {/* Latest Updates Cards */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-20">
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.2
          }} className="bg-black text-white p-3 sm:p-6 rounded-lg">
              <div className="flex items-center mb-2 sm:mb-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-2 sm:mr-3"></div>
                <span className="text-xs sm:text-sm italic">Latest Exhibition</span>
              </div>
              <h3 className="text-sm sm:text-xl font-bold mb-1 sm:mb-2">Underground Collective</h3>
              <p className="text-xs sm:text-sm text-gray-300">
                Featuring emerging artists from around the globe...
              </p>
            </motion.div>

            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.3
          }} className="bg-black text-white p-3 sm:p-6 rounded-lg">
              <div className="flex items-center mb-2 sm:mb-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 sm:mr-3"></div>
                <span className="text-xs sm:text-sm italic">Latest Feature</span>
              </div>
              <h3 className="text-sm sm:text-xl font-bold mb-1 sm:mb-2">Artist Profiles 2.0</h3>
              <p className="text-xs sm:text-sm text-gray-300">
                Enhanced artist dashboard with live preview...
              </p>
            </motion.div>

            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.4
          }} className="bg-black text-white p-3 sm:p-6 rounded-lg">
              <div className="flex items-center mb-2 sm:mb-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 sm:mr-3"></div>
                <span className="text-xs sm:text-sm italic">Latest Story</span>
              </div>
              <h3 className="text-sm sm:text-xl font-bold mb-1 sm:mb-2">Art Never Sleeps</h3>
              <p className="text-xs sm:text-sm text-gray-300">
                The story behind 247.ART and our mission...
              </p>
            </motion.div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </motion.div>;
};
export default HeroSection;