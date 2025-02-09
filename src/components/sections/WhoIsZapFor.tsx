
import { motion } from "framer-motion";
import { ArrowRight, Palette, Building2, Wrench } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const WhoIsZapFor = () => {
  return (
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
  );
};

export default WhoIsZapFor;
