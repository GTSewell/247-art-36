
import React, { useEffect, useState } from 'react';
import { User, LogOut, MessageSquare, ShoppingCart, Settings, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { isUserAdmin } from '@/utils/admin-utils';
import CurrencySelector from './CurrencySelector';

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
    if (user) {
      // For demo accounts, always display "Demo Artist"
      if (user.email?.includes('demo') || user.email?.includes('247art')) {
        setDisplayName('Demo Artist');
        setInitials('DA');
      } else {
        // Extract name from user metadata or use email if no name is available
        let name = user.user_metadata?.full_name || '';
        
        // If name is empty or contains @, use first part of email instead
        if (!name || name.includes('@')) {
          name = user.email ? user.email.split('@')[0] : 'User';
        }
        
        setInitials(getInitials(name));
        setDisplayName(name);
      }
      
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
  
  // Use a solid background variant to improve contrast against any background
  const buttonVariant = "secondary";
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={buttonVariant} 
          className="flex items-center gap-2 rounded-md"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage 
              src="/lovable-uploads/44e75f5d-9241-4255-87f8-126a4ed04203.png" 
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
              src="/lovable-uploads/44e75f5d-9241-4255-87f8-126a4ed04203.png" 
              alt={displayName}
            />
            <AvatarFallback className="bg-primary text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium truncate">{user.email}</span>
        </div>
        
        {/* Currency selector */}
        <div className="p-2 border-b">
          <DropdownMenuLabel className="px-1 text-xs text-gray-500">Currency</DropdownMenuLabel>
          <CurrencySelector className="mt-1 py-1" />
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
          <DropdownMenuItem className="p-3 hover:bg-gray-100">
            <Settings className="mr-2 h-5 w-5" />
            <span className="font-medium">Artist Dashboard</span>
          </DropdownMenuItem>
        </Link>
        
        <Link to="/dashboard/collector">
          <DropdownMenuItem className="p-3 hover:bg-gray-100">
            <Settings className="mr-2 h-5 w-5" />
            <span className="font-medium">Collector Dashboard</span>
          </DropdownMenuItem>
        </Link>
        
        {isAdmin && (
          <Link to="/admin/artists">
            <DropdownMenuItem className="p-3 hover:bg-gray-100">
              <Shield className="mr-2 h-5 w-5" />
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

export default UserMenu;
