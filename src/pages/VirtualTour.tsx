
import React from 'react';
import Navigation from "@/components/navigation/Navigation";
import MatterportViewer from "@/components/MatterportViewer";

const VirtualTour = () => {
  return (
    <div className="min-h-screen bg-zap-blue">
      <Navigation />
      <div className="container mx-auto pt-20 px-4 pb-8">
        <h1 className="text-4xl font-bold text-white mb-8">Virtual Tour</h1>
        <div className="aspect-video w-full bg-white rounded-lg overflow-hidden shadow-xl">
          <MatterportViewer 
            modelId="BNNRoZpfMt6"
            height="600px"
          />
        </div>
        <div className="mt-8 text-white">
          <h2 className="text-2xl font-semibold mb-4">Explore Our Space</h2>
          <p className="mb-4">
            Take a virtual walkthrough of our innovative art space. Navigate through different rooms
            and areas to get a feel for where artists create, collaborate, and showcase their work.
          </p>
          <p>
            Use your mouse to look around, click and drag to move, and scroll to zoom in and out.
            For the best experience, view in fullscreen mode.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VirtualTour;
