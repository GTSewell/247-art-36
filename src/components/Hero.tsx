import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const Hero = () => {
  const [isClicked, setIsClicked] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
      console.log('PWA installation prompt captured');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstallable(false);
      setIsClicked(true);
      console.log('App is already in standalone mode');
    }

    const isStandalone = (window.navigator as any).standalone;
    if (isStandalone === true || window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstallable(false);
      setIsClicked(true);
      console.log('App is in standalone mode (iOS or Android)');
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    setIsClicked(true);
    if (!deferredPrompt) {
      toast.info("You can install this app by tapping the browser menu and selecting 'Add to Home Screen'", {
        duration: 5000
      });
      return;
    }

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        toast.success("ZAP! has been installed successfully!");
        setDeferredPrompt(null);
        setIsInstallable(false);
      } else {
        toast.info("Installation cancelled");
        setIsClicked(false);
      }
    } catch (error) {
      console.error('Installation error:', error);
      toast.error("There was a problem installing the app");
      setIsClicked(false);
    }
  };

  // Off-white background is now handled by Tailwind (global styles)

  // Remove all content except the bouncing logo
  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-background">
      {/* Bouncing 247art Logo in the center */}
      <div className="flex-1 flex items-center justify-center pt-24 md:pt-28">
        <motion.img
          alt="ZAP!"
          className="h-32 md:h-48 mx-auto animate-float"
          src="/lovable-uploads/10585327-7129-43c2-a90b-0544e7a9a420.png"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
      </div>
      {/* Footer: "Built by artist" logo (footer remains unchanged, shown if present elsewhere) */}
    </div>
  );
};

export default Hero;
