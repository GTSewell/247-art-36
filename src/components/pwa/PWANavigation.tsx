
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Palette, ShoppingBag, X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { logger } from "@/utils/logger";
import { supabase } from "@/integrations/supabase/client";

const PWANavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navigateTo = (path: string) => {
    logger.info(`Navigating to: ${path}`);
    navigate(path);
    setIsOpen(false);
  };

  return (
    <>
      {/* Top navigation bar - removed bg-white */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/20 bg-transparent w-full">
        <div className="w-full mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex justify-between items-center h-16 w-full">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img 
                src="/lovable-uploads/fd6ed9ef-16de-4047-baa1-b7d7ef1c8200.png" 
                alt="247.ART" 
                className="h-8"
              />
            </Link>

            {/* Profile icon button */}
            <div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="User menu"
                className="rounded-full overflow-hidden"
              >
                {isOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <img 
                    src="/lovable-uploads/54a6a4ac-14da-4fd9-9656-9c2f2366744b.png" 
                    alt="Profile" 
                    className="h-8 w-8"
                  />
                )}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Menu - Simplified for PWA */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-16">
          <div className="container mx-auto px-4 py-6 space-y-4">
            {user ? (
              <>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-lg p-4",
                    isActive("/dashboard/artist") && "bg-primary text-primary-foreground"
                  )}
                  onClick={() => navigateTo("/dashboard/artist")}
                >
                  <img 
                    src="/lovable-uploads/54a6a4ac-14da-4fd9-9656-9c2f2366744b.png" 
                    alt="Artist Profile"
                    className="mr-2 h-5 w-5"
                  />
                  Artist Dashboard
                </Button>

                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-lg p-4",
                    isActive("/dashboard/collector") && "bg-primary text-primary-foreground"
                  )}
                  onClick={() => navigateTo("/dashboard/collector")}
                >
                  <img 
                    src="/lovable-uploads/54a6a4ac-14da-4fd9-9656-9c2f2366744b.png" 
                    alt="Collector Profile"
                    className="mr-2 h-5 w-5"
                  />
                  Collector Dashboard
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-start text-lg p-4 text-red-500"
                  onClick={async () => {
                    await supabase.auth.signOut();
                    navigateTo("/");
                    window.location.reload();
                  }}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <Button
                variant="default"
                className="w-full justify-center text-lg p-4 bg-zap-red hover:bg-zap-blue"
                onClick={() => navigateTo("/auth")}
              >
                Sign In / Sign Up
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Bottom navigation bar for PWA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="grid grid-cols-3 h-16">
          <Button 
            variant="ghost" 
            className={cn(
              "flex flex-col items-center justify-center rounded-none h-full",
              isActive("/") && "text-primary"
            )}
            onClick={() => navigateTo("/")}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs mt-1">Home</span>
          </Button>
          <Button 
            variant="ghost" 
            className={cn(
              "flex flex-col items-center justify-center rounded-none h-full",
              isActive("/artists") && "text-primary"
            )}
            onClick={() => navigateTo("/artists")}
          >
            <Palette className="h-5 w-5" />
            <span className="text-xs mt-1">Artists</span>
          </Button>
          <Button 
            variant="ghost" 
            className={cn(
              "flex flex-col items-center justify-center rounded-none h-full",
              isActive("/store") && "text-primary"
            )}
            onClick={() => navigateTo("/store")}
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="text-xs mt-1">Store</span>
          </Button>
        </div>
      </div>
    </>
  );
};

export default PWANavigation;
