
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { X, UserRound } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useAppMode } from "@/contexts/AppModeContext";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, isLoading } = useAuth();
  const { isPWA } = useAppMode();

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

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/20 bg-transparent w-full">
      <div className="w-full mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center h-16 w-full">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/fd6ed9ef-16de-4047-baa1-b7d7ef1c8200.png" 
              alt="247art" 
              className="h-8"
            />
          </Link>

          {/* Desktop Navigation */}
          <DesktopNav isActive={isActive} user={user} isLoading={isLoading} />

          {/* Mobile menu button - replaced hamburger with profile icon */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              className="p-0" /* Removed padding to eliminate the button outline */
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <img 
                  src="/lovable-uploads/4fe6bfa5-5bff-4a18-853b-305aa52002c5.png" 
                  alt="Menu" 
                  className="h-8 w-8" 
                />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileNav isOpen={isOpen} isActive={isActive} user={user} isLoading={isLoading} />
    </nav>
  );
};

export default Navigation;
