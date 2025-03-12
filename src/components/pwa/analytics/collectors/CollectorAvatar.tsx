
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Collector } from "./types";

export interface CollectorAvatarProps {
  collector: Collector;
}

const CollectorAvatar: React.FC<CollectorAvatarProps> = ({ collector }) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Avatar className="h-9 w-9">
      {collector.avatarUrl && (
        <AvatarImage 
          src={collector.avatarUrl} 
          alt={collector.name} 
        />
      )}
      <AvatarFallback>
        {getInitials(collector.name)}
      </AvatarFallback>
    </Avatar>
  );
};

export default CollectorAvatar;
