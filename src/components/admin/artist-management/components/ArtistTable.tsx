
import React from 'react';
import { Artist } from '@/data/types/artist';
import { ScrollArea } from '@/components/ui/scroll-area';
import ArtistTableRow from './ArtistTableRow';

interface ArtistTableProps {
  artists: Artist[];
  publishingStatus: Record<number, boolean>;
  onPublishToggle: (artistId: number, currentStatus: boolean) => void;
  onSelect: (artistId: number) => void;
}

const ArtistTable: React.FC<ArtistTableProps> = ({
  artists,
  publishingStatus,
  onPublishToggle,
  onSelect,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <ScrollArea className="h-[calc(100vh-220px)]">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialty</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Published</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {artists.length > 0 ? (
              artists.map((artist) => (
                <ArtistTableRow
                  key={artist.id}
                  artist={artist}
                  publishingStatus={publishingStatus[artist.id] || false}
                  onPublishToggle={onPublishToggle}
                  onSelect={onSelect}
                />
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  No artists found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </ScrollArea>
    </div>
  );
};

export default ArtistTable;
