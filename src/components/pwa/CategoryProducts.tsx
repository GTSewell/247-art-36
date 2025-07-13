
import React, { useState, useCallback } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import PWACategoryFilters from "./PWACategoryFilters";
import PWAPaginatedProductGrid from "./PWAPaginatedProductGrid";

interface CategoryProductsProps {
  products: any[];
  categoryName: string;
}

const CategoryProducts: React.FC<CategoryProductsProps> = ({ 
  products, 
  categoryName 
}) => {
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleFilteredProductsChange = useCallback((filtered: any[]) => {
    setFilteredProducts(filtered);
  }, []);

  const handleItemsPerPageChange = useCallback((value: number) => {
    setItemsPerPage(value);
  }, []);

  // Update filtered products when products change
  React.useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  // If no products found, display a message
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-zap-yellow rounded-lg border-4 border-white min-h-[300px]">
        <p className="text-xl font-nove text-center mb-4">No products found in this category</p>
        <p className="text-base text-center">Check back soon for new additions!</p>
      </div>
    );
  }

  // Format the category name for display
  const formatCategoryName = (name: string) => {
    // Convert category ID to display name
    switch(name) {
      case 'original': return 'ORIGINAL ARTWORK';
      case 'signed': return 'SIGNED & NUMBERED';
      case 'sticker': return 'STICKERS & FUN STUFF';
      case 'merch': return 'T-SHIRTS & APPAREL';
      case 'print': return 'ART PRINTS & POSTERS';
      case 'collection': return 'THE 247 COLLECTION';
      default: return name.toUpperCase();
    }
  };

  // Debug logging for category products
  React.useEffect(() => {
    console.log(`🏪 CategoryProducts for ${categoryName}:`, {
      categoryName,
      productCount: products.length,
      products: products.map(p => ({
        id: p.id,
        name: p.name,
        category: p.category,
        artist: p.artists?.name || (p as any).artist_name
      }))
    });
  }, [products, categoryName]);

  return (
    <div className="bg-zap-yellow rounded-lg border-4 border-white overflow-hidden h-full">
      <div className="space-y-4 p-4">
        <PWACategoryFilters
          products={products}
          onFilteredProductsChange={handleFilteredProductsChange}
          categoryName={formatCategoryName(categoryName)}
        />
        
        <ScrollArea className="h-[calc(100vh-300px)]">
          <div className="pr-4">
            <PWAPaginatedProductGrid
              products={filteredProducts}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default CategoryProducts;
