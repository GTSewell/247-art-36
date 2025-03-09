
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 text-center">
          <div>
            <h3 className="text-sm font-semibold">247.art</h3>
            <p className="text-xl font-bold mt-1">64</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Instagram</h3>
            <p className="text-xl font-bold mt-1">102</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Facebook</h3>
            <p className="text-xl font-bold mt-1">15</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold">X</h3>
            <p className="text-xl font-bold mt-1">3</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Other</h3>
            <p className="text-xl font-bold mt-1">16</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileViewsCard;
