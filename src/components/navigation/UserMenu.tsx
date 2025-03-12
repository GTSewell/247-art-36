
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";

interface UserMenuProps {
  user: any | null;
  isLoading: boolean;
}

const UserMenu = ({ user, isLoading }: UserMenuProps) => {
  const navigate = useNavigate();
  const { handleFakeLogout } = useAuth();

  const handleSignOut = async () => {
    try {
      // Check if this is a demo user first
      if (handleFakeLogout()) {
        navigate("/");
        toast.success("Signed out of demo account");
        return;
      }
      
      // Normal sign out process
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
      <Button variant="ghost" size="icon" disabled className="p-0">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-gray-200">...</AvatarFallback>
        </Avatar>
        <span className="sr-only">Loading</span>
      </Button>
    );
  }

  if (!user) {
    return (
      <Button variant="ghost" size="icon" onClick={() => navigate("/auth")} title="Sign In" className="p-0">
        <Avatar className="h-8 w-8">
          <AvatarImage src="/lovable-uploads/b4d254c3-2988-4d1a-97ad-beb4e333e55c.png" alt="Profile" />
          <AvatarFallback className="bg-gray-200">
            <LogIn className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
        <span className="sr-only">Sign In</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" title="Account" className="p-0">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/lovable-uploads/b4d254c3-2988-4d1a-97ad-beb4e333e55c.png" alt="Profile" />
            <AvatarFallback className="bg-gray-200">
              {user.email ? user.email.charAt(0).toUpperCase() : "G"}
            </AvatarFallback>
          </Avatar>
          <span className="sr-only">Account</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          {user.email || "GT Sewell"}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/dashboard/artist">
            <Settings className="mr-2 h-4 w-4" />
            Artist Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/dashboard/collector">
            <Settings className="mr-2 h-4 w-4" />
            Collector Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
