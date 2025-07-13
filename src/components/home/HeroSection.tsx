import React from 'react';
import { motion } from 'framer-motion';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
interface HeroSectionProps {
  onTriggerRef?: (element: HTMLElement | null) => void;
  onContentRef?: (element: HTMLElement | null) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onTriggerRef, onContentRef }) => {
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
      <AccordionTrigger 
        ref={onTriggerRef}
        className="hover:no-underline px-0 my-0 font-extrabold text-9xl py-0 homepage-accordion-group group flex-col items-start md:flex-row md:items-center md:justify-between w-full"
      >
        <div className="flex flex-col md:flex-row md:items-center w-full md:justify-between">
          <h1 
            className="text-[8rem] sm:text-[12rem] md:text-[16rem] lg:text-[24rem] xl:text-[32rem] font-agharti font-black leading-none uppercase homepage-accordion-title bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] whitespace-nowrap w-full text-left md:w-auto"
            style={{
              '--homepage-bg-image': 'url(/lovable-uploads/78290654-3ec5-4f13-a3f3-9c03597b2721.png)'
            } as React.CSSProperties}
          >
            247.ART
          </h1>
          <p className="text-xl font-light text-gray-600 ml-0 md:ml-8 font-nove mt-2 md:mt-0 text-left md:text-right">
            WELCOME TO THE HOME FOR CREATIVES
          </p>
        </div>
      </AccordionTrigger>
        <AccordionContent ref={onContentRef} className="px-0 pb-16">
          <div className="mb-20">
            <div className="mt-8 max-w-lg">
              <p className="text-xl font-light mb-8 font-sans">
                Where art transcends boundaries and creativity knows no limits. Discover a curated ecosystem of emerging and established artists, cutting-edge exhibitions, and premium printing services—all designed to elevate the contemporary art experience.
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