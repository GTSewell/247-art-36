
import React from "react";
import { Link } from "react-router-dom";
import { LogIn, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

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
        <div className="px-3 flex items-center gap-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="py-2">
        <Button 
          variant="ghost" 
          className="w-full justify-start p-0"
          onClick={() => navigate("/auth")}
        >
          <Avatar className="h-6 w-6 mr-2">
            <AvatarImage src="/lovable-uploads/b4d254c3-2988-4d1a-97ad-beb4e333e55c.png" alt="Profile" />
            <AvatarFallback className="bg-gray-200">
              <LogIn className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="py-2 space-y-2">
      <div className="px-3 flex items-center">
        <Avatar className="h-6 w-6 mr-2">
          <AvatarImage src="/lovable-uploads/b4d254c3-2988-4d1a-97ad-beb4e333e55c.png" alt="Profile" />
          <AvatarFallback className="bg-gray-200">
            {user.email ? user.email.charAt(0).toUpperCase() : "U"}
          </AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium">{user.email || "My Account"}</span>
      </div>
      <Separator />
      <Link to="/dashboard/artist" className="block">
        <Button 
          variant="ghost" 
          className={cn(
            "w-full justify-start",
            "bg-gray-200 text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
          )}
        >
          <Settings className="mr-2 h-4 w-4" />
          Artist Dashboard
        </Button>
      </Link>
      <Link to="/dashboard/collector" className="block">
        <Button 
          variant="ghost" 
          className={cn(
            "w-full justify-start",
            "bg-gray-200 text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
          )}
        >
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
