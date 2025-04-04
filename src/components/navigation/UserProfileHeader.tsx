
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from '@supabase/supabase-js';

interface UserProfileHeaderProps {
  user: User | null;
  displayName: string;
  initials: string;
}

const UserProfileHeader: React.FC<UserProfileHeaderProps> = ({
  user,
  displayName,
  initials
}) => {
  return (
    <div className="flex items-center p-2">
      <Avatar className="h-10 w-10 mr-3">
        <AvatarImage 
          src="/lovable-uploads/44e75f5d-9241-4255-87f8-126a4ed04203.png" 
          alt={displayName}
        />
        <AvatarFallback className="bg-primary text-white">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <p className="font-medium text-sm">{displayName}</p>
        <p className="text-xs text-gray-500 truncate max-w-[150px]">{user?.email}</p>
      </div>
    </div>
  );
};

export default UserProfileHeader;
