import React from "react";
import { Card } from "@/components/ui/card";
import { Smartphone } from "lucide-react";

type DashboardSection = "overview" | "links" | "appearance" | "analytics" | "settings";

interface LivePreviewPanelProps {
  artistId: string | null;
  activeSection: DashboardSection;
}

const LivePreviewPanel: React.FC<LivePreviewPanelProps> = ({
  artistId,
  activeSection
}) => {
  return (
    <div className="h-full p-6 flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h3 className="font-semibold text-foreground mb-2">Live Preview</h3>
        <p className="text-sm text-muted-foreground">
          See how your profile looks to visitors
        </p>
      </div>

      {/* Mobile Mockup */}
      <div className="flex-1 flex items-center justify-center">
        <div className="relative">
          {/* Phone Frame */}
          <div className="w-64 h-[520px] bg-black rounded-[2.5rem] p-2 shadow-2xl">
            {/* Screen */}
            <div className="w-full h-full bg-white rounded-[1.8rem] overflow-hidden relative">
              {/* Status Bar */}
              <div className="h-6 bg-gray-900 flex items-center justify-center">
                <div className="w-16 h-1 bg-gray-700 rounded-full"></div>
              </div>
              
              {/* Content Area */}
              <div className="flex-1 p-4 overflow-y-auto">
                {/* Preview Content Based on Active Section */}
                {activeSection === "links" && (
                  <div className="space-y-4">
                    {/* Profile Header */}
                    <div className="text-center mb-6">
                      <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-3"></div>
                      <h2 className="font-semibold text-gray-900">Artist Name</h2>
                      <p className="text-sm text-gray-600">Digital Artist</p>
                    </div>
                    
                    {/* Links Preview */}
                    <div className="space-y-3">
                      <div className="h-12 bg-gray-100 rounded-lg flex items-center px-4">
                        <span className="text-sm text-gray-700">Instagram</span>
                      </div>
                      <div className="h-12 bg-gray-100 rounded-lg flex items-center px-4">
                        <span className="text-sm text-gray-700">Portfolio</span>
                      </div>
                      <div className="h-12 bg-gray-100 rounded-lg flex items-center px-4">
                        <span className="text-sm text-gray-700">Shop</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeSection === "appearance" && (
                  <div className="space-y-4">
                    <div className="text-center mb-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mx-auto mb-3"></div>
                      <h2 className="font-semibold text-gray-900">Artist Name</h2>
                      <p className="text-sm text-gray-600">Customizing appearance...</p>
                    </div>
                    <div className="space-y-3">
                      <div className="h-12 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center px-4">
                        <span className="text-sm text-gray-700">Styled Link</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {(activeSection === "overview" || activeSection === "analytics" || activeSection === "settings") && (
                  <div className="space-y-4">
                    <div className="text-center mb-6">
                      <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-3"></div>
                      <h2 className="font-semibold text-gray-900">Artist Name</h2>
                      <p className="text-sm text-gray-600">Your artist profile</p>
                    </div>
                    <div className="space-y-3">
                      <div className="h-12 bg-gray-100 rounded-lg flex items-center px-4">
                        <span className="text-sm text-gray-700">Link 1</span>
                      </div>
                      <div className="h-12 bg-gray-100 rounded-lg flex items-center px-4">
                        <span className="text-sm text-gray-700">Link 2</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Phone Icon */}
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="bg-background border border-border rounded-full p-2">
              <Smartphone className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Preview Actions */}
      <div className="mt-6 space-y-2">
        <button className="w-full text-sm text-primary hover:underline">
          View live profile →
        </button>
      </div>
    </div>
  );
};

export default LivePreviewPanel;