
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Menu, X, User, LogIn, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const {
    user,
    isLoading
  } = useAuth();
  const navigate = useNavigate();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    try {
      const {
        error
      } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Signed out successfully");
      navigate("/");
    } catch (error: any) {
      toast.error(`Error signing out: ${error.message}`);
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/20 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-foreground">247art</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/artists" className={cn("px-3 py-2 rounded-md text-sm font-medium transition-colors", isActive("/artists") ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-accent hover:text-accent-foreground")}>
              Artists
            </Link>
            <Link to="/who-are-you" className={cn("px-3 py-2 rounded-md text-sm font-medium transition-colors", isActive("/who-are-you") ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-accent hover:text-accent-foreground")}>
              About Us
            </Link>
            <Link to="/services" className={cn("px-3 py-2 rounded-md text-sm font-medium transition-colors", isActive("/services") ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-accent hover:text-accent-foreground")}>
              Services
            </Link>
            <Link to="/store" className={cn("px-3 py-2 rounded-md text-sm font-medium transition-colors", isActive("/store") ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-accent hover:text-accent-foreground")}>
              Store
            </Link>
            <Link to="/virtual-tour" className={cn("px-3 py-2 rounded-md text-sm font-medium transition-colors", isActive("/virtual-tour") ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-accent hover:text-accent-foreground")}>
              Virtual Tour
            </Link>

            {!isLoading && <>
                {user ? <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="ml-4 flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span className="hidden sm:inline">Account</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="cursor-pointer" onClick={handleSignOut}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu> : <Button variant="outline" size="sm" className="ml-4 flex items-center gap-2" onClick={() => navigate("/auth")}>
                    <LogIn className="h-4 w-4" />
                    <span className="hidden sm:inline">Sign In</span>
                  </Button>}
              </>}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && <div className="md:hidden backdrop-blur-md border-t border-border/20">
          <div className="container mx-auto px-4 py-2 space-y-1">
            <Link to="/artists" className={cn("block px-3 py-2 rounded-md text-base font-medium", isActive("/artists") ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-accent hover:text-accent-foreground")}>
              Artists
            </Link>
            <Link to="/who-are-you" className={cn("block px-3 py-2 rounded-md text-base font-medium", isActive("/who-are-you") ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-accent hover:text-accent-foreground")}>
              About Us
            </Link>
            <Link to="/services" className={cn("block px-3 py-2 rounded-md text-base font-medium", isActive("/services") ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-accent hover:text-accent-foreground")}>
              Services
            </Link>
            <Link to="/store" className={cn("block px-3 py-2 rounded-md text-base font-medium", isActive("/store") ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-accent hover:text-accent-foreground")}>
              Store
            </Link>
            <Link to="/virtual-tour" className={cn("block px-3 py-2 rounded-md text-base font-medium", isActive("/virtual-tour") ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-accent hover:text-accent-foreground")}>
              Virtual Tour
            </Link>

            {!isLoading && <>
                {user ? <Button variant="outline" className="w-full justify-start mt-4" onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button> : <Button variant="outline" className="w-full justify-start mt-4" onClick={() => navigate("/auth")}>
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>}
              </>}
          </div>
        </div>}
    </nav>;
};

export default Navigation;
