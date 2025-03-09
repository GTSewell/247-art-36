
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, LogIn, LogOut, Settings } from "lucide-react";
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

interface UserMenuProps {
  user: any | null;
  isLoading: boolean;
}

const UserMenu = ({ user, isLoading }: UserMenuProps) => {
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
      <Button variant="ghost" size="sm" disabled>
        <User className="mr-2 h-4 w-4" />
        Loading...
      </Button>
    );
  }

  if (!user) {
    return (
      <Button variant="outline" size="sm" onClick={() => navigate("/auth")}>
        <LogIn className="mr-2 h-4 w-4" />
        Sign In
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <User className="mr-2 h-4 w-4" />
          Account
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          {user.email || "My Account"}
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
