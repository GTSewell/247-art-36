
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface NotFoundStateProps {
  artistName?: string;
}

const NotFoundState: React.FC<NotFoundStateProps> = ({ artistName }) => {
  return (
    <div className="h-screen flex flex-col items-center justify-center p-4 bg-gray-100">
      <div className="text-center max-w-md">
        <h1 className="text-3xl font-bold mb-4">Artist Not Found</h1>
        
        {!artistName || artistName.trim() === '' ? (
          <p className="mb-6 text-gray-600">
            No artist name was provided in the URL. Please check the URL and try again.
          </p>
        ) : (
          <p className="mb-6 text-gray-600">
            We couldn't find an artist with the name "{artistName}". They might not be registered yet.
          </p>
        )}
        
        <div className="space-y-4">
          <Button asChild>
            <Link to="/artists">Explore Artists</Link>
          </Button>
          
          <div className="text-sm text-gray-500 mt-4">
            <p>URL format should be: 247.art/artists/ArtistName</p>
            <p>Make sure there are no spaces or special characters in the artist name in the URL.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundState;
