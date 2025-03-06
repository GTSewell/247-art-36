import React from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Services = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">Our Services</h1>
          
          <div className="space-y-12 mt-10">
            {/* Tattoo Services */}
            <section className="bg-card rounded-lg p-6 shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Custom Tattoo Design</h2>
              <p className="mb-4 text-muted-foreground">
                Our talented artists specialize in creating unique tattoo designs tailored to your vision. 
                Whether you're looking for something traditional, modern, abstract, or completely original, 
                our team can bring your ideas to life.
              </p>
              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <div className="bg-accent/20 p-4 rounded-md">
                  <h3 className="font-medium mb-2">Consultation</h3>
                  <p className="text-sm text-muted-foreground">One-on-one meetings to discuss your vision and explore design possibilities.</p>
                </div>
                <div className="bg-accent/20 p-4 rounded-md">
                  <h3 className="font-medium mb-2">Design</h3>
                  <p className="text-sm text-muted-foreground">Custom artwork creation based on your ideas and preferences.</p>
                </div>
                <div className="bg-accent/20 p-4 rounded-md">
                  <h3 className="font-medium mb-2">Execution</h3>
                  <p className="text-sm text-muted-foreground">Expert tattooing with attention to detail, safety, and comfort.</p>
                </div>
              </div>
            </section>

            {/* Other Services */}
            <section className="bg-card rounded-lg p-6 shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Additional Services</h2>
              <div className="space-y-6">
                <div className="border-b border-border pb-4">
                  <h3 className="font-medium mb-2">Tattoo Touch-ups & Revisions</h3>
                  <p className="text-muted-foreground">We offer professional touch-up services to refresh existing tattoos or make minor adjustments to ensure your ink looks its best.</p>
                </div>
                <div className="border-b border-border pb-4">
                  <h3 className="font-medium mb-2">Cover-up Designs</h3>
                  <p className="text-muted-foreground">Our specialists can transform old or unwanted tattoos into beautiful new designs that you'll love.</p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Merchandise & Art Prints</h3>
                  <p className="text-muted-foreground">Explore our collection of custom merchandise and limited-edition art prints created by our resident artists.</p>
                </div>
              </div>
            </section>

            {/* Pricing */}
            <section className="bg-card rounded-lg p-6 shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Pricing</h2>
              <p className="mb-6 text-muted-foreground">
                Our pricing varies based on design complexity, size, placement, and the artist you choose. 
                We believe in transparent pricing and will provide a clear quote after your consultation.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="border border-border rounded-md p-4">
                  <h3 className="font-medium mb-2">Starting Rates</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>Small designs: From $80</li>
                    <li>Medium designs: From $150</li>
                    <li>Large designs: From $300</li>
                    <li>Full sessions: From $500 (6-8 hours)</li>
                  </ul>
                </div>
                <div className="border border-border rounded-md p-4">
                  <h3 className="font-medium mb-2">Special Services</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>Cover-ups: Custom quote required</li>
                    <li>Touch-ups (our work): Complimentary within 3 months</li>
                    <li>Touch-ups (other work): From $100</li>
                    <li>Custom design only (no tattoo): From $60</li>
                  </ul>
                </div>
              </div>
            </section>
          </div>

          <div className="mt-12 text-center">
            <h2 className="text-2xl font-semibold mb-4">Ready to Get Started?</h2>
            <p className="mb-6 text-muted-foreground max-w-2xl mx-auto">
              Book a consultation with one of our talented artists to discuss your ideas and start your tattoo journey.
            </p>
            <Button asChild size="lg" className="mt-2">
              <Link to="/artists">Find Your Artist</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
