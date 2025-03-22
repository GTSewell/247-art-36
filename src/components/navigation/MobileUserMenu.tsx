
import React from "react";
import { Button } from "@/components/ui/button";
import { LogOut, MessageSquare, Settings, ShoppingCart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MobileUserMenuProps {
  user: any | null;
  isLoading: boolean;
}

const MobileUserMenu = ({ user, isLoading }: MobileUserMenuProps) => {
  const navigate = useNavigate();
  const { itemCount } = useCart();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/");
    } catch (error: any) {
      console.error("Error signing out:", error.message);
    }
  };

  return (
    <>
      {/* User Avatar and info if logged in */}
      {!isLoading && user && (
        <div className="flex items-center gap-2 px-3 py-3 mb-2 bg-gray-100 dark:bg-gray-800 rounded-md">
          <Avatar className="h-10 w-10 border border-gray-300">
            <AvatarImage src="/lovable-uploads/5277ffb4-1849-4a10-9964-bb459163cabc.png" alt="Profile" />
            <AvatarFallback className="bg-gray-200 text-gray-700">
              {user?.email?.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <div className="font-medium truncate">{user.email?.split('@')[0] || 'User'}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</div>
          </div>
        </div>
      )}
      
      {/* Cart Link */}
      <Link
        to="/cart"
        className={cn(
          "flex items-center justify-between px-3 py-2 rounded-md text-base font-medium",
          "bg-gray-200 text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
        )}
      >
        <div className="flex items-center">
          <ShoppingCart className="mr-2 h-5 w-5" />
          <span>Cart</span>
        </div>
        {itemCount > 0 && (
          <Badge className="bg-zap-red text-white">
            {itemCount}
          </Badge>
        )}
      </Link>
      
      {/* Messages Link */}
      {!isLoading && user && (
        <Link
          to="/messages"
          className={cn(
            "flex items-center justify-between mt-2 px-3 py-2 rounded-md text-base font-medium",
            "bg-gray-200 text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
          )}
        >
          <div className="flex items-center">
            <MessageSquare className="mr-2 h-5 w-5" />
            <span>Messages</span>
          </div>
        </Link>
      )}
      
      {/* Only show dashboard links if user is logged in */}
      {!isLoading && user && (
        <>
          <Button 
            className="w-full justify-start mt-2 text-left font-bold text-white bg-zap-red hover:bg-zap-red/90"
            onClick={() => navigate("/dashboard/collector")}
          >
            <Settings className="h-4 w-4 mr-2" />
            Collector Dashboard
          </Button>
          
          <Button 
            className="w-full justify-start mt-2 text-left font-bold text-white bg-zap-blue hover:bg-zap-blue/90"
            onClick={() => navigate("/dashboard/artist")}
          >
            <Settings className="h-4 w-4 mr-2" />
            Artist Dashboard
          </Button>
        </>
      )}
      
      {/* Sign in/out button */}
      {!isLoading && (
        user ? (
          <Button 
            variant="outline" 
            className="w-full justify-start mt-2 text-red-500"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        ) : (
          <Button 
            variant="outline" 
            className="w-full justify-start mt-2"
            onClick={() => navigate("/auth")}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign In
          </Button>
        )
      )}
    </>
  );
};

export default MobileUserMenu;
