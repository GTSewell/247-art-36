import React from 'react';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { ExternalLink, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ArtistProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  artistName: string;
  artistDomain?: string;
}

const ArtistProfileModal: React.FC<ArtistProfileModalProps> = ({
  isOpen,
  onClose,
  artistName,
  artistDomain
}) => {
  const navigate = useNavigate();
  
  // Set zap blue for the artist profile button (visit button) - always blue
  const zapBlue = '#00baef';
  const visitButtonStyles = {
    backgroundColor: zapBlue,
    color: 'white',
    borderColor: 'transparent',
    height: '40px'
  };

  const handleVisitProfile = () => {
    if (artistDomain) {
      // Transform the artist domain to match the URL format used in the site
      // Remove spaces, special characters, and convert to uppercase
      const formattedDomain = artistDomain
        .replace(/\s+/g, '')
        .replace(/[^\w]/gi, '')
        .toUpperCase();
      navigate(`/artists/${formattedDomain}`);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-6 overflow-hidden bg-background rounded-xl shadow-lg border border-border max-w-md">
        <DialogTitle className="sr-only">Artist Profile</DialogTitle>
        
        {/* Close button */}
        <button 
          onClick={onClose} 
          aria-label="Close dialog" 
          className="absolute right-2 top-2 p-2 rounded-full backdrop-blur-sm shadow-sm transition-colors z-50 bg-background/90 hover:bg-muted border border-border"
        >
          <X className="h-4 w-4 text-foreground" />
        </button>
        
        <div className="space-y-4 pt-2">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              View {artistName} Full Profile
            </h3>
            <p className="text-sm text-muted-foreground">
              Explore more artworks, biography, and exclusive content from this artist.
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              className="flex-1"
              style={visitButtonStyles}
              onClick={handleVisitProfile}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#0095c0';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = zapBlue;
              }}
              disabled={!artistDomain}
            >
              <div className="flex items-center justify-center gap-1">
                <span>Visit Profile</span>
                <ExternalLink size={16} />
              </div>
            </Button>
          </div>
          
          {!artistDomain && (
            <p className="text-xs text-muted-foreground text-center">
              Artist profile not available
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ArtistProfileModal;