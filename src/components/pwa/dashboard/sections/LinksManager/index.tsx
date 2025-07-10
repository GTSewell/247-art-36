import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useArtistProfileLinks } from "@/hooks/useArtistProfileLinks";
import { LinkForm } from "./LinkForm";
import { LinkItem } from "./LinkItem";
import { EmptyState } from "./EmptyState";

interface LinksManagerProps {
  artistId: string | null;
  isDemo: boolean;
}

const LinksManager: React.FC<LinksManagerProps> = ({ artistId, isDemo }) => {
  const { 
    links, 
    loading, 
    saving, 
    addLink, 
    updateLink,
    deleteLink, 
    toggleLinkActive 
  } = useArtistProfileLinks(artistId);
  
  const [showAddLink, setShowAddLink] = useState(false);
  const [editingLink, setEditingLink] = useState<string | null>(null);
  const [newLink, setNewLink] = useState({ title: "", url: "", type: "website" });

  const handleAddLink = () => {
    if (newLink.title && newLink.url) {
      if (editingLink) {
        // Update existing link
        updateLink(editingLink, {
          title: newLink.title,
          url: newLink.url,
          type: newLink.type
        });
        setEditingLink(null);
      } else {
        // Add new link
        addLink({
          title: newLink.title,
          url: newLink.url,
          type: newLink.type,
          active: true
        });
      }
      setNewLink({ title: "", url: "", type: "website" });
      setShowAddLink(false);
    }
  };

  const handleEditLink = (link: any) => {
    setNewLink({
      title: link.title,
      url: link.url,
      type: link.type || "website"
    });
    setEditingLink(link.id);
    setShowAddLink(true);
  };

  const handleCancel = () => {
    setNewLink({ title: "", url: "", type: "website" });
    setEditingLink(null);
    setShowAddLink(false);
  };

  if (loading) {
    return (
      <div className="p-6 max-w-3xl">
        <div className="text-center py-12">
          <div className="animate-pulse text-muted-foreground">Loading links...</div>
        </div>
      </div>
    );
  }

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
        <LinkForm
          newLink={newLink}
          setNewLink={setNewLink}
          onAdd={handleAddLink}
          onCancel={handleCancel}
          saving={saving}
          isEditing={!!editingLink}
        />
      )}

      {/* Links List */}
      <div className="space-y-3">
        {links.map((link) => (
          <LinkItem
            key={link.id}
            link={link}
            onToggleActive={toggleLinkActive}
            onDelete={deleteLink}
            onEdit={handleEditLink}
            saving={saving}
          />
        ))}
      </div>

      {/* Empty State */}
      {links.length === 0 && (
        <EmptyState onAddClick={() => setShowAddLink(true)} />
      )}
    </div>
  );
};

export default LinksManager;