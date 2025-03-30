
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User } from '@supabase/supabase-js';

interface UserAvatarProps {
  user: User | null;
  displayName: string;
  initials: string;
  itemCount: number;
  showBadge?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  displayName,
  initials,
  itemCount,
  showBadge = true,
  size = 'md',
}) => {
  // Determine avatar size based on prop
  const avatarSize = {
    sm: 'h-8 w-8',
    md: 'h-9 w-9',
    lg: 'h-10 w-10'
  }[size];

  return (
    <div className="relative">
      <Avatar className={avatarSize}>
        <AvatarImage 
          src="/lovable-uploads/af63a2ba-f2fc-4794-af1b-a504b0c294de.png" 
          alt={displayName}
        />
        <AvatarFallback className="bg-primary text-white">
          {initials}
        </AvatarFallback>
      </Avatar>
      {showBadge && itemCount > 0 && (
        <Badge 
          className="absolute -top-2 -right-2 bg-zap-red text-white h-5 w-5 flex items-center justify-center p-0 text-xs"
        >
          {itemCount}
        </Badge>
      )}
    </div>
  );
};

export default UserAvatar;
