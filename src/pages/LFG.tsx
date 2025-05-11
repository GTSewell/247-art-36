
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import Navigation from '@/components/navigation/Navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppMode } from '@/contexts/AppModeContext';
import PWANavigation from '@/components/pwa/PWANavigation';
const LFG = () => {
  const {
    isPWA
  } = useAppMode();
  return <>
      <Helmet>
        <title>247.ART | Artist Sponsorship Program</title>
        <meta name="description" content="Sponsor an artist for the 247.ART exhibition and get exclusive rewards" />
      </Helmet>
      
      <main className="min-h-screen bg-[#f0f0e7] pb-20">
        {isPWA ? <PWANavigation /> : <Navigation />}
        
        <div className="container mx-auto px-4 pt-24 pb-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Sponsor an Artist</h1>
            <p className="text-xl max-w-2xl mx-auto text-gray-700">
              Become part of the 247.ART movement by sponsoring an artist for our exhibition.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <Card className="border-2 border-zap-yellow">
              <CardHeader>
                <CardTitle className="text-2xl">The Patron</CardTitle>
                <CardDescription>Exclusive rewards for your sponsorship</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-zap-yellow p-2 rounded-full flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold">Limited Edition Artist ATLAS Book</h3>
                    <p className="text-gray-700">Featuring all 420 artists in our network</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-zap-yellow p-2 rounded-full flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold">STP Collector Pack</h3>
                    <p className="text-gray-700">Exclusive collector items for your chosen artist</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-zap-yellow p-2 rounded-full flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold">Global Shipping</h3>
                    <p className="text-gray-700">Items shipped directly to your doorstep, wherever you are</p>
                  </div>
                </div>
              </CardContent>
              {/* Removed the CardFooter with Button */}
            </Card>
            
            <Card className="border-2 border-zap-blue">
              <CardHeader>
                <CardTitle className="text-2xl">The Artist</CardTitle>
                <CardDescription>What you get when sponsored</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-zap-blue p-2 rounded-full flex-shrink-0 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 7v10c0 3-2 5-5 5H8c-3 0-5-2-5-5V7c0-3 2-5 5-5h8c3 0 5 2 5 5Z"></path>
                      <path d="M3.59 12.51l4.94-4.95"></path>
                      <path d="M8.53 7.56 7.56 8.53"></path>
                      <path d="M15.47 7.56 16.44 8.53"></path>
                      <path d="M12 2v1"></path>
                      <path d="m18.37 10.65-3.94 3.94"></path>
                      <path d="M14.43 14.59 12 12.15l-2.43 2.44"></path>
                      <path d="M3.59 8.51h4.94"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold">Fine Art Exhibition Print</h3>
                    <p className="text-gray-700">Your work displayed at 247.ART for 3 months</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-zap-blue p-2 rounded-full flex-shrink-0 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polygon points="10 8 16 12 10 16 10 8"></polygon>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold">Digital 247.ART Profile</h3>
                    <p className="text-gray-700">Custom digital presence on our platform</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-zap-blue p-2 rounded-full flex-shrink-0 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"></path>
                      <path d="M7 7h.01"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold">Premium Quality Merchandise</h3>
                    <p className="text-gray-700">Retail prints & merch produced on demand for your collectors</p>
                  </div>
                </div>
              </CardContent>
              {/* Removed the CardFooter with Button */}
            </Card>
          </div>
          
          <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold mb-6 text-center">How It Works</h2>
            
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="bg-zap-yellow flex items-center justify-center w-16 h-16 rounded-full text-2xl font-bold flex-shrink-0">1</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Patrons Curate The Exhibition</h3>
                  <p className="text-gray-700">
                    Collectors and patrons select artists they want to support, directly influencing 
                    which artists are featured in our exhibition. Artists can also sponsor themselves.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="bg-zap-yellow flex items-center justify-center w-16 h-16 rounded-full text-2xl font-bold flex-shrink-0">2</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">We Handle Production</h3>
                  <p className="text-gray-700">
                    Once an artist is sponsored, we take care of producing their exhibition print, 
                    creating their digital profile, and setting up their merchandise store.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="bg-zap-yellow flex items-center justify-center w-16 h-16 rounded-full text-2xl font-bold flex-shrink-0">3</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Everyone Benefits</h3>
                  <p className="text-gray-700">
                    Patrons receive exclusive collectibles, artists gain exposure and sales channels, 
                    and the 247.ART community grows with high-quality curated artwork.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-16">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-700">
              Join the 247.ART movement and help shape the future of our exhibition.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="px-8">Sponsor an Artist</Button>
              <Button size="lg" variant="outline" className="px-8">Apply as an Artist</Button>
            </div>
          </div>
        </div>
      </main>
    </>;
};
export default LFG;
