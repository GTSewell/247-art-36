
import React from "react";
import { Link } from "react-router-dom";
import { User, LogIn, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface MobileUserMenuProps {
  user: any | null;
  isLoading: boolean;
}

const MobileUserMenu = ({ user, isLoading }: MobileUserMenuProps) => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/");
      toast.success("Signed out successfully");
    } catch (error: any) {
      toast.error(`Error signing out: ${error.message}`);
    }
  };

  if (isLoading) {
    return (
      <div className="py-2">
        <Button variant="ghost" disabled className="w-full justify-start">
          <User className="mr-2 h-4 w-4" />
          Loading...
        </Button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="py-2">
        <Button 
          variant="outline" 
          className="w-full justify-start"
          onClick={() => navigate("/auth")}
        >
          <LogIn className="mr-2 h-4 w-4" />
          Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="py-2 space-y-2">
      <div className="px-3 text-sm font-medium">{user.email || "My Account"}</div>
      <Separator />
      <Link to="/dashboard/artist" className="block">
        <Button variant="ghost" className="w-full justify-start">
          <Settings className="mr-2 h-4 w-4" />
          Artist Dashboard
        </Button>
      </Link>
      <Link to="/dashboard/collector" className="block">
        <Button variant="ghost" className="w-full justify-start">
          <Settings className="mr-2 h-4 w-4" />
          Collector Dashboard
        </Button>
      </Link>
      <Separator />
      <Button 
        variant="ghost" 
        className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
        onClick={handleSignOut}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Sign Out
      </Button>
    </div>
  );
};

export default MobileUserMenu;
