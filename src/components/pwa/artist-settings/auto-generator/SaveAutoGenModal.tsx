import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Save, X } from "lucide-react";

interface SaveAutoGenModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
  onCancel: () => void;
  isSaving: boolean;
}

const SaveAutoGenModal: React.FC<SaveAutoGenModalProps> = ({
  open,
  onOpenChange,
  onSave,
  onCancel,
  isSaving
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Save Auto-Generated Profile
          </DialogTitle>
          <DialogDescription className="space-y-2">
            <p>
              Your AI-generated profile is ready! Save it now to prevent losing your data when navigating the form.
            </p>
            <p className="text-sm font-medium text-muted-foreground">
              📝 This will save as a draft - your profile won't be public until you publish it.
            </p>
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isSaving}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Don't Save
          </Button>
          <Button
            onClick={onSave}
            disabled={isSaving}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Saving..." : "Save Auto-Gen"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SaveAutoGenModal;