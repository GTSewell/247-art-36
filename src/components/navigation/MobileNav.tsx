import React from "react";
import MobileNavLink from "./MobileNavLink";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/contexts/CartContext";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate, Link } from "react-router-dom";
import { isUserAdmin } from '@/utils/admin-utils';
import { 
  ShoppingCart, 
  MessageSquare, 
  Settings, 
  Shield, 
  LogOut,
  Sun,
  Moon,
  X,
  Home,
  Palette,
  Store
} from 'lucide-react';
import { useTheme } from "next-themes";

interface MobileNavProps {
  isOpen: boolean;
  isActive: (path: string) => boolean;
  user: any | null;
  isLoading: boolean;
  onClose: () => void;
}

const MobileNav = ({ isOpen, isActive, user, isLoading, onClose }: MobileNavProps) => {
  const location = useLocation();
  const isWhoAreYouPage = location.pathname === "/who-are-you";
  const navigate = useNavigate();
  const { itemCount } = useCart();
  const { theme, setTheme } = useTheme();
  const [isAdmin, setIsAdmin] = React.useState(false);
  
  React.useEffect(() => {
    if (user) {
      const checkAdminStatus = async () => {
        const adminStatus = await isUserAdmin();
        setIsAdmin(adminStatus);
      };
      
      checkAdminStatus();
    }
  }, [user]);
  
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("You have been signed out");
      navigate('/');
    } catch (error: any) {
      toast.error(`Error signing out: ${error.message}`);
    }
  };
  
  if (!isOpen) return null;

  return (
    <div 
      className={`md:hidden fixed top-0 left-0 right-0 bottom-0 z-50 ${isWhoAreYouPage ? 'mt-4' : ''}`}
      onClick={onClose}
    >
      {/* Dropdown content area */}
      <div className="bg-background border shadow-md rounded-md w-full max-w-md mx-auto mt-16 mr-4 ml-auto">
        {/* Close button in the padding area */}
        <button 
          className="absolute top-4 right-4 p-2 rounded-md text-foreground hover:bg-muted"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </button>
        
        <div 
          className="p-0"
          onClick={(e) => e.stopPropagation()}
        >
        {/* Navigation links for all users */}
        <div className="px-3 hover:bg-muted rounded-t-md">
          <MobileNavLink to="/" isActive={isActive("/")} icon={<Home className="h-5 w-5" />}>
            Home
          </MobileNavLink>
        </div>
        <div className="px-3 hover:bg-muted">
          <MobileNavLink to="/artists" isActive={isActive("/artists")} icon={<Palette className="h-5 w-5" />}>
            The Artists
          </MobileNavLink>
        </div>
        <div className="px-3 hover:bg-muted">
          <MobileNavLink to="/store" isActive={isActive("/store")} icon={<Store className="h-5 w-5" />}>
            The Store
          </MobileNavLink>
        </div>
        
        <div className="border-t border-border"></div>
        
        {/* Theme Toggle */}
        <button 
          className="flex items-center w-full p-3 text-foreground hover:bg-muted"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          <Sun className="mr-2 h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <Moon className="mr-2 h-5 w-5 absolute rotate-0 scale-100 transition-all dark:rotate-90 dark:scale-0" />
          <span>{theme === "dark" ? "Infinite Light Mode" : "Genesis Dark Mode"}</span>
        </button>
        
        {/* User menu items - Only show if user is logged in */}
        {user && (
          <>
            <div className="border-t border-border"></div>
            
            {/* User profile info */}
            <div className="flex items-center gap-2 p-3 border-b border-border">
              <div className="h-8 w-8 rounded-full overflow-hidden bg-primary">
                <img 
                  src="/lovable-uploads/44e75f5d-9241-4255-87f8-126a4ed04203.png" 
                  alt={user.user_metadata?.full_name || user.email} 
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="text-sm font-medium truncate">{user.email}</span>
            </div>
            
            {/* User menu options */}
            <Link to="/cart" className="flex items-center p-3 text-foreground hover:bg-muted">
              <ShoppingCart className="mr-2 h-5 w-5" />
              <span>Cart</span>
              {itemCount > 0 && (
                <span className="ml-auto bg-zap-red text-white text-xs px-2 py-1 rounded-full">
                  {itemCount}
                </span>
              )}
            </Link>
            
            <div className="cursor-not-allowed">
              <div className="flex items-center p-3 text-muted-foreground">
                <MessageSquare className="mr-2 h-5 w-5" />
                <span>Messages</span>
                <span className="ml-auto text-xs text-muted-foreground">coming soon</span>
              </div>
            </div>
            
            <Link to="/dashboard/artist" className={`flex items-center p-3 text-foreground hover:bg-muted ${location.pathname === '/dashboard/artist' ? 'bg-zap-yellow text-black' : ''}`}>
              <Settings className="mr-2 h-5 w-5" />
              <span className="font-medium">Artist Dashboard</span>
            </Link>
            
            <Link to="/dashboard/collector" className={`flex items-center p-3 text-foreground hover:bg-muted ${location.pathname === '/dashboard/collector' ? 'bg-zap-yellow text-black' : ''}`}>
              <Settings className="mr-2 h-5 w-5" />
              <span className="font-medium">Collector Dashboard</span>
            </Link>
            
            {isAdmin && (
              <Link to="/admin/artists" className="flex items-center p-3 text-foreground hover:bg-muted">
                <Shield className="mr-2 h-5 w-5" />
                <span>Artist Management</span>
              </Link>
            )}
            
            <button 
              className="flex items-center w-full p-3 text-destructive hover:bg-muted border-t border-border rounded-b-md"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-5 w-5" />
              <span>Sign out</span>
            </button>
          </>
        )}
        
        {/* Show sign in link if user is not logged in */}
        {!user && !isLoading && (
          <>
            <div className="border-t border-border"></div>
            <div className="p-3 hover:bg-muted rounded-b-md">
              <MobileNavLink to="/auth" isActive={isActive("/auth")}>
                Sign In
              </MobileNavLink>
            </div>
          </>
        )}
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
