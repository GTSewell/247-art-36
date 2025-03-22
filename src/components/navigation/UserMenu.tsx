
import { useState } from "react";
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
import { LogOut, MessageSquare, Settings, ShoppingCart } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { usePasswordProtection } from "@/contexts/PasswordProtectionContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserMenuProps {
  isCartPage?: boolean;
}

export function UserMenu({ isCartPage = false }: UserMenuProps) {
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
        <Button 
          variant="ghost" 
          className={`flex items-center gap-1 px-3 hover:bg-accent/20 ${isCartPage ? "text-white" : "text-foreground"}`}
        >
          <Avatar className={`h-8 w-8 ${isCartPage ? "bg-white border-white/30" : "bg-primary border-primary/30"}`}>
            <AvatarImage src="/lovable-uploads/5277ffb4-1849-4a10-9964-bb459163cabc.png" alt="Profile" />
            <AvatarFallback className={isCartPage ? "bg-white text-black" : "bg-primary text-primary-foreground"}>
              {user?.email?.substring(0, 2).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <span className={`hidden md:inline-block ml-1 ${isCartPage ? "text-white" : "text-foreground"}`}>
            {user ? user.email?.split('@')[0] : 'Sign in'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {user ? (
          <>
            <DropdownMenuLabel className="flex items-center">
              <Avatar className="h-6 w-6 mr-2">
                <AvatarImage src="/lovable-uploads/5277ffb4-1849-4a10-9964-bb459163cabc.png" alt="Profile" />
                <AvatarFallback className="bg-gray-200 text-xs">
                  {user?.email?.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="truncate">
                {user.email}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => {
              setIsUserMenuOpen(false);
              navigate("/cart");
            }} className="flex items-center">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Cart
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              setIsUserMenuOpen(false);
              navigate("/messages");
            }} className="flex items-center">
              <MessageSquare className="mr-2 h-4 w-4" />
              Messages
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              setIsUserMenuOpen(false);
              navigate("/dashboard/collector");
            }} className="flex items-center bg-zap-red text-white font-bold hover:bg-zap-red/90">
              <Settings className="mr-2 h-4 w-4" />
              Collector Dashboard
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              setIsUserMenuOpen(false);
              navigate("/dashboard/artist");
            }} className="flex items-center bg-zap-blue text-white font-bold hover:bg-zap-blue/90">
              <Settings className="mr-2 h-4 w-4" />
              Artist Dashboard
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-red-500">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
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
};
