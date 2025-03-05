
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const NotFoundState: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col justify-center items-center min-h-screen gap-4" style={{ backgroundColor: '#f7cf1e' }}>
      <p className="text-xl font-semibold">Artist not found</p>
      <Button 
        onClick={() => navigate('/artists')}
        variant="outline"
        className="bg-white hover:bg-gray-100"
      >
        Back to Artists
      </Button>
    </div>
  );
};

export default NotFoundState;
