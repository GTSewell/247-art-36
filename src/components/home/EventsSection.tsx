import React from 'react';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import useEmblaCarousel from 'embla-carousel-react';

interface EventsSectionProps {
  onTriggerRef?: (element: HTMLElement | null) => void;
  onContentRef?: (element: HTMLElement | null) => void;
}

const EventsSection: React.FC<EventsSectionProps> = ({
  onTriggerRef,
  onContentRef
}) => {
  const [emblaRef] = useEmblaCarousel({ 
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: true
  });

  const events = [
    {
      color: 'bg-purple-500',
      category: 'workshop',
      title: 'Digital Art Masterclass',
      description: 'Learn advanced techniques from industry professionals'
    },
    {
      color: 'bg-orange-500',
      category: 'exhibition',
      title: 'Emerging Voices',
      description: 'Showcasing the next generation of creative talent'
    },
    {
      color: 'bg-teal-500',
      category: 'community',
      title: 'Art & Coffee',
      description: 'Monthly meetups for artists and art lovers'
    }
  ];

  return (
    <AccordionItem value="events" className="border-none">
      <AccordionTrigger
        ref={onTriggerRef}
        className="hover:no-underline px-0 py-0 homepage-accordion-group group flex-col items-start md:flex-row md:items-center md:justify-between w-full"
      >
        <div className="flex flex-col md:flex-row md:items-center w-full md:justify-between">
          <h2 className="text-[8rem] sm:text-[12rem] md:text-[16rem] lg:text-[24rem] xl:text-[32rem] font-agharti font-black leading-none uppercase homepage-accordion-title bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] whitespace-nowrap w-full text-left md:w-auto" style={{
            '--homepage-bg-image': 'url(/lovable-uploads/f5bcb249-8214-4e6e-8f63-104b8fc16330.png)'
          } as React.CSSProperties}>
            EVENTS
          </h2>
          <p className="text-5xl font-semibold text-gray-600 ml-0 md:ml-8 font-agharti mt-2 md:mt-0 text-left md:text-right tracking-wide">
            ATTEND OR HOST YOUR NEXT WORKSHOP | POP-UP | EXHIBITION
          </p>
        </div>
      </AccordionTrigger>
      <AccordionContent ref={onContentRef} className="px-0 pb-16">
        <div className="mb-20">
          {/* Desktop Layout */}
          <div className="hidden md:flex justify-between items-end">
            <p className="text-2xl font-light text-gray-600 max-w-xl font-sans">
              Join a vibrant community of creators through exclusive workshops, opening nights, and collaborative sessions. Connect with like-minded artists and art enthusiasts in spaces designed to inspire and educate.
            </p>
            <button 
              className="px-8 py-3 border-2 border-foreground text-lg font-medium hover:bg-foreground hover:text-background transition-colors cursor-pointer bg-transparent"
              data-tally-open="nPEkWx"
              data-tally-emoji-text="👋" 
              data-tally-emoji-animation="wave"
            >
              Book Venue
            </button>
          </div>
          
          {/* Mobile Layout */}
          <div className="md:hidden">
            <p className="text-xl font-light text-gray-600 mb-6 font-sans">
              Join a vibrant community of creators through exclusive workshops, opening nights, and collaborative sessions. Connect with like-minded artists and art enthusiasts in spaces designed to inspire and educate.
            </p>
            <button 
              className="px-8 py-3 border-2 border-foreground text-lg font-medium hover:bg-foreground hover:text-background transition-colors cursor-pointer bg-transparent"
              data-tally-open="nPEkWx"
              data-tally-emoji-text="👋" 
              data-tally-emoji-animation="wave"
            >
              Book Venue
            </button>
          </div>
        </div>

        {/* Events - Desktop Grid */}
        <div className="hidden md:grid grid-cols-3 gap-4">
          {events.map((event, index) => (
            <div key={index} className="bg-black text-white p-6 rounded-lg">
              <div className="flex items-center mb-3">
                <div className={`w-2 h-2 ${event.color} rounded-full mr-3`}></div>
                <span className="text-sm italic">{event.category}</span>
              </div>
              <h3 className="text-xl font-bold mb-2">{event.title}</h3>
              <p className="text-sm text-gray-300 mb-4">{event.description}</p>
              <button className="text-sm underline">read more</button>
            </div>
          ))}
        </div>

        {/* Events - Mobile Carousel */}
        <div className="md:hidden">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4">
              {events.map((event, index) => (
                <div key={index} className="bg-black text-white p-6 rounded-lg flex-[0_0_85%] min-w-0">
                  <div className="flex items-center mb-3">
                    <div className={`w-2 h-2 ${event.color} rounded-full mr-3`}></div>
                    <span className="text-sm italic">{event.category}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                  <p className="text-sm text-gray-300 mb-4">{event.description}</p>
                  <button className="text-sm underline">read more</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default EventsSection;