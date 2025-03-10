
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Users, ShoppingBag, X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAppMode } from "@/contexts/AppModeContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const PWANavigation = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isPWA } = useAppMode();

  // Don't render the navigation if not in PWA mode
  if (!isPWA) {
    return null;
  }

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Signed out successfully");
    } catch (error: any) {
      toast.error(`Error signing out: ${error.message}`);
    }
  };

  // Determine active route
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Fixed header with logo and account button - no background or border */}
      <header className="fixed top-0 left-0 right-0 h-16 z-50 flex items-center justify-between px-4">
        <Link to="/" className="flex items-center">
          <img 
            src="/lovable-uploads/fd6ed9ef-16de-4047-baa1-b7d7ef1c8200.png" 
            alt="247art" 
            className="h-8"
          />
        </Link>
        
        <button 
          onClick={() => setIsMenuOpen(true)}
          className="flex items-center justify-center"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src="/lovable-uploads/08710ff8-94bd-4d10-b8eb-aaf1dbc23f07.png" alt="Profile" />
            <AvatarFallback className="bg-gray-200 rounded-full">
              {user?.email ? user.email.charAt(0).toUpperCase() : "?"}
            </AvatarFallback>
          </Avatar>
        </button>
      </header>

      {/* Fixed bottom navigation bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex justify-around items-center h-16">
          <Link to="/" className="flex flex-col items-center justify-center text-gray-500">
            <Home className={cn("h-6 w-6", isActive("/") && "text-[#ea384c]")} />
            <span className={cn("text-xs mt-1", isActive("/") && "text-[#ea384c]")}>Home</span>
          </Link>
          
          <Link to="/artists" className="flex flex-col items-center justify-center text-gray-500">
            <Users className={cn("h-6 w-6", isActive("/artists") && "text-[#0EA5E9]")} />
            <span className={cn("text-xs mt-1", isActive("/artists") && "text-[#0EA5E9]")}>Artists</span>
          </Link>
          
          <Link to="/store" className="flex flex-col items-center justify-center text-gray-500">
            <ShoppingBag className={cn("h-6 w-6", isActive("/store") && "text-[#ea384c]")} />
            <span className={cn("text-xs mt-1", isActive("/store") && "text-[#ea384c]")}>Store</span>
          </Link>
        </div>
      </nav>

      {/* Sliding account menu */}
      <div 
        className={cn(
          "fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300",
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsMenuOpen(false)}
      >
        <div 
          className={cn(
            "absolute top-0 right-0 bottom-0 w-3/4 max-w-xs bg-white transition-transform duration-300 transform",
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-bold">Account</h2>
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="p-4">
            {user ? (
              <>
                <div className="mb-4 p-3 bg-gray-100 rounded-lg">
                  <p className="text-sm font-medium">{user.email}</p>
                </div>
                
                <div className="space-y-2">
                  <Link 
                    to="/dashboard/artist"
                    className="block w-full p-2 text-left rounded hover:bg-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Artist Dashboard
                  </Link>
                  
                  <Link 
                    to="/dashboard/collector"
                    className="block w-full p-2 text-left rounded hover:bg-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Collector Dashboard
                  </Link>
                  
                  <button 
                    onClick={handleSignOut}
                    className="block w-full p-2 text-left text-red-500 rounded hover:bg-red-50"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <Link 
                to="/auth"
                className="block w-full p-2 text-center bg-zap-red text-white rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In / Register
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PWANavigation;
