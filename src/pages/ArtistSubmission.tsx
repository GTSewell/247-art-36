
import React from "react";
import Navigation from "@/components/Navigation";
import { ArtistSubmissionForm } from "@/components/forms/ArtistSubmissionForm";

const ArtistSubmission = () => {
  return (
    <div className="min-h-screen bg-zap-yellow">
      <Navigation />
      <div className="container mx-auto pt-20 px-4">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-6">Submit Your Artist Application</h1>
          <p className="text-gray-600 mb-8">
            Interested in joining our artist community? Fill out the form below and we'll get back to you soon.
          </p>
          <ArtistSubmissionForm />
        </div>
      </div>
    </div>
  );
};

export default ArtistSubmission;
