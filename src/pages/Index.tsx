
import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import WhatIsZap from "@/components/sections/WhatIsZap";
import VirtualTourSection from "@/components/sections/VirtualTourSection";
import WhoIsZapFor from "@/components/sections/WhoIsZapFor";
import CallToAction from "@/components/sections/CallToAction";
import PasswordGate from "@/components/PasswordGate";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if previously authenticated
  useEffect(() => {
    const authenticated = localStorage.getItem("zap-authenticated");
    if (authenticated === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleAuthentication = () => {
    localStorage.setItem("zap-authenticated", "true");
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <PasswordGate onAuthenticated={handleAuthentication} />;
  }

  return (
    <div className="min-h-screen relative">
      <Navigation />
      <Hero />
      <WhatIsZap />
      <VirtualTourSection />
      <WhoIsZapFor />
      <CallToAction />
    </div>
  );
};

export default Index;
