
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

const benefits = [
  "Receive payments instantly upon sale—no more waiting or chasing invoices.",
  "Automate split payments between artists, galleries, curators, and service providers.",
  "Sell artwork online, in retail spaces, and at live events with seamless integrations.",
  "Use crypto or fiat—choose how you want to get paid.",
  "Get your own custom payment page & wallet.",
  "Enjoy a simple, fun, and enjoyable experience."
];

const WhyUseZap = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-zap-blue to-transparent relative z-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto"
      >
        <h2 className="text-4xl font-bold mb-12 text-center">Why Use ZAP!?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
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
  );
};

export default WhyUseZap;
