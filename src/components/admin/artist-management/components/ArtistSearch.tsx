
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface ArtistSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const ArtistSearch: React.FC<ArtistSearchProps> = ({ 
  searchTerm, 
  onSearchChange 
}) => {
  return (
    <div className="mb-4 relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
      <Input
        placeholder="Search artists..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10"
      />
    </div>
  );
};

export default ArtistSearch;
