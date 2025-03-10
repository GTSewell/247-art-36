
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate, useParams } from 'react-router-dom';
import { X } from 'lucide-react';

const NotFoundState: React.FC = () => {
  const navigate = useNavigate();
  const { artistName } = useParams<{ artistName: string }>();
  
  return (
    <div 
      className="flex flex-col justify-center items-center min-h-screen gap-4" 
      style={{ backgroundColor: '#f7cf1e' }}
    >
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-red-100 p-3 rounded-full">
            <X className="h-8 w-8 text-red-500" />
          </div>
        </div>
        <h2 className="text-xl font-semibold text-center mb-4">Artist Not Found</h2>
        <p className="text-gray-600 text-center mb-6">
          {artistName ? (
            `We couldn't find the artist "${artistName}". They may have been removed or the URL might be incorrect.`
          ) : (
            "No artist was specified in the URL. Please check the URL and try again."
          )}
        </p>
        <Button 
          onClick={() => navigate('/artists')}
          className="w-full bg-[#f7cf1e] hover:bg-[#e6bf1a] text-gray-800"
        >
          Back to Artists
        </Button>
      </div>
    </div>
  );
};

export default NotFoundState;
