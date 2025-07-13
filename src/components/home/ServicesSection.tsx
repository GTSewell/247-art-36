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
        <div className="h-24 sm:h-32 overflow-hidden relative">
          <div className="flex animate-[scroll-left_20s_linear_infinite] h-full">
            <div className="flex shrink-0 items-center h-full space-x-8">
              <img src="/lovable-uploads/9b8aaaec-260e-4521-97f5-9112b786f964.png" alt="Australian Open" className="h-16 sm:h-20 w-auto object-contain" />
              <img src="/lovable-uploads/a6b1e057-8f66-4644-a891-ea4f59271933.png" alt="Deadfell Az" className="h-16 sm:h-20 w-auto object-contain" />
              <img src="/lovable-uploads/fcd73dd1-9c16-4eae-bcb5-547cb3ca8394.png" alt="Disney" className="h-16 sm:h-20 w-auto object-contain" />
              <img src="/lovable-uploads/a824492b-297d-4fa8-88b0-05ac55526030.png" alt="Marvel" className="h-16 sm:h-20 w-auto object-contain" />
              <img src="/lovable-uploads/9be7f7df-0132-4b34-ac9d-e068d9bb0358.png" alt="MetaMask" className="h-16 sm:h-20 w-auto object-contain" />
              <img src="/lovable-uploads/626c7a49-4159-4311-9c1e-3a37a6bdd319.png" alt="Sony Music" className="h-16 sm:h-20 w-auto object-contain" />
              <img src="/lovable-uploads/c7fafd2b-8e57-462f-952a-374fd506cc2b.png" alt="Warner Music Group" className="h-16 sm:h-20 w-auto object-contain" />
            </div>
            <div className="flex shrink-0 items-center h-full space-x-8 ml-8">
              <img src="/lovable-uploads/9b8aaaec-260e-4521-97f5-9112b786f964.png" alt="Australian Open" className="h-16 sm:h-20 w-auto object-contain" />
              <img src="/lovable-uploads/a6b1e057-8f66-4644-a891-ea4f59271933.png" alt="Deadfell Az" className="h-16 sm:h-20 w-auto object-contain" />
              <img src="/lovable-uploads/fcd73dd1-9c16-4eae-bcb5-547cb3ca8394.png" alt="Disney" className="h-16 sm:h-20 w-auto object-contain" />
              <img src="/lovable-uploads/a824492b-297d-4fa8-88b0-05ac55526030.png" alt="Marvel" className="h-16 sm:h-20 w-auto object-contain" />
              <img src="/lovable-uploads/9be7f7df-0132-4b34-ac9d-e068d9bb0358.png" alt="MetaMask" className="h-16 sm:h-20 w-auto object-contain" />
              <img src="/lovable-uploads/626c7a49-4159-4311-9c1e-3a37a6bdd319.png" alt="Sony Music" className="h-16 sm:h-20 w-auto object-contain" />
              <img src="/lovable-uploads/c7fafd2b-8e57-462f-952a-374fd506cc2b.png" alt="Warner Music Group" className="h-16 sm:h-20 w-auto object-contain" />
            </div>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>;
};
export default ServicesSection;