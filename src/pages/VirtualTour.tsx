
import React from 'react';
import Navigation from "@/components/Navigation";
import MatterportViewer from "@/components/MatterportViewer";

const VirtualTour = () => {
  return (
    <div className="min-h-screen bg-zap-blue">
      <Navigation />
      <div className="container mx-auto pt-20 px-4">
        <h1 className="text-4xl font-bold text-white mb-8">Virtual Tour</h1>
        <div className="aspect-video w-full">
          <MatterportViewer 
            modelId="YOUR_MATTERPORT_MODEL_ID"
            height="100%"
          />
        </div>
      </div>
    </div>
  );
};

export default VirtualTour;
