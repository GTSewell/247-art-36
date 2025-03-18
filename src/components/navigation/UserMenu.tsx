
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ChevronDown, LogOut, User } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { usePasswordProtection } from "@/contexts/PasswordProtectionContext";

export function UserMenu() {
  const navigate = useNavigate();
  const { user, session } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { clearPasswordStatus } = usePasswordProtection();
  
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsUserMenuOpen(false);
    navigate("/auth");
  };

  const handleLockSite = () => {
    clearPasswordStatus();
    setIsUserMenuOpen(false);
  };
  
  return (
    <DropdownMenu open={isUserMenuOpen} onOpenChange={setIsUserMenuOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-1 px-3 hover:bg-black/5">
          <User size={18} />
          <span className="hidden md:inline-block">
            {user ? user.email?.split('@')[0] : 'Account'}
          </span>
          <ChevronDown size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {user ? (
          <>
            <DropdownMenuLabel>
              {user.email}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => {
              setIsUserMenuOpen(false);
              navigate("/account");
            }}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSignOut}>
              Sign out
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLockSite} className="text-red-500">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Lock Site</span>
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem onClick={() => {
              setIsUserMenuOpen(false);
              navigate("/auth");
            }}>
              Sign in
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLockSite} className="text-red-500">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Lock Site</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
