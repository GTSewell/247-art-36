
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const CollectorPurchases: React.FC = () => {
  const navigate = useNavigate();
  const demoMode = localStorage.getItem('demoSession') === 'active';
  
  const mockPurchases = [
    {
      id: 'p1',
      name: 'Geometric Abstraction Print',
      artist: 'GT Sewell',
      price: '$120',
      date: '2023-12-15',
      image: '/lovable-uploads/43f5719e-a69d-483e-aeda-bc85b9c5deba.png',
      status: 'Delivered'
    },
    {
      id: 'p2',
      name: 'Abstract Series Tote Bag',
      artist: 'Alex Rivera',
      price: '$45',
      date: '2024-02-22',
      image: '/lovable-uploads/80e835f2-8b6b-4f56-9044-26de67cd3903.png',
      status: 'Shipped'
    },
    {
      id: 'p3',
      name: 'Limited Edition T-Shirt',
      artist: 'Maya Chen',
      price: '$65',
      date: '2024-03-10',
      image: '/lovable-uploads/ddc18b16-629a-42e8-a97e-af21acb3e67a.png',
      status: 'Processing'
    }
  ];
  
  if (!demoMode || mockPurchases.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ShoppingBag className="mr-2 h-5 w-5" />
            Your Purchases
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Package className="mx-auto h-12 w-12 mb-4 text-gray-400" />
            <p>You haven't made any purchases yet</p>
            <Button variant="outline" className="mt-4" onClick={() => navigate('/store')}>
              Browse Store
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
            <ShoppingBag className="mr-2 h-5 w-5" />
            Your Purchases
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate('/store')}>
            Shop More
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockPurchases.map((purchase) => (
            <div key={purchase.id} className="border rounded-lg overflow-hidden flex">
              <div className="w-24 h-24 shrink-0">
                <img 
                  src={purchase.image} 
                  alt={purchase.name} 
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="p-3 flex-grow">
                <div className="flex justify-between">
                  <h3 className="font-bold">{purchase.name}</h3>
                  <span className="text-sm font-semibold">{purchase.price}</span>
                </div>
                <p className="text-sm text-gray-600">By {purchase.artist}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    purchase.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                    purchase.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {purchase.status}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => toast.info('This action is disabled in the demo account')}
                  >
                    Details
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

export default CollectorPurchases;
