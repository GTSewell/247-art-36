
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const CollectorFavorites: React.FC = () => {
  const navigate = useNavigate();
  const demoMode = localStorage.getItem('demoSession') === 'active';
  
  const mockFavorites = [
    {
      id: 1,
      name: "Alex Rivera",
      image: "/lovable-uploads/cdc0cbb8-b760-4aba-b9aa-3490af08c781.png",
      specialty: "Digital Art, Illustration"
    },
    {
      id: 2,
      name: "Maya Chen",
      image: "/lovable-uploads/d0e2f0f5-3e1b-4aca-ba46-dd13f40890ce.png",
      specialty: "Photography, Mixed Media"
    },
    {
      id: 3,
      name: "Jamal Williams",
      image: "/lovable-uploads/d64cfdce-f54d-4b8b-b704-fdf8df4fb48f.png",
      specialty: "Surrealism, Oil Painting"
    }
  ];
  
  if (!demoMode || mockFavorites.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Heart className="mr-2 h-5 w-5" />
            Favorite Artists
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Heart className="mx-auto h-12 w-12 mb-4 text-gray-400" />
            <p>You haven't added any favorite artists yet</p>
            <Button variant="outline" className="mt-4" onClick={() => navigate('/artists')}>
              Browse Artists
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Heart className="mr-2 h-5 w-5" />
            Favorite Artists
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate('/artists')}>
            Browse More
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockFavorites.map((artist) => (
            <div key={artist.id} className="border rounded-lg overflow-hidden">
              <div className="aspect-square relative overflow-hidden">
                <img 
                  src={artist.image} 
                  alt={artist.name} 
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="p-3">
                <h3 className="font-bold">{artist.name}</h3>
                <p className="text-sm text-gray-600">{artist.specialty}</p>
                <div className="flex justify-between mt-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate('/artists')}
                  >
                    Profile
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-500"
                    onClick={() => toast.info('This action is disabled in the demo account')}
                  >
                    <Heart className="h-4 w-4 fill-current" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CollectorFavorites;
