
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Search, ShoppingBag, User, Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const PWANavigation = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  return (
    <>
      {/* Fixed bottom navigation bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex justify-around items-center h-16">
          <Link to="/" className="flex flex-col items-center justify-center text-gray-500 hover:text-zap-red">
            <Home className="h-6 w-6" />
            <span className="text-xs mt-1">Home</span>
          </Link>
          
          <Link to="/artists" className="flex flex-col items-center justify-center text-gray-500 hover:text-zap-red">
            <Search className="h-6 w-6" />
            <span className="text-xs mt-1">Artists</span>
          </Link>
          
          <Link to="/store" className="flex flex-col items-center justify-center text-gray-500 hover:text-zap-red">
            <ShoppingBag className="h-6 w-6" />
            <span className="text-xs mt-1">Store</span>
          </Link>
          
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="flex flex-col items-center justify-center text-gray-500 hover:text-zap-red"
          >
            <User className="h-6 w-6" />
            <span className="text-xs mt-1">Account</span>
          </button>
        </div>
      </nav>

      {/* Fixed header with logo */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 h-16 z-50">
        <div className="flex items-center justify-center h-full">
          <Link to="/">
            <img 
              src="/lovable-uploads/fd6ed9ef-16de-4047-baa1-b7d7ef1c8200.png" 
              alt="247art" 
              className="h-8"
            />
          </Link>
        </div>
      </header>

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
