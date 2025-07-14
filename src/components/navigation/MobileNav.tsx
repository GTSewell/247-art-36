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
  X
} from 'lucide-react';
import { useTheme } from "next-themes";

interface MobileNavProps {
  isOpen: boolean;
  isActive: (path: string) => boolean;
  user: any | null;
  isLoading: boolean;
}

const MobileNav = ({ isOpen, isActive, user, isLoading }: MobileNavProps) => {
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
    <div className={`md:hidden fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border/20 w-full pt-16 z-50 ${isWhoAreYouPage ? 'mt-4' : ''}`}>
      {/* Close button in the padding area */}
      <button 
        className="absolute top-4 right-4 p-2 rounded-md text-foreground hover:bg-muted"
        onClick={() => {/* This will be handled by parent component */}}
      >
        <X className="h-5 w-5" />
      </button>
      
      <div className="max-w-full mx-auto px-6 py-2 space-y-1">
        {/* Navigation links for all users */}
        <MobileNavLink to="/" isActive={isActive("/")}>
          Home
        </MobileNavLink>
        <MobileNavLink to="/artists" isActive={isActive("/artists")}>
          The Artists
        </MobileNavLink>
        <MobileNavLink to="/store" isActive={isActive("/store")}>
          The Store
        </MobileNavLink>
        
        {/* Theme Toggle */}
        <button 
          className="flex items-center w-full p-2 rounded-md text-foreground hover:bg-muted"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          <Sun className="mr-2 h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="mr-2 h-4 w-4 absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span>Toggle theme</span>
        </button>
        
        {/* User menu items - Only show if user is logged in */}
        {user && (
          <>
            {/* User profile info */}
            <div className="flex items-center p-2 mb-2 bg-muted rounded-md">
              <div className="h-10 w-10 rounded-full overflow-hidden mr-3 bg-primary">
                <img 
                  src="/lovable-uploads/af63a2ba-f2fc-4794-af1b-a504b0c294de.png" 
                  alt={user.user_metadata?.full_name || user.email} 
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <p className="font-medium text-sm text-foreground">
                  {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
                </p>
                <p className="text-xs text-muted-foreground truncate max-w-[150px]">{user.email}</p>
              </div>
            </div>
            
            {/* User menu options */}
            <Link to="/cart" className="flex items-center p-2 rounded-md text-foreground hover:bg-muted">
              <ShoppingCart className="mr-2 h-4 w-4" />
              <span>Cart</span>
              {itemCount > 0 && (
                <span className="ml-auto bg-zap-red text-white text-xs px-2 py-1 rounded-full">
                  {itemCount}
                </span>
              )}
            </Link>
            
            <Link to="/messages" className="flex items-center p-2 rounded-md text-foreground hover:bg-muted">
              <MessageSquare className="mr-2 h-4 w-4" />
              <span>Messages</span>
            </Link>
            
            <Link to="/dashboard/artist" className="flex items-center p-2 rounded-md text-foreground hover:bg-muted">
              <Settings className="mr-2 h-4 w-4" />
              <span>Artist Dashboard</span>
            </Link>
            
            <Link to="/dashboard/collector" className="flex items-center p-2 rounded-md text-foreground hover:bg-muted">
              <Settings className="mr-2 h-4 w-4" />
              <span>Collector Dashboard</span>
            </Link>
            
            {isAdmin && (
              <Link to="/admin/artists" className="flex items-center p-2 rounded-md text-foreground hover:bg-muted">
                <Shield className="mr-2 h-4 w-4" />
                <span>Artist Management</span>
              </Link>
            )}
            
            <button 
              className="flex items-center w-full p-2 rounded-md text-destructive hover:bg-muted"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign out</span>
            </button>
          </>
        )}
        
        {/* Show sign in link if user is not logged in */}
        {!user && !isLoading && (
          <MobileNavLink to="/auth" isActive={isActive("/auth")}>
            Sign In
          </MobileNavLink>
        )}
      </div>
    </div>
  );
};

export default MobileNav;
