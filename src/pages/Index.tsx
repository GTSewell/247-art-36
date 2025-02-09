import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Palette, Building2, Wrench, Globe, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen relative">
      <Navigation />
      <Hero />
      
      {/* What is ZAP Section */}
      <section className="py-20 px-4 bg-zap-blue relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto"
        >
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <h2 className="text-4xl font-bold mb-6">What is ZAP!?</h2>
              <p className="text-lg mb-4">
                ZAP! is the <span className="font-bold">next-generation payments platform</span> built for <span className="font-bold">artists, galleries, and creative businesses</span>. We make payments <span className="font-bold">instant, automated, and transparent</span>, removing the delays, friction, and invoicing headaches that creatives face every day.
              </p>
              <p className="text-lg mb-4">
                Powered by <span className="font-bold">smart contracts and Web3 technology</span>, ZAP! ensures that everyone involved in a sale—whether it's an artist, curator, gallery, or service provider—<span className="font-bold">gets paid instantly, automatically, and fairly.</span>
              </p>
              <p className="text-lg">
                ZAP! is designed to be fun, easy-to-use, and completely artist-first, that makes handling finances as exciting as making art.
              </p>
            </div>
            <div className="flex-1">
              <img
                src="/lovable-uploads/9884fa85-9b3c-4add-9873-d6f92fc2d673.png"
                alt="ZAP Platform"
                className="animate-float"
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Why Use ZAP Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-zap-blue to-transparent relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto"
        >
          <h2 className="text-4xl font-bold mb-12 text-center">Why Use ZAP!?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "Receive payments instantly upon sale—no more waiting or chasing invoices.",
              "Automate split payments between artists, galleries, curators, and service providers.",
              "Sell artwork online, in retail spaces, and at live events with seamless integrations.",
              "Use crypto or fiat—choose how you want to get paid.",
              "Get your own custom payment page & wallet.",
              "Enjoy a simple, fun, and gamified experience."
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-zap-yellow rounded-full flex items-center justify-center mb-4">
                      <Zap className="w-6 h-6 text-black" />
                    </div>
                    <CardTitle className="text-lg">{benefit}</CardTitle>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Who is ZAP for Section */}
      <section className="py-20 px-4 relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto relative z-20"
        >
          <h2 className="text-4xl font-bold mb-12 text-center">Who is ZAP! for?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-zap-blue rounded-full flex items-center justify-center mb-4">
                  <Palette className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Artists</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-5 h-5 mt-1 flex-shrink-0 text-zap-blue" />
                    <span>Get paid instantly upon sale</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-5 h-5 mt-1 flex-shrink-0 text-zap-blue" />
                    <span>Set fixed payments or revenue splits</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-5 h-5 mt-1 flex-shrink-0 text-zap-blue" />
                    <span>Sell physical & digital art seamlessly</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-zap-red rounded-full flex items-center justify-center mb-4">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Galleries & Collectors</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-5 h-5 mt-1 flex-shrink-0 text-zap-red" />
                    <span>Automate artist payouts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-5 h-5 mt-1 flex-shrink-0 text-zap-red" />
                    <span>Integrate with major POS systems</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-5 h-5 mt-1 flex-shrink-0 text-zap-red" />
                    <span>Track real-time revenue splits</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-zap-yellow rounded-full flex items-center justify-center mb-4">
                  <Wrench className="w-6 h-6 text-black" />
                </div>
                <CardTitle>Service Providers</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-5 h-5 mt-1 flex-shrink-0 text-zap-yellow" />
                    <span>Get paid automatically</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-5 h-5 mt-1 flex-shrink-0 text-zap-yellow" />
                    <span>Set minimum guaranteed payouts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-5 h-5 mt-1 flex-shrink-0 text-zap-yellow" />
                    <span>Scale with built-in tools</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 px-4 relative overflow-visible min-h-[600px]">
        <div 
          className="absolute inset-0 bg-contain bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/lovable-uploads/3dbe32ba-b0c5-44b3-a7cc-47faea6b5572.png')",
            opacity: 1,
            zIndex: -1,
          }}
        />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto text-center relative"
        >
          <h2 className="text-4xl font-bold mb-6">Join the ZAP! Revolution</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Tired of chasing payments? Want to <span className="font-bold">get paid instantly</span> and <span className="font-bold">focus on your creativity</span>? ZAP! is built <span className="font-bold">for creators, by creators</span> to make financial transactions <span className="font-bold">fast, fair, and fun.</span>
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-zap-blue text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-opacity-90 transition-colors"
          >
            Get Started with ZAP! <img src="/lovable-uploads/eb2c14e8-c113-4c23-ad33-76d46f95badd.png" alt="ZAP!" className="inline-block w-6 h-6 ml-2 drop-shadow-md" />
          </motion.button>
        </motion.div>
      </section>
    </div>
  );
};

export default Index;
