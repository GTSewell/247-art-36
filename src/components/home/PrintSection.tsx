import React from 'react';
import { Link } from 'react-router-dom';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import useEmblaCarousel from 'embla-carousel-react';

interface PrintSectionProps {
  onTriggerRef?: (element: HTMLElement | null) => void;
  onContentRef?: (element: HTMLElement | null) => void;
}

const PrintSection: React.FC<PrintSectionProps> = ({
  onTriggerRef,
  onContentRef
}) => {
  const [emblaRef] = useEmblaCarousel({ 
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: true
  });

  const printFeatures = [
    {
      color: 'bg-blue-500',
      category: 'premium quality',
      title: 'Museum Grade Papers',
      description: 'Archival quality papers that last generations'
    },
    {
      color: 'bg-green-500', 
      category: 'custom sizes',
      title: 'Any Dimension',
      description: 'From small prints to large format installations'
    },
    {
      color: 'bg-purple-500',
      category: 'fast delivery', 
      title: 'Quick Turnaround',
      description: 'Professional printing with fast, reliable delivery'
    }
  ];

  return (
    <AccordionItem value="print" className="border-none">
      <AccordionTrigger
        ref={onTriggerRef}
        className="hover:no-underline px-0 py-0 homepage-accordion-group group flex-col items-start md:flex-row md:items-center md:justify-between w-full"
      >
        <div className="flex flex-col md:flex-row md:items-center w-full md:justify-between">
          <h2 className="text-[8rem] sm:text-[12rem] md:text-[16rem] lg:text-[24rem] xl:text-[32rem] font-agharti font-black leading-none uppercase homepage-accordion-title bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] whitespace-nowrap w-full text-left md:w-auto" style={{
            '--homepage-bg-image': 'url(/lovable-uploads/0e792c6e-d4f2-45f3-9de6-f1c897a07f79.png)'
          } as React.CSSProperties}>
            PRINT
          </h2>
          <p className="text-xl font-light text-gray-600 ml-0 md:ml-8 font-nove mt-2 md:mt-0 text-left md:text-right">
            CUSTOM STICKERS | TEES | PRINTS & MORE
          </p>
        </div>
      </AccordionTrigger>
      <AccordionContent ref={onContentRef} className="px-0 pb-16">
        <div className="mb-20">
          {/* Desktop Layout */}
          <div className="hidden md:flex justify-between items-end">
            <p className="text-2xl font-light text-gray-600 max-w-xl font-sans">
              Transform digital masterpieces into tangible works of art with our museum-grade printing technology. From intimate prints to large-scale installations, we ensure every detail preserves the artist's original vision.
            </p>
            <Link to="/details" className="px-8 py-3 border-2 border-foreground text-lg font-medium hover:bg-foreground hover:text-background transition-colors">
              learn more
            </Link>
          </div>
          
          {/* Mobile Layout */}
          <div className="md:hidden">
            <p className="text-xl font-light text-gray-600 mb-6 font-sans">
              Transform digital masterpieces into tangible works of art with our museum-grade printing technology. From intimate prints to large-scale installations, we ensure every detail preserves the artist's original vision.
            </p>
            <Link to="/details" className="inline-block px-8 py-3 border-2 border-foreground text-lg font-medium hover:bg-foreground hover:text-background transition-colors">
              learn more
            </Link>
          </div>
        </div>

        {/* Print Info - Desktop Grid */}
        <div className="hidden md:grid grid-cols-3 gap-4">
          {printFeatures.map((feature, index) => (
            <div key={index} className="bg-black text-white p-6 rounded-lg">
              <div className="flex items-center mb-3">
                <div className={`w-2 h-2 ${feature.color} rounded-full mr-3`}></div>
                <span className="text-sm italic">{feature.category}</span>
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Print Info - Mobile Carousel */}
        <div className="md:hidden">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4">
              {printFeatures.map((feature, index) => (
                <div key={index} className="bg-black text-white p-6 rounded-lg flex-[0_0_85%] min-w-0">
                  <div className="flex items-center mb-3">
                    <div className={`w-2 h-2 ${feature.color} rounded-full mr-3`}></div>
                    <span className="text-sm italic">{feature.category}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-300">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default PrintSection;