
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Menu, Palette, ShoppingBag, User, X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

const PWANavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navigateTo = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <>
      {/* Top navigation bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/20 bg-white w-full">
        <div className="w-full mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex justify-between items-center h-16 w-full">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img 
                src="/lovable-uploads/0a46328d-bced-45e2-8877-d5c6914ff44c.png" 
                alt="247.ART" 
                className="h-8"
              />
            </Link>

            {/* Mobile menu button */}
            <div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
              >
                {isOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-16">
          <div className="container mx-auto px-4 py-6 space-y-4">
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-lg p-4",
                isActive("/") && "bg-primary text-primary-foreground"
              )}
              onClick={() => navigateTo("/")}
            >
              <Home className="mr-2 h-5 w-5" />
              Home
            </Button>
            
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-lg p-4",
                isActive("/artists") && "bg-primary text-primary-foreground"
              )}
              onClick={() => navigateTo("/artists")}
            >
              <Palette className="mr-2 h-5 w-5" />
              Artists
            </Button>
            
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-lg p-4",
                isActive("/store") && "bg-primary text-primary-foreground"
              )}
              onClick={() => navigateTo("/store")}
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              Store
            </Button>

            {user && (
              <>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-lg p-4",
                    isActive("/dashboard/artist") && "bg-primary text-primary-foreground"
                  )}
                  onClick={() => navigateTo("/dashboard/artist")}
                >
                  <User className="mr-2 h-5 w-5" />
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
                  <User className="mr-2 h-5 w-5" />
                  Collector Dashboard
                </Button>
              </>
            )}

            {!user && !isLoading && (
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
            className="flex flex-col items-center justify-center rounded-none h-full"
            onClick={() => navigateTo("/")}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs mt-1">Home</span>
          </Button>
          <Button 
            variant="ghost" 
            className="flex flex-col items-center justify-center rounded-none h-full"
            onClick={() => navigateTo("/artists")}
          >
            <Palette className="h-5 w-5" />
            <span className="text-xs mt-1">Artists</span>
          </Button>
          <Button 
            variant="ghost" 
            className="flex flex-col items-center justify-center rounded-none h-full"
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
