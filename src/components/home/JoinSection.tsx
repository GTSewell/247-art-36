import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const JoinSection: React.FC = () => {
  return (
    <section className="py-20 bg-black text-white">
      <div className="w-full text-center pl-4 md:pl-8 lg:pl-12 pr-4 md:pr-8 lg:pr-12">
        <h2 className="text-6xl font-londrina font-black mb-8 tracking-tight">
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
  );
};

export default JoinSection;