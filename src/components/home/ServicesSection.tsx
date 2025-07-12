import React from 'react';
import { Link } from 'react-router-dom';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
interface ServicesSectionProps {
  onTriggerRef?: (element: HTMLElement | null) => void;
  onContentRef?: (element: HTMLElement | null) => void;
}

const ServicesSection: React.FC<ServicesSectionProps> = ({ onTriggerRef, onContentRef }) => {
  return <AccordionItem value="services" className="border-none">
      <AccordionTrigger 
        ref={onTriggerRef}
        className="hover:no-underline px-0 py-0 homepage-accordion-group group"
      >
        <div className="flex flex-col md:flex-row md:items-center w-full md:justify-between">
          <div className="inline-block">
            <h2 
              className="text-[8rem] sm:text-[12rem] md:text-[16rem] lg:text-[24rem] xl:text-[32rem] font-agharti font-black leading-none uppercase homepage-accordion-title bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] whitespace-nowrap"
              style={{
                '--homepage-bg-image': 'url(/lovable-uploads/07f6a8d8-39c8-43c9-b4ef-6eb5a69c416d.png)'
              } as React.CSSProperties}
            >SERVICES</h2>
          </div>
          <p className="hidden md:block text-xl font-light text-gray-600 ml-8">
            Curatorial expertise and event management
          </p>
        </div>
      </AccordionTrigger>
      <AccordionContent ref={onContentRef} className="px-0 pb-16">
        <div className="mb-20">
          <div className="flex justify-between items-end">
            <p className="text-2xl font-light text-gray-600 max-w-xl">
              Curatorial expertise, event management, and custom builds
            </p>
            <Link to="/services" className="text-xl border-b-2 border-black hover:border-gray-600 transition-colors">
              learn more
            </Link>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <div className="bg-black text-white p-3 sm:p-6 rounded-lg">
            <div className="flex items-center mb-2 sm:mb-3">
              <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2 sm:mr-3"></div>
              <span className="text-xs sm:text-sm italic">curation</span>
            </div>
            <h3 className="text-sm sm:text-xl font-bold mb-1 sm:mb-2">Exhibition Curation</h3>
            <p className="text-xs sm:text-sm text-gray-300">
              Expert curatorial services for galleries and private collections
            </p>
          </div>

          <div className="bg-black text-white p-3 sm:p-6 rounded-lg">
            <div className="flex items-center mb-2 sm:mb-3">
              <div className="w-2 h-2 bg-rose-500 rounded-full mr-2 sm:mr-3"></div>
              <span className="text-xs sm:text-sm italic">management</span>
            </div>
            <h3 className="text-sm sm:text-xl font-bold mb-1 sm:mb-2">Event Management</h3>
            <p className="text-xs sm:text-sm text-gray-300">
              Full-service event planning and execution for art events
            </p>
          </div>

          <div className="bg-black text-white p-3 sm:p-6 rounded-lg">
            <div className="flex items-center mb-2 sm:mb-3">
              <div className="w-2 h-2 bg-amber-500 rounded-full mr-2 sm:mr-3"></div>
              <span className="text-xs sm:text-sm italic">custom builds</span>
            </div>
            <h3 className="text-sm sm:text-xl font-bold mb-1 sm:mb-2">Installation Design</h3>
            <p className="text-xs sm:text-sm text-gray-300">
              Bespoke installations and exhibition space design
            </p>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>;
};
export default ServicesSection;