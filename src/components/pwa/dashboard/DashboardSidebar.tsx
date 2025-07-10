import React from "react";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  LayoutDashboard, 
  Link as LinkIcon, 
  Palette, 
  BarChart3, 
  User,
  Store
} from "lucide-react";
import { cn } from "@/lib/utils";

type DashboardSection = "overview" | "links" | "appearance" | "analytics" | "settings" | "products";

interface DashboardSidebarProps {
  activeSection: DashboardSection;
  onSectionChange: (section: DashboardSection) => void;
  onBack: () => void;
  isPWA: boolean;
  isDemo: boolean;
}

const navigationItems = [
  {
    id: "overview" as const,
    label: "Overview",
    icon: LayoutDashboard,
    description: "Dashboard home"
  },
  {
    id: "settings" as const,
    label: "Profile",
    icon: User,
    description: "Profile settings"
  },
  {
    id: "products" as const,
    label: "Assigned Products",
    icon: Store,
    description: "Your store products"
  },
  {
    id: "links" as const,
    label: "Links",
    icon: LinkIcon,
    description: "Manage your links"
  },
  {
    id: "appearance" as const,
    label: "Appearance",
    icon: Palette,
    description: "Customize design"
  },
  {
    id: "analytics" as const,
    label: "Analytics",
    icon: BarChart3,
    description: "View insights"
  }
];

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  activeSection,
  onSectionChange,
  onBack,
  isPWA,
  isDemo
}) => {
  return (
    <div className="w-64 bg-background border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center mb-4">
          {isPWA && (
            <Button variant="ghost" size="sm" className="mr-2 -ml-2" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          )}
        </div>
        
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            {isDemo ? "Demo Artist" : "Artist Dashboard"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your artist profile
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "w-full flex items-center px-3 py-2.5 text-left rounded-lg transition-colors",
                "hover:bg-muted",
                isActive && "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
            >
              <Icon className="h-5 w-5 mr-3" />
              <div className="flex-1">
                <div className="font-medium">{item.label}</div>
                <div className={cn(
                  "text-xs",
                  isActive ? "text-primary-foreground/70" : "text-muted-foreground"
                )}>
                  {item.description}
                </div>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center text-xs text-muted-foreground">
          <Store className="h-4 w-4 mr-2" />
          247 Artist Dashboard
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;