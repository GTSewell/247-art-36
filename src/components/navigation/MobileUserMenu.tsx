
import React from "react";
import { Button } from "@/components/ui/button";
import { User, LogIn, LogOut, ShoppingCart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

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

  // Display cart link with badge
  return (
    <>
      <Link
        to="/cart"
        className="flex items-center justify-between px-3 py-2 rounded-md text-base font-medium bg-gray-200 text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
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
