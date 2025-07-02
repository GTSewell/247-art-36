import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Eye, 
  MousePointer, 
  TrendingUp, 
  ExternalLink,
  Plus,
  BarChart3
} from "lucide-react";

interface OverviewSectionProps {
  artistId: string | null;
  isDemo: boolean;
}

const OverviewSection: React.FC<OverviewSectionProps> = ({ artistId, isDemo }) => {
  const stats = {
    profileViews: 1247,
    linkClicks: 489,
    topLink: "Instagram"
  };

  return (
    <div className="p-6 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Welcome back{isDemo ? ", Demo Artist" : ""}!
        </h2>
        <p className="text-muted-foreground">
          Here's how your profile is performing
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Profile Views</p>
                <p className="text-2xl font-bold text-foreground">{stats.profileViews.toLocaleString()}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12% this week
                </p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Eye className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Link Clicks</p>
                <p className="text-2xl font-bold text-foreground">{stats.linkClicks}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +8% this week
                </p>
              </div>
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                <MousePointer className="h-6 w-6 text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Top Performing Link</p>
                <p className="text-lg font-semibold text-foreground">{stats.topLink}</p>
                <p className="text-xs text-muted-foreground">245 clicks this week</p>
              </div>
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <ExternalLink className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
              <Plus className="h-5 w-5 mb-2" />
              <span className="font-medium">Add New Link</span>
              <span className="text-xs text-muted-foreground">Connect your social media</span>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
              <BarChart3 className="h-5 w-5 mb-2" />
              <span className="font-medium">View Analytics</span>
              <span className="text-xs text-muted-foreground">See detailed insights</span>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
              <Eye className="h-5 w-5 mb-2" />
              <span className="font-medium">Preview Profile</span>
              <span className="text-xs text-muted-foreground">See how visitors see you</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Instagram link was clicked 15 times</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Profile viewed 23 times today</p>
                <p className="text-xs text-muted-foreground">6 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">New artwork added to gallery</p>
                <p className="text-xs text-muted-foreground">1 day ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewSection;