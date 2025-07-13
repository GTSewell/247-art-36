import React, { useState, useMemo } from 'react';
import PWAProductCard from './PWAProductCard';
import { Package } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PWAPaginatedProductGridProps {
  products: any[];
  itemsPerPage?: number;
  onItemsPerPageChange?: (value: number) => void;
  onProductClick?: (product: any) => void;
}

const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

const PWAPaginatedProductGrid: React.FC<PWAPaginatedProductGridProps> = ({ 
  products, 
  itemsPerPage = 10,
  onItemsPerPageChange,
  onProductClick 
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(products.length / itemsPerPage);
  
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return products.slice(startIndex, endIndex);
  }, [products, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of grid when page changes
    const gridElement = document.querySelector('[data-pwa-pagination-grid]');
    if (gridElement) {
      gridElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleItemsPerPageChange = (value: string) => {
    const newItemsPerPage = parseInt(value);
    setCurrentPage(1); // Reset to first page
    onItemsPerPageChange?.(newItemsPerPage);
  };

  // Reset to page 1 when products change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [products]);

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center bg-white/10 backdrop-blur-sm rounded-lg">
        <Package className="h-16 w-16 text-white/60 mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">
          No products found
        </h3>
        <p className="text-white/80">
          Try adjusting your filters or search criteria.
        </p>
      </div>
    );
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, products.length);

  return (
    <div className="space-y-4" data-pwa-pagination-grid>
      {/* Products Grid */}
      <div className="grid grid-cols-2 gap-4">
        {paginatedProducts.map(product => (
          <PWAProductCard key={product.id} product={product} onProductClick={onProductClick} />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-lg">
          {/* Results Info & Items Per Page */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white">
            <span>
              Showing {startItem}-{endItem} of {products.length} products
            </span>
            <div className="flex items-center gap-2">
              <span>Show:</span>
              <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                <SelectTrigger className="w-20 h-8 bg-white text-black">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ITEMS_PER_PAGE_OPTIONS.map(option => (
                    <SelectItem key={option} value={option.toString()}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Pagination Navigation */}
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  className={`${currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"} bg-white text-black hover:bg-white/90`}
                />
              </PaginationItem>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNumber;
                if (totalPages <= 5) {
                  pageNumber = i + 1;
                } else if (currentPage <= 3) {
                  pageNumber = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i;
                } else {
                  pageNumber = currentPage - 2 + i;
                }

                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      onClick={() => handlePageChange(pageNumber)}
                      isActive={currentPage === pageNumber}
                      className={`cursor-pointer ${
                        currentPage === pageNumber 
                          ? "bg-zap-red text-white" 
                          : "bg-white text-black hover:bg-white/90"
                      }`}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  className={`${currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"} bg-white text-black hover:bg-white/90`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default PWAPaginatedProductGrid;