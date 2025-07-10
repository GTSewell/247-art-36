import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LINK_TYPES } from "./linkTypes";

interface LinkFormProps {
  newLink: { title: string; url: string; type: string; customCategory?: string };
  setNewLink: (link: { title: string; url: string; type: string; customCategory?: string }) => void;
  onAdd: () => void;
  onCancel: () => void;
  saving: boolean;
  isEditing?: boolean;
}

export const LinkForm: React.FC<LinkFormProps> = ({
  newLink,
  setNewLink,
  onAdd,
  onCancel,
  saving,
  isEditing = false
}) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Link" : "Add New Link"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="link-type">Link Type</Label>
          <Select value={newLink.type} onValueChange={(value) => setNewLink({ ...newLink, type: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select link type" />
            </SelectTrigger>
            <SelectContent>
              {LINK_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  <div className="flex items-center gap-2">
                    <type.icon className="h-4 w-4" />
                    {type.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {newLink.type === 'other' && (
          <div>
            <Label htmlFor="custom-category">Custom Category</Label>
            <Input
              id="custom-category"
              placeholder="e.g. Blog, Portfolio, etc."
              value={newLink.customCategory || ""}
              onChange={(e) => setNewLink({ ...newLink, customCategory: e.target.value })}
            />
          </div>
        )}
        <div>
          <Label htmlFor="link-title">Link Title</Label>
          <Input
            id="link-title"
            placeholder="e.g. My Portfolio Website"
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
          <Button onClick={onAdd} disabled={!newLink.title || !newLink.url || saving}>
            {saving ? (isEditing ? "Updating..." : "Adding...") : (isEditing ? "Update Link" : "Add Link")}
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};