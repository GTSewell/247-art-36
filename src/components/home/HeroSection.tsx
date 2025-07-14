import React from 'react';
import { motion } from 'framer-motion';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import useEmblaCarousel from 'embla-carousel-react';

interface HeroSectionProps {
  onTriggerRef?: (element: HTMLElement | null) => void;
  onContentRef?: (element: HTMLElement | null) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onTriggerRef, onContentRef }) => {
  const [emblaRef] = useEmblaCarousel({ 
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: true
  });

  const latestUpdates = [
    {
      color: 'bg-red-500',
      category: 'Latest Exhibition',
      title: 'Underground Collective',
      description: 'Featuring emerging artists from around the globe...',
      delay: 0.2
    },
    {
      color: 'bg-blue-500',
      category: 'Latest Feature', 
      title: 'Artist Profiles 2.0',
      description: 'Enhanced artist dashboard with live preview...',
      delay: 0.3
    },
    {
      color: 'bg-green-500',
      category: 'Latest Story',
      title: 'Art Never Sleeps',
      description: 'The story behind 247.ART and our mission...',
      delay: 0.4
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <AccordionItem value="hero" className="border-none">
        <AccordionTrigger
          ref={onTriggerRef}
          className="hover:no-underline px-0 py-0 homepage-accordion-group group flex-col items-start md:flex-row md:items-center md:justify-between w-full"
        >
          <div className="flex flex-col md:flex-row md:items-center w-full md:justify-between">
            <h1 className="text-[8rem] sm:text-[12rem] md:text-[16rem] lg:text-[24rem] xl:text-[32rem] font-agharti font-black leading-none uppercase homepage-accordion-title bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] whitespace-nowrap w-full text-left md:w-auto" 
                style={{
                  '--homepage-bg-image': 'url(/lovable-uploads/be055b29-9f0f-43df-ab8e-756b57ff803b.png)'
                } as React.CSSProperties}>
              247 ART
            </h1>
            <p className="text-5xl font-semibold text-gray-600 ml-0 md:ml-8 font-agharti mt-2 md:mt-0 text-left md:text-right tracking-wide">
              ART NEVER SLEEPS
            </p>
          </div>
        </AccordionTrigger>
        <AccordionContent ref={onContentRef} className="px-0 pb-16">
          <div className="mb-20">
            {/* Desktop Layout */}
            <div className="hidden md:flex items-end justify-between mt-8">
              <div className="max-w-lg">
                <p className="text-xl font-light mb-0 font-sans">
                  Where art transcends boundaries and creativity knows no limits. Discover a curated ecosystem of emerging and established artists, cutting-edge exhibitions, and premium printing services—all designed to elevate the contemporary art experience.
                </p>
              </div>
              <button className="px-8 py-3 border-2 border-foreground text-lg font-medium hover:bg-foreground hover:text-background transition-colors ml-8">
                Enter Gallery
              </button>
            </div>
            
            {/* Mobile Layout */}
            <div className="md:hidden mt-8">
              <p className="text-xl font-light mb-6 font-sans">
                Where art transcends boundaries and creativity knows no limits. Discover a curated ecosystem of emerging and established artists, cutting-edge exhibitions, and premium printing services—all designed to elevate the contemporary art experience.
              </p>
              <button className="px-8 py-3 border-2 border-foreground text-lg font-medium hover:bg-foreground hover:text-background transition-colors">
                Enter Gallery
              </button>
            </div>
          </div>

          {/* Latest Updates Cards - Desktop Grid */}
          <div className="hidden md:grid grid-cols-3 gap-4 mb-20">
            {latestUpdates.map((update, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: update.delay }}
                className="bg-black text-white p-6 rounded-lg"
              >
                <div className="flex items-center mb-3">
                  <div className={`w-2 h-2 ${update.color} rounded-full mr-3`}></div>
                  <span className="text-sm italic">{update.category}</span>
                </div>
                <h3 className="text-xl font-bold mb-2">{update.title}</h3>
                <p className="text-sm text-gray-300">{update.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Latest Updates Cards - Mobile Carousel */}
          <div className="md:hidden mb-20">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex gap-4">
                {latestUpdates.map((update, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: update.delay }}
                    className="bg-black text-white p-6 rounded-lg flex-[0_0_85%] min-w-0"
                  >
                    <div className="flex items-center mb-3">
                      <div className={`w-2 h-2 ${update.color} rounded-full mr-3`}></div>
                      <span className="text-sm italic">{update.category}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{update.title}</h3>
                    <p className="text-sm text-gray-300">{update.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </motion.div>
  );
};

export default HeroSection;