
import React from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { User, LogIn, LogOut, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { Badge } from "@/components/ui/badge";
import { useAppMode } from "@/contexts/AppModeContext";

interface UserMenuProps {
  user: any | null;
  isLoading: boolean;
}

const UserMenu = ({ user, isLoading }: UserMenuProps) => {
  const navigate = useNavigate();
  const { itemCount } = useCart();
  const { isPWA } = useAppMode();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Signed out successfully");
      navigate("/");
    } catch (error: any) {
      console.error("Error signing out:", error.message);
      toast.error(`Error signing out: ${error.message}`);
    }
  };

  if (isLoading) {
    return <Button variant="ghost" size="icon" disabled className="ml-2" />;
  }

  if (!user) {
    return (
      <Button 
        variant="ghost"
        size="icon"
        onClick={() => navigate("/auth")}
        className="ml-2"
        title="Sign In"
      >
        <LogIn className="h-5 w-5" />
      </Button>
    );
  }

  // Only show the cart badge on mobile/PWA view
  const showCartBadge = isPWA && itemCount > 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="ml-2 relative"
          title="User Menu"
        >
          <User className="h-5 w-5" />
          {showCartBadge && (
            <Badge className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs bg-zap-red text-white">
              {itemCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          onClick={() => navigate("/account")}
          className="cursor-pointer"
        >
          Account
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => navigate('/dashboard/collector')}
          className="cursor-pointer"
        >
          <Settings className="h-4 w-4 mr-2" />
          Collector Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => navigate('/dashboard/artist')}
          className="cursor-pointer"
        >
          <Settings className="h-4 w-4 mr-2" />
          Artist Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleSignOut}
          className="cursor-pointer text-red-500"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
