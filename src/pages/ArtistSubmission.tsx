
import React from "react";
import Navigation from "@/components/navigation/Navigation";
import { ArtistSubmissionForm } from "@/components/forms/ArtistSubmissionForm";
import { useIsMobile } from "@/hooks/use-mobile";

const ArtistSubmission = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen bg-zap-yellow">
      <Navigation />
      <div className="container mx-auto pt-16 px-4 pb-8">
        <div className="max-w-2xl mx-auto bg-white p-4 md:p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Submit Your Artist Application</h1>
          <p className="text-gray-600 mb-6 md:mb-8 text-sm md:text-base">
            Interested in joining our artist community? Fill out the form below and we'll get back to you soon.
          </p>
          <ArtistSubmissionForm />
        </div>
      </div>
    </div>
  );
};

export default ArtistSubmission;
