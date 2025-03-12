
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ProfileViewsCardProps {
  demoMode?: boolean;
}

const ProfileViewsCard: React.FC<ProfileViewsCardProps> = ({ demoMode }) => {
  // Demo data with more realistic values
  const data = demoMode ? [
    { day: "Mon", views: 240 },
    { day: "Tue", views: 139 },
    { day: "Wed", views: 980 },
    { day: "Thu", views: 390 },
    { day: "Fri", views: 480 },
    { day: "Sat", views: 380 },
    { day: "Sun", views: 430 }
  ] : [
    { day: "Mon", views: 12 },
    { day: "Tue", views: 19 },
    { day: "Wed", views: 3 },
    { day: "Thu", views: 5 },
    { day: "Fri", views: 2 },
    { day: "Sat", views: 3 },
    { day: "Sun", views: 9 }
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Profile Views</CardTitle>
        <CardDescription>
          Visits to your artist profile
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip formatter={(value) => [value, 'Views']} />
              <Bar dataKey="views" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileViewsCard;
