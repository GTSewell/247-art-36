
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingCart, 
  MessageSquare, 
  Settings, 
  Shield, 
  LogOut 
} from 'lucide-react';
import { 
  DropdownMenuItem, 
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { User } from '@supabase/supabase-js';

interface UserMenuItemsProps {
  user: User | null;
  isAdmin: boolean;
  itemCount: number;
  handleSignOut: () => Promise<void>;
}

const UserMenuItems: React.FC<UserMenuItemsProps> = ({
  isAdmin,
  itemCount,
  handleSignOut
}) => {
  return (
    <>
      <DropdownMenuItem asChild className="focus:bg-accent dark:hover:bg-gray-800 dark:focus:bg-gray-800">
        <Link to="/cart" className="flex cursor-pointer items-center dark:text-gray-200">
          <ShoppingCart className="mr-2 h-4 w-4" />
          <span>Cart</span>
          {itemCount > 0 && (
            <Badge className="ml-auto bg-zap-red text-white">{itemCount}</Badge>
          )}
        </Link>
      </DropdownMenuItem>
      
      <DropdownMenuItem asChild className="focus:bg-accent dark:hover:bg-gray-800 dark:focus:bg-gray-800">
        <Link to="/messages" className="flex cursor-pointer items-center dark:text-gray-200">
          <MessageSquare className="mr-2 h-4 w-4" />
          <span>Messages</span>
        </Link>
      </DropdownMenuItem>
      
      <DropdownMenuItem asChild className="focus:bg-accent dark:hover:bg-gray-800 dark:focus:bg-gray-800">
        <Link to="/dashboard/artist" className="flex cursor-pointer items-center dark:text-gray-200">
          <Settings className="mr-2 h-4 w-4" />
          <span>Artist Dashboard</span>
        </Link>
      </DropdownMenuItem>
      
      <DropdownMenuItem asChild className="focus:bg-accent dark:hover:bg-gray-800 dark:focus:bg-gray-800">
        <Link to="/dashboard/collector" className="flex cursor-pointer items-center dark:text-gray-200">
          <Settings className="mr-2 h-4 w-4" />
          <span>Collector Dashboard</span>
        </Link>
      </DropdownMenuItem>
      
      {isAdmin && (
        <DropdownMenuItem asChild className="focus:bg-accent dark:hover:bg-gray-800 dark:focus:bg-gray-800">
          <Link to="/admin/artists" className="flex cursor-pointer items-center dark:text-gray-200">
            <Shield className="mr-2 h-4 w-4" />
            <span>Artist Management</span>
          </Link>
        </DropdownMenuItem>
      )}
      
      <DropdownMenuSeparator />
      
      <DropdownMenuItem 
        className="text-red-500 focus:text-red-500 cursor-pointer dark:hover:bg-gray-800 dark:focus:bg-gray-800" 
        onClick={handleSignOut}
      >
        <LogOut className="mr-2 h-4 w-4" />
        <span>Sign out</span>
      </DropdownMenuItem>
    </>
  );
};

export default UserMenuItems;
