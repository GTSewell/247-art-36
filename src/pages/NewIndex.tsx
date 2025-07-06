import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppMode } from "@/contexts/AppModeContext";
import Navigation from "@/components/navigation/Navigation";
import PWANavigation from "@/components/pwa/PWANavigation";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Palette, Calendar, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { motion, AnimatePresence } from "framer-motion";
import { useArtists } from "@/hooks/use-artists";
import AutoScrollCarousel from "@/components/ui/auto-scroll-carousel";
import ArtistDetailModal from "@/components/artists/ArtistDetailModal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
const NewIndex = () => {
  const {
    isPWA
  } = useAppMode();
  const {
    featuredArtists,
    additionalArtists,
    isLoading
  } = useArtists();
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState<any>(null);
  const [selectedArtistIndex, setSelectedArtistIndex] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [favoriteArtists] = useState<Set<number>>(new Set());
  const featuredArtworks = [{
    id: 1,
    image: "/lovable-uploads/b9d20e81-12cd-4c2e-ade0-6590c3338fa7.png",
    title: "Digital Renaissance",
    year: "2024",
    description: "Where traditional techniques meet digital innovation"
  }, {
    id: 2,
    image: "/lovable-uploads/2f884c19-75ec-4f8c-a501-ebc90a17c2c6.png",
    title: "Underground Visions",
    year: "2024",
    description: "Emerging voices from the creative underground"
  }, {
    id: 3,
    image: "/lovable-uploads/5275fee6-9936-449c-bb71-730600ae1475.png",
    title: "Abstract Futures",
    year: "2024",
    description: "Exploring tomorrow through artistic expression"
  }];
  const galleryImages = ["/lovable-uploads/69af7803-27d7-4f04-b312-6169327229b3.png", "/lovable-uploads/71405033-4f8a-40d6-b459-a95523ca10f8.png", "/lovable-uploads/77d6eca3-c8ee-469f-8975-11645265224b.png", "/lovable-uploads/80693eda-1198-40da-8f3e-795e24bb4897.png", "/lovable-uploads/96c594a0-80b9-4675-b599-deb4ad4802b8.png", "/lovable-uploads/b4d254c3-2988-4d1a-97ad-beb4e333e55c.png"];
  const nextGalleryImage = () => {
    setCurrentGalleryIndex(prev => (prev + 1) % galleryImages.length);
  };
  const prevGalleryImage = () => {
    setCurrentGalleryIndex(prev => (prev - 1 + galleryImages.length) % galleryImages.length);
  };
  const handleArtistClick = (artist: any, index: number) => {
    setSelectedArtist(artist);
    setSelectedArtistIndex(index);
    setDialogOpen(true);
  };
  const handleArtistChange = (index: number) => {
    setSelectedArtistIndex(index);
    setSelectedArtist([...featuredArtists, ...additionalArtists][index]);
  };
  return <>
      <Helmet>
        <meta property="og:image" content="https://247.art/lovable-uploads/c54f87f7-7b02-4bc8-999b-f5a580ad369e.png" />
        <link rel="icon" href="https://247.art/lovable-uploads/15e8cb31-73b1-4d72-9d9b-0dac8bf0baed.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="247.ART" />
        <meta name="twitter:description" content="247.ART - Art Never Sleeps" />
        <meta name="twitter:image" content="https://247.art/lovable-uploads/c54f87f7-7b02-4bc8-999b-f5a580ad369e.png" />
      </Helmet>
      
      {/* Simple White Background */}
      <div className="fixed inset-0 -z-10 bg-white" />

      <main className="min-h-screen relative text-black">
        {isPWA ? <PWANavigation /> : <Navigation />}
        
        {/* Hero Section */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.8
      }} className="pt-20 pb-32">
          <div className="w-full pl-4 md:pl-8 lg:pl-12">
            <div className="mb-20">
              <h1 className="text-[4rem] sm:text-[6rem] md:text-[8rem] lg:text-[12rem] xl:text-[16rem] font-black tracking-tighter leading-none text-left">
                247.ART
              </h1>
              
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
            <div className="grid md:grid-cols-3 gap-4 mb-20">
              <motion.div initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: 0.2
            }} className="bg-black text-white p-6 rounded-lg">
                <div className="flex items-center mb-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                  <span className="text-sm italic">Latest Exhibition</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Underground Collective</h3>
                <p className="text-sm text-gray-300">
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
            }} className="bg-black text-white p-6 rounded-lg">
                <div className="flex items-center mb-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-sm italic">Latest Feature</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Artist Profiles 2.0</h3>
                <p className="text-sm text-gray-300">
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
            }} className="bg-black text-white p-6 rounded-lg">
                <div className="flex items-center mb-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm italic">Latest Story</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Art Never Sleeps</h3>
                <p className="text-sm text-gray-300">
                  The story behind 247.ART and our mission...
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Collapsible Sections */}
        <div className="w-full pl-4 md:pl-8 lg:pl-12 pr-4 md:pr-8 lg:pr-12">
          <Accordion type="multiple" className="w-full">
            
            {/* PRINT Section */}
            <AccordionItem value="print" className="border-none">
              <AccordionTrigger className="hover:no-underline px-0 py-8">
                <h2 className="text-[4rem] sm:text-[6rem] md:text-[8rem] lg:text-[12rem] xl:text-[16rem] font-black tracking-tighter leading-none">PRINT</h2>
              </AccordionTrigger>
              <AccordionContent className="px-0 pb-16">
                <div className="mb-20">
                  <div className="flex justify-between items-end">
                    <p className="text-2xl font-light text-gray-600 max-w-xl">
                      Professional printing services for artists and collectors
                    </p>
                    <Link to="/details" className="text-xl border-b-2 border-black hover:border-gray-600 transition-colors">
                      learn more
                    </Link>
                  </div>
                </div>

                {/* Print Info Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center mb-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      <span className="text-sm italic">premium quality</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Museum Grade Papers</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Archival quality papers that last generations
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center mb-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      <span className="text-sm italic">custom sizes</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Any Dimension</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      From small prints to large format installations
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center mb-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                      <span className="text-sm italic">fast delivery</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Quick Turnaround</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Professional printing with fast, reliable delivery
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* ARTISTS Section */}
            <AccordionItem value="artists" className="border-none">
              <AccordionTrigger className="hover:no-underline px-0 py-8">
                <h2 className="text-[4rem] sm:text-[6rem] md:text-[8rem] lg:text-[12rem] xl:text-[16rem] font-black tracking-tighter leading-none">ARTISTS</h2>
              </AccordionTrigger>
              <AccordionContent className="px-0 pb-16">
                <div className="mb-20">
                  <div className="flex justify-between items-end">
                    <p className="text-2xl font-light text-gray-600 max-w-xl">
                      Discover emerging talent and established creators
                    </p>
                    <Link to="/artists" className="text-xl border-b-2 border-black hover:border-gray-600 transition-colors">
                      view all
                    </Link>
                  </div>
                </div>

                {/* Auto-scrolling Artist Thumbnails */}
                {!isLoading && (featuredArtists.length > 0 || additionalArtists.length > 0) && (
                  <div className="space-y-8 mb-16">
                    {/* First row - right direction, offset 0 */}
                    <AutoScrollCarousel 
                      artists={[...featuredArtists, ...additionalArtists].slice(0, 15)} 
                      speed={70} 
                      direction="right"
                      startOffset={0}
                      onArtistClick={handleArtistClick} 
                    />
                    
                    {/* Second row - left direction, offset 5 */}
                    <AutoScrollCarousel 
                      artists={[...featuredArtists, ...additionalArtists].slice(0, 15)} 
                      speed={60} 
                      direction="left"
                      startOffset={5}
                      onArtistClick={handleArtistClick} 
                    />
                    
                    {/* Third row - right direction, offset 10 */}
                    <AutoScrollCarousel 
                      artists={[...featuredArtists, ...additionalArtists].slice(0, 15)} 
                      speed={80} 
                      direction="right"
                      startOffset={10}
                      onArtistClick={handleArtistClick} 
                    />
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>

            {/* GALLERY Section */}
            <AccordionItem value="gallery" className="border-none">
              <AccordionTrigger className="hover:no-underline px-0 py-8">
                <h2 className="text-[4rem] sm:text-[6rem] md:text-[8rem] lg:text-[12rem] xl:text-[16rem] font-black tracking-tighter leading-none">GALLERY</h2>
              </AccordionTrigger>
              <AccordionContent className="px-0 pb-16">
                <div className="mb-20">
                  <div className="flex justify-between items-end">
                    <p className="text-2xl font-light text-gray-600 max-w-xl">
                      Physical and virtual exhibitions, plus professional printing
                    </p>
                    <Link to="/tour" className="text-xl border-b-2 border-black hover:border-gray-600 transition-colors">
                      view all
                    </Link>
                  </div>
                </div>

                {/* Gallery Viewer */}
                <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{
                height: '600px'
              }}>
                  <AnimatePresence mode="wait">
                    <motion.img key={currentGalleryIndex} src={galleryImages[currentGalleryIndex]} alt="Gallery artwork" initial={{
                    opacity: 0,
                    x: 300
                  }} animate={{
                    opacity: 1,
                    x: 0
                  }} exit={{
                    opacity: 0,
                    x: -300
                  }} transition={{
                    duration: 0.3
                  }} className="w-full h-full object-cover" />
                  </AnimatePresence>

                  {/* Navigation Controls */}
                  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4">
                    <button onClick={prevGalleryImage} className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors">
                      prev
                    </button>
                    <button onClick={nextGalleryImage} className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors">
                      next
                    </button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* EVENTS Section */}
            <AccordionItem value="events" className="border-none">
              <AccordionTrigger className="hover:no-underline px-0 py-8">
                <h2 className="text-[4rem] sm:text-[6rem] md:text-[8rem] lg:text-[12rem] xl:text-[16rem] font-black tracking-tighter leading-none">EVENTS</h2>
              </AccordionTrigger>
              <AccordionContent className="px-0 pb-16">
                <div className="mb-20">
                  <div className="flex justify-between items-end">
                    <p className="text-2xl font-light text-gray-600 max-w-xl">
                      Workshops, exhibitions, and community gatherings
                    </p>
                    <Link to="/store" className="text-xl border-b-2 border-black hover:border-gray-600 transition-colors">
                      view all
                    </Link>
                  </div>
                </div>

                {/* Events Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center mb-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                      <span className="text-sm italic">workshop</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Digital Art Masterclass</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Learn advanced techniques from industry professionals
                    </p>
                    <button className="text-sm underline">read more</button>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center mb-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                      <span className="text-sm italic">exhibition</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Emerging Voices</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Showcasing the next generation of creative talent
                    </p>
                    <button className="text-sm underline">read more</button>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center mb-3">
                      <div className="w-2 h-2 bg-teal-500 rounded-full mr-3"></div>
                      <span className="text-sm italic">community</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Art & Coffee</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Monthly meetups for artists and art lovers
                    </p>
                    <button className="text-sm underline">read more</button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
          </Accordion>
        </div>

        {/* Join Section */}
        <section className="py-20 bg-black text-white">
          <div className="w-full text-center pl-4 md:pl-8 lg:pl-12 pr-4 md:pr-8 lg:pr-12">
            <h2 className="text-6xl font-black mb-8 tracking-tight">
              JOIN THE REVOLUTION
            </h2>
            <p className="text-xl mb-8 font-light italic max-w-2xl mx-auto">
              "Art never sleeps, and neither do we. Join a community where creativity flows 24/7 and every voice matters."
            </p>
            <p className="text-sm text-gray-400 mb-12">247.ART Team</p>
            
            <div className="space-y-4 max-w-md mx-auto">
              <Button asChild size="lg" className="w-full bg-white text-black hover:bg-gray-100">
                <Link to="/submit">
                  Submit Your Art
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full border-white text-white hover:bg-white hover:text-black">
                <Link to="/artists">
                  Explore Artists
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Artist Detail Modal */}
        <ArtistDetailModal artists={[...featuredArtists, ...additionalArtists]} selectedArtist={selectedArtist} selectedArtistIndex={selectedArtistIndex} open={dialogOpen} onOpenChange={setDialogOpen} onArtistChange={handleArtistChange} onFavoriteToggle={() => {}} favoriteArtists={favoriteArtists} refreshArtists={() => {}} onSelect={setSelectedArtist} />
      </main>
    </>;
};
export default NewIndex;