
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ShoppingCart, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Navigation from "@/components/navigation/Navigation";
import PWANavigation from "@/components/pwa/PWANavigation";
import { useAppMode } from "@/contexts/AppModeContext";
import { useShopifyProducts, ShopifyProduct } from '@/hooks/useShopifyProducts';
import ShopifyProductCard from '@/components/shopify/ShopifyProductCard';
import ShopifyProductDetail from '@/components/shopify/ShopifyProductDetail';
import { useShopifyCart } from '@/contexts/ShopifyCartContext';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const Shop = () => {
  const { products, isLoading } = useShopifyProducts();
  const { itemCount } = useShopifyCart();
  const { isPWA } = useAppMode();
  const navigate = useNavigate();
  
  const [selectedProduct, setSelectedProduct] = useState<ShopifyProduct | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArtist, setSelectedArtist] = useState<number | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  // Extract unique artists and tags from products
  const artists = [...new Set(products.map(p => p.artist_id).filter(Boolean))];
  const tags = [...new Set(products.flatMap(p => p.tags))].filter(tag => !tag.startsWith('artist-'));
  
  // Filter products based on search and filters
  const filteredProducts = products.filter(product => {
    // Search query filter
    const matchesSearch = searchQuery === '' || 
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
      
    // Artist filter
    const matchesArtist = selectedArtist === null || product.artist_id === selectedArtist;
    
    // Tags filter
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.some(tag => product.tags.includes(tag));
      
    return matchesSearch && matchesArtist && matchesTags;
  });
  
  const handleProductClick = (product: ShopifyProduct) => {
    setSelectedProduct(product);
  };
  
  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };
  
  const handleArtistToggle = (artistId: number | null) => {
    setSelectedArtist(prev => prev === artistId ? null : artistId);
  };
  
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedArtist(null);
    setSelectedTags([]);
  };

  return (
    <div className="min-h-screen bg-black">
      {isPWA ? <PWANavigation /> : <Navigation />}
      
      <div className="container mx-auto px-4 pt-28 pb-24">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Shop</h1>
          
          <Button 
            variant="outline" 
            className="relative"
            onClick={() => navigate('/shopify-checkout')}
          >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <Badge className="absolute -top-2 -right-2 px-2 h-5 min-w-5 flex items-center justify-center bg-zap-red">
                {itemCount}
              </Badge>
            )}
          </Button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="default" className="whitespace-nowrap">
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {(selectedArtist !== null || selectedTags.length > 0) && (
                  <Badge className="ml-2 bg-white text-black">{selectedTags.length + (selectedArtist !== null ? 1 : 0)}</Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="py-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Artists</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {artists.map(artistId => (
                      <div key={artistId} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`artist-${artistId}`} 
                          checked={selectedArtist === artistId}
                          onCheckedChange={() => handleArtistToggle(artistId)}
                        />
                        <Label htmlFor={`artist-${artistId}`} className="text-sm cursor-pointer">
                          Artist {artistId}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                      <Badge
                        key={tag}
                        variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => handleTagToggle(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={clearFilters}
                  disabled={searchQuery === '' && selectedArtist === null && selectedTags.length === 0}
                >
                  Clear Filters
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse text-white text-xl">Loading products...</div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-white mb-4">No products found</h2>
            <p className="text-muted-foreground mb-6">Try adjusting your filters or search query</p>
            <Button onClick={clearFilters}>Clear All Filters</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ShopifyProductCard
                key={product.id}
                product={product}
                onProductClick={handleProductClick}
              />
            ))}
          </div>
        )}
        
        <ShopifyProductDetail
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      </div>
    </div>
  );
};

export default Shop;
