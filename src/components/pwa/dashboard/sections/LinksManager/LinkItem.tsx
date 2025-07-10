import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { 
  GripVertical, 
  EyeOff,
  Pencil,
  Trash2
} from "lucide-react";
import { LINK_TYPES } from "./linkTypes";

interface Link {
  id: string;
  title: string;
  url: string;
  active: boolean;
  type?: string;
  clicks?: number;
}

interface LinkItemProps {
  link: Link;
  onToggleActive: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (link: Link) => void;
  saving: boolean;
}

export const LinkItem: React.FC<LinkItemProps> = ({
  link,
  onToggleActive,
  onDelete,
  onEdit,
  saving
}) => {
  const getLinkIcon = (type?: string) => {
    const linkType = LINK_TYPES.find(t => t.value === type);
    return linkType ? linkType.icon : LINK_TYPES[LINK_TYPES.length - 1].icon; // Default to 'Other'
  };

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* Drag Handle */}
          <div className="cursor-grab text-muted-foreground hover:text-foreground">
            <GripVertical className="h-5 w-5" />
          </div>

          {/* Link Icon */}
          <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
            {React.createElement(getLinkIcon(link.type), { className: "h-5 w-5" })}
          </div>

          {/* Link Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-foreground truncate">
                {link.title}
              </h3>
              {!link.active && (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
            <p className="text-sm text-muted-foreground truncate">
              {link.url}
            </p>
            <div className="text-xs text-muted-foreground mt-1">
              {link.clicks || 0} clicks • {LINK_TYPES.find(t => t.value === link.type)?.label || 'Link'}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Active Toggle */}
            <div className="flex items-center gap-2">
              <Switch
                checked={link.active}
                onCheckedChange={() => onToggleActive(link.id)}
              />
              <span className="text-xs text-muted-foreground hidden sm:inline">
                {link.active ? "On" : "Off"}
              </span>
            </div>

            {/* Edit Button */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0"
              onClick={() => onEdit(link)}
            >
              <Pencil className="h-4 w-4" />
            </Button>

            {/* Delete Button */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              onClick={() => onDelete(link.id)}
              disabled={saving}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};