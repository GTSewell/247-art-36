
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";

const Hero = () => {
  const [isClicked, setIsClicked] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      // Update UI to notify the user they can install the PWA
      setIsInstallable(true);
      console.log('PWA installation prompt captured');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstallable(false);
      setIsClicked(true);
      console.log('App is already in standalone mode');
    }

    // For Android, also check if it's installed through the app mode
    if (navigator.standalone || window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstallable(false);
      setIsClicked(true);
      console.log('App is in standalone mode (iOS or Android)');
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const scrollToWhatIsZap = () => {
    const whatIsZapSection = document.getElementById('247-details');
    if (whatIsZapSection) {
      whatIsZapSection.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };

  const handleInstallClick = async () => {
    setIsClicked(true);
    
    if (!deferredPrompt) {
      // If not installable via prompt, provide instructions for manual installation
      toast.info("You can install this app by tapping the browser menu and selecting 'Add to Home Screen'", {
        duration: 5000
      });
      return;
    }

    // Show the install prompt
    try {
      // @ts-ignore - deferredPrompt is a non-standard API
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      // @ts-ignore - deferredPrompt is a non-standard API
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        toast.success("ZAP! has been installed successfully!");
        setDeferredPrompt(null);
        setIsInstallable(false);
      } else {
        toast.info("Installation cancelled");
        // Allow the user to try again
        setIsClicked(false);
      }
    } catch (error) {
      console.error('Installation error:', error);
      toast.error("There was a problem installing the app");
      setIsClicked(false);
    }
  };

  return <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-zap-yellow">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
        backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)',
        backgroundSize: '40px 40px'
      }} />
      </div>

      {/* Halftone Background Image */}
      <div className="absolute inset-0">
        <img src="/lovable-uploads/e16074dd-11b0-4f2e-bcc8-06b5fa6c282a.png" alt="Halftone Pattern" className="w-full h-full object-cover" />
      </div>

      <div className="container mx-auto px-4 py-32 relative z-10">
        <div className="text-center">
          <motion.div initial={{
          scale: 0.5,
          opacity: 0
        }} animate={{
          scale: 1,
          opacity: 1
        }} transition={{
          duration: 0.5
        }} className="inline-block">
            <img src="/lovable-uploads/59a6f684-31db-4ac2-a157-a94968384f00.png" alt="ZAP!" className="h-32 md:h-48 mx-auto animate-float" />
          </motion.div>
          
          <motion.div initial={{
          y: 20,
          opacity: 0
        }} animate={{
          y: 0,
          opacity: 1
        }} transition={{
          delay: 0.3,
          duration: 0.5
        }} className="mt-6 text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto font-bold">
            <p className="mb-6">It's time for a revolution in the art world!</p>
            <p className="font-extrabold">YOU CREATE. WE CREATE.</p>
            <p className="font-extrabold">TOGETHER WE KICK ASS!</p>
          </motion.div>
          
          <motion.div initial={{
          y: 20,
          opacity: 0
        }} animate={{
          y: 0,
          opacity: 1
        }} transition={{
          delay: 0.6,
          duration: 0.5
        }} className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handleInstallClick} 
              className={`${isClicked && !isInstallable ? 'bg-zap-blue' : 'bg-[#ea384c]'} text-white px-8 py-3 rounded-full font-bold hover:bg-opacity-90 transition-all duration-200 transform hover:scale-105`}
              disabled={isClicked && !isInstallable}
            >
              {isClicked && !isInstallable ? 'Installed' : isInstallable ? 'Install App' : 'Get the app'}
            </button>
            <button onClick={scrollToWhatIsZap} className="border-2 border-[#ea384c] text-[#ea384c] px-8 py-3 rounded-full font-bold hover:bg-[#ea384c] hover:text-white transition-all duration-200">
              Learn More
            </button>
          </motion.div>
        </div>
      </div>
    </div>;
};

export default Hero;
