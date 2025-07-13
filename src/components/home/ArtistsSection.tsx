import React from 'react';
import { Link } from 'react-router-dom';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import AutoScrollCarousel from '@/components/ui/auto-scroll-carousel';
interface ArtistsSectionProps {
  featuredArtists: any[];
  additionalArtists: any[];
  isLoading: boolean;
  onArtistClick: (artist: any, index: number) => void;
  onTriggerRef?: (element: HTMLElement | null) => void;
  onContentRef?: (element: HTMLElement | null) => void;
}
const ArtistsSection: React.FC<ArtistsSectionProps> = ({
  featuredArtists,
  additionalArtists,
  isLoading,
  onArtistClick,
  onTriggerRef,
  onContentRef
}) => {
  return <AccordionItem value="artists" className="border-none">
      <AccordionTrigger 
        ref={onTriggerRef}
        className="hover:no-underline px-0 py-0 homepage-accordion-group group flex-col items-start md:flex-row md:items-center md:justify-between w-full"
      >
        <div className="flex flex-col md:flex-row md:items-center w-full md:justify-between">
          <h2 
            className="text-[8rem] sm:text-[12rem] md:text-[16rem] lg:text-[24rem] xl:text-[32rem] font-agharti font-black leading-none uppercase homepage-accordion-title bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] whitespace-nowrap w-full text-left md:w-auto"
            style={{
              '--homepage-bg-image': 'url(/lovable-uploads/8e976936-1c21-424f-86b2-36cfecc6eacd.png)'
            } as React.CSSProperties}
          >ARTISTS</h2>
          <p className="text-xl font-light text-gray-600 ml-0 md:ml-8 font-nove mt-2 md:mt-0 text-left md:text-right">
            DISCOVER AMAZING TALENT, FROM EMERGING TO ESTABLISHED ARTISTS
          </p>
        </div>
      </AccordionTrigger>
      <AccordionContent ref={onContentRef} className="px-0 pb-16">
        <div className="mb-20">
          <div className="flex justify-between items-end">
            <p className="text-2xl font-light text-gray-600 max-w-xl font-sans">
              Explore an ever-evolving roster of visionary artists pushing creative boundaries. From street art pioneers to digital innovators, our platform connects you with the voices shaping tomorrow's art landscape.
            </p>
            <Link to="/artists" className="text-xl border-b-2 border-black hover:border-gray-600 transition-colors">
              view all
            </Link>
          </div>
        </div>

        {/* Auto-scrolling Artist Thumbnails */}
        {!isLoading && (featuredArtists.length > 0 || additionalArtists.length > 0) && <div className="space-y-8 mb-16">
            {/* First row - right direction, offset 0 */}
            <AutoScrollCarousel artists={[...featuredArtists, ...additionalArtists].slice(0, 15)} speed={70} direction="right" startOffset={0} onArtistClick={onArtistClick} />
            
            {/* Second row - left direction, offset 5 */}
            <AutoScrollCarousel artists={[...featuredArtists, ...additionalArtists].slice(0, 15)} speed={60} direction="left" startOffset={5} onArtistClick={onArtistClick} />
            
            {/* Third row - right direction, offset 10 */}
            <AutoScrollCarousel artists={[...featuredArtists, ...additionalArtists].slice(0, 15)} speed={80} direction="right" startOffset={10} onArtistClick={onArtistClick} />
          </div>}
      </AccordionContent>
    </AccordionItem>;
};
export default ArtistsSection;