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
          <h2 
            className="text-[8rem] sm:text-[12rem] md:text-[16rem] lg:text-[24rem] xl:text-[32rem] font-agharti font-black leading-none uppercase homepage-accordion-title bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] whitespace-nowrap w-full text-left md:w-auto"
            style={{
              '--homepage-bg-image': 'url(/lovable-uploads/6a02808c-6f26-4b2b-81ca-342a5be9d9b9.png)'
            } as React.CSSProperties}
          >
            SERVICES
          </h2>
          <p className="text-xl font-light text-gray-600 ml-0 md:ml-8 font-nove mt-2 md:mt-0 text-left md:text-right">
            PROFESSIONAL CURATION AND EVENT MANAGEMENT. ART ACTIVATIONS, KICK-ASS INSTALLATIONS. YOU DREAM IT. WE'LL BUILD IT!
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

        {/* Logo Slideshow */}
        <div className="h-32 sm:h-48 md:h-64 overflow-hidden relative">
          <div 
            className="flex h-full animate-[scroll-seamless_30s_linear_infinite]"
            style={{ width: '200%' }}
          >
            {/* First set - exactly 50% width */}
            <div className="flex shrink-0 items-center h-full px-2 sm:px-4 md:px-8 gap-2 sm:gap-4 md:gap-6" style={{ width: '50%' }}>
              <img src="/lovable-uploads/9b8aaaec-260e-4521-97f5-9112b786f964.png" alt="Australian Open" className="h-16 sm:h-24 md:h-32 lg:h-40 w-auto object-contain flex-shrink-0" />
              <img src="/lovable-uploads/a6b1e057-8f66-4644-a891-ea4f59271933.png" alt="Deadfell Az" className="h-16 sm:h-24 md:h-32 lg:h-40 w-auto object-contain flex-shrink-0" />
              <img src="/lovable-uploads/fcd73dd1-9c16-4eae-bcb5-547cb3ca8394.png" alt="Disney" className="h-16 sm:h-24 md:h-32 lg:h-40 w-auto object-contain flex-shrink-0" />
              <img src="/lovable-uploads/a824492b-297d-4fa8-88b0-05ac55526030.png" alt="Marvel" className="h-16 sm:h-24 md:h-32 lg:h-40 w-auto object-contain flex-shrink-0" />
              <img src="/lovable-uploads/b574e628-0625-4dc5-a6cf-81f6ce3da939.png" alt="MetaMask" className="h-16 sm:h-24 md:h-32 lg:h-40 w-auto object-contain flex-shrink-0" />
              <img src="/lovable-uploads/067f8322-0e67-4b3d-881f-3969238632f5.png" alt="Sony Music" className="h-16 sm:h-24 md:h-32 lg:h-40 w-auto object-contain flex-shrink-0" />
              <img src="/lovable-uploads/c7fafd2b-8e57-462f-952a-374fd506cc2b.png" alt="Warner Music Group" className="h-16 sm:h-24 md:h-32 lg:h-40 w-auto object-contain flex-shrink-0" />
              <img src="/lovable-uploads/ee3c875a-71c6-4583-803f-ccdbc12dd1ea.png" alt="Z Logo" className="h-16 sm:h-24 md:h-32 lg:h-40 w-auto object-contain flex-shrink-0" />
              <img src="/lovable-uploads/1bc22eef-5c46-4faf-942c-a042e0180553.png" alt="Fed Sq" className="h-16 sm:h-24 md:h-32 lg:h-40 w-auto object-contain flex-shrink-0" />
            </div>
            {/* Second set - exactly 50% width, identical to first */}
            <div className="flex shrink-0 items-center h-full px-2 sm:px-4 md:px-8 gap-2 sm:gap-4 md:gap-6" style={{ width: '50%' }}>
              <img src="/lovable-uploads/9b8aaaec-260e-4521-97f5-9112b786f964.png" alt="Australian Open" className="h-16 sm:h-24 md:h-32 lg:h-40 w-auto object-contain flex-shrink-0" />
              <img src="/lovable-uploads/a6b1e057-8f66-4644-a891-ea4f59271933.png" alt="Deadfell Az" className="h-16 sm:h-24 md:h-32 lg:h-40 w-auto object-contain flex-shrink-0" />
              <img src="/lovable-uploads/fcd73dd1-9c16-4eae-bcb5-547cb3ca8394.png" alt="Disney" className="h-16 sm:h-24 md:h-32 lg:h-40 w-auto object-contain flex-shrink-0" />
              <img src="/lovable-uploads/a824492b-297d-4fa8-88b0-05ac55526030.png" alt="Marvel" className="h-16 sm:h-24 md:h-32 lg:h-40 w-auto object-contain flex-shrink-0" />
              <img src="/lovable-uploads/b574e628-0625-4dc5-a6cf-81f6ce3da939.png" alt="MetaMask" className="h-16 sm:h-24 md:h-32 lg:h-40 w-auto object-contain flex-shrink-0" />
              <img src="/lovable-uploads/067f8322-0e67-4b3d-881f-3969238632f5.png" alt="Sony Music" className="h-16 sm:h-24 md:h-32 lg:h-40 w-auto object-contain flex-shrink-0" />
              <img src="/lovable-uploads/c7fafd2b-8e57-462f-952a-374fd506cc2b.png" alt="Warner Music Group" className="h-16 sm:h-24 md:h-32 lg:h-40 w-auto object-contain flex-shrink-0" />
              <img src="/lovable-uploads/ee3c875a-71c6-4583-803f-ccdbc12dd1ea.png" alt="Z Logo" className="h-16 sm:h-24 md:h-32 lg:h-40 w-auto object-contain flex-shrink-0" />
              <img src="/lovable-uploads/1bc22eef-5c46-4faf-942c-a042e0180553.png" alt="Fed Sq" className="h-16 sm:h-24 md:h-32 lg:h-40 w-auto object-contain flex-shrink-0" />
            </div>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>;
};
export default ServicesSection;