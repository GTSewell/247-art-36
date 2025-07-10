
import React from 'react';
import { Artist } from '@/data/types/artist';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Check, Edit2, X } from 'lucide-react';

interface ArtistTableRowProps {
  artist: Artist;
  publishingStatus: boolean;
  onPublishToggle: (artistId: number, currentStatus: boolean) => void;
  onSelect: (artistId: number) => void;
}

const ArtistTableRow: React.FC<ArtistTableRowProps> = ({
  artist,
  publishingStatus,
  onPublishToggle,
  onSelect,
}) => {
  return (
    <tr key={artist.id} className="hover:bg-gray-50">
      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {artist.id}
      </td>
      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
            {artist.image ? (
              <img src={artist.image} alt={artist.name} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">N/A</div>
            )}
          </div>
          <div className="ml-2 sm:ml-4 min-w-0">
            <div className="text-sm font-medium text-gray-900 truncate max-w-[120px] sm:max-w-none">
              {artist.name}
            </div>
            {/* Show specialty on mobile as a subtitle */}
            <div className="sm:hidden text-xs text-gray-500 truncate max-w-[120px]">
              {artist.specialty || 'N/A'}
            </div>
          </div>
        </div>
      </td>
      <td className="hidden sm:table-cell px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <div className="max-w-[120px] truncate">
          {artist.specialty || 'N/A'}
        </div>
      </td>
      <td className="hidden md:table-cell px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {artist.user_id ? (
          <span className="max-w-[150px] inline-block overflow-hidden text-ellipsis">
            {artist.user_id}
          </span>
        ) : 'N/A'}
      </td>
      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-1 sm:space-x-2">
          <Switch
            checked={publishingStatus}
            onCheckedChange={() => onPublishToggle(artist.id, publishingStatus)}
            className="data-[state=checked]:bg-green-500"
          />
          <span className="hidden sm:inline text-sm text-gray-500">
            {publishingStatus ? (
              <span className="flex items-center text-green-600">
                <Check size={16} className="mr-1" />
                Published
              </span>
            ) : (
              <span className="flex items-center text-gray-500">
                <X size={16} className="mr-1" />
                Unpublished
              </span>
            )}
          </span>
          {/* Mobile status indicator */}
          <span className="sm:hidden">
            {publishingStatus ? (
              <Check size={16} className="text-green-600" />
            ) : (
              <X size={16} className="text-gray-500" />
            )}
          </span>
        </div>
      </td>
      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onSelect(artist.id)}
          className="text-primary hover:text-primary-dark"
        >
          <Edit2 className="h-4 w-4 sm:mr-1" />
          <span className="hidden sm:inline">Edit</span>
        </Button>
      </td>
    </tr>
  );
};

export default ArtistTableRow;
