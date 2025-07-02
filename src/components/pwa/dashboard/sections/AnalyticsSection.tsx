import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart3, 
  TrendingUp, 
  Eye, 
  MousePointer, 
  Calendar,
  Download,
  Globe,
  Smartphone
} from "lucide-react";
import ArtistSalesAnalytics from "@/components/pwa/ArtistSalesAnalytics";

interface AnalyticsSectionProps {
  artistId: string | null;
  isDemo: boolean;
}

const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({ artistId, isDemo }) => {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Analytics</h2>
        <p className="text-muted-foreground">
          Track your profile performance and engagement
        </p>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Views</p>
                <p className="text-lg font-bold">1,247</p>
                <p className="text-xs text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12%
                </p>
              </div>
              <Eye className="h-5 w-5 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Link Clicks</p>
                <p className="text-lg font-bold">489</p>
                <p className="text-xs text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +8%
                </p>
              </div>
              <MousePointer className="h-5 w-5 text-secondary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Avg. Time</p>
                <p className="text-lg font-bold">2:34</p>
                <p className="text-xs text-blue-600 flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  +0:15s
                </p>
              </div>
              <Calendar className="h-5 w-5 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Countries</p>
                <p className="text-lg font-bold">23</p>
                <p className="text-xs text-purple-600 flex items-center">
                  <Globe className="h-3 w-3 mr-1" />
                  +3 new
                </p>
              </div>
              <Globe className="h-5 w-5 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Links Performance */}
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Top Performing Links</CardTitle>
          <Download className="h-4 w-4 text-muted-foreground cursor-pointer" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="font-medium">Instagram</span>
              </div>
              <div className="text-right">
                <p className="font-semibold">245 clicks</p>
                <p className="text-xs text-green-600">+15% this week</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                <span className="font-medium">Portfolio Website</span>
              </div>
              <div className="text-right">
                <p className="font-semibold">189 clicks</p>
                <p className="text-xs text-green-600">+8% this week</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <span className="font-medium">Art Shop</span>
              </div>
              <div className="text-right">
                <p className="font-semibold">67 clicks</p>
                <p className="text-xs text-red-600">-5% this week</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Device & Location Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Smartphone className="h-5 w-5 mr-2" />
              Device Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Mobile</span>
                <span className="font-semibold">68%</span>
              </div>
              <div className="flex justify-between">
                <span>Desktop</span>
                <span className="font-semibold">28%</span>
              </div>
              <div className="flex justify-between">
                <span>Tablet</span>
                <span className="font-semibold">4%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="h-5 w-5 mr-2" />
              Top Countries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>United States</span>
                <span className="font-semibold">34%</span>
              </div>
              <div className="flex justify-between">
                <span>United Kingdom</span>
                <span className="font-semibold">18%</span>
              </div>
              <div className="flex justify-between">
                <span>Canada</span>
                <span className="font-semibold">12%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Existing Sales Analytics Component */}
      <ArtistSalesAnalytics artistId={artistId} />
    </div>
  );
};

export default AnalyticsSection;
