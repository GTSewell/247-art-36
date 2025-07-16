import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, Eye, X, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import DashboardSidebar from "./DashboardSidebar";
import DashboardContent from "./DashboardContent";
import LivePreviewPanel from "./LivePreviewPanel";
import MobileBottomNav from "./MobileBottomNav";
import PreviewModal from "./PreviewModal";
type DashboardSection = "overview" | "links" | "appearance" | "analytics" | "settings" | "products";
interface ResponsiveDashboardLayoutProps {
  activeSection: DashboardSection;
  onSectionChange: (section: DashboardSection) => void;
  artistId: string | null;
  isPWA: boolean;
  isDemo: boolean;
  onBack: () => void;
}
const ResponsiveDashboardLayout: React.FC<ResponsiveDashboardLayoutProps> = ({
  activeSection,
  onSectionChange,
  artistId,
  isPWA,
  isDemo,
  onBack
}) => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false); // For tablet preview toggle

  // Mobile Layout (< 768px)
  if (isMobile) {
    return <>
        {/* Mobile Header - Fixed positioning to avoid profile icon overlap */}
        <div className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-b border-border z-50 px-4 py-[30px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isPWA && <Button variant="ghost" size="sm" onClick={onBack}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>}
              <div>
                <h1 className="font-semibold text-foreground">
                  {isDemo ? "Demo Artist" : "Dashboard"}
                </h1>
              </div>
            </div>
            
            {/* Centered Preview Button - leaves space for profile icon */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <Button variant="outline" size="sm" onClick={() => setPreviewOpen(true)}>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
            </div>
            
            {/* Empty space for profile icon */}
            <div className="w-10"></div>
          </div>
        </div>

        {/* Mobile Content - Adjusted for fixed header */}
        <div className="pt-16 pb-20 px-4">
          <DashboardContent activeSection={activeSection} artistId={artistId} isDemo={isDemo} />
        </div>

        {/* Mobile Bottom Navigation */}
        <MobileBottomNav activeSection={activeSection} onSectionChange={onSectionChange} />

        {/* Mobile Preview Modal */}
        <PreviewModal isOpen={previewOpen} onClose={() => setPreviewOpen(false)} artistId={artistId} activeSection={activeSection} />
      </>;
  }

  // Tablet Layout - More nuanced responsive logic
  const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
  const isNarrowTablet = window.innerWidth < 900 || window.innerHeight > window.innerWidth; // Portrait or narrow

  if (isTablet) {
    return <>
        {/* Tablet Header */}
        <div className="fixed top-16 left-0 right-0 bg-background border-b border-border z-40 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu className="h-4 w-4" />
            </Button>
            {isPWA && <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>}
            <h1 className="font-semibold text-foreground">
              {isDemo ? "Demo Artist Dashboard" : "Artist Dashboard"}
            </h1>
          </div>
          <Button variant={showPreview ? "default" : "outline"} size="sm" onClick={() => setShowPreview(!showPreview)}>
            <Eye className="h-4 w-4 mr-2" />
            {showPreview ? "Hide Preview" : "Show Preview"}
          </Button>
        </div>

        {/* Tablet Layout */}
        <div className="flex pt-28">
          {/* Sidebar Overlay for Tablet */}
          {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30" onClick={() => setSidebarOpen(false)} />}
          
          {/* Collapsible Sidebar */}
          <div className={cn("fixed left-0 top-28 bottom-0 z-40 transform transition-transform duration-300", sidebarOpen ? "translate-x-0" : "-translate-x-full")}>
            <div className="relative h-full">
              <DashboardSidebar activeSection={activeSection} onSectionChange={section => {
              onSectionChange(section);
              setSidebarOpen(false);
            }} onBack={onBack} isPWA={isPWA} isDemo={isDemo} />
              <Button variant="ghost" size="sm" className="absolute top-4 right-4" onClick={() => setSidebarOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 flex">
            {!showPreview ?
          // Full width content
          <div className="flex-1 px-4">
                <DashboardContent activeSection={activeSection} artistId={artistId} isDemo={isDemo} />
              </div> : isNarrowTablet ?
          // For narrow tablets/portrait - use modal instead of split view
          <>
                <div className="flex-1 px-4">
                  <DashboardContent activeSection={activeSection} artistId={artistId} isDemo={isDemo} />
                </div>
                <PreviewModal isOpen={showPreview} onClose={() => setShowPreview(false)} artistId={artistId} activeSection={activeSection} />
              </> :
          // Wide tablets - split view with smaller preview panel
          <>
                <div className="flex-1 border-r border-border px-4">
                  <DashboardContent activeSection={activeSection} artistId={artistId} isDemo={isDemo} />
                </div>
                <div className="w-64 bg-muted/30">
                  <LivePreviewPanel artistId={artistId} activeSection={activeSection} />
                </div>
              </>}
          </div>
        </div>
      </>;
  }

  // Desktop Layout (>= 1024px) - Keep existing three-column layout
  return <div className="flex pt-16">
      <DashboardSidebar activeSection={activeSection} onSectionChange={onSectionChange} onBack={onBack} isPWA={isPWA} isDemo={isDemo} />
      
      <div className="flex-1 flex min-w-0">
        <div className="flex-1 border-r border-border">
          <DashboardContent activeSection={activeSection} artistId={artistId} isDemo={isDemo} />
        </div>
        
        <div className="w-80 xl:w-96 bg-muted/30">
          <LivePreviewPanel artistId={artistId} activeSection={activeSection} />
        </div>
      </div>
    </div>;
};
export default ResponsiveDashboardLayout;