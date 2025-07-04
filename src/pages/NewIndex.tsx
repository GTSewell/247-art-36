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
import halftoneYellow from "@/assets/halftone-yellow.jpg";
import halftoneBlue from "@/assets/halftone-blue.jpg";
import halftoneRed from "@/assets/halftone-red.jpg";

const NewIndex = () => {
  const { isPWA } = useAppMode();
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  const backgrounds = [halftoneYellow, halftoneBlue, halftoneRed];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      const bgIndex = Math.floor(scrollPercent * backgrounds.length);
      setCurrentBgIndex(Math.min(bgIndex, backgrounds.length - 1));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const featuredArtworks = [
    {
      id: 1,
      image: "/lovable-uploads/b9d20e81-12cd-4c2e-ade0-6590c3338fa7.png",
      title: "Digital Renaissance",
      year: "2024",
      description: "Where traditional techniques meet digital innovation",
    },
    {
      id: 2,
      image: "/lovable-uploads/2f884c19-75ec-4f8c-a501-ebc90a17c2c6.png",
      title: "Underground Visions",
      year: "2024", 
      description: "Emerging voices from the creative underground",
    },
    {
      id: 3,
      image: "/lovable-uploads/5275fee6-9936-449c-bb71-730600ae1475.png",
      title: "Abstract Futures",
      year: "2024",
      description: "Exploring tomorrow through artistic expression",
    }
  ];

  const galleryImages = [
    "/lovable-uploads/69af7803-27d7-4f04-b312-6169327229b3.png",
    "/lovable-uploads/71405033-4f8a-40d6-b459-a95523ca10f8.png",
    "/lovable-uploads/77d6eca3-c8ee-469f-8975-11645265224b.png",
    "/lovable-uploads/80693eda-1198-40da-8f3e-795e24bb4897.png",
    "/lovable-uploads/96c594a0-80b9-4675-b599-deb4ad4802b8.png",
    "/lovable-uploads/b4d254c3-2988-4d1a-97ad-beb4e333e55c.png"
  ];

  const nextGalleryImage = () => {
    setCurrentGalleryIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevGalleryImage = () => {
    setCurrentGalleryIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  return (
    <>
      <Helmet>
        <meta property="og:image" content="https://247.art/lovable-uploads/c54f87f7-7b02-4bc8-999b-f5a580ad369e.png" />
        <link rel="icon" href="https://247.art/lovable-uploads/15e8cb31-73b1-4d72-9d9b-0dac8bf0baed.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="247.ART" />
        <meta name="twitter:description" content="247.ART - Art Never Sleeps" />
        <meta name="twitter:image" content="https://247.art/lovable-uploads/c54f87f7-7b02-4bc8-999b-f5a580ad369e.png" />
      </Helmet>
      
      {/* Dynamic Halftone Background */}
      <div className="fixed inset-0 -z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentBgIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${backgrounds[currentBgIndex]})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          />
        </AnimatePresence>
        {/* Contrast overlay for text readability */}
        <div className="absolute inset-0 bg-white/80 backdrop-blur-[1px]" />
      </div>

      <main className="min-h-screen relative text-black">
        {isPWA ? <PWANavigation /> : <Navigation />}
        
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="pt-32 pb-32 px-8"
        >
          <div className="max-w-7xl mx-auto">
            <div className="mb-20">
              <h1 className="text-[12rem] md:text-[16rem] font-black tracking-tighter leading-none text-left">
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
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-black text-white p-6 rounded-lg"
              >
                <div className="flex items-center mb-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                  <span className="text-sm italic">Latest Exhibition</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Underground Collective</h3>
                <p className="text-sm text-gray-300">
                  Featuring emerging artists from around the globe...
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-black text-white p-6 rounded-lg"
              >
                <div className="flex items-center mb-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-sm italic">Latest Feature</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Artist Profiles 2.0</h3>
                <p className="text-sm text-gray-300">
                  Enhanced artist dashboard with live preview...
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-black text-white p-6 rounded-lg"
              >
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

        {/* ARTISTS Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="mb-20">
              <h2 className="text-[8rem] md:text-[10rem] font-black tracking-tighter leading-none mb-8">ARTISTS</h2>
              <div className="flex justify-between items-end">
                <p className="text-2xl font-light text-gray-600 max-w-xl">
                  Discover emerging talent and established creators
                </p>
                <Link 
                  to="/artists"
                  className="text-xl border-b-2 border-black hover:border-gray-600 transition-colors"
                >
                  view all
                </Link>
              </div>
            </div>

            <div className="text-center mb-8">
              <button 
                onClick={() => setAudioEnabled(!audioEnabled)}
                className="px-6 py-2 border border-black rounded-full text-sm font-medium hover:bg-black hover:text-white transition-colors"
              >
                {audioEnabled ? 'disable audio' : 'enable audio'}
              </button>
            </div>

            {/* Featured Artists Carousel */}
            <Carousel className="w-full">
              <CarouselContent>
                {featuredArtworks.map((artwork, index) => (
                  <CarouselItem key={artwork.id}>
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="text-center"
                    >
                      <div className="relative mx-auto mb-8" style={{ width: '200px', height: '200px' }}>
                        <img 
                          src={artwork.image}
                          alt={artwork.title}
                          className="w-full h-full object-cover rounded-full"
                        />
                        <div className="absolute inset-0 border-4 border-black rounded-full animate-spin-slow opacity-20"></div>
                      </div>
                      
                      <h3 className="text-4xl font-bold mb-2">{artwork.title}</h3>
                      <p className="text-lg text-gray-600 mb-4">({artwork.year})</p>
                      <p className="text-gray-700 mb-6 max-w-md mx-auto">{artwork.description}</p>
                      
                      <button className="px-8 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors">
                        view profile
                      </button>
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </section>

        {/* GALLERY Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="mb-20">
              <h2 className="text-[8rem] md:text-[10rem] font-black tracking-tighter leading-none mb-8">GALLERY</h2>
              <div className="flex justify-between items-end">
                <p className="text-2xl font-light text-gray-600 max-w-xl">
                  Physical and virtual exhibitions, plus professional printing
                </p>
                <Link 
                  to="/tour"
                  className="text-xl border-b-2 border-black hover:border-gray-600 transition-colors"
                >
                  view all
                </Link>
              </div>
            </div>

            {/* Gallery Viewer */}
            <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ height: '600px' }}>
              <AnimatePresence mode="wait">
                <motion.img 
                  key={currentGalleryIndex}
                  src={galleryImages[currentGalleryIndex]}
                  alt="Gallery artwork"
                  initial={{ opacity: 0, x: 300 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -300 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>

              {/* Navigation Controls */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4">
                <button 
                  onClick={prevGalleryImage}
                  className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
                >
                  prev
                </button>
                <button 
                  onClick={nextGalleryImage}
                  className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
                >
                  next
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* EVENTS Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="mb-20">
              <h2 className="text-[8rem] md:text-[10rem] font-black tracking-tighter leading-none mb-8">EVENTS</h2>
              <div className="flex justify-between items-end">
                <p className="text-2xl font-light text-gray-600 max-w-xl">
                  Workshops, exhibitions, and community gatherings
                </p>
                <Link 
                  to="/store"
                  className="text-xl border-b-2 border-black hover:border-gray-600 transition-colors"
                >
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
          </div>
        </section>

        {/* Join Section */}
        <section className="py-20 bg-black text-white">
          <div className="max-w-4xl mx-auto text-center px-4">
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
      </main>
    </>
  );
};

export default NewIndex;
