
import React from "react";
import Navigation from "@/components/navigation/Navigation";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Printer, ImageIcon, ShoppingBag, Users, Calendar, Sparkles } from "lucide-react";

const Services = () => {
  return (
    <div className="min-h-screen bg-zap-blue">
      <Navigation />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center text-white">Our Services</h1>
          
          <div className="space-y-12 mt-10">
            {/* Printing Services */}
            <section className="bg-card rounded-lg p-6 shadow-md">
              <div className="flex items-center mb-4">
                <Printer className="h-6 w-6 mr-2 text-primary" />
                <h2 className="text-2xl font-semibold">Print Services</h2>
              </div>
              <p className="mb-4 text-muted-foreground">
                We offer a range of high-quality printing services for artists and businesses, 
                from fine art prints to commercial applications.
              </p>
              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <div className="bg-accent/20 p-4 rounded-md">
                  <h3 className="font-medium mb-2">Fine Art Prints</h3>
                  <p className="text-sm text-muted-foreground">Museum-quality reproductions of artwork on premium papers and canvas.</p>
                </div>
                <div className="bg-accent/20 p-4 rounded-md">
                  <h3 className="font-medium mb-2">Large Format Graphics</h3>
                  <p className="text-sm text-muted-foreground">Banners, posters, and large-scale prints for exhibitions and promotions.</p>
                </div>
                <div className="bg-accent/20 p-4 rounded-md">
                  <h3 className="font-medium mb-2">Merchandise Printing</h3>
                  <p className="text-sm text-muted-foreground">Custom printing on apparel, accessories, and promotional items.</p>
                </div>
              </div>
            </section>

            {/* Artist Services */}
            <section className="bg-card rounded-lg p-6 shadow-md">
              <div className="flex items-center mb-4">
                <Users className="h-6 w-6 mr-2 text-primary" />
                <h2 className="text-2xl font-semibold">Artist Management & Support</h2>
              </div>
              <div className="space-y-6">
                <div className="border-b border-border pb-4">
                  <h3 className="font-medium mb-2">Representation & Management</h3>
                  <p className="text-muted-foreground">We provide career development, exhibition opportunities, and promotional services for emerging and established artists.</p>
                </div>
                <div className="border-b border-border pb-4">
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
            <section className="bg-card rounded-lg p-6 shadow-md">
              <div className="flex items-center mb-4">
                <Sparkles className="h-6 w-6 mr-2 text-primary" />
                <h2 className="text-2xl font-semibold">Commercial & Event Services</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="border border-border rounded-md p-4">
                  <div className="flex items-center mb-2">
                    <ImageIcon className="h-5 w-5 mr-2 text-primary" />
                    <h3 className="font-medium">Commercial Art Activations</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Custom art installations and activations for businesses, retail spaces, and commercial properties.
                    Live art demonstrations, interactive exhibitions, and brand collaborations.
                  </p>
                </div>
                <div className="border border-border rounded-md p-4">
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
            <section className="bg-card rounded-lg p-6 shadow-md">
              <div className="flex items-center mb-4">
                <ShoppingBag className="h-6 w-6 mr-2 text-primary" />
                <h2 className="text-2xl font-semibold">Products & Merchandise</h2>
              </div>
              <p className="mb-6 text-muted-foreground">
                We help artists transform their work into high-quality products and merchandise, 
                from limited edition prints to branded apparel and accessories.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-accent/20 p-4 rounded-md">
                  <h3 className="font-medium mb-2">Custom Merchandise</h3>
                  <p className="text-sm text-muted-foreground">
                    Development and production of branded merchandise featuring your artwork. Perfect for artists 
                    looking to diversify their income streams and expand their reach.
                  </p>
                </div>
                <div className="bg-accent/20 p-4 rounded-md">
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
            <p className="mb-6 text-white/80 max-w-2xl mx-auto">
              Contact us to discuss your project needs or to schedule a consultation with our team.
            </p>
            <Button asChild size="lg" className="mt-2">
              <Link to="/artists">Connect With Our Team</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
