
import React, { useEffect, useState } from 'react';
import { User, LogOut, Settings, ChevronDown, MessageSquare, UserPlus, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { isUserAdmin } from '@/utils/admin-utils';

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
  const [isOpen, setIsOpen] = useState(false);
  const [initials, setInitials] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    // If user is loaded, get initials
    if (user) {
      const name = user.user_metadata?.full_name || user.email || '';
      setInitials(getInitials(name));
      
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
      setIsOpen(false);
      navigate('/');
    } catch (error: any) {
      toast.error(`Error signing out: ${error.message}`);
    }
  };
  
  const closeSheet = () => {
    setIsOpen(false);
  };
  
  if (isLoading) {
    return (
      <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
    );
  }
  
  if (!user) {
    return (
      <Button variant="outline" className="h-9" onClick={() => navigate('/auth')}>
        <User className="h-4 w-4 mr-2" />
        Sign In
      </Button>
    );
  }
  
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="relative rounded-full h-10 w-10 p-0">
          <Avatar className="h-10 w-10">
            <AvatarImage 
              src={user.user_metadata?.avatar_url || undefined} 
              alt={user.user_metadata?.full_name || "User"}
            />
            <AvatarFallback className="bg-primary text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader className="mb-4">
          <SheetTitle>Account</SheetTitle>
        </SheetHeader>
        
        <div className="flex items-center mb-4">
          <Avatar className="h-12 w-12 mr-4">
            <AvatarImage 
              src={user.user_metadata?.avatar_url || undefined} 
              alt={user.user_metadata?.full_name || "User"}
            />
            <AvatarFallback className="bg-primary text-white text-lg">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">
              {user.user_metadata?.full_name || user.email}
            </p>
            <p className="text-sm text-gray-500 truncate max-w-[200px]">
              {user.email}
            </p>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <nav className="flex flex-col space-y-3">
          <Link 
            to="/account" 
            className="flex items-center p-2 rounded-md hover:bg-gray-100"
            onClick={closeSheet}
          >
            <Settings className="mr-2 h-5 w-5" />
            <span>Account Settings</span>
          </Link>
          
          <Link 
            to="/messages" 
            className="flex items-center p-2 rounded-md hover:bg-gray-100"
            onClick={closeSheet}
          >
            <MessageSquare className="mr-2 h-5 w-5" />
            <span>Messages</span>
          </Link>
          
          {isAdmin && (
            <Link 
              to="/admin/artists" 
              className="flex items-center p-2 rounded-md hover:bg-gray-100"
              onClick={closeSheet}
            >
              <ShieldCheck className="mr-2 h-5 w-5" />
              <span>Artist Management</span>
            </Link>
          )}
          
          <Button 
            variant="destructive" 
            className="justify-start mt-4"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-5 w-5" />
            <span>Sign out</span>
          </Button>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileUserMenu;
