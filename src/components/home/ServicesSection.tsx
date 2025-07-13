import React from 'react';
import { Link } from 'react-router-dom';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
interface ServicesSectionProps {
  onTriggerRef?: (element: HTMLElement | null) => void;
  onContentRef?: (element: HTMLElement | null) => void;
}
const ServicesSection: React.FC<ServicesSectionProps> = ({
  onTriggerRef,
  onContentRef
}) => {
  return <AccordionItem value="services" className="border-none">
      <AccordionTrigger ref={onTriggerRef} className="hover:no-underline px-0 py-0 homepage-accordion-group group">
        <div className="flex flex-col md:flex-row md:items-center w-full md:justify-between">
          <div className="inline-block">
            <h2 className="text-[8rem] sm:text-[12rem] md:text-[16rem] lg:text-[24rem] xl:text-[32rem] font-agharti font-black leading-none uppercase homepage-accordion-title bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] whitespace-nowrap" style={{
            '--homepage-bg-image': 'url(/lovable-uploads/07f6a8d8-39c8-43c9-b4ef-6eb5a69c416d.png)'
          } as React.CSSProperties}>SERVICES</h2>
          </div>
          <p className="hidden md:block text-xl font-light text-gray-600 ml-8">
            Curatorial expertise and event management
          </p>
        </div>
      </AccordionTrigger>
      <AccordionContent ref={onContentRef} className="px-0 pb-16">
        <div className="mb-20">
          <div className="flex justify-between items-end">
            <p className="text-2xl font-light text-gray-600 max-w-xl px-0">Working with creative companies to deliver creative experiences is our jam. Professional curation and event management is just the beginning. We help you bring your concepts to creation. From high speed 1 day pop-ups, to long lasting memories. We'll make it happen.</p>
            <Link to="/services" className="text-xl border-b-2 border-black hover:border-gray-600 transition-colors">
              learn more
            </Link>
          </div>
        </div>

        {/* Brand Showreel */}
        <div className="mb-16 overflow-hidden">
          <div className="flex animate-scroll" style={{ width: '200%' }}>
            <div className="flex w-1/2 justify-between items-center gap-4 mr-1">
              <img src="/lovable-uploads/e712fac8-35fb-4031-94dd-21b5b2d9e2cf.png" alt="Orana" className="h-8 sm:h-12 object-contain" />
              <img src="/lovable-uploads/3eb1b40c-37b4-447b-aad5-37b22eac7f5c.png" alt="Australian Open" className="h-8 sm:h-12 object-contain" />
              <img src="/lovable-uploads/fee57e59-e2fb-4b44-bc49-e06f5ddcdce5.png" alt="Fed Square" className="h-8 sm:h-12 object-contain" />
              <img src="/lovable-uploads/c0f9d87c-8b7b-4c95-8b3e-df7e99a57088.png" alt="Brand 4" className="h-8 sm:h-12 object-contain" />
              <img src="/lovable-uploads/8b6c9e46-e6b6-4eb6-b945-f73a7de8e5d4.png" alt="Brand 5" className="h-8 sm:h-12 object-contain" />
            </div>
            <div className="flex w-1/2 justify-between items-center gap-4 ml-1">
              <img src="/lovable-uploads/e712fac8-35fb-4031-94dd-21b5b2d9e2cf.png" alt="Orana" className="h-8 sm:h-12 object-contain" />
              <img src="/lovable-uploads/3eb1b40c-37b4-447b-aad5-37b22eac7f5c.png" alt="Australian Open" className="h-8 sm:h-12 object-contain" />
              <img src="/lovable-uploads/fee57e59-e2fb-4b44-bc49-e06f5ddcdce5.png" alt="Fed Square" className="h-8 sm:h-12 object-contain" />
              <img src="/lovable-uploads/c0f9d87c-8b7b-4c95-8b3e-df7e99a57088.png" alt="Brand 4" className="h-8 sm:h-12 object-contain" />
              <img src="/lovable-uploads/8b6c9e46-e6b6-4eb6-b945-f73a7de8e5d4.png" alt="Brand 5" className="h-8 sm:h-12 object-contain" />
            </div>
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