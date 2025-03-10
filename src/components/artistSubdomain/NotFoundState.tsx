
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
        <p className="mb-6 text-gray-600">
          {artistName 
            ? `We couldn't find an artist with the name "${artistName}". They might not be registered yet.` 
            : "No artist name was provided. Please check the URL and try again."}
        </p>
        <Button asChild>
          <Link to="/artists">Explore Artists</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFoundState;
