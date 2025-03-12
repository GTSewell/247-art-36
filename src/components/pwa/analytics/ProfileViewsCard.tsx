
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye } from "lucide-react";

const ProfileViewsCard: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Eye className="mr-2 h-5 w-5" />
          Profile Views
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[
            { platform: "247.art", views: 64 },
            { platform: "Instagram", views: 102 },
            { platform: "Facebook", views: 15 },
            { platform: "X", views: 3 },
            { platform: "Other", views: 16 },
          ].map((item, index) => (
            <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
              <span className="font-medium">{item.platform}</span>
              <span className="text-xl font-bold">{item.views}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileViewsCard;
