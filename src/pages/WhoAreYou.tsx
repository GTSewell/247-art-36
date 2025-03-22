
import React, { useState } from "react";
import Navigation from "@/components/navigation/Navigation";
import FeaturedGalleries from "@/components/galleries/FeaturedGalleries";
import { useGalleries } from "@/hooks/use-galleries";
import { Gallery } from "@/data/types/gallery";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Printer, ImageIcon, ShoppingBag, Users, Calendar, Sparkles } from "lucide-react";
import MatterportViewer from "@/components/MatterportViewer";

const WhoAreYou = () => {
  const {
    data: galleries = [],
    isLoading
  } = useGalleries();
  const [favoriteGalleries, setFavoriteGalleries] = useState<Set<number>>(new Set());
  const [isJaneActive, setIsJaneActive] = useState(false);
  const [isGTActive, setIsGTActive] = useState(false);
  const {
    toast
  } = useToast();
  const isMobile = useIsMobile();

  const handleGallerySelect = (gallery: Gallery) => {
    toast({
      title: "Coming Soon",
      description: "Gallery details view will be implemented soon!"
    });
  };

  const handleFavoriteToggle = (galleryId: number, isFavorite: boolean) => {
    setFavoriteGalleries(prev => {
      const newFavorites = new Set(prev);
      if (isFavorite) {
        newFavorites.add(galleryId);
        toast({
          title: "Added to Favorites",
          description: "Gallery has been added to your favorites."
        });
      } else {
        newFavorites.delete(galleryId);
        toast({
          title: "Removed from Favorites",
          description: "Gallery has been removed from your favorites."
        });
      }
      return newFavorites;
    });
  };

  if (isLoading) {
    return <div className="min-h-screen bg-zap-blue">
        <Navigation />
        <div className="container mx-auto pt-20 px-4">
          <p className="text-lg">Loading galleries...</p>
        </div>
      </div>;
  }

  return <div className="min-h-screen bg-zap-blue pb-[50px] relative">
      <Navigation />
      <div className={`pt-16 ${isMobile ? 'pt-20' : 'pt-16'} relative`}>
        <img src="https://iqmskopbhrzqqqjewdzv.supabase.co/storage/v1/object/public/patterns/247-art-Jane%26GT-Halftone-white-soft%20edge-short.png" alt="Jane & GT Halftone" className="w-full h-auto" onError={(e) => e.currentTarget.src = '/placeholder.svg'} />
        {isJaneActive && <img src="https://iqmskopbhrzqqqjewdzv.supabase.co/storage/v1/object/public/patterns/janesolo-hover-5.png" alt="Jane Solo Hover" className="absolute top-[55px] -left-[3px] w-full h-auto opacity-100 transition-opacity duration-300" onError={(e) => e.currentTarget.src = '/placeholder.svg'} />}
        {isGTActive && <img src="https://iqmskopbhrzqqqjewdzv.supabase.co/storage/v1/object/public/patterns/gtsolo-hover-2.png?v=2" alt="GT Solo Hover" className="absolute top-[62px] -left-[1px] w-full h-auto opacity-100 transition-opacity duration-300" onError={(e) => e.currentTarget.src = '/placeholder.svg'} />}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="relative w-full h-full max-w-[1920px] mx-auto">
            <a href="https://www.instagram.com/gtsewell/" target="_blank" rel="noopener noreferrer" className="block absolute transition-all duration-300" style={{
            width: isMobile ? '9rem' : '18rem',
            height: isMobile ? '9rem' : '18rem',
            left: isMobile ? '50px' : '20%',
            top: isMobile ? '3.5rem' : '50px'  /* Increased top position for mobile */
          }} onMouseEnter={() => setIsGTActive(true)} onMouseLeave={() => setIsGTActive(false)}>
              <img src={isGTActive ? "https://iqmskopbhrzqqqjewdzv.supabase.co/storage/v1/object/public/patterns/thatsgt-hover.png" : "https://iqmskopbhrzqqqjewdzv.supabase.co/storage/v1/object/public/patterns/thatsGT.png"} alt="That's GT" className="w-full h-full" onError={(e) => e.currentTarget.src = '/placeholder.svg'} />
            </a>
            <a href="https://www.instagram.com/jlartsphere/" target="_blank" rel="noopener noreferrer" className="block absolute transition-all duration-300" style={{
            width: isMobile ? '6rem' : '12rem',
            height: isMobile ? '6rem' : '12rem',
            right: isMobile ? '35px' : '20%',
            top: isMobile ? '2.5rem' : '50px'  /* Increased top position for mobile */
          }} onMouseEnter={() => setIsJaneActive(true)} onMouseLeave={() => setIsJaneActive(false)}>
              <img src={isJaneActive ? "https://iqmskopbhrzqqqjewdzv.supabase.co/storage/v1/object/public/patterns/thatsJane-hover.png" : "https://iqmskopbhrzqqqjewdzv.supabase.co/storage/v1/object/public/patterns/thatsJane-1.png"} alt="That's Jane" className="w-full h-full" onError={(e) => e.currentTarget.src = '/placeholder.svg'} />
            </a>
          </div>
        </div>
      </div>

      <div>
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5
      }} className="container mx-auto px-4 pt-8 relative z-10">
          <h1 className="text-center mb-8 text-gray-50 text-7xl my-[25px] font-extrabold">Who the f#@k are we?</h1>
          
          <div className="max-w-4xl mx-auto space-y-4 text-lg">
            <p className="text-black text-xl font-bold">
              We are Jane Rolls & GT Sewell, we are artists, we are creatives, but let's be real, we're better at supporting other artists than being artists ourselves. Facts!
            </p>
            <p className="text-black text-xl font-bold">
              We've been long-time advocates for Melbourne & Australia's vibrant arts community. You may have met us galivanting around artist studios, like{' '}
              <a href="https://www.instagram.com/everfreshstudio/" target="_blank" rel="noopener noreferrer" className="text-black bg-zap-yellow/50 px-1 rounded hover:underline">
                Everfresh
              </a>
              {', '}
              <a href="https://www.instagram.com/theartshole/" target="_blank" rel="noopener noreferrer" className="text-black bg-zap-yellow/50 px-1 rounded hover:underline">
                The Artshole
              </a>
              {' '}or{' '}
              <a href="https://www.instagram.com/blenderstudios/" target="_blank" rel="noopener noreferrer" className="text-black bg-zap-yellow/50 px-1 rounded hover:underline">
                Blender
              </a>
              , or even at a kick-ass exhibition at the likes of{' '}
              <a href="https://www.instagram.com/backwoods.gallery/" target="_blank" rel="noopener noreferrer" className="text-black bg-zap-yellow/50 px-1 rounded hover:underline">
                Backwoods
              </a>
              {' '}or{' '}
              <a href="https://www.instagram.com/bside.gallery/" target="_blank" rel="noopener noreferrer" className="text-black bg-zap-yellow/50 px-1 rounded hover:underline">
                B-side
              </a>
              , or maybe you're along the lines of "Who TF are you!?" ... well,
            </p>
            <p className="text-black text-xl font-bold">Over the past decade, we've proudly dedicated ourselves to supporting artists and their creative journeys through our work at galleries and studios we've built such as Lanes End, VS. Gallery (with the inimitable Ben Frost & Nixi Killick), Milkbar, and most recently, OSHI our current location, and, future home of 247, on the always vibing Smith St, Collingwood.</p>
            <p className="text-black text-xl font-bold">
              Each of these spaces has been a labor of love, designed to foster connections between artists, collectors, and the wider community.
            </p>
            <p className="text-black text-xl font-bold">
              In addition to our gallery work, our artist printing services have been a cornerstone of our efforts to empower artists. By providing high-quality printing in fine art (Giclée), apparel, merchandise, and more, we've helped countless artists generate passive income and expand their creative practices into new avenues.
            </p>
            <p className="text-black text-xl font-bold">
              We've also helped build amazing creative activations around Australia, including{' '}
              <a href="https://www.instagram.com/sandrewmelbs/" target="_blank" rel="noopener noreferrer" className="text-black bg-zap-yellow/50 px-1 rounded hover:underline">
                Sandrew's
              </a>
              {' '}epic street art exhibition{' '}
              <a href="https://www.instagram.com/theoutsidersmelbourne/" target="_blank" rel="noopener noreferrer" className="text-black bg-zap-yellow/50 px-1 rounded hover:underline">
                'The Outsiders Melbourne'
              </a>
              {' '}(A MUST SEE!), to Shepard Fairey's (OBEY){' '}
              <a href="https://lifewithoutandy.com/featured/party-bullshit/obey-printed-matters-shepard-fairey-ambush-pop-up-gallery-sydney/" target="_blank" rel="noopener noreferrer" className="text-black bg-zap-yellow/50 px-1 rounded hover:underline">
                Printed Matters
              </a>
              {' '}Gallery in Sydney.
            </p>
            <p className="text-black text-xl font-bold mx-0">With the relaunch of our new space, we're excited to continue our mission in fresh and innovative ways merging, Art, Technology & Culture whilst adhering to our life motto, 'CultureB4Capital'. We're serious about art and we're serious about having fun along the way.

                                                    Let's make cool shit happen! 💙</p>
          </div>

          {/* Services content moved from Services.tsx */}
          <div className="mt-16 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-white">Our Services</h2>
            
            <div className="space-y-12 max-w-4xl mx-auto">
              {/* Print Services */}
              <section className="bg-white rounded-lg p-8 shadow-md">
                <div className="flex items-center mb-6">
                  <Printer className="h-7 w-7 mr-3 text-primary" />
                  <h2 className="text-2xl font-semibold">Print Services</h2>
                </div>
                
                <p className="mb-6 text-muted-foreground">
                  We offer a range of high-quality printing services for artists and businesses, from fine art prints to commercial applications.
                </p>
                
                <div className="grid md:grid-cols-3 gap-6 mt-8">
                  <div>
                    <h3 className="font-medium mb-2">Fine Art Prints</h3>
                    <p className="text-muted-foreground">Museum-quality reproductions of artwork on premium papers and canvas.</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Large Format Graphics</h3>
                    <p className="text-muted-foreground">Banners, posters, and large-scale prints for exhibitions and promotions.</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Merchandise Printing</h3>
                    <p className="text-muted-foreground">Custom printing on apparel, accessories, and promotional items.</p>
                  </div>
                </div>
              </section>

              {/* Virtual Tour Section */}
              <section className="bg-white rounded-lg p-8 shadow-md">
                <div className="flex items-center mb-6">
                  <ImageIcon className="h-7 w-7 mr-3 text-primary" />
                  <h2 className="text-2xl font-semibold">Virtual Tour</h2>
                </div>
                
                <div className="bg-zap-yellow text-black p-4 rounded-lg mb-6">
                  <p className="font-semibold">
                    This is an older 3D scan of our gallery space. We will be making BIG changes to take it to the next level in preparation for the new home of 247⚡ART!
                  </p>
                </div>
                
                <div className="aspect-video w-full bg-white rounded-lg overflow-hidden mb-6">
                  <MatterportViewer 
                    modelId="BNNRoZpfMt6"
                    height="500px"
                  />
                </div>
                
                <div className="mt-4">
                  <h3 className="font-medium mb-2">The Virtual Exhibition</h3>
                  <p className="text-muted-foreground mb-4">
                    Once the exhibition is in installed we will recreate a new 3D lidar scan of the gallery which will allow international viewers to explore the space and select your artwork to view and purchase directly within the virtual experience.
                  </p>
                  
                  <h3 className="font-medium mb-2">Explore Our Space</h3>
                  <p className="text-muted-foreground mb-4">
                    Take a virtual walkthrough of our innovative art space. Navigate through different rooms
                    and areas to get a feel for where artists create, collaborate, and showcase their work.
                  </p>
                  <p className="text-muted-foreground">
                    Use your mouse to look around, click and drag to move, and scroll to zoom in and out.
                    For the best experience, view in fullscreen mode.
                  </p>
                </div>
              </section>

              {/* Artist Services */}
              <section className="bg-white rounded-lg p-8 shadow-md">
                <div className="flex items-center mb-6">
                  <Users className="h-7 w-7 mr-3 text-primary" />
                  <h2 className="text-2xl font-semibold">Artist Management & Support</h2>
                </div>
                
                <div className="space-y-8">
                  <div className="border-b border-gray-100 pb-4">
                    <h3 className="font-medium mb-2">Representation & Management</h3>
                    <p className="text-muted-foreground">We provide career development, exhibition opportunities, and promotional services for emerging and established artists.</p>
                  </div>
                  <div className="border-b border-gray-100 pb-4">
                    <h3 className="font-medium mb-2">Portfolio Development</h3>
                    <p className="text-muted-foreground">Professional photography, digital archiving, and presentation materials to showcase your work effectively.</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Sales & Distribution</h3>
                    <p className="text-muted-foreground">Online and physical gallery representation, art fair participation, and connection to our collector network.</p>
                  </div>
                </div>
              </section>

              {/* Commercial & Event Services */}
              <section className="bg-white rounded-lg p-8 shadow-md">
                <div className="flex items-center mb-6">
                  <Sparkles className="h-7 w-7 mr-3 text-primary" />
                  <h2 className="text-2xl font-semibold">Commercial & Event Services</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="border border-gray-100 rounded-md p-5">
                    <div className="flex items-center mb-2">
                      <ImageIcon className="h-5 w-5 mr-2 text-primary" />
                      <h3 className="font-medium">Commercial Art Activations</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Custom art installations and activations for businesses, retail spaces, and commercial properties.
                      Live art demonstrations, interactive exhibitions, and brand collaborations.
                    </p>
                  </div>
                  <div className="border border-gray-100 rounded-md p-5">
                    <div className="flex items-center mb-2">
                      <Calendar className="h-5 w-5 mr-2 text-primary" />
                      <h3 className="font-medium">Private Events</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Curated art experiences for private parties, corporate functions, and special occasions.
                      Artist talks, workshops, and custom event programming tailored to your audience.
                    </p>
                  </div>
                </div>
              </section>

              {/* Product & Merchandise */}
              <section className="bg-white rounded-lg p-8 shadow-md">
                <div className="flex items-center mb-6">
                  <ShoppingBag className="h-7 w-7 mr-3 text-primary" />
                  <h2 className="text-2xl font-semibold">Products & Merchandise</h2>
                </div>
                <p className="mb-6 text-muted-foreground">
                  We help artists transform their work into high-quality products and merchandise, 
                  from limited edition prints to branded apparel and accessories.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-5 rounded-md">
                    <h3 className="font-medium mb-2">Custom Merchandise</h3>
                    <p className="text-sm text-muted-foreground">
                      Development and production of branded merchandise featuring your artwork. Perfect for artists 
                      looking to diversify their income streams and expand their reach.
                    </p>
                  </div>
                  <div className="bg-gray-50 p-5 rounded-md">
                    <h3 className="font-medium mb-2">Limited Edition Collections</h3>
                    <p className="text-sm text-muted-foreground">
                      Creation of exclusive, limited-run products and art objects that increase value and 
                      collector interest in your work.
                    </p>
                  </div>
                </div>
              </section>
            </div>

            <div className="mt-12 text-center">
              <h2 className="text-2xl font-semibold mb-4 text-white">Ready to Work With Us?</h2>
              <p className="mb-6 text-white opacity-90 max-w-2xl mx-auto">
                Contact us to discuss your project needs or to schedule a consultation with our team.
              </p>
              <Button asChild size="lg" className="mt-2">
                <Link to="/artists">Connect With Our Team</Link>
              </Button>
            </div>
          </div>

          <div className="mt-12">
            <FeaturedGalleries galleries={galleries} onSelect={handleGallerySelect} onFavoriteToggle={handleFavoriteToggle} favoriteGalleries={favoriteGalleries} />
          </div>
        </motion.div>
      </div>

      {/* Bottom banner image with 0.5 opacity */}
      <div className="absolute bottom-0 left-0 w-full">
        <img src="/lovable-uploads/ddc18b16-629a-42e8-a97e-af21acb3e67a.png" alt="Bottom Banner" className="w-full opacity-50" onError={(e) => e.currentTarget.src = '/placeholder.svg'} />
      </div>
    </div>;
};

export default WhoAreYou;
