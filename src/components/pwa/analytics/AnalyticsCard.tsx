
import React, { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface AnalyticsCardProps {
  title: string;
  icon: LucideIcon;
  iconColor: string;
  children: ReactNode;
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({ 
  title, 
  icon: Icon, 
  iconColor, 
  children 
}) => {
  return (
    <Card className="bg-black border-zinc-800">
      <CardHeader className="pb-1 pt-3">
        <CardTitle className="flex items-center text-base font-medium text-white">
          <Icon className={`mr-2 h-4 w-4 ${iconColor}`} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-3">
        {children}
      </CardContent>
    </Card>
  );
};

export default AnalyticsCard;
