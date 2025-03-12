
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface CollectorAvatarProps {
  name: string;
  avatarUrl: string;
}

const CollectorAvatar: React.FC<CollectorAvatarProps> = ({ name, avatarUrl }) => {
  return (
    <Avatar className="h-8 w-8">
      <AvatarImage src={avatarUrl} alt={name} />
      <AvatarFallback className={cn(
        name === "Anon" ? "bg-gray-300" : "bg-zap-blue",
        "text-white"
      )}>
        {name.substring(0, 2)}
      </AvatarFallback>
    </Avatar>
  );
};

export default CollectorAvatar;
