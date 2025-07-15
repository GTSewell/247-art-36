import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Smartphone, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type DashboardSection = "overview" | "links" | "appearance" | "analytics" | "settings" | "products";

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  artistId: string | null;
  activeSection: DashboardSection;
}

const PreviewModal: React.FC<PreviewModalProps> = ({
  isOpen,
  onClose,
  artistId,
  activeSection
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Live Preview
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex items-center justify-center py-4">
          <div className="relative">
            {/* Phone Frame */}
            <div className="w-56 h-96 bg-black rounded-[2rem] p-2 shadow-2xl">
              {/* Screen */}
              <div className="w-full h-full bg-white rounded-[1.5rem] overflow-hidden relative">
                {/* Status Bar */}
                <div className="h-6 bg-gray-900 flex items-center justify-center">
                  <div className="w-12 h-1 bg-gray-700 rounded-full"></div>
                </div>
                
                {/* Content Area */}
                <div className="flex-1 p-3 overflow-y-auto">
                  {/* Preview Content Based on Active Section */}
                  {activeSection === "links" && (
                    <div className="space-y-3">
                      {/* Profile Header */}
                      <div className="text-center mb-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-2"></div>
                        <h2 className="font-semibold text-gray-900 text-sm">Artist Name</h2>
                        <p className="text-xs text-gray-600">Digital Artist</p>
                      </div>
                      
                      {/* Links Preview */}
                      <div className="space-y-2">
                        <div className="h-10 bg-gray-100 rounded-lg flex items-center px-3">
                          <span className="text-xs text-gray-700">Instagram</span>
                        </div>
                        <div className="h-10 bg-gray-100 rounded-lg flex items-center px-3">
                          <span className="text-xs text-gray-700">Portfolio</span>
                        </div>
                        <div className="h-10 bg-gray-100 rounded-lg flex items-center px-3">
                          <span className="text-xs text-gray-700">Shop</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeSection === "appearance" && (
                    <div className="space-y-3">
                      <div className="text-center mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mx-auto mb-2"></div>
                        <h2 className="font-semibold text-gray-900 text-sm">Artist Name</h2>
                        <p className="text-xs text-gray-600">Customizing...</p>
                      </div>
                      <div className="space-y-2">
                        <div className="h-10 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center px-3">
                          <span className="text-xs text-gray-700">Styled Link</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {(activeSection === "overview" || activeSection === "analytics" || activeSection === "settings" || activeSection === "products") && (
                    <div className="space-y-3">
                      <div className="text-center mb-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-2"></div>
                        <h2 className="font-semibold text-gray-900 text-sm">Artist Name</h2>
                        <p className="text-xs text-gray-600">Your profile</p>
                      </div>
                      <div className="space-y-2">
                        <div className="h-10 bg-gray-100 rounded-lg flex items-center px-3">
                          <span className="text-xs text-gray-700">Link 1</span>
                        </div>
                        <div className="h-10 bg-gray-100 rounded-lg flex items-center px-3">
                          <span className="text-xs text-gray-700">Link 2</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close Preview
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewModal;