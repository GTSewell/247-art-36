
import React, { useEffect, useState } from 'react';
import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { isUserAdmin } from '@/utils/admin-utils';
import { useCart } from '@/contexts/CartContext';
import UserAvatar from './UserAvatar';
import UserMenuItems from './UserMenuItems';
import UserProfileHeader from './UserProfileHeader';
import CurrencySelector from './CurrencySelector';

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
          <UserAvatar 
            user={user}
            displayName={displayName}
            initials={initials}
            itemCount={itemCount}
          />
          <span className="text-sm sm:inline">{displayName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white" align="end">
        <UserProfileHeader 
          user={user}
          displayName={displayName}
          initials={initials}
        />

        {/* Currency selector */}
        <div className="p-2 border-b">
          <DropdownMenuLabel className="px-1 text-xs text-gray-500">Currency</DropdownMenuLabel>
          <CurrencySelector className="mt-1 py-1" />
        </div>
        
        <DropdownMenuSeparator />
        
        <UserMenuItems 
          user={user}
          isAdmin={isAdmin}
          itemCount={itemCount}
          handleSignOut={handleSignOut}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MobileUserMenu;
