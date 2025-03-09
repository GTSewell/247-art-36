
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAppMode } from "@/contexts/AppModeContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MobileUserMenuProps {
  user: any | null;
  isLoading: boolean;
}

const MobileUserMenu = ({ user, isLoading }: MobileUserMenuProps) => {
  const navigate = useNavigate();
  const { isPWA } = useAppMode();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Signed out successfully");
      navigate("/");
    } catch (error: any) {
      toast.error(`Error signing out: ${error.message}`);
    }
  };

  if (isLoading) {
    return null;
  }

  // If in PWA mode, use the original buttons
  if (isPWA) {
    if (user) {
      return (
        <Button
          variant="outline"
          className="w-full justify-start mt-4"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      );
    }

    return (
      <Button
        variant="outline"
        className="w-full justify-start mt-4"
        onClick={() => navigate("/auth")}
      >
        <User className="h-4 w-4 mr-2" />
        Sign In
      </Button>
    );
  }

  // For regular website mode
  if (user) {
    return (
      <Button
        variant="outline"
        className="w-full justify-start mt-4"
        onClick={handleSignOut}
      >
        <Avatar className="h-5 w-5 mr-2">
          <AvatarImage src="/lovable-uploads/cf5565b7-f7b3-4c38-bdbb-99b1bfb3b192.png" alt="Profile" />
          <AvatarFallback><User className="h-3 w-3" /></AvatarFallback>
        </Avatar>
        Sign Out
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      className="w-full justify-start mt-4"
      onClick={() => navigate("/auth")}
    >
      <Avatar className="h-5 w-5 mr-2">
        <AvatarImage src="/lovable-uploads/cf5565b7-f7b3-4c38-bdbb-99b1bfb3b192.png" alt="Profile" />
        <AvatarFallback><User className="h-3 w-3" /></AvatarFallback>
      </Avatar>
      Sign In
    </Button>
  );
};

export default MobileUserMenu;
