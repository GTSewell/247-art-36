import React from "react";
import { Button } from "@/components/ui/button";
import { User, LogIn, LogOut, ShoppingCart, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

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
      
      {/* Only show dashboard links if user is logged in */}
      {!isLoading && user && (
        <>
          <Button 
            variant="outline" 
            className="w-full justify-start mt-2 text-left"
            onClick={() => navigate("/dashboard/collector")}
          >
            <Settings className="h-4 w-4 mr-2" />
            Collector Dashboard
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start mt-2 text-left"
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
            className="w-full justify-start mt-2"
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
            <LogIn className="h-4 w-4 mr-2" />
            Sign In
          </Button>
        )
      )}
    </>
  );
};

export default MobileUserMenu;
