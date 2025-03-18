
import React from 'react';

interface SpacingNoteProps {
  showNote: boolean;
  spacing: number;
}

const SpacingNote: React.FC<SpacingNoteProps> = ({ showNote, spacing }) => {
  if (!showNote) return null;
  
  return (
    <div className="text-sm text-gray-600 mt-4 p-3 bg-blue-50 rounded-lg">
      <strong>Note:</strong> When displaying multiple artworks, we add {spacing}cm spacing on all sides of each artwork.
      This increases the total space needed.
    </div>
  );
};

export default SpacingNote;
