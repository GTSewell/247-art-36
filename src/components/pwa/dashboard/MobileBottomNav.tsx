import React from "react";
import { 
  LayoutDashboard, 
  Link as LinkIcon, 
  Palette, 
  BarChart3, 
  User,
  Store
} from "lucide-react";
import { cn } from "@/lib/utils";

type DashboardSection = "overview" | "links" | "appearance" | "analytics" | "settings" | "products";

interface MobileBottomNavProps {
  activeSection: DashboardSection;
  onSectionChange: (section: DashboardSection) => void;
}

const navigationItems = [
  {
    id: "overview" as const,
    label: "Overview",
    icon: LayoutDashboard
  },
  {
    id: "settings" as const,
    label: "Profile",
    icon: User
  },
  {
    id: "products" as const,
    label: "Products",
    icon: Store
  },
  {
    id: "links" as const,
    label: "Links",
    icon: LinkIcon
  },
  {
    id: "appearance" as const,
    label: "Style",
    icon: Palette
  },
  {
    id: "analytics" as const,
    label: "Stats",
    icon: BarChart3
  }
];

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeSection,
  onSectionChange
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 md:hidden">
      <nav className="flex justify-around items-center py-2 px-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "flex flex-col items-center px-2 py-2 rounded-lg transition-colors min-w-0 flex-1",
                "hover:bg-muted",
                isActive && "bg-primary text-primary-foreground"
              )}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className={cn(
                "text-xs font-medium truncate",
                isActive ? "text-primary-foreground" : "text-muted-foreground"
              )}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default MobileBottomNav;