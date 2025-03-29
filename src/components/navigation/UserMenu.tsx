
import React, { useEffect, useState } from 'react';
import { User, LogOut, MessageSquare, ShoppingCart, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { isUserAdmin } from '@/utils/admin-utils';

function getInitials(name: string): string {
  if (!name) return 'U';
  
  const nameParts = name.split(' ');
  if (nameParts.length > 1) {
    return `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`;
  }
  return name.charAt(0);
}

interface UserMenuProps {
  isCartPage?: boolean;
  isArtistDashboard?: boolean;
}

// Export both as default and named export
export const UserMenu = ({ isCartPage, isArtistDashboard }: UserMenuProps) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [initials, setInitials] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [displayName, setDisplayName] = useState('');
  
  useEffect(() => {
    // If user is loaded, get initials and display name
    if (user) {
      const name = user.user_metadata?.full_name || user.email || '';
      setInitials(getInitials(name));
      setDisplayName(user.user_metadata?.full_name || user.email?.split('@')[0] || 'User');
      
      // Check if user is admin
      const checkAdminStatus = async () => {
        const adminStatus = await isUserAdmin();
        setIsAdmin(adminStatus);
      };
      
      checkAdminStatus();
    }
  }, [user]);
  
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("You have been signed out");
      navigate('/');
    } catch (error: any) {
      toast.error(`Error signing out: ${error.message}`);
    }
  };
  
  if (isLoading) {
    return (
      <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
    );
  }
  
  if (!user) {
    return (
      <Button variant="outline" onClick={() => navigate('/auth')}>
        <User className="h-4 w-4 mr-2" />
        Sign In
      </Button>
    );
  }
  
  // Determine text color based on current page
  const textColorClass = isCartPage || isArtistDashboard ? "text-white" : "text-foreground";
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className={`flex items-center gap-2 ${textColorClass}`}>
          <Avatar className="h-8 w-8">
            <AvatarImage 
              src="/lovable-uploads/16f2e313-fded-449d-84fb-74238acce45c.png" 
              alt={displayName}
            />
            <AvatarFallback className="bg-primary text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="hidden md:inline">{displayName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 p-0 rounded-md bg-white">
        <div className="flex items-center gap-2 p-3 border-b">
          <Avatar className="h-8 w-8">
            <AvatarImage 
              src="/lovable-uploads/16f2e313-fded-449d-84fb-74238acce45c.png" 
              alt={displayName}
            />
            <AvatarFallback className="bg-primary text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium truncate">{user.email}</span>
        </div>
        
        <Link to="/cart">
          <DropdownMenuItem className="p-3 hover:bg-gray-100">
            <ShoppingCart className="mr-2 h-5 w-5" />
            <span>Cart</span>
          </DropdownMenuItem>
        </Link>
        
        <Link to="/messages">
          <DropdownMenuItem className="p-3 hover:bg-gray-100">
            <MessageSquare className="mr-2 h-5 w-5" />
            <span>Messages</span>
          </DropdownMenuItem>
        </Link>
        
        <Link to="/dashboard/artist">
          <DropdownMenuItem className="p-3 hover:bg-gray-100 bg-zap-blue/10 text-zap-blue">
            <Settings className="mr-2 h-5 w-5" />
            <span className="font-medium">Artist Dashboard</span>
          </DropdownMenuItem>
        </Link>
        
        <Link to="/dashboard/collector">
          <DropdownMenuItem className="p-3 hover:bg-gray-100 bg-zap-red/10 text-zap-red">
            <Settings className="mr-2 h-5 w-5" />
            <span className="font-medium">Collector Dashboard</span>
          </DropdownMenuItem>
        </Link>
        
        {isAdmin && (
          <Link to="/admin/artists">
            <DropdownMenuItem className="p-3 hover:bg-gray-100">
              <ShieldCheck className="mr-2 h-5 w-5" />
              <span>Artist Management</span>
            </DropdownMenuItem>
          </Link>
        )}
        
        <DropdownMenuItem onClick={handleSignOut} className="p-3 hover:bg-gray-100 text-red-500 border-t">
          <LogOut className="mr-2 h-5 w-5" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Also export as default
export default UserMenu;
