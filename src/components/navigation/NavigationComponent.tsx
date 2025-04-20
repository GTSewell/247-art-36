import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { X, UserRound } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useAppMode } from "@/contexts/AppModeContext";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCart } from "@/contexts/CartContext";
import { Badge } from "@/components/ui/badge";
import ThemedLogo from "./ThemedLogo";
const NavigationComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const {
    user,
    isLoading
  } = useAuth();
  const {
    isPWA
  } = useAppMode();
  const isMobile = useIsMobile();
  const {
    itemCount
  } = useCart();
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  // Listen for theme changes
  useEffect(() => {
    const checkTheme = () => {
      setDarkMode(localStorage.getItem("theme") === "dark");
    };

    // Initial check
    checkTheme();

    // Set up an interval to check for theme changes
    const interval = setInterval(checkTheme, 1000);
    return () => clearInterval(interval);
  }, []);

  // Return null if in PWA mode to hide navigation
  if (isPWA) {
    return null;
  }

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Add extra padding class for specific pages on mobile
  const isWhoAreYouPage = location.pathname === "/who-are-you";
  const navExtraClass = isMobile && isWhoAreYouPage ? "h-20" : "h-16";
  return <nav className={`fixed top-0 left-0 right-0 z-50 bg-transparent w-full`}>
      <div className="w-full mx-auto px-4 sm:px-6 md:px-8">
        <div className={`flex justify-between items-center ${navExtraClass} w-full`}>
          {/* Logo with theme awareness */}
          <ThemedLogo darkMode={darkMode} />

          {/* Desktop Navigation */}
          <DesktopNav isActive={isActive} user={user} isLoading={isLoading} />

          {/* Mobile menu button - with cart badge */}
          <div className="md:hidden relative">
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu" className="p-0" /* Removed padding to eliminate the button outline */>
              {isOpen ? <X className="h-6 w-6" /> : <div className="relative">
                  <img alt="Menu" className="h-8 w-8" src="/lovable-uploads/52048c59-1bc7-4152-897e-7af9c8695f63.png" />
                  {itemCount > 0 && <Badge className="absolute -top-2 -right-2 bg-zap-red text-white h-5 w-5 flex items-center justify-center p-0 text-xs">
                      {itemCount}
                    </Badge>}
                </div>}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileNav isOpen={isOpen} isActive={isActive} user={user} isLoading={isLoading} />
    </nav>;
};
export default NavigationComponent;