import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Plus, 
  GripVertical, 
  ExternalLink, 
  Instagram, 
  Eye, 
  EyeOff,
  Pencil,
  Trash2
} from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface Link {
  id: string;
  title: string;
  url: string;
  active: boolean;
  icon?: string;
  clicks?: number;
}

interface LinksManagerProps {
  artistId: string | null;
  isDemo: boolean;
}

const LinksManager: React.FC<LinksManagerProps> = ({ artistId, isDemo }) => {
  const [links, setLinks] = useState<Link[]>([
    {
      id: "1",
      title: "Instagram",
      url: "https://instagram.com/artist",
      active: true,
      icon: "instagram",
      clicks: 245
    },
    {
      id: "2", 
      title: "Portfolio Website",
      url: "https://artist-portfolio.com",
      active: true,
      clicks: 189
    },
    {
      id: "3",
      title: "Art Shop",
      url: "https://shop.artist.com",
      active: false,
      clicks: 67
    }
  ]);

  const [showAddLink, setShowAddLink] = useState(false);
  const [newLink, setNewLink] = useState({ title: "", url: "" });

  const toggleLinkActive = (id: string) => {
    setLinks(links.map(link => 
      link.id === id ? { ...link, active: !link.active } : link
    ));
  };

  const addLink = () => {
    if (newLink.title && newLink.url) {
      const link: Link = {
        id: Date.now().toString(),
        title: newLink.title,
        url: newLink.url,
        active: true,
        clicks: 0
      };
      setLinks([...links, link]);
      setNewLink({ title: "", url: "" });
      setShowAddLink(false);
    }
  };

  const deleteLink = (id: string) => {
    setLinks(links.filter(link => link.id !== id));
  };

  return (
    <div className="p-6 max-w-3xl">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Links</h2>
        <p className="text-muted-foreground">
          Add, edit and organize your links. Drag to reorder.
        </p>
      </div>

      {/* Add Link Button */}
      <div className="mb-6">
        <Button 
          onClick={() => setShowAddLink(!showAddLink)}
          className="w-full h-14 border-2 border-dashed border-muted-foreground/30 bg-transparent hover:bg-muted text-muted-foreground hover:text-foreground"
          variant="ghost"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add link
        </Button>
      </div>

      {/* Add Link Form */}
      {showAddLink && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Link</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="link-title">Link Title</Label>
              <Input
                id="link-title"
                placeholder="e.g. My Instagram"
                value={newLink.title}
                onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="link-url">URL</Label>
              <Input
                id="link-url"
                placeholder="https://..."
                value={newLink.url}
                onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={addLink} disabled={!newLink.title || !newLink.url}>
                Add Link
              </Button>
              <Button variant="outline" onClick={() => setShowAddLink(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Links List */}
      <div className="space-y-3">
        {links.map((link, index) => (
          <Card key={link.id} className="group hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                {/* Drag Handle */}
                <div className="cursor-grab text-muted-foreground hover:text-foreground">
                  <GripVertical className="h-5 w-5" />
                </div>

                {/* Link Icon */}
                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                  {link.icon === "instagram" ? (
                    <Instagram className="h-5 w-5" />
                  ) : (
                    <ExternalLink className="h-5 w-5" />
                  )}
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
                    {link.clicks} clicks
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {/* Active Toggle */}
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={link.active}
                      onCheckedChange={() => toggleLinkActive(link.id)}
                    />
                    <span className="text-xs text-muted-foreground hidden sm:inline">
                      {link.active ? "On" : "Off"}
                    </span>
                  </div>

                  {/* Edit Button */}
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Pencil className="h-4 w-4" />
                  </Button>

                  {/* Delete Button */}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    onClick={() => deleteLink(link.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {links.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <ExternalLink className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-medium text-foreground mb-2">No links yet</h3>
          <p className="text-muted-foreground mb-4">
            Add your first link to get started
          </p>
          <Button onClick={() => setShowAddLink(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add your first link
          </Button>
        </div>
      )}
    </div>
  );
};

export default LinksManager;