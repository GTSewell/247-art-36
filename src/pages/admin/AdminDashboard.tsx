import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Users, 
  ShoppingBag, 
  Settings, 
  BarChart3,
  Database,
  FileText,
  Activity
} from 'lucide-react';
import UserMenu from '@/components/navigation/UserMenu';
import ErrorBoundary from '@/components/admin/ErrorBoundary';
import { supabase } from '@/integrations/supabase/client';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalArtists: 0,
    activeProducts: 0,
    recentOrders: 0,
    siteVisits: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Get total artists count
        const { count: artistsCount } = await supabase
          .from('artists')
          .select('*', { count: 'exact', head: true });
        
        // Get active products count
        const { count: productsCount } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true })
          .eq('is_visible', true);
        
        // Get site visits from password logs (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const { count: visitsCount } = await supabase
          .from('password_access_logs')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', thirtyDaysAgo.toISOString());
        
        setStats({
          totalArtists: artistsCount || 0,
          activeProducts: productsCount || 0,
          recentOrders: 0, // Set to 0 as mentioned by user
          siteVisits: visitsCount || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const adminSections = [
    {
      title: "Artist Management",
      description: "Manage artist profiles, artworks, and submissions",
      icon: Users,
      href: "/admin/artists",
      color: "bg-blue-500",
      badge: "Core"
    },
    {
      title: "Shopify Integration",
      description: "Sync products, manage inventory, and monitor sales",
      icon: ShoppingBag,
      href: "/admin/shopify",
      color: "bg-green-500",
      badge: "Store"
    },
    {
      title: "System Settings",
      description: "Configure site settings and user permissions",
      icon: Settings,
      href: "/admin/settings",
      color: "bg-purple-500",
      badge: "Config",
      comingSoon: true
    },
    {
      title: "Analytics Dashboard",
      description: "View site metrics, user activity, and sales data",
      icon: BarChart3,
      href: "/admin/analytics",
      color: "bg-orange-500",
      badge: "Data",
      comingSoon: true
    },
    {
      title: "Database Management",
      description: "Backup, restore, and manage database operations",
      icon: Database,
      href: "/admin/database",
      color: "bg-red-500",
      badge: "DB",
      comingSoon: true
    },
    {
      title: "Content Management",
      description: "Manage site content, pages, and blog posts",
      icon: FileText,
      href: "/admin/content",
      color: "bg-teal-500",
      badge: "CMS",
      comingSoon: true
    }
  ];

  const quickStats = [
    { label: "Total Artists", value: loading ? "..." : stats.totalArtists.toString(), change: "" },
    { label: "Active Products", value: loading ? "..." : stats.activeProducts.toString(), change: "" },
    { label: "Recent Orders", value: loading ? "..." : stats.recentOrders.toString(), change: "" },
    { label: "Site Visits (30d)", value: loading ? "..." : stats.siteVisits.toString(), change: "" }
  ];

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background text-foreground">
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
            </div>
            <UserMenu />
          </div>
        </header>

        <div className="container mx-auto p-6 space-y-8">
          {/* Welcome Section */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-foreground">Welcome to Admin Control</h2>
            <p className="text-muted-foreground">
              Manage your 247 Art platform with powerful admin tools and insights.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickStats.map((stat, index) => (
              <Card key={index} className="border-2">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="text-xs">
                        {stat.change}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Admin Sections */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground">Administration Tools</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {adminSections.map((section, index) => (
                <Card key={index} className="border-2 hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${section.color}`}>
                          <section.icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{section.title}</CardTitle>
                          <Badge variant="outline" className="mt-1">
                            {section.badge}
                          </Badge>
                        </div>
                      </div>
                      {section.comingSoon && (
                        <Badge variant="secondary" className="text-xs">
                          Coming Soon
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="mb-4">
                      {section.description}
                    </CardDescription>
                    {section.comingSoon ? (
                      <Button disabled className="w-full">
                        <Activity className="mr-2 h-4 w-4" />
                        In Development
                      </Button>
                    ) : (
                      <Button asChild className="w-full">
                        <Link to={section.href}>
                          <section.icon className="mr-2 h-4 w-4" />
                          Access {section.title}
                        </Link>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* System Status */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>System Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Database: Online</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Shopify: Connected</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Auth Service: Active</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default AdminDashboard;