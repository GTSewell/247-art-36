
import React, { useEffect, useState } from 'react';
import { User, LogOut, MessageSquare, ShoppingCart, Settings, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { isUserAdmin } from '@/utils/admin-utils';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';

function getInitials(name: string): string {
  if (!name) return 'U';
  
  const nameParts = name.split(' ');
  if (nameParts.length > 1) {
    return `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`;
  }
  return name.charAt(0);
}

const MobileUserMenu = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [initials, setInitials] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const { itemCount } = useCart();
  
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
      <Button variant="secondary" className="h-9" onClick={() => navigate('/auth')}>
        <User className="h-4 w-4 mr-2" />
        Sign In
      </Button>
    );
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" className="flex items-center gap-2 rounded-md">
          <Avatar className="h-9 w-9">
            <AvatarImage 
              src="/lovable-uploads/af63a2ba-f2fc-4794-af1b-a504b0c294de.png" 
              alt={displayName}
            />
            <AvatarFallback className="bg-primary text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm sm:inline">{displayName}</span>
          {itemCount > 0 && (
            <Badge 
              className="absolute -top-2 -right-2 bg-zap-red text-white h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {itemCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white" align="end">
        <div className="flex items-center p-2">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage 
              src="/lovable-uploads/af63a2ba-f2fc-4794-af1b-a504b0c294de.png" 
              alt={displayName}
            />
            <AvatarFallback className="bg-primary text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="font-medium text-sm">{displayName}</p>
            <p className="text-xs text-gray-500 truncate max-w-[150px]">{user.email}</p>
          </div>
        </div>

        <DropdownMenuSeparator />
        
        <DropdownMenuItem asChild>
          <Link to="/cart" className="flex cursor-pointer items-center">
            <ShoppingCart className="mr-2 h-4 w-4" />
            <span>Cart</span>
            {itemCount > 0 && (
              <Badge className="ml-auto bg-zap-red text-white">{itemCount}</Badge>
            )}
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link to="/messages" className="flex cursor-pointer items-center">
            <MessageSquare className="mr-2 h-4 w-4" />
            <span>Messages</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link to="/dashboard/artist" className="flex cursor-pointer items-center">
            <Settings className="mr-2 h-4 w-4" />
            <span>Artist Dashboard</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link to="/dashboard/collector" className="flex cursor-pointer items-center">
            <Settings className="mr-2 h-4 w-4" />
            <span>Collector Dashboard</span>
          </Link>
        </DropdownMenuItem>
        
        {isAdmin && (
          <DropdownMenuItem asChild>
            <Link to="/admin/artists" className="flex cursor-pointer items-center">
              <Shield className="mr-2 h-4 w-4" />
              <span>Artist Management</span>
            </Link>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          className="text-red-500 focus:text-red-500 cursor-pointer" 
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MobileUserMenu;
