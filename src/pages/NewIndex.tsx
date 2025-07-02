import React from "react";
import { Link } from "react-router-dom";
import { useAppMode } from "@/contexts/AppModeContext";
import Navigation from "@/components/navigation/Navigation";
import PWANavigation from "@/components/pwa/PWANavigation";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Palette, Calendar, Store, Eye, PenTool } from "lucide-react";

const NewIndex = () => {
  const { isPWA } = useAppMode();

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
      
      <main className="min-h-screen bg-black text-white">
        {isPWA ? <PWANavigation /> : <Navigation />}
        
        {/* Hero Section */}
        <div className="pt-24 pb-16 text-center">
          <div className="mb-8">
            <span className="text-lg font-light tracking-wider">All things</span>
            <span className="ml-2 inline-flex items-center justify-center w-8 h-8 bg-white rounded-full">
              <span className="text-black font-bold text-sm">⚡</span>
            </span>
            <span className="ml-2 text-lg font-light tracking-wider">247 art</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold mb-8 tracking-tight">
            247.ART
          </h1>
          
          <p className="text-xl md:text-2xl font-light max-w-2xl mx-auto mb-12 px-4">
            The official home for all creative minds.<br />
            Where art never sleeps.
          </p>
          
          <Link to="/artists" className="text-white hover:text-zap-yellow transition-colors underline">
            explore artists
          </Link>
        </div>

        {/* Featured Image */}
        <div className="max-w-6xl mx-auto px-4 mb-16">
          <img 
            src="/lovable-uploads/c54f87f7-7b02-4bc8-999b-f5a580ad369e.png"
            alt="247 Art Gallery"
            className="w-full h-96 object-cover rounded-lg"
          />
        </div>

        {/* Latest Updates */}
        <div className="max-w-6xl mx-auto px-4 mb-16">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-2">Latest Exhibition</h3>
              <h4 className="text-2xl font-bold mb-3">Underground Collective</h4>
              <p className="text-gray-400 mb-4">
                Featuring emerging artists from around the globe in our immersive gallery space...
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Latest Feature</h3>
              <h4 className="text-2xl font-bold mb-3">Artist Profiles 2.0</h4>
              <p className="text-gray-400 mb-4">
                Enhanced artist dashboard with live preview and social integration...
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Latest Story</h3>
              <h4 className="text-2xl font-bold mb-3">Art Never Sleeps</h4>
              <p className="text-gray-400 mb-4">
                The story behind 247.ART and our mission to revolutionize the art world...
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Pillars */}
        <div className="max-w-6xl mx-auto px-4 mb-20">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Artists */}
            <div className="text-center">
              <div className="mb-6">
                <Users className="h-12 w-12 mx-auto mb-4 text-zap-yellow" />
                <h2 className="text-3xl font-bold mb-4">ARTISTS</h2>
                <p className="text-gray-400 mb-6">
                  Discover emerging talent and established creators
                </p>
                <Link 
                  to="/artists"
                  className="text-white hover:text-zap-yellow transition-colors underline"
                >
                  view all
                </Link>
              </div>
            </div>

            {/* Gallery & Print */}
            <div className="text-center">
              <div className="mb-6">
                <Palette className="h-12 w-12 mx-auto mb-4 text-zap-yellow" />
                <h2 className="text-3xl font-bold mb-4">GALLERY</h2>
                <p className="text-gray-400 mb-6">
                  Physical and virtual exhibitions, plus professional printing
                </p>
                <Link 
                  to="/tour"
                  className="text-white hover:text-zap-yellow transition-colors underline"
                >
                  view all
                </Link>
              </div>
            </div>

            {/* Events & Store */}
            <div className="text-center">
              <div className="mb-6">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-zap-yellow" />
                <h2 className="text-3xl font-bold mb-4">EVENTS</h2>
                <p className="text-gray-400 mb-6">
                  Workshops, exhibitions, and community gatherings
                </p>
                <Link 
                  to="/store"
                  className="text-white hover:text-zap-yellow transition-colors underline"
                >
                  view all
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Content */}
        <div className="max-w-6xl mx-auto px-4 mb-20">
          <div className="text-center mb-4">
            <span className="text-sm text-gray-400">enable audio</span>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Featured Artist */}
            <div className="bg-gray-900 rounded-lg p-6 relative overflow-hidden">
              <div className="flex items-center mb-4">
                <div className="relative">
                  <img 
                    src="/lovable-uploads/b9d20e81-12cd-4c2e-ade0-6590c3338fa7.png"
                    alt="Featured Artist"
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 rounded-lg"></div>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-bold">Featured Artist</h3>
                  <p className="text-gray-400 text-sm">(2024)</p>
                </div>
              </div>
              <p className="text-gray-300 mb-4">
                What happens when traditional art meets digital innovation?
              </p>
              <Link 
                to="/artists"
                className="text-zap-yellow hover:text-white transition-colors text-sm"
              >
                view profile
              </Link>
            </div>

            {/* Featured Exhibition */}
            <div className="bg-gray-900 rounded-lg p-6 relative overflow-hidden">
              <div className="flex items-center mb-4">
                <div className="relative">
                  <img 
                    src="/lovable-uploads/2f884c19-75ec-4f8c-a501-ebc90a17c2c6.png"
                    alt="Underground Collection"
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 rounded-lg"></div>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-bold">Underground Collection</h3>
                  <p className="text-gray-400 text-sm">(2024)</p>
                </div>
              </div>
              <p className="text-gray-300 mb-4">
                A curated collection exploring the depths of creative expression.
              </p>
              <Link 
                to="/tour"
                className="text-zap-yellow hover:text-white transition-colors text-sm"
              >
                view exhibition
              </Link>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center py-16 border-t border-gray-800">
          <h2 className="text-3xl font-bold mb-6">Join the Revolution</h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Whether you're an artist, collector, or art enthusiast, 247.ART is where creativity thrives 24/7.
          </p>
          <div className="space-x-4">
            <Button asChild size="lg" className="bg-zap-yellow text-black hover:bg-zap-yellow/90">
              <Link to="/submit">
                Submit Your Art
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black">
              <Link to="/artists">
                Explore Artists
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </>
  );
};

export default NewIndex;