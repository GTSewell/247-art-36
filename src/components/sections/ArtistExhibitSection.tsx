import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
const ArtistExhibitSection = () => {
  return <section className="max-w-5xl mx-auto py-10 px-4 md:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Join 420 Artists At 247.ART</h2>
        <p className="text-lg md:text-xl max-w-3xl mx-auto">Exhibit your work in our Melbourne gallery for 3 months, and your digital profile ... FOREVER!</p>
        
        <div className="mt-6 bg-zap-yellow text-black inline-flex items-center px-6 py-3 rounded-lg font-bold text-xl md:text-2xl">
          $299 AUD / $191 USD
        </div>
      </div>
      
      <Card className="border-2 border-zap-yellow mb-12">
        <CardContent className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <span className="bg-zap-yellow text-black w-8 h-8 inline-flex items-center justify-center rounded-full mr-2">1</span>
                Your Art, Printed & Exhibited
              </h3>
              <p className="ml-10">
                We print your work as a stunning 400mm x 500mm ChromaLuxe metal panel — museum-quality, 
                ultra-durable, and gallery-ready.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <span className="bg-zap-yellow text-black w-8 h-8 inline-flex items-center justify-center rounded-full mr-2">2</span>
                Digital Artist Profile & Shop
              </h3>
              <p className="ml-10">Get your own online 247 &quot;Link-in-Bio&quot; profile with a direct sales funnel for prints, merch, stickers, or originals. You keep 100% of the profits!</p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <span className="bg-zap-yellow text-black w-8 h-8 inline-flex items-center justify-center rounded-full mr-2">3</span>
                Retail Placement
              </h3>
              <p className="ml-10">
                Your work is also turned into print, sticker, and merch products, sold in-gallery and online.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <span className="bg-zap-yellow text-black w-8 h-8 inline-flex items-center justify-center rounded-full mr-2">4</span>
                Global Exposure
              </h3>
              <p className="ml-10">
                We're tapping into both Web3/NFT and traditional art audiences, uniting worlds through 
                Twitter, Instagram, gallery events, and collectors.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <span className="bg-zap-yellow text-black w-8 h-8 inline-flex items-center justify-center rounded-full mr-2">5</span>
                Community, Not Competition
              </h3>
              <p className="ml-10">
                You're not just exhibiting — you're joining a movement of 420 creatives working together 
                to shift the culture.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <span className="bg-zap-yellow text-black w-8 h-8 inline-flex items-center justify-center rounded-full mr-2">6</span>
                Collector & Patron Sponsorships
              </h3>
              <p className="ml-10">
                Can't afford it right now? Collectors can sponsor you. We'll help match artists with patrons.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex flex-col md:flex-row justify-center gap-4">
        <Button size="lg" className="px-8 py-6 text-lg bg-zap-yellow text-black hover:bg-yellow-400">
          Apply as an Artist
        </Button>
        <Button size="lg" variant="outline" className="px-8 py-6 text-lg border-2 border-zap-yellow text-black hover:bg-yellow-100">
          Sponsor an Artist
        </Button>
      </div>
    </section>;
};
export default ArtistExhibitSection;